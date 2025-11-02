package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	_ "github.com/lib/pq" // PostgreSQLドライバ
)

// --- グローバル変数 ---
var db *sql.DB

// --- 構造体定義 (JSONとGoの型) ---

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

// DBから読み出すための構造体
type StoredTestResult struct {
	ID        int       `json:"id"`
	TestID    string    `json:"test_id"`
	TestName  string    `json:"test_name"`
	TestValue string    `json:"test_value"`
	TestUnit  string    `json:"test_unit"`
	CreatedAt time.Time `json:"created_at"`
}

// --- メイン関数 (プログラムの開始点) ---

func main() {
	// 1. DBに接続
	err := initDB()
	if err != nil {
		log.Fatalf("Error initializing database: %v", err)
	}
	log.Println("Database connection successful!")

	// 2. HTTPハンドラ（APIの窓口）を登録
	
	// /api/predict へのPOSTリクエストを処理
	predictHandler := http.HandlerFunc(predictHandler)
	http.Handle("/api/predict", corsMiddleware(predictHandler))

	// /api/results へのGETリクエストを処理
	resultsHandler := http.HandlerFunc(getResultsHandler)
	http.Handle("/api/results", corsMiddleware(resultsHandler))

	// 3. Webサーバーを起動
	port := "8080"
	log.Printf("Server starting on port %s\n", port)
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatal(err)
	}
}

// --- DB関連の関数 ---

// initDB はデータベース接続を初期化
func initDB() error {
	// 接続文字列を作成
	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	dbname := os.Getenv("DB_NAME")
	sslmode := os.Getenv("DB_SSLMODE")

	psqlInfo := fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=%s",
		user, password, host, port, dbname, sslmode)

	// データベース接続オブジェクトを準備
	var err error
	db, err = sql.Open("postgres", psqlInfo)
	if err != nil {
		return err
	}

	// リトライロジック
	maxRetries := 5
	for i := 0; i < maxRetries; i++ {
		err = db.Ping() // 接続をテスト
		if err == nil {
			break // 接続成功！
		}
		log.Printf("DB connection failed (attempt %d/%d), retrying in 2 seconds... Error: %v", i+1, maxRetries, err)
		time.Sleep(2 * time.Second) // 2秒待機
	}

	if err != nil {
		log.Println("Could not connect to the database after all retries.")
		return err
	}

	// 接続に成功したので、テーブル作成に進む
	err = createTables()
	if err != nil {
		return err
	}

	return nil
}

// createTables は、必要なテーブルがなければ作成します
func createTables() error {
	createTableSQL := `
	CREATE TABLE IF NOT EXISTS test_results (
		id SERIAL PRIMARY KEY,
		test_id VARCHAR(50),
		test_name VARCHAR(100),
		test_value TEXT,
		test_unit VARCHAR(50),
		created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
	);`

	_, err := db.Exec(createTableSQL)
	if err != nil {
		log.Printf("Error creating 'test_results' table: %v", err)
		return err
	}

	log.Println("Table 'test_results' is ready.")
	return nil
}


// Handles POST requests to /api/predict (データ保存)
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

	fmt.Printf("Received data: %+v\n", requestData)

	// DB保存処理
	insertSQL := `
	INSERT INTO test_results (test_id, test_name, test_value, test_unit)
	VALUES ($1, $2, $3, $4)`

	for _, item := range requestData.Tests {
		valueStr := fmt.Sprintf("%v", item.Value)
		_, err := db.Exec(insertSQL, item.ID, item.Name, valueStr, item.Unit)
		if err != nil {
			log.Printf("Error inserting data into DB: %v", err)
			http.Error(w, "Could not save data", http.StatusInternalServerError)
			return
		}
	}
	log.Println("Successfully saved test results to DB.")

	// モックデータ
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

// Handles GET requests to /api/results (データ取得)
func getResultsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	log.Println("Received request to get all test results")

	selectSQL := `SELECT id, test_id, test_name, test_value, test_unit, created_at FROM test_results ORDER BY created_at DESC`

	rows, err := db.Query(selectSQL)
	if err != nil {
		log.Printf("Error querying DB: %v", err)
		http.Error(w, "Could not query data", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var results []StoredTestResult

	for rows.Next() {
		var res StoredTestResult
		err := rows.Scan(&res.ID, &res.TestID, &res.TestName, &res.TestValue, &res.TestUnit, &res.CreatedAt)
		if err != nil {
			log.Printf("Error scanning DB row: %v", err)
			continue
		}
		results = append(results, res)
	}

	if err = rows.Err(); err != nil {
		log.Printf("Error after scanning rows: %v", err)
		http.Error(w, "Error processing data", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(results)
}

// --- ユーティリティ関数 ---

// Simple CORS middleware
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000") // 開発用にNext.jsのURLを許可
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS") // GETも許可
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		next.ServeHTTP(w, r)
	})
}