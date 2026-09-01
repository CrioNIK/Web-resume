// Command pulse-dev runs the portfolio pulse API for local frontend development.
package main

import (
	"log"
	"net/http"
	"os"
	"time"

	"github.com/CrioNIK/Web-resume/internal/pulse"
)

func main() {
	address := os.Getenv("PULSE_ADDR")
	if address == "" {
		address = "127.0.0.1:8787"
	}
	server := &http.Server{
		Addr:              address,
		Handler:           pulse.NewHandler(),
		ReadHeaderTimeout: 5 * time.Second,
	}

	log.Printf("portfolio pulse listening on http://%s", address)
	if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatal(err)
	}
}
