package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	_ "github.com/lib/pq" // PostgreSQLドライバ
)

// --- 構造体定義 ---

// Server : データベース接続を保持するための構造体（グローバル変数を回避）
type Server struct {
	db *sql.DB
}

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
	BatchID   string    `json:"batch_id"` // 1回の検査をまとめるID
	TestID    string    `json:"test_id"`
	TestName  string    `json:"test_name"`
	TestValue string    `json:"test_value"`
	TestUnit  string    `json:"test_unit"`
	CreatedAt time.Time `json:"created_at"`
}

func main() {
	// 1. DB接続処理
	db, err := initDB()
	if err != nil {
		log.Fatalf("Error initializing database: %v", err)
	}
	defer db.Close() // main終了時に閉じる
	log.Println("Database connection successful!")

	// Server構造体を初期化（ここでDBを渡す）
	server := &Server{db: db}

	// 2. HTTPハンドラを登録（Serverのメソッドとして呼び出す）
	
	// /api/predict へのPOSTリクエスト
	// http.HandlerFuncを使って、メソッドをハンドラに変換
	http.Handle("/api/predict", corsMiddleware(http.HandlerFunc(server.predictHandler)))

	// /api/results へのGETリクエスト
	http.Handle("/api/results", corsMiddleware(http.HandlerFunc(server.getResultsHandler)))

	// 3. Webサーバーを起動
	port := "8080"
	log.Printf("Server starting on port %s\n", port)
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatal(err)
	}
}

// initDB はデータベース接続を初期化し、接続を返します
func initDB() (*sql.DB, error) {
	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	dbname := os.Getenv("DB_NAME")
	sslmode := os.Getenv("DB_SSLMODE")

	psqlInfo := fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=%s",
		user, password, host, port, dbname, sslmode)

	db, err := sql.Open("postgres", psqlInfo)
	if err != nil {
		return nil, err
	}

	// リトライロジック
	maxRetries := 5
	for i := 0; i < maxRetries; i++ {
		err = db.Ping()
		if err == nil {
			break
		}
		log.Printf("DB connection failed (attempt %d/%d), retrying... Error: %v", i+1, maxRetries, err)
		time.Sleep(2 * time.Second)
	}

	if err != nil {
		return nil, err
	}

	// テーブル作成
	err = createTables(db)
	if err != nil {
		return nil, err
	}

	return db, nil
}

// createTables テーブル作成（引数でdbを受け取る）
func createTables(db *sql.DB) error {
	// batch_id を追加して、一度の検査リクエストをグループ化できるようにしました
	createTableSQL := `
    CREATE TABLE IF NOT EXISTS test_results (
        id SERIAL PRIMARY KEY,
        batch_id VARCHAR(50), 
        test_id VARCHAR(50),
        test_name VARCHAR(100),
        test_value TEXT,
        test_unit VARCHAR(50),
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );`

	_, err := db.Exec(createTableSQL)
	if err != nil {
		log.Printf("Error creating table: %v", err)
		return err
	}
	return nil
}

// --- ハンドラメソッド (Server構造体に紐付け) ---

// POST: データを保存し、判定結果を返す
func (s *Server) predictHandler(w http.ResponseWriter, r *http.Request) {
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

	// 今回のリクエスト用の一意なID（BatchID）を生成
	// 簡易的に現在時刻を使用（本格的にはUUIDなどが良い）
	batchID := fmt.Sprintf("batch_%d", time.Now().UnixNano())

	insertSQL := `
    INSERT INTO test_results (batch_id, test_id, test_name, test_value, test_unit)
    VALUES ($1, $2, $3, $4, $5)`

	var results []PredictionResult

	for _, item := range requestData.Tests {
		// DB保存
		valueStr := fmt.Sprintf("%v", item.Value)
		_, err := s.db.Exec(insertSQL, batchID, item.ID, item.Name, valueStr, item.Unit)
		if err != nil {
			log.Printf("Error inserting data: %v", err)
			continue // エラーでも他の項目の処理は続ける
		}

		// --- 簡易自動判定ロジック ---
		prediction := "判定なし"
		advice := "医師の診断を受けてください。"

		// 数値に変換して判定
		valFloat, err := strconv.ParseFloat(valueStr, 64)
		if err == nil {
			// 検査項目ごとのロジック (※あくまで例です)
			switch item.ID {
			case "ldl":
				if valFloat >= 140 {
					prediction = "高値 (High)"
					advice = "基準値を超えています。脂質制限を心がけましょう。"
				} else {
					prediction = "正常 (Normal)"
					advice = "正常範囲内です。"
				}
			case "glucose":
				if valFloat >= 110 { // 空腹時血糖の簡易基準
					prediction = "高値傾向"
					advice = "糖質の摂りすぎに注意しましょう。"
				} else {
					prediction = "正常"
					advice = "引き続き良い生活習慣を維持してください。"
				}
			default:
				prediction = "記録済み"
				advice = "データは保存されました。"
			}
		}

		results = append(results, PredictionResult{
			ID:         item.ID,
			Name:       item.Name,
			Prediction: prediction,
			Advice:     advice,
		})
	}

	response := PredictResponse{Results: results}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// GET: 保存された全データを返す
func (s *Server) getResultsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	// 新しい順に取得
	selectSQL := `SELECT id, batch_id, test_id, test_name, test_value, test_unit, created_at FROM test_results ORDER BY created_at DESC`

	rows, err := s.db.Query(selectSQL)
	if err != nil {
		log.Printf("Error querying DB: %v", err)
		http.Error(w, "Could not query data", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var results []StoredTestResult

	for rows.Next() {
		var res StoredTestResult
		// Scanに batch_id を追加
		err := rows.Scan(&res.ID, &res.BatchID, &res.TestID, &res.TestName, &res.TestValue, &res.TestUnit, &res.CreatedAt)
		if err != nil {
			log.Printf("Error scanning DB row: %v", err)
			continue
		}
		results = append(results, res)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(results)
}

// CORS対応ミドルウェア
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		next.ServeHTTP(w, r)
	})
}