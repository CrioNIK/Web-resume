package pulse

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"reflect"
	"strconv"
	"strings"
	"sync"
	"testing"
	"time"
)

func TestHandlerGET(t *testing.T) {
	handler := newHandler(steppedClock(time.Date(2026, time.September, 1, 12, 0, 0, 0, time.UTC), 425*time.Microsecond))
	request := httptest.NewRequest(http.MethodGet, "https://web-resume-murex.vercel.app/api/pulse", nil)
	request.Header.Set("Origin", "https://web-resume-murex.vercel.app")
	recorder := httptest.NewRecorder()

	handler.ServeHTTP(recorder, request)

	if recorder.Code != http.StatusOK {
		t.Fatalf("status = %d, want %d", recorder.Code, http.StatusOK)
	}
	if got := recorder.Header().Get("Content-Type"); got != "application/json; charset=utf-8" {
		t.Errorf("Content-Type = %q", got)
	}
	if got := recorder.Header().Get("Cache-Control"); got != "no-store, max-age=0" {
		t.Errorf("Cache-Control = %q", got)
	}
	if got := recorder.Header().Get("Vercel-CDN-Cache-Control"); got != "no-store" {
		t.Errorf("Vercel-CDN-Cache-Control = %q", got)
	}
	if got := recorder.Header().Get("Access-Control-Allow-Origin"); got != "https://web-resume-murex.vercel.app" {
		t.Errorf("Access-Control-Allow-Origin = %q", got)
	}
	if got := recorder.Header().Get("Access-Control-Expose-Headers"); got != "Server-Timing" {
		t.Errorf("Access-Control-Expose-Headers = %q", got)
	}
	if got := recorder.Header().Get("Timing-Allow-Origin"); got != "https://web-resume-murex.vercel.app" {
		t.Errorf("Timing-Allow-Origin = %q", got)
	}
	if got := recorder.Header().Get("Server-Timing"); !strings.Contains(got, "pulse;dur=0.850000") {
		t.Errorf("Server-Timing = %q", got)
	}

	var response Response
	if err := json.Unmarshal(recorder.Body.Bytes(), &response); err != nil {
		t.Fatalf("decode response: %v", err)
	}
	if !response.OK {
		t.Error("response OK = false")
	}
	if response.Service.Name != serviceName || response.Service.ContractVersion != contractVersion {
		t.Errorf("service = %#v", response.Service)
	}
	if response.ObservedAt != "2026-09-01T12:00:00Z" {
		t.Errorf("observedAt = %q", response.ObservedAt)
	}
	if response.Timing.HandlerPreparationNanoseconds != int64(425*time.Microsecond) {
		t.Errorf("handlerPreparationNanoseconds = %d", response.Timing.HandlerPreparationNanoseconds)
	}
	if response.Runtime.Language != "go" || response.Runtime.Version == "" {
		t.Errorf("runtime = %#v", response.Runtime)
	}
	if response.Capabilities.Persistence || response.Capabilities.VisitorTracking {
		t.Errorf("capabilities = %#v", response.Capabilities)
	}
	if response.Privacy.ApplicationPersistence || response.Privacy.ApplicationLogging || response.Privacy.VisitorFingerprinting || response.Privacy.RequestDerivedSignal {
		t.Errorf("privacy = %#v", response.Privacy)
	}
}

func TestHandlerHEAD(t *testing.T) {
	handler := newHandler(steppedClock(time.Unix(0, 0), time.Millisecond))
	request := httptest.NewRequest(http.MethodHead, "https://example.test/api/pulse", nil)
	recorder := httptest.NewRecorder()

	handler.ServeHTTP(recorder, request)

	if recorder.Code != http.StatusOK {
		t.Fatalf("status = %d, want %d", recorder.Code, http.StatusOK)
	}
	if recorder.Body.Len() != 0 {
		t.Fatalf("HEAD body length = %d, want 0", recorder.Body.Len())
	}
	if got := recorder.Header().Get("Cache-Control"); got != "no-store, max-age=0" {
		t.Errorf("Cache-Control = %q", got)
	}
	contentLength, err := strconv.Atoi(recorder.Header().Get("Content-Length"))
	if err != nil || contentLength <= 0 {
		t.Fatalf("Content-Length = %q", recorder.Header().Get("Content-Length"))
	}
}

func TestHandlerRejectsUnsupportedMethods(t *testing.T) {
	handler := newHandler(steppedClock(time.Unix(0, 0), time.Microsecond))
	request := httptest.NewRequest(http.MethodPost, "https://example.test/api/pulse", strings.NewReader("ignored"))
	recorder := httptest.NewRecorder()

	handler.ServeHTTP(recorder, request)

	if recorder.Code != http.StatusMethodNotAllowed {
		t.Fatalf("status = %d, want %d", recorder.Code, http.StatusMethodNotAllowed)
	}
	if got := recorder.Header().Get("Allow"); got != "GET, HEAD" {
		t.Errorf("Allow = %q", got)
	}
	if got := recorder.Header().Get("Cache-Control"); got != "no-store, max-age=0" {
		t.Errorf("Cache-Control = %q", got)
	}
	if got := recorder.Header().Get("Vercel-CDN-Cache-Control"); got != "no-store" {
		t.Errorf("Vercel-CDN-Cache-Control = %q", got)
	}

	var response errorResponse
	if err := json.Unmarshal(recorder.Body.Bytes(), &response); err != nil {
		t.Fatalf("decode response: %v", err)
	}
	if response.Error.Code != "method_not_allowed" {
		t.Errorf("error code = %q", response.Error.Code)
	}
}

func TestCORSAllowlist(t *testing.T) {
	tests := []struct {
		name   string
		origin string
		want   string
	}{
		{name: "production", origin: "https://web-resume-murex.vercel.app", want: "https://web-resume-murex.vercel.app"},
		{name: "vite dev", origin: "http://localhost:5173", want: "http://localhost:5173"},
		{name: "loopback preview", origin: "http://127.0.0.1:4173", want: "http://127.0.0.1:4173"},
		{name: "lookalike domain", origin: "https://web-resume-murex.vercel.app.evil.example", want: ""},
		{name: "arbitrary local port", origin: "http://localhost:9000", want: ""},
		{name: "opaque origin", origin: "null", want: ""},
		{name: "whitespace altered", origin: " http://localhost:5173 ", want: ""},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			handler := newHandler(steppedClock(time.Unix(0, 0), time.Microsecond))
			request := httptest.NewRequest(http.MethodGet, "https://example.test/api/pulse", nil)
			request.Header.Set("Origin", test.origin)
			recorder := httptest.NewRecorder()

			handler.ServeHTTP(recorder, request)

			if got := recorder.Header().Get("Access-Control-Allow-Origin"); got != test.want {
				t.Errorf("Access-Control-Allow-Origin = %q, want %q", got, test.want)
			}
			if test.want == "" && recorder.Header().Get("Timing-Allow-Origin") != "" {
				t.Errorf("disallowed origin received Timing-Allow-Origin = %q", recorder.Header().Get("Timing-Allow-Origin"))
			}
		})
	}
}

func TestDeterministicSignal(t *testing.T) {
	want := []uint16{398, 121, 91, 883, 955, 893, 878, 88, 95, 572, 308, 127}
	first := deterministicSignal()
	second := deterministicSignal()

	if !reflect.DeepEqual(first.Values, want) {
		t.Fatalf("values = %v, want %v", first.Values, want)
	}
	if !reflect.DeepEqual(first, second) {
		t.Fatalf("signal changed between calls: %#v != %#v", first, second)
	}
	if first.Seed != signalSeed || first.Algorithm != "fixed-lcg32-v1" {
		t.Errorf("signal metadata = %#v", first)
	}
	if first.Kind != "synthetic-diagnostic" || first.Source != "public-fixed-seed" {
		t.Errorf("signal provenance = %#v", first)
	}
}

func TestSignalDoesNotDependOnRequestMetadata(t *testing.T) {
	handler := newHandler(steppedClock(time.Unix(0, 0), time.Microsecond))

	first := requestSignal(t, handler, "https://example.test/api/pulse?visitor=one", "agent-one")
	second := requestSignal(t, handler, "https://example.test/api/pulse?visitor=two", "agent-two")

	if !reflect.DeepEqual(first, second) {
		t.Fatalf("request metadata changed signal: %#v != %#v", first, second)
	}
}

func TestHandlerSupportsConcurrentRequests(t *testing.T) {
	const requestCount = 32

	type result struct {
		signal SignalSample
		err    error
	}

	handler := NewHandler()
	results := make(chan result, requestCount)
	var waitGroup sync.WaitGroup

	for index := 0; index < requestCount; index++ {
		waitGroup.Add(1)

		go func(index int) {
			defer waitGroup.Done()

			request := httptest.NewRequest(http.MethodGet, fmt.Sprintf("https://example.test/api/pulse?request=%d", index), nil)
			recorder := httptest.NewRecorder()
			handler.ServeHTTP(recorder, request)

			if recorder.Code != http.StatusOK {
				results <- result{err: fmt.Errorf("status = %d", recorder.Code)}
				return
			}

			var response Response
			if err := json.Unmarshal(recorder.Body.Bytes(), &response); err != nil {
				results <- result{err: err}
				return
			}

			results <- result{signal: response.Signal}
		}(index)
	}

	waitGroup.Wait()
	close(results)

	want := deterministicSignal()
	for result := range results {
		if result.err != nil {
			t.Errorf("concurrent request failed: %v", result.err)
			continue
		}
		if !reflect.DeepEqual(result.signal, want) {
			t.Errorf("concurrent signal = %#v, want %#v", result.signal, want)
		}
	}
}

func requestSignal(t *testing.T, handler http.Handler, target, userAgent string) SignalSample {
	t.Helper()
	request := httptest.NewRequest(http.MethodGet, target, nil)
	request.Header.Set("User-Agent", userAgent)
	request.Header.Set("Accept-Language", userAgent)
	request.Header.Set("Cookie", "visitor="+userAgent)
	request.Header.Set("X-Forwarded-For", "192.0.2.1")
	recorder := httptest.NewRecorder()

	handler.ServeHTTP(recorder, request)

	var response Response
	if err := json.Unmarshal(recorder.Body.Bytes(), &response); err != nil {
		t.Fatalf("decode response: %v", err)
	}

	return response.Signal
}

func steppedClock(start time.Time, step time.Duration) clock {
	current := start.Add(-step)

	return func() time.Time {
		current = current.Add(step)
		return current
	}
}
