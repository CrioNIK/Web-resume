// Package pulse implements the stateless portfolio pulse endpoint.
package pulse

import (
	"encoding/json"
	"fmt"
	"net/http"
	"runtime"
	"strconv"
	"time"
)

const (
	serviceName     = "portfolio-pulse"
	contractVersion = "1"
	signalSeed      = uint32(0xC01DBA5E)
	signalCount     = 12
)

var allowedOrigins = map[string]struct{}{
	"https://web-resume-murex.vercel.app": {},
	"http://localhost:3000":               {},
	"http://localhost:4173":               {},
	"http://localhost:5173":               {},
	"http://127.0.0.1:3000":               {},
	"http://127.0.0.1:4173":               {},
	"http://127.0.0.1:5173":               {},
}

// Response is the public JSON contract returned by the pulse endpoint.
type Response struct {
	OK           bool         `json:"ok"`
	Service      ServiceInfo  `json:"service"`
	ObservedAt   string       `json:"observedAt"`
	Timing       TimingInfo   `json:"timing"`
	Runtime      RuntimeInfo  `json:"runtime"`
	Capabilities Capabilities `json:"capabilities"`
	Signal       SignalSample `json:"signal"`
	Privacy      PrivacyInfo  `json:"privacy"`
}

// ServiceInfo identifies this API contract without exposing deployment secrets.
type ServiceInfo struct {
	Name            string `json:"name"`
	ContractVersion string `json:"contractVersion"`
}

// TimingInfo contains application-side timing observed before response serialization.
type TimingInfo struct {
	HandlerPreparationNanoseconds int64  `json:"handlerPreparationNanoseconds"`
	Scope                         string `json:"scope"`
}

// RuntimeInfo describes only the Go runtime, operating system, and architecture.
type RuntimeInfo struct {
	Language        string `json:"language"`
	Version         string `json:"version"`
	OperatingSystem string `json:"operatingSystem"`
	Architecture    string `json:"architecture"`
}

// Capabilities documents the endpoint's intentionally small public surface.
type Capabilities struct {
	Methods             []string `json:"methods"`
	MediaType           string   `json:"mediaType"`
	ServerTiming        bool     `json:"serverTiming"`
	DeterministicSignal bool     `json:"deterministicSignal"`
	Persistence         bool     `json:"persistence"`
	VisitorTracking     bool     `json:"visitorTracking"`
}

// SignalSample is a fixed-seed diagnostic sample and is never derived from a request.
type SignalSample struct {
	Algorithm string   `json:"algorithm"`
	Kind      string   `json:"kind"`
	Source    string   `json:"source"`
	Seed      uint32   `json:"seed"`
	Range     string   `json:"range"`
	Values    []uint16 `json:"values"`
}

// PrivacyInfo describes behavior implemented by this application code.
type PrivacyInfo struct {
	ApplicationPersistence bool `json:"applicationPersistence"`
	ApplicationLogging     bool `json:"applicationLogging"`
	VisitorFingerprinting  bool `json:"visitorFingerprinting"`
	RequestDerivedSignal   bool `json:"requestDerivedSignal"`
}

type errorResponse struct {
	Error apiError `json:"error"`
}

type apiError struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

type clock func() time.Time

type handler struct {
	now clock
}

// NewHandler returns an immutable, concurrency-safe HTTP handler.
func NewHandler() http.Handler {
	return newHandler(time.Now)
}

func newHandler(now clock) http.Handler {
	if now == nil {
		now = time.Now
	}

	return &handler{now: now}
}

func (h *handler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	startedAt := h.now()
	setResponseHeaders(w, r)

	if r.Method != http.MethodGet && r.Method != http.MethodHead {
		w.Header().Set("Allow", "GET, HEAD")
		h.writeJSON(w, r, http.StatusMethodNotAllowed, errorResponse{
			Error: apiError{
				Code:    "method_not_allowed",
				Message: "Only GET and HEAD are supported.",
			},
		}, startedAt)
		return
	}

	response := Response{
		OK: true,
		Service: ServiceInfo{
			Name:            serviceName,
			ContractVersion: contractVersion,
		},
		ObservedAt: startedAt.UTC().Format(time.RFC3339Nano),
		Timing: TimingInfo{
			Scope: "application preparation before JSON serialization",
		},
		Runtime: RuntimeInfo{
			Language:        "go",
			Version:         runtime.Version(),
			OperatingSystem: runtime.GOOS,
			Architecture:    runtime.GOARCH,
		},
		Capabilities: Capabilities{
			Methods:             []string{http.MethodGet, http.MethodHead},
			MediaType:           "application/json",
			ServerTiming:        true,
			DeterministicSignal: true,
			Persistence:         false,
			VisitorTracking:     false,
		},
		Signal: deterministicSignal(),
		Privacy: PrivacyInfo{
			ApplicationPersistence: false,
			ApplicationLogging:     false,
			VisitorFingerprinting:  false,
			RequestDerivedSignal:   false,
		},
	}
	response.Timing.HandlerPreparationNanoseconds = nonNegativeDuration(h.now().Sub(startedAt)).Nanoseconds()

	h.writeJSON(w, r, http.StatusOK, response, startedAt)
}

func (h *handler) writeJSON(w http.ResponseWriter, r *http.Request, status int, value any, startedAt time.Time) {
	body, err := json.Marshal(value)
	if err != nil {
		status = http.StatusInternalServerError
		body = []byte(`{"error":{"code":"encoding_failed","message":"The response could not be encoded."}}`)
	}
	body = append(body, '\n')

	elapsed := nonNegativeDuration(h.now().Sub(startedAt))
	w.Header().Set("Server-Timing", serverTimingValue(elapsed))
	w.Header().Set("Content-Length", strconv.Itoa(len(body)))
	w.WriteHeader(status)

	if r.Method == http.MethodHead {
		return
	}

	_, _ = w.Write(body)
}

func setResponseHeaders(w http.ResponseWriter, r *http.Request) {
	header := w.Header()
	header.Set("Content-Type", "application/json; charset=utf-8")
	header.Set("Cache-Control", "no-store, max-age=0")
	header.Set("Vercel-CDN-Cache-Control", "no-store")
	header.Set("Content-Security-Policy", "default-src 'none'; frame-ancestors 'none'; sandbox")
	header.Set("Referrer-Policy", "no-referrer")
	header.Set("X-Content-Type-Options", "nosniff")
	header.Set("X-Frame-Options", "DENY")
	header.Add("Vary", "Origin")

	origin := r.Header.Get("Origin")
	if _, allowed := allowedOrigins[origin]; allowed {
		header.Set("Access-Control-Allow-Origin", origin)
		header.Set("Access-Control-Allow-Methods", "GET, HEAD")
		header.Set("Access-Control-Expose-Headers", "Server-Timing")
		header.Set("Timing-Allow-Origin", origin)
	}
}

func deterministicSignal() SignalSample {
	values := make([]uint16, signalCount)
	state := signalSeed

	for i := range values {
		state = state*1664525 + 1013904223
		values[i] = uint16((state >> 16) % 1001)
	}

	return SignalSample{
		Algorithm: "fixed-lcg32-v1",
		Kind:      "synthetic-diagnostic",
		Source:    "public-fixed-seed",
		Seed:      signalSeed,
		Range:     "0..1000",
		Values:    values,
	}
}

func serverTimingValue(elapsed time.Duration) string {
	durationMilliseconds := float64(elapsed.Nanoseconds()) / float64(time.Millisecond)

	return fmt.Sprintf(`pulse;dur=%.6f;desc="Go handler through JSON serialization"`, durationMilliseconds)
}

func nonNegativeDuration(value time.Duration) time.Duration {
	if value < 0 {
		return 0
	}

	return value
}
