"use client"
import { useState } from "react"
import { ArrowLeft, Info, Activity, Droplets, Heart, Bone, CheckCircle, User, Pill, Apple, Dumbbell, AlertCircle } from "lucide-react"
import type { TestItem } from "@/lib/test-items"
import { isOutOfRange } from "@/lib/test-item-helpers"

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

const getCategoryIcon = (category: string) => {
  const icons: { [key: string]: any } = {
    lifestyle: Dumbbell,
    health: AlertCircle,
    diet: Apple,
    medication: Pill,
  }
  return icons[category] || User
}

const getCategoryName = (category: string) => {
  const names: { [key: string]: string } = {
    lifestyle: "生活習慣",
    health: "病気・体調",
    diet: "食事・飲酒",
    medication: "薬剤",
  }
  return names[category] || category
}

type Props = {
  item: TestItem
  userValue: string | undefined
  onBack: () => void
}

export const TestDetailView = ({ item, userValue, onBack }: Props) => {
  const [activeTab, setActiveTab] = useState<"overview" | "details" | "factors" | "expert" | "tips">("overview")
  const isAbnormal = Boolean(userValue) && isOutOfRange(userValue ?? "", item.normalRange)

  return (
      <div className="min-h-screen bg-white p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>一覧へ戻る</span>
          </button>

          <div
            className={`bg-white border-2 rounded-lg p-4 mb-6 ${isAbnormal ? "border-red-500 bg-red-50" : "border-gray-200"}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-gray-700 mb-1">基準値</h2>
                <p className="text-lg font-bold text-gray-900">
                  {item.normalRange} {item.unit}
                </p>
              </div>
              {userValue && (
                <div className="text-right">
                  <h2 className="text-sm font-semibold text-gray-700 mb-1">あなたの値</h2>
                  <p className={`text-lg font-bold ${isAbnormal ? "text-red-600" : "text-green-600"}`}>
                    {userValue} {item.unit}
                  </p>
                </div>
              )}
            </div>
            {isAbnormal && (
              <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                基準値外の値です。詳しくは医療機関にご相談ください。
              </p>
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 p-6 border-b border-gray-200">
              <div className="text-gray-700">{getIcon(item.icon)}</div>
              <h1 className="text-2xl font-bold text-gray-900">{item.name}について</h1>
            </div>

            <div className="flex border-b border-gray-200 overflow-x-auto">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === "overview"
                    ? "border-b-2 border-gray-900 text-gray-900"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                概要
              </button>
              <button
                onClick={() => setActiveTab("details")}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === "details"
                    ? "border-b-2 border-gray-900 text-gray-900"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                詳細解説
              </button>
              <button
                onClick={() => setActiveTab("factors")}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === "factors"
                    ? "border-b-2 border-gray-900 text-gray-900"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                影響因子
              </button>
              {item.expertKnowledge && (
                <button
                  onClick={() => setActiveTab("expert")}
                  className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === "expert"
                      ? "border-b-2 border-gray-900 text-gray-900"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  専門知識
                </button>
              )}
              {item.healthTips && (
                <button
                  onClick={() => setActiveTab("tips")}
                  className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === "tips"
                      ? "border-b-2 border-gray-900 text-gray-900"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  健康維持のヒント
                </button>
              )}
            </div>

            <div className="p-6">
              {activeTab === "overview" && (
                <div>
                  <p className="text-gray-700 leading-relaxed">{item.description}</p>
                  <p className="text-sm text-gray-500 mt-4">※ 基準値は検査機関や測定方法により異なる場合があります</p>
                </div>
              )}

              {activeTab === "details" && (
                <div>
                  <p className="text-gray-700 leading-relaxed">{item.detailedDescription}</p>
                </div>
              )}

              {activeTab === "factors" && (
                <div className="space-y-6">
                  {Object.entries(item.factors).map(([category, items]) => {
                    const IconComponent = getCategoryIcon(category)
                    return (
                      <div key={category}>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <IconComponent className="w-5 h-5 text-gray-600" />
                          {getCategoryName(category)}
                        </h3>
                        <ul className="space-y-2 ml-7">
                          {items.map((factor, index) => (
                            <li key={index} className="flex items-start gap-2 text-gray-700">
                              <span className="text-gray-400 mt-1">•</span>
                              <span>{factor}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )
                  })}
                </div>
              )}

              {activeTab === "expert" && item.expertKnowledge && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <Info className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700 leading-relaxed">{item.expertKnowledge}</p>
                  </div>
                </div>
              )}

              {activeTab === "tips" && item.healthTips && (
                <div className="space-y-3">
                  {item.healthTips.map((tip: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-lg p-4"
                    >
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{tip}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
  )
}
