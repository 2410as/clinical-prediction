"use client"

import type React from "react"
import { useState } from "react"
import {
  Activity,
  Plus,
  Trash2,
  FlaskConical,
  Loader2,
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  ChevronDown,
} from "lucide-react"

const TEST_ITEMS = [
  { id: "glucose", name: "グルコース", unit: "mg/dL", normalRange: "70-100" },
  { id: "hba1c", name: "HbA1c", unit: "%", normalRange: "4.0-5.6" },
  { id: "ast", name: "AST", unit: "U/L", normalRange: "10-40" },
  { id: "alt", name: "ALT", unit: "U/L", normalRange: "5-40" },
  { id: "ldl", name: "LDLコレステロール", unit: "mg/dL", normalRange: "<120" },
  { id: "hdl", name: "HDLコレステロール", unit: "mg/dL", normalRange: ">40" },
  { id: "triglyceride", name: "中性脂肪", unit: "mg/dL", normalRange: "30-150" },
  { id: "creatinine", name: "クレアチニン", unit: "mg/dL", normalRange: "0.6-1.2" },
  { id: "uric_acid", name: "尿酸", unit: "mg/dL", normalRange: "3.0-7.0" },
  { id: "wbc", name: "白血球数", unit: "/μL", normalRange: "3500-9000" },
]

interface TestInput {
  id: string
  testId: string
  value: string
}

export default function Home() {
  const [inputs, setInputs] = useState<TestInput[]>([{ id: "1", testId: "", value: "" }])
  const [predictions, setPredictions] = useState<any>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [openSelectId, setOpenSelectId] = useState<string | null>(null)

  const addInput = () => {
    setInputs([...inputs, { id: Date.now().toString(), testId: "", value: "" }])
  }

  const removeInput = (id: string) => {
    if (inputs.length > 1) {
      setInputs(inputs.filter((input) => input.id !== id))
    }
  }

  const updateInput = (id: string, field: "testId" | "value", value: string) => {
    setInputs(inputs.map((input) => (input.id === id ? { ...input, [field]: value } : input)))
  }

  const getSelectedTestIds = () => inputs.map((input) => input.testId).filter(Boolean)

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault()
    const validInputs = inputs.filter((input) => input.testId && input.value)
    if (validInputs.length === 0) return

    setIsAnalyzing(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const mockResults = {
      predictions: [
        {
          disease: "2型糖尿病",
          probability: 78,
          riskLevel: "high",
          relatedTests: [
            { name: "グルコース", value: 145, unit: "mg/dL", status: "abnormal", normalRange: "70-100" },
            { name: "HbA1c", value: 7.2, unit: "%", status: "abnormal", normalRange: "4.0-5.6" },
          ],
        },
        {
          disease: "脂質異常症",
          probability: 65,
          riskLevel: "medium",
          relatedTests: [
            { name: "LDLコレステロール", value: 165, unit: "mg/dL", status: "abnormal", normalRange: "<120" },
            { name: "HDLコレステロール", value: 38, unit: "mg/dL", status: "abnormal", normalRange: ">40" },
          ],
        },
        {
          disease: "肝機能障害",
          probability: 42,
          riskLevel: "low",
          relatedTests: [
            { name: "AST", value: 45, unit: "U/L", status: "borderline", normalRange: "10-40" },
            { name: "ALT", value: 52, unit: "U/L", status: "abnormal", normalRange: "5-40" },
          ],
        },
      ],
      analyzedAt: new Date().toISOString(),
    }

    setPredictions(mockResults)
    setIsAnalyzing(false)
  }

  const handleReset = () => {
    setInputs([{ id: "1", testId: "", value: "" }])
    setPredictions(null)
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case "high":
        return "text-red-600"
      case "medium":
        return "text-amber-600"
      case "low":
        return "text-emerald-600"
      default:
        return "text-gray-500"
    }
  }

  const getRiskBgColor = (level: string) => {
    switch (level) {
      case "high":
        return "bg-red-50 border-red-200"
      case "medium":
        return "bg-amber-50 border-amber-200"
      case "low":
        return "bg-emerald-50 border-emerald-200"
      default:
        return "bg-gray-50"
    }
  }

  const getRiskIcon = (level: string) => {
    switch (level) {
      case "high":
        return <AlertCircle className="w-5 h-5" />
      case "medium":
        return <AlertTriangle className="w-5 h-5" />
      case "low":
        return <CheckCircle className="w-5 h-5" />
      default:
        return null
    }
  }

  const getRiskLabel = (level: string) => {
    switch (level) {
      case "high":
        return "高リスク"
      case "medium":
        return "中リスク"
      case "low":
        return "低リスク"
      default:
        return ""
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "abnormal":
        return "text-red-600"
      case "borderline":
        return "text-amber-600"
      case "normal":
        return "text-emerald-600"
      default:
        return "text-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "abnormal":
        return <AlertCircle className="w-4 h-4" />
      case "borderline":
        return <AlertTriangle className="w-4 h-4" />
      case "normal":
        return <CheckCircle className="w-4 h-4" />
      default:
        return null
    }
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "abnormal":
        return "bg-red-100 text-red-700 border-red-200"
      case "borderline":
        return "bg-amber-100 text-amber-700 border-amber-200"
      case "normal":
        return "bg-emerald-100 text-emerald-700 border-emerald-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-7xl">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-600">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">MediPredict</h1>
              <p className="text-xs text-gray-600">疾病予測システム</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors">
              ホーム
            </a>
            <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              使い方
            </a>
            <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              検査項目について
            </a>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
            <Activity className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 text-balance">臨床検査値からの疾病予測</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto text-pretty">
            複数の検査項目と数値を入力することで、AIが関連性の高い疾患の可能性を分析します
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="lg:sticky lg:top-8 h-fit">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <FlaskConical className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-bold text-gray-900">検査値入力</h2>
                </div>
                <p className="text-sm text-gray-600">検査項目を選択し、測定値を入力してください</p>
              </div>
              <div className="p-6">
                <form onSubmit={handleAnalyze} className="space-y-4">
                  <div className="space-y-3">
                    {inputs.map((input) => {
                      const selectedTest = TEST_ITEMS.find((t) => t.id === input.testId)
                      const selectedIds = getSelectedTestIds()
                      const isOpen = openSelectId === input.id

                      return (
                        <div key={input.id} className="flex gap-2 items-start">
                          <div className="flex-1 space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                              {/* Custom Select */}
                              <div>
                                <label htmlFor={`test-${input.id}`} className="block text-xs text-gray-600 mb-1">
                                  検査項目
                                </label>
                                <div className="relative">
                                  <button
                                    type="button"
                                    onClick={() => setOpenSelectId(isOpen ? null : input.id)}
                                    className="w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-md text-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  >
                                    <span className={selectedTest ? "text-gray-900" : "text-gray-500"}>
                                      {selectedTest ? selectedTest.name : "選択"}
                                    </span>
                                    <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                  </button>
                                  {isOpen && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                                      {TEST_ITEMS.map((test) => {
                                        const isDisabled = selectedIds.includes(test.id) && test.id !== input.testId
                                        return (
                                          <button
                                            key={test.id}
                                            type="button"
                                            onClick={() => {
                                              if (!isDisabled) {
                                                updateInput(input.id, "testId", test.id)
                                                setOpenSelectId(null)
                                              }
                                            }}
                                            disabled={isDisabled}
                                            className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-100 ${
                                              isDisabled ? "text-gray-400 cursor-not-allowed" : "text-gray-900"
                                            } ${test.id === input.testId ? "bg-blue-50 text-blue-600" : ""}`}
                                          >
                                            {test.name}
                                          </button>
                                        )
                                      })}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Input */}
                              <div>
                                <label htmlFor={`value-${input.id}`} className="block text-xs text-gray-600 mb-1">
                                  測定値 {selectedTest && `(${selectedTest.unit})`}
                                </label>
                                <input
                                  id={`value-${input.id}`}
                                  type="number"
                                  step="0.1"
                                  placeholder="数値"
                                  value={input.value}
                                  onChange={(e) => updateInput(input.id, "value", e.target.value)}
                                  disabled={!input.testId}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                                />
                              </div>
                            </div>

                            {selectedTest && (
                              <p className="text-xs text-gray-600">
                                基準値: {selectedTest.normalRange} {selectedTest.unit}
                              </p>
                            )}
                          </div>

                          {inputs.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeInput(input.id)}
                              className="mt-6 p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {inputs.length < TEST_ITEMS.length && (
                    <button
                      type="button"
                      onClick={addInput}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      検査項目を追加
                    </button>
                  )}

                  <div className="flex gap-2 pt-4">
                    <button
                      type="submit"
                      disabled={isAnalyzing || !inputs.some((i) => i.testId && i.value)}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          分析中...
                        </>
                      ) : (
                        "予測を実行"
                      )}
                    </button>

                    {predictions && (
                      <button
                        type="button"
                        onClick={handleReset}
                        disabled={isAnalyzing}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                      >
                        リセット
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Results */}
          <div>
            {predictions ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">予測結果</h2>
                    <p className="text-sm text-gray-600 mt-1">
                      分析日時: {new Date(predictions.analyzedAt).toLocaleString("ja-JP")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-blue-600">
                    <TrendingUp className="w-5 h-5" />
                    <span className="text-sm font-medium">{predictions.predictions.length}件の予測</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {predictions.predictions.map((prediction: any, index: number) => (
                    <div
                      key={index}
                      className={`bg-white border rounded-lg shadow-sm ${getRiskBgColor(prediction.riskLevel)}`}
                    >
                      <div className="p-6 border-b border-gray-200">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{prediction.disease}</h3>
                            <div
                              className={`flex items-center gap-2 font-medium ${getRiskColor(prediction.riskLevel)}`}
                            >
                              {getRiskIcon(prediction.riskLevel)}
                              <span>{getRiskLabel(prediction.riskLevel)}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-3xl font-bold ${getRiskColor(prediction.riskLevel)}`}>
                              {prediction.probability}%
                            </div>
                            <p className="text-xs text-gray-600 mt-1">可能性</p>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-4">
                          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full transition-all duration-500 ${
                                prediction.riskLevel === "high"
                                  ? "bg-red-600"
                                  : prediction.riskLevel === "medium"
                                    ? "bg-amber-600"
                                    : "bg-emerald-600"
                              }`}
                              style={{ width: `${prediction.probability}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="space-y-3">
                          <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            関連する検査値
                          </h4>

                          <div className="space-y-2">
                            {prediction.relatedTests.map((test: any, testIndex: number) => (
                              <div
                                key={testIndex}
                                className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                              >
                                <div className="flex items-center gap-3">
                                  <span className={getStatusColor(test.status)}>{getStatusIcon(test.status)}</span>
                                  <div>
                                    <p className="font-medium text-sm text-gray-900">{test.name}</p>
                                    <p className="text-xs text-gray-600">
                                      基準値: {test.normalRange} {test.unit}
                                    </p>
                                  </div>
                                </div>

                                <div className="text-right">
                                  <p className={`font-bold ${getStatusColor(test.status)}`}>
                                    {test.value} {test.unit}
                                  </p>
                                  <span
                                    className={`inline-block px-2 py-1 text-xs font-medium rounded-full border mt-1 ${getStatusBadgeClass(test.status)}`}
                                  >
                                    {test.status === "abnormal"
                                      ? "異常"
                                      : test.status === "borderline"
                                        ? "境界"
                                        : "正常"}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Warning Card */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="space-y-2 text-sm">
                      <p className="font-medium text-gray-900">医療機関への受診をお勧めします</p>
                      <p className="text-gray-700 text-pretty">
                        この予測結果は参考情報です。正確な診断と適切な治療のため、医療機関を受診し、専門医にご相談ください。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg p-12 text-center shadow-sm">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
                  <Activity className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">検査値を入力してください</h3>
                <p className="text-gray-600 text-pretty">
                  左側のフォームに検査項目と数値を入力し、「予測を実行」ボタンをクリックすると、AIによる疾病予測結果がここに表示されます
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-16 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">ご利用にあたっての注意事項</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex gap-2">
              <span className="text-blue-600">•</span>
              <span>本システムの予測結果は参考情報であり、医学的診断を代替するものではありません</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-600">•</span>
              <span>実際の診断や治療については、必ず医療機関を受診してください</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-600">•</span>
              <span>入力された検査データは予測処理にのみ使用され、保存されません</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  )
}
