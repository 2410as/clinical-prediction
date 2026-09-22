"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

type StoredTestResult = {
  id: number
  batch_id: string
  test_id: string
  test_name: string
  test_value: string
  test_unit: string
  created_at: string
}

type Batch = {
  batchId: string
  createdAt: string
  items: StoredTestResult[]
}

const formatDateTime = (iso: string) => {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 ${String(d.getHours()).padStart(2, "0")}:${String(
    d.getMinutes(),
  ).padStart(2, "0")}`
}

// API は新しい順のフラットな配列を返すので、batch_id（分析1回ぶん）でまとめ直す
const groupByBatch = (rows: StoredTestResult[]): Batch[] => {
  const map = new Map<string, Batch>()
  for (const row of rows) {
    const batch = map.get(row.batch_id)
    if (batch) {
      batch.items.push(row)
    } else {
      map.set(row.batch_id, { batchId: row.batch_id, createdAt: row.created_at, items: [row] })
    }
  }
  return Array.from(map.values())
}

const HistoryPage = () => {
  const [batches, setBatches] = useState<Batch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/results")
        if (!response.ok) {
          throw new Error(`サーバーがエラーを返しました (${response.status})`)
        }
        const data = await response.json()
        // 保存が0件のとき Go は null を返すので、配列に落としてから扱う
        setBatches(groupByBatch(data ?? []))
      } catch (e) {
        setError(
          e instanceof Error && e.message.includes("fetch")
            ? "APIに接続できませんでした。バックエンド（localhost:8080）が起動しているか確認してください。"
            : e instanceof Error
              ? e.message
              : "不明なエラーが発生しました",
        )
      } finally {
        setLoading(false)
      }
    }
    fetchResults()
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">検査結果の履歴</h1>
          <p className="text-gray-600">保存した検査値を新しい順に表示しています</p>
        </header>

        <Link
          href="/"
          className="inline-block mb-8 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          入力画面に戻る
        </Link>

        {loading && <p className="text-gray-600">読み込み中...</p>}

        {error && (
          <div className="border border-red-300 bg-red-50 rounded-lg p-4">
            <p className="font-semibold text-red-800">読み込みに失敗しました</p>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        )}

        {!loading && !error && batches.length === 0 && (
          <div className="border border-gray-200 bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-600">まだ保存された記録がありません。</p>
            <p className="text-sm text-gray-500 mt-1">入力画面で値を入れて「分析する」を押すと、ここに残ります。</p>
          </div>
        )}

        <div className="space-y-8">
          {batches.map((batch) => (
            <section key={batch.batchId} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-baseline justify-between gap-4">
                <h2 className="font-semibold text-gray-900">{formatDateTime(batch.createdAt)}</h2>
                <span className="text-sm text-gray-500">{batch.items.length}項目</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-600 border-b border-gray-200">
                      <th className="px-4 py-2 font-medium">検査項目</th>
                      <th className="px-4 py-2 font-medium">値</th>
                      <th className="px-4 py-2 font-medium">単位</th>
                    </tr>
                  </thead>
                  <tbody>
                    {batch.items.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100 last:border-b-0">
                        <td className="px-4 py-2 text-gray-900">{item.test_name}</td>
                        <td className="px-4 py-2 text-gray-900 font-medium">{item.test_value}</td>
                        <td className="px-4 py-2 text-gray-600">{item.test_unit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HistoryPage
