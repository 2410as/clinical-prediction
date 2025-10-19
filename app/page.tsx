"use client"
import { useState } from "react"
import { Activity, Heart, Droplet, Brain, Bone, Eye, ArrowLeft } from "lucide-react"

const TEST_ITEMS = [
  {
    id: "alt",
    name: "ALT (GPT)",
    unit: "U/L",
    normalRange: "5-40",
    icon: "liver",
    description: "肝臓の健康状態を示す酵素です",
    detailedDescription:
      "ALT（アラニンアミノトランスフェラーゼ）は、主に肝臓に存在する酵素です。肝細胞が損傷を受けると血液中に放出されるため、肝臓の健康状態を評価する重要な指標となります。肝炎、脂肪肝、アルコール性肝障害などで上昇することがあります。",
    factors: [
      "体位（臥位・立位など）",
      "時間帯（朝・夕など）",
      "最近のアルコール摂取",
      "服用している薬（抗生物質、スタチンなど）",
      "激しい運動",
      "肥満や脂肪肝",
    ],
  },
  {
    id: "glucose",
    name: "血糖値（Glucose）",
    unit: "mg/dL",
    normalRange: "70-100",
    icon: "blood",
    description: "血液中の糖の濃度を測定します",
    detailedDescription:
      "血糖値は血液中のブドウ糖の濃度を示します。食事から摂取した糖質がエネルギー源として利用されるため、体のエネルギー代謝の状態を反映します。高値が続くと糖尿病のリスクが高まります。",
    factors: [
      "時間帯（朝・夕など）",
      "空腹状態（食前・食後）",
      "最近の食事内容（特に炭水化物）",
      "運動量",
      "ストレスや病気",
      "服用している薬（ステロイド、利尿薬など）",
    ],
  },
  {
    id: "ldl",
    name: "LDLコレステロール",
    unit: "mg/dL",
    normalRange: "<120",
    icon: "heart",
    description: "動脈硬化の原因となる「悪玉コレステロール」です",
    detailedDescription:
      "LDLコレステロールは「悪玉コレステロール」とも呼ばれ、血管壁に蓄積して動脈硬化を引き起こす可能性があります。心筋梗塞や脳卒中などの心血管疾患のリスク因子となるため、適切な管理が重要です。",
    factors: [
      "体位（臥位・立位など）",
      "最近の食事習慣（高脂肪食）",
      "運動量",
      "遺伝的要因",
      "喫煙",
      "服用している薬（スタチン、フィブラートなど）",
    ],
  },
  {
    id: "creatinine",
    name: "クレアチニン（Creatinine）",
    unit: "mg/dL",
    normalRange: "0.6-1.2",
    icon: "kidney",
    description: "腎臓の働きを示す指標です",
    detailedDescription:
      "クレアチニンは筋肉の代謝産物で、通常は腎臓でろ過されて尿中に排泄されます。腎機能が低下すると血液中のクレアチニン値が上昇するため、腎臓の働きを評価する重要な指標となります。",
    factors: [
      "時間帯（朝・夕など）",
      "筋肉量（筋肉質な人ほど高値）",
      "最近のタンパク質摂取",
      "水分摂取状態",
      "激しい運動",
      "服用している薬（NSAIDs、ACE阻害薬など）",
    ],
  },
  {
    id: "hba1c",
    name: "HbA1c",
    unit: "%",
    normalRange: "4.0-5.6",
    icon: "blood",
    description: "過去2〜3ヶ月の平均血糖値を示します",
    detailedDescription:
      "HbA1c（ヘモグロビンA1c）は、赤血球中のヘモグロビンに糖が結合した割合を示します。過去2〜3ヶ月間の平均的な血糖値を反映するため、糖尿病の診断や血糖コントロールの評価に用いられます。",
    factors: [
      "過去2〜3ヶ月の平均血糖値",
      "赤血球の寿命",
      "貧血や血液疾患",
      "最近の輸血",
      "腎臓病",
      "特定のヘモグロビン変異",
    ],
  },
]

const getIcon = (iconType: string) => {
  const iconClass = "w-8 h-8"
  switch (iconType) {
    case "liver":
      return <Activity className={iconClass} />
    case "heart":
      return <Heart className={iconClass} />
    case "blood":
      return <Droplet className={iconClass} />
    case "kidney":
      return <Brain className={iconClass} />
    case "bone":
      return <Bone className={iconClass} />
    default:
      return <Eye className={iconClass} />
  }
}

export default function Home() {
  const [inputValues, setInputValues] = useState<Record<string, string>>({})
  const [selectedTest, setSelectedTest] = useState<string | null>(null)

  const selectedTestData = selectedTest ? TEST_ITEMS.find((test) => test.id === selectedTest) : null

  const handleInputChange = (id: string, value: string) => {
    setInputValues((prev) => ({ ...prev, [id]: value }))
  }

  const handleRunAnalysis = () => {
    console.log("Running analysis with values:", inputValues)
    // Here you would typically send the data to your backend
  }

  if (selectedTestData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
        {/* Header */}
        <header className="border-b border-blue-100 bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
          <div className="container mx-auto px-4 py-4 max-w-4xl">
            <button
              onClick={() => setSelectedTest(null)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">一覧へ戻る</span>
            </button>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Title */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
                {getIcon(selectedTestData.icon)}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{selectedTestData.name}について</h1>
                <p className="text-gray-600 mt-1">{selectedTestData.description}</p>
              </div>
            </div>
          </div>

          {/* What is this? */}
          <div className="bg-white rounded-3xl shadow-lg border border-blue-100 p-8 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">この項目について</h2>
            <p className="text-gray-700 leading-relaxed">{selectedTestData.detailedDescription}</p>
          </div>

          {/* Normal Range */}
          <div className="bg-white rounded-3xl shadow-lg border border-blue-100 p-8 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">基準値</h2>
            <p className="text-3xl font-bold text-blue-600">
              {selectedTestData.normalRange}
              <span className="text-lg font-normal ml-2 text-gray-600">{selectedTestData.unit}</span>
            </p>
          </div>

          {/* Factors that can affect the result */}
          <div className="bg-white rounded-3xl shadow-lg border border-blue-100 p-8 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">数値に影響を与える要因</h2>
            <ul className="space-y-3">
              {selectedTestData.factors.map((factor, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-2"></span>
                  <span className="text-gray-700">{factor}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Back Button */}
          <div className="text-center">
            <button
              onClick={() => setSelectedTest(null)}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl font-medium shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-cyan-600 transition-all"
            >
              一覧へ戻る
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
      {/* Header */}
      <header className="border-b border-blue-100 bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-500 shadow-md">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                健康診断結果入力
              </h1>
              <p className="text-xs text-gray-600">検査結果を入力してください</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Instructions */}
        <div className="mb-8 bg-white rounded-3xl shadow-lg border border-blue-100 p-6">
          <p className="text-gray-700 text-center">
            下記に検査値を入力し、「分析を実行」ボタンをクリックすると、AIによる健康アドバイスが表示されます。
          </p>
        </div>

        <div className="space-y-4 mb-8">
          {TEST_ITEMS.map((test) => (
            <div
              key={test.id}
              className="bg-white rounded-2xl shadow-md border border-blue-100 overflow-hidden transition-all hover:shadow-lg"
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  {/* Icon - clickable to view details */}
                  <button
                    onClick={() => setSelectedTest(test.id)}
                    className="flex-shrink-0 w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 hover:bg-blue-200 transition-colors"
                  >
                    {getIcon(test.icon)}
                  </button>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1">
                        <button
                          onClick={() => setSelectedTest(test.id)}
                          className="text-left hover:text-blue-600 transition-colors"
                        >
                          <h3 className="text-lg font-bold text-gray-900">{test.name}</h3>
                        </button>
                        <p className="text-sm text-gray-600 mt-1">{test.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mb-3">
                      <input
                        type="number"
                        step="0.1"
                        placeholder="数値を入力"
                        value={inputValues[test.id] || ""}
                        onChange={(e) => handleInputChange(test.id, e.target.value)}
                        className="flex-1 px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-lg font-semibold text-gray-900"
                      />
                      <span className="text-gray-600 font-medium min-w-[60px]">{test.unit}</span>
                    </div>

                    {/* Normal Range */}
                    <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
                      <span className="font-medium">基準値:</span>
                      <span>
                        {test.normalRange} {test.unit}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={handleRunAnalysis}
            className="px-12 py-5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-cyan-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={Object.keys(inputValues).length === 0}
          >
            分析を実行
          </button>
          <p className="text-sm text-gray-600 mt-3">AIによる健康アドバイスを取得します</p>
        </div>

        {/* Info Notice */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <div className="flex gap-3">
            <Activity className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-2 text-sm">
              <p className="font-medium text-gray-900">情報提供のみを目的としています</p>
              <p className="text-gray-700">
                このツールは一般的な健康情報を提供します。検査結果の解釈や医療アドバイスについては、必ず医療専門家にご相談ください。
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
