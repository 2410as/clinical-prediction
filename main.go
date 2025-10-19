package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

// Data structures for communication with the frontend
type TestItem struct {
	ID    string      `json:"id"`
	Name  string      `json:"name"`
	Value interface{} `json:"value"`
	Unit  string      `json:"unit"`
}

type PredictRequest struct {
	Tests []TestItem `json:"tests"`
}

type PredictionResult struct {
	ID         string `json:"id"`
	Name       string `json:"name"`
	Prediction string `json:"prediction"`
	Advice     string `json:"advice"`
}

type PredictResponse struct {
	Results []PredictionResult `json:"results"`
}

// Handles requests to /api/predict
func predictHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	var requestData PredictRequest
	err := json.NewDecoder(r.Body).Decode(&requestData)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// For debugging: print received data to the console
	fmt.Printf("Received data: %+v\n", requestData)

	// Future AI analysis logic will go here.
	// For now, we return mock data.
	mockResults := []PredictionResult{
		{
			ID:         "ldl",
			Name:       "LDL Cholesterol",
			Prediction: "肝機能への注意が必要です",
			Advice:     "食生活の見直しや適度な運動を心がけましょう。詳細は医師にご相談ください。",
		},
		{
			ID:         "glucose",
			Name:       "Glucose",
			Prediction: "血糖値は正常範囲です",
			Advice:     "現在の健康的な生活習慣を維持しましょう。",
		},
	}

	response := PredictResponse{
		Results: mockResults,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// Main function to start the server
func main() {
	// CORS middleware to allow requests from the frontend development server
	handler := http.HandlerFunc(predictHandler)
	http.Handle("/api/predict", corsMiddleware(handler))

	port := "8080"
	fmt.Printf("Server starting on port %s\n", port)
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatal(err)
	}
}

// Simple CORS middleware to allow communication from the frontend
func corsMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        // Allow requests from our React development server
        w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
        w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
        w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

        // Handle preflight requests
        if r.Method == "OPTIONS" {
            w.WriteHeader(http.StatusOK)
            return
        }

        next.ServeHTTP(w, r)
    })
}