"use client"
import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { TEST_ITEMS, type TestItem } from "@/lib/test-items"
import { isOutOfRange } from "@/lib/test-item-helpers"
import { TestDetailView } from "@/components/test-detail-view"
import { Activity, Droplets, Heart, Bone, Info } from "lucide-react"

type PredictionResult = {
  id: string
  name: string
  prediction: string
  advice: string
}

const getIcon = (iconName: string) => {
  const icons: { [key: string]: any } = {
    liver: Activity,
    kidney: Droplets,
    heart: Heart,
    bone: Bone,
    blood: Droplets,
  }
  const IconComponent = icons[iconName] || Activity
  return <IconComponent className="w-6 h-6" />
}


const Page = () => {
  const [viewMode, setViewMode] = useState<"list" | "detail">("list")
  const [selectedItem, setSelectedItem] = useState<TestItem | null>(null)
  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({})
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const [results, setResults] = useState<PredictionResult[]>([])
  const [analyzeError, setAnalyzeError] = useState<string | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem("healthCheckValues")
    if (saved) {
      setInputValues(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("healthCheckValues", JSON.stringify(inputValues))
  }, [inputValues])

  const handleCardClick = (item: TestItem) => {
    setSelectedItem(item)
    setViewMode("detail")
  }

  const handleBackToList = () => {
    setViewMode("list")
    setSelectedItem(null)
  }

  const handleInputChange = (id: string, value: string) => {
    setInputValues((prev) => ({ ...prev, [id]: value }))
  }

  const handleAnalyze = async () => {
    const tests = TEST_ITEMS
      .filter((item) => inputValues[item.id]) // 値が入力されてる項目だけ残す
      .map((item) => ({
        id: item.id,
        name: item.name,
        value: inputValues[item.id],
        unit: item.unit,
      }))

    setAnalyzeError(null)
    try {
      const response = await fetch("http://localhost:8080/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tests }),
      })
      if (!response.ok) {
        throw new Error(`サーバーがエラーを返しました (${response.status})`)
      }
      const result = await response.json()
      // 全項目が保存に失敗すると Go は null を返すので、配列に落としてから扱う
      setResults(result.results ?? [])
    } catch (e) {
      setResults([])
      setAnalyzeError(
        e instanceof Error && e.message.includes("fetch")
          ? "APIに接続できませんでした。バックエンド（localhost:8080）が起動しているか確認してください。"
          : e instanceof Error
            ? e.message
            : "不明なエラーが発生しました",
      )
    }
  }

  const scrollToCategory = (category: string) => {
    const ref = categoryRefs.current[category]
    if (ref) {
      ref.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const categories = Array.from(new Set(TEST_ITEMS.map((item) => item.category)))

  if (viewMode === "detail" && selectedItem) {
    return (
      <TestDetailView item={selectedItem} userValue={inputValues[selectedItem.id]} onBack={handleBackToList} />
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">健康診断結果入力</h1>
          <p className="text-gray-600">検査項目をクリックすると詳細情報が表示されます</p>
        </header>

        <div className="flex flex-wrap gap-3 mb-8">
          <button
          onClick={handleAnalyze}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          分析する
          </button>

          <Link
            href="/history"
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            保存した記録を見る
          </Link>
        </div>

        {analyzeError && (
          <div className="mb-8 border border-red-300 bg-red-50 rounded-lg p-4">
            <p className="font-semibold text-red-800">分析に失敗しました</p>
            <p className="text-sm text-red-700 mt-1">{analyzeError}</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="mb-8 space-y-3">
            {results.map((r) => (
              <div
                key={r.id}
                className={`border rounded-lg p-4 ${
                  r.prediction.includes("正常")
                    ? "border-green-300 bg-green-50"
                    : r.prediction.includes("高値")
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                <p className="font-semibold text-gray-900">
                  {r.name}：{r.prediction}
                </p>
                <p className="text-sm text-gray-600 mt-1">{r.advice}</p>
              </div>
            ))}
          </div>
        )}

        <div className="mb-8 bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">カテゴリから探す</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => scrollToCategory(category)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          {categories.map((category) => (
            <div key={category} ref={(el) => {categoryRefs.current[category] = el}}>
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-gray-200">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {TEST_ITEMS.filter((item) => item.category === category).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleCardClick(item)}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="text-gray-600 group-hover:text-gray-900 transition-colors">
                          {getIcon(item.icon)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-500">{item.description}</p>
                        </div>
                      </div>
                      <Info className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        inputMode="decimal"
                        value={inputValues[item.id] || ""}
                        onChange={(e) => {
                          e.stopPropagation()
                          handleInputChange(item.id, e.target.value)
                        }}
                        onClick={(e) => e.stopPropagation()}
                        placeholder="数値を入力"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-600 whitespace-nowrap">{item.unit}</span>
                    </div>

                    <p className="text-xs text-gray-500 mt-2">基準値: {item.normalRange}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Page