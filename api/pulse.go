// Package handler exposes the Vercel Go Function entry point for /api/pulse.
package handler

import (
	"net/http"

	"github.com/CrioNIK/Web-resume/internal/pulse"
)

var pulseHandler = pulse.NewHandler()

// Handler serves the privacy-first portfolio pulse endpoint.
func Handler(w http.ResponseWriter, r *http.Request) {
	pulseHandler.ServeHTTP(w, r)
}
