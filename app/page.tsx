"use client"
import { useState, useRef, useEffect } from "react"
import {
  ArrowLeft,
  Info,
  Activity,
  Droplets,
  Heart,
  Bone,
  CheckCircle,
  User,
  Pill,
  Apple,
  Dumbbell,
  AlertCircle,
} from "lucide-react"


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

const TEST_ITEMS = [
  {
    id: "ast",
    name: "AST（GOT）",
    unit: "U/L",
    normalRange: "10-40",
    minValue: 0,
    maxValue: 1000,
    icon: "liver",
    category: "肝機能検査",
    description: "肝臓や心臓の健康状態を示す酵素です",
    detailedDescription:
      "AST（アスパラギン酸アミノトランスフェラーゼ）は、肝臓、心臓、筋肉などに存在する酵素です。これらの臓器が損傷を受けると血液中に放出されます。特に肝炎、肝硬変、心筋梗塞などで上昇します。ALTと併せて評価することで、肝臓の状態をより正確に把握できます。",
    factors: {
      lifestyle: ["体位（臥位・立位など）", "時間帯（朝・夕など）", "激しい運動や筋肉損傷"],
      health: ["心臓疾患の有無"],
      diet: ["最近のアルコール摂取"],
      medication: ["服用している薬"],
    },
    expertKnowledge:
      "仰臥位から立位への体位変換により、血液が下肢に移動し、血液濃縮が起こることで、酵素濃度が5-10%程度上昇することがあります。採血時の体位を統一することが、正確な評価のために重要です。",
    healthTips: ["適度な運動を心がけ、過度な飲酒を避ける", "バランスの取れた食事を摂る", "定期的な健康診断を受ける"],
  },
  {
    id: "alt",
    name: "ALT（GPT）",
    unit: "U/L",
    normalRange: "5-40",
    minValue: 0,
    maxValue: 1000,
    icon: "liver",
    category: "肝機能検査",
    description: "肝臓の健康状態を示す酵素です",
    detailedDescription:
      "ALT（アラニンアミノトランスフェラーゼ）は、主に肝臓に存在する酵素です。肝細胞が損傷を受けると血液中に放出されるため、肝臓の健康状態を評価する重要な指標となります。肝炎、脂肪肝、アルコール性肝障害などで上昇することがあります。",
    factors: {
      lifestyle: ["体位（臥位・立位など）", "時間帯（朝・夕など）", "激しい運動"],
      health: ["肝細胞の損傷"],
      diet: ["最近のアルコール摂取"],
      medication: ["服用している薬（抗生物質、スタチンなど）"],
      other: ["肥満や脂肪肝"],
    },
    expertKnowledge:
      "肝細胞の損傷により放出されるため、肝炎や脂肪肝などの肝臓疾患で上昇することがあります。適切な管理が重要です。",
    healthTips: ["適度な運動を心がけ、過度な飲酒を避ける", "バランスの取れた食事を摂る", "定期的な健康診断を受ける"],
  },
  {
    id: "ggt",
    name: "γ-GT",
    unit: "U/L",
    normalRange: "男性: 10-50, 女性: 10-30",
    minValue: 0,
    maxValue: 1000,
    icon: "liver",
    category: "肝機能検査",
    description: "肝臓や胆道の状態を示す酵素です",
    detailedDescription:
      "γ-GT（ガンマ・グルタミルトランスフェラーゼ）は、肝臓や胆道に多く存在する酵素です。アルコール性肝障害や胆道疾患で特に上昇しやすく、アルコール摂取の影響を受けやすい指標です。慢性的な飲酒習慣がある場合、この値が高くなる傾向があります。",
    factors: {
      diet: ["アルコール摂取（最も影響大）"],
      medication: ["服用している薬（抗てんかん薬など）"],
      other: ["肥満", "胆道系疾患", "脂肪肝", "喫煙"],
    },
    expertKnowledge:
      "アルコール摂取の影響を受けやすい指標であり、慢性的な飲酒習慣がある場合、この値が高くなる傾向があります。",
    healthTips: ["適度な運動を心がけ、過度な飲酒を避ける", "バランスの取れた食事を摂る", "定期的な健康診断を受ける"],
  },
  {
    id: "urine-sugar",
    name: "尿糖",
    unit: "",
    normalRange: "陰性（-）",
    minValue: null,
    maxValue: null,
    icon: "kidney",
    category: "尿検査",
    description: "尿中の糖の有無を調べます",
    detailedDescription:
      "尿糖検査は、尿中にブドウ糖が排泄されているかを調べる検査です。通常、血糖値が腎臓の再吸収能力を超えると（約160-180mg/dL以上）、尿中に糖が出現します。糖尿病のスクリーニングや血糖コントロールの評価に用いられます。",
    factors: {
      diet: ["血糖値の高さ"],
      other: [
        "腎臓の糖再吸収能力",
        "最近の食事内容",
        "妊娠（妊娠糖尿病）",
        "ストレスや発熱",
        "特定の薬剤（ステロイドなど）",
      ],
    },
    expertKnowledge:
      "血糖値が腎臓の再吸収能力を超えると（約160-180mg/dL以上）、尿中に糖が出現します。糖尿病のスクリーニングや血糖コントロールの評価に用いられます。",
    healthTips: ["適度な運動を心がけ、過度な飲酒を避ける", "バランスの取れた食事を摂る", "定期的な健康診断を受ける"],
  },
  {
    id: "urine-protein",
    name: "蛋白",
    unit: "",
    normalRange: "陰性（-）",
    minValue: null,
    maxValue: null,
    icon: "kidney",
    category: "尿検査",
    description: "尿中のタンパク質の有無を調べます",
    detailedDescription:
      "尿蛋白検査は、尿中にタンパク質が排泄されているかを調べる検査です。通常、腎臓は血液中のタンパク質をほとんど通さないため、尿中にはほとんど出現しません。陽性の場合、腎臓の機能低下や腎疾患の可能性があります。",
    factors: {
      lifestyle: ["体位（立位で一時的に陽性になることも）"],
      other: ["激しい運動後", "発熱や脱水", "尿路感染症", "妊娠", "腎臓疾患の有無"],
    },
    expertKnowledge:
      "腎臓は血液中のタンパク質をほとんど通さないため、尿中にはほとんど出現しません。陽性の場合、腎臓の機能低下や腎疾患の可能性があります。",
    healthTips: ["適度な運動を心がけ、過度な飲酒を避ける", "バランスの取れた食事を摂る", "定期的な健康診断を受ける"],
  },
  {
    id: "glucose",
    name: "血糖値（Glucose）",
    unit: "mg/dL",
    normalRange: "70-100",
    minValue: 30,
    maxValue: 600,
    icon: "blood",
    category: "血液検査",
    description: "血液中の糖の濃度を測定します",
    detailedDescription:
      "血糖値は血液中のブドウ糖の濃度を示します。食事から摂取した糖質がエネルギー源として利用されるため、体のエネルギー代謝の状態を反映します。高値が続くと糖尿病のリスクが高まります。",
    factors: {
      lifestyle: ["時間帯（朝・夕など）", "運動量"],
      diet: ["最近の食事内容（特に炭水化物）"],
      health: ["空腹状態（食前・食後）", "ストレスや病気"],
      medication: ["服用している薬（ステロイド、利尿薬など）"],
    },
    expertKnowledge:
      "食事から摂取した糖質がエネルギー源として利用されるため、体のエネルギー代謝の状態を反映します。高値が続くと糖尿病のリスクが高まります。",
    healthTips: ["適度な運動を心がけ、過度な飲酒を避ける", "バランスの取れた食事を摂る", "定期的な健康診断を受ける"],
  },
  {
    id: "ldl",
    name: "LDLコレステロール",
    unit: "mg/dL",
    normalRange: "<120",
    minValue: 20,
    maxValue: 500,
    icon: "heart",
    category: "血液検査",
    description: "動脈硬化の原因となる「悪玉コレステロール」です",
    detailedDescription:
      "LDLコレステロールは「悪玉コレステロール」とも呼ばれ、血管壁に蓄積して動脈硬化を引き起こす可能性があります。心筋梗塞や脳卒中などの心血管疾患のリスク因子となるため、適切な管理が重要です。",
    factors: {
      lifestyle: ["体位（臥位・立位など）", "運動量"],
      diet: ["最近の食事習慣（高脂肪食）"],
      other: ["遺伝的要因", "喫煙"],
      medication: ["服用している薬（スタチン、フィブラートなど）"],
    },
    expertKnowledge:
      "血管壁に蓄積して動脈硬化を引き起こす可能性があります。心筋梗塞や脳卒中などの心血管疾患のリスク因子となるため、適切な管理が重要です。",
    healthTips: ["適度な運動を心がけ、過度な飲酒を避ける", "バランスの取れた食事を摂る", "定期的な健康診断を受ける"],
  },
  {
    id: "creatinine",
    name: "クレアチニン",
    unit: "mg/dL",
    normalRange: "男性: 0.65-1.09, 女性: 0.46-0.82",
    minValue: 0.1,
    maxValue: 20,
    icon: "kidney",
    category: "生化学検査",
    description: "腎臓の働きを示す指標です",
    detailedDescription:
      "クレアチニンは筋肉の代謝産物で、通常は腎臓でろ過されて尿中に排泄されます。腎機能が低下すると血液中のクレアチニン値が上昇するため、腎臓の働きを評価する重要な指標となります。筋肉量の影響を受けるため、男性の方が女性より基準値が高くなります。",
    factors: {
      other: ["筋肉量（筋肉質な人ほど高値）", "年齢（高齢者は低値傾向）"],
      diet: ["最近のタンパク質摂取"],
      lifestyle: ["水分摂取状態"],
      otherFactors: ["激しい運動"],
      medication: ["服用している薬（NSAIDs、ACE阻害薬など）"],
    },
    expertKnowledge: "筋肉量の影響を受けるため、男性の方が女性より基準値が高くなります。",
    healthTips: ["適度な運動を心がけ、過度な飲酒を避ける", "バランスの取れた食事を摂る", "定期的な健康診断を受ける"],
  },
  {
    id: "hba1c",
    name: "HbA1c",
    unit: "%",
    normalRange: "4.0-5.6",
    minValue: 3,
    maxValue: 20,
    icon: "blood",
    category: "血液検査",
    description: "過去2〜3ヶ月の平均血糖値を示します",
    detailedDescription:
      "HbA1c（ヘモグロビンA1c）は、赤血球中のヘモグロビンに糖が結合した割合を示します。過去2〜3ヶ月間の平均的な血糖値を反映するため、糖尿病の診断や血糖コントロールの評価に用いられます。",
    factors: {
      health: ["過去2〜3ヶ月の平均血糖値"],
      other: ["赤血球の寿命", "貧血や血液疾患", "最近の輸血", "腎臓病", "特定のヘモグロビン変異"],
    },
    expertKnowledge:
      "過去2〜3ヶ月間の平均的な血糖値を反映するため、糖尿病の診断や血糖コントロールの評価に用いられます。",
    healthTips: ["適度な運動を心がけ、過度な飲酒を避ける", "バランスの取れた食事を摂る", "定期的な健康診断を受ける"],
  },
  {
    id: "bun",
    name: "尿素窒素（BUN）",
    unit: "mg/dL",
    normalRange: "8-20",
    minValue: 1,
    maxValue: 200,
    icon: "kidney",
    category: "生化学検査",
    description: "腎臓の働きとタンパク質代謝の状態を示します",
    detailedDescription:
      "尿素窒素（BUN）は、タンパク質が分解される際に生成される老廃物です。通常は腎臓でろ過されて尿中に排泄されます。腎機能が低下すると血液中のBUN値が上昇するため、腎臓の働きを評価する指標となります。また、脱水や高タンパク食でも上昇することがあります。",
    factors: {
      other: ["腎臓の機能状態", "水分摂取量（脱水で上昇）", "タンパク質の摂取量", "消化管出血", "発熱や感染症"],
      medication: ["服用している薬（ステロイド、利尿薬など）"],
    },
    expertKnowledge: "腎臓の働きを評価する指標となります。また、脱水や高タンパク食でも上昇することがあります。",
    healthTips: ["適度な運動を心がけ、過度な飲酒を避ける", "バランスの取れた食事を摂る", "定期的な健康診断を受ける"],
  },
  {
    id: "egfr",
    name: "e-GFR",
    unit: "mL/分/1.73m²",
    normalRange: "≥60",
    minValue: 1,
    maxValue: 150,
    icon: "kidney",
    category: "生化学検査",
    description: "腎臓のろ過能力を推定する値です",
    detailedDescription:
      "e-GFR（推算糸球体濾過量）は、腎臓がどれだけ効率的に血液をろ過できるかを示す指標です。クレアチニン値、年齢、性別から計算されます。60未満で腎機能低下、30未満で中等度以上の腎機能低下と判断されます。慢性腎臓病（CKD）の診断と病期分類に用いられます。",
    factors: {
      other: ["年齢（加齢とともに低下）", "性別", "筋肉量", "腎臓の健康状態", "高血圧や糖尿病の有無", "脱水状態"],
    },
    expertKnowledge:
      "60未満で腎機能低下、30未満で中等度以上の腎機能低下と判断されます。慢性腎臓病（CKD）の診断と病期分類に用いられます。",
    healthTips: ["適度な運動を心がけ、過度な飲酒を避ける", "バランスの取れた食事を摂る", "定期的な健康診断を受ける"],
  },
  {
    id: "na",
    name: "Na（ナトリウム）",
    unit: "mEq/L",
    normalRange: "135-145",
    minValue: 100,
    maxValue: 180,
    icon: "blood",
    category: "生化学検査",
    description: "体液のバランスを保つ重要な電解質です",
    detailedDescription:
      "ナトリウムは体液の浸透圧を調整し、神経や筋肉の機能を維持する重要な電解質です。水分バランスと密接に関係しており、脱水や過剰な水分摂取、腎臓や内分泌系の異常で変動します。低ナトリウム血症や高ナトリウム血症は、重篤な症状を引き起こすことがあります。",
    factors: {
      lifestyle: ["水分摂取量"],
      other: ["発汗や嘔吐、下痢"],
      medication: ["利尿薬の使用"],
      otherFactors: ["腎臓の機能", "ホルモンバランス（抗利尿ホルモンなど）", "心不全や肝硬変の有無"],
    },
    expertKnowledge:
      "水分バランスと密接に関係しており、脱水や過剰な水分摂取、腎臓や内分泌系の異常で変動します。低ナトリウム血症や高ナトリウム血症は、重篤な症状を引き起こすことがあります。",
    healthTips: ["適度な運動を心がけ、過度な飲酒を避ける", "バランスの取れた食事を摂る", "定期的な健康診断を受ける"],
  },
  {
    id: "k",
    name: "K（カリウム）",
    unit: "mEq/L",
    normalRange: "3.5-5.0",
    minValue: 1,
    maxValue: 10,
    icon: "heart",
    category: "生化学検査",
    description: "心臓や筋肉の機能に重要な電解質です",
    detailedDescription:
      "カリウムは細胞内に多く存在し、神経伝達、筋肉収縮、心臓のリズム調整に重要な役割を果たします。高カリウム血症は不整脈のリスクがあり、低カリウム血症は筋力低下や不整脈を引き起こす可能性があります。腎臓の機能や薬剤の影響を受けやすい電解質です。",
    factors: {
      medication: ["利尿薬やACE阻害薬の使用"],
      diet: ["食事内容（果物、野菜の摂取）"],
      other: ["嘔吐や下痢", "インスリンの使用", "アルドステロンなどのホルモン"],
      otherFactors: ["腎臓の機能"],
    },
    expertKnowledge:
      "高カリウム血症は不整脈のリスクがあり、低カリウム血症は筋力低下や不整脈を引き起こす可能性があります。腎臓の機能や薬剤の影響を受けやすい電解質です。",
    healthTips: ["適度な運動を心がけ、過度な飲酒を避ける", "バランスの取れた食事を摂る", "定期的な健康診断を受ける"],
  },
  {
    id: "cl",
    name: "Cl（クロール）",
    unit: "mEq/L",
    normalRange: "98-108",
    minValue: 70,
    maxValue: 130,
    icon: "blood",
    category: "生化学検査",
    description: "体液の酸塩基バランスを調整する電解質です",
    detailedDescription:
      "クロール（塩素）は、ナトリウムとともに体液の浸透圧を維持し、酸塩基平衡の調整に関与する電解質です。胃液の成分でもあり、消化にも重要な役割を果たします。嘔吐、下痢、腎疾患、呼吸器疾患などで変動することがあります。",
    factors: {
      diet: ["嘔吐や下痢"],
      lifestyle: ["水分摂取量"],
      medication: ["利尿薬の使用"],
      other: ["呼吸状態（呼吸性シドーシス・アルカローシス）", "代謝性疾患"],
      otherFactors: ["腎臓の機能"],
    },
    expertKnowledge: "嘔吐、下痢、腎疾患、呼吸器疾患などで変動することがあります。",
    healthTips: ["適度な運動を心がけ、過度な飲酒を避ける", "バランスの取れた食事を摂る", "定期的な健康診断を受ける"],
  },
  {
    id: "ca",
    name: "Ca（カルシウム）",
    unit: "mg/dL",
    normalRange: "8.5-10.5",
    minValue: 5,
    maxValue: 15,
    icon: "bone",
    category: "生化学検査",
    description: "骨の健康と神経・筋肉機能に重要なミネラルです",
    detailedDescription:
      "カルシウムは骨や歯の主要成分であり、神経伝達、筋肉収縮、血液凝固にも重要な役割を果たします。副甲状腺ホルモンやビタミンDによって調整されています。高カルシウム血症は副甲状腺機能亢進症や悪性腫瘍で、低カルシウム血症はビタミンD欠乏や副甲状腺機能低下症で見られます。",
    factors: {
      diet: ["食事からのカルシウム摂取"],
      other: ["骨代謝の状態", "悪性腫瘍の有無"],
      medication: ["インスリンの影響"],
      otherFactors: ["腎臓の機能"],
      health: ["ビタミンDの状態", "副甲状腺ホルモンのバランス"],
    },
    expertKnowledge:
      "高カルシウム血症は副甲状腺機能亢進症や悪性腫瘍で、低カルシウム血症はビタミンD欠乏や副甲状腺機能低下症で見られます。",
    healthTips: ["適度な運動を心がけ、過度な飲酒を避ける", "バランスの取れた食事を摂る", "定期的な健康診断を受ける"],
  },
  {
    id: "p",
    name: "P（リン）",
    unit: "mg/dL",
    normalRange: "2.5-4.5",
    minValue: 0.5,
    maxValue: 10,
    icon: "bone",
    category: "生化学検査",
    description: "骨の形成とエネルギー代謝に重要なミネラルです",
    detailedDescription:
      "リンは骨や歯の構成成分であり、エネルギー代謝（ATP）や細胞膜の構成にも重要な役割を果たします。カルシウムと密接に関係しており、副甲状腺ホルモンやビタミンDによって調整されています。腎機能低下で高リン血症、副甲状腺機能亢進症で低リン血症となることがあります。",
    factors: {
      diet: ["食事からのリン摂取（乳製品、肉類）"],
      other: ["骨代謝の状態"],
      medication: ["インスリンの影響"],
      otherFactors: ["腎臓の機能"],
      health: ["ビタミンDの状態", "副甲状腺ホルモンのバランス"],
    },
    expertKnowledge: "腎機能低下で高リン血症、副甲状腺機能亢進症で低リン血症となることがあります。",
    healthTips: ["適度な運動を心がけ、過度な飲酒を避ける", "バランスの取れた食事を摂る", "定期的な健康診断を受ける"],
  },
  {
    id: "urine-ph",
    name: "pH",
    unit: "",
    normalRange: "5.0-7.5",
    minValue: 4,
    maxValue: 9,
    icon: "kidney",
    category: "尿検査",
    description: "尿の酸性・アルカリ性を示します",
    detailedDescription:
      "尿のpHは、体内の酸塩基バランスや腎臓の機能を反映します。通常は弱酸性ですが、食事内容や代謝状態によって変動します。アルカリ性に傾くと尿路感染症の可能性があり、酸性に傾くと糖尿病や痛風のリスクが高まることがあります。",
    factors: {
      diet: ["食事内容（肉類で酸性、野菜で中性）"],
      other: ["尿路感染症の有無", "代謝性疾患", "薬剤の影響", "呼吸状態", "脱水状態"],
    },
    expertKnowledge:
      "アルカリ性に傾くと尿路感染症の可能性があり、酸性に傾くと糖尿病や痛風のリスクが高まることがあります。",
    healthTips: ["適度な運動を心がけ、過度な飲酒を避ける", "バランスの取れた食事を摂る", "定期的な健康診断を受ける"],
  },
  {
    id: "urine-gravity",
    name: "比重",
    unit: "",
    normalRange: "1.010-1.025",
    minValue: 1.0,
    maxValue: 1.04,
    icon: "kidney",
    category: "尿検査",
    description: "尿の濃さを示します",
    detailedDescription:
      "尿比重は、尿中に溶けている物質の濃度を示す指標です。腎臓の濃縮能力や体内の水分バランスを反映します。高値は脱水や糖尿病、低値は過剰な水分摂取や腎機能低下を示唆することがあります。",
    factors: {
      lifestyle: ["水分摂取量"],
      other: ["発汗量", "腎臓の濃縮能力", "糖尿病の有無", "利尿薬の使用"],
      otherFactors: ["時間帯（朝は高値傾向）"],
    },
    expertKnowledge: "高値は脱水や糖尿病、低値は過剰な水分摂取や腎機能低下を示唆することがあります。",
    healthTips: ["適度な運動を心がけ、過度な飲酒を避ける", "バランスの取れた食事を摂る", "定期的な健康診断を受ける"],
  },
  {
    id: "urine-urobilinogen",
    name: "ウロビリノーゲン",
    unit: "",
    normalRange: "弱陽性（±）",
    minValue: null,
    maxValue: null,
    icon: "liver",
    category: "尿検査",
    description: "肝臓や胆道の状態を示します",
    detailedDescription:
      "ウロビリノーゲンは、胆汁色素が腸内細菌によって分解されて生成される物質です。通常は弱陽性ですが、肝臓疾患や溶血性貧血で増加し、胆道閉塞で減少します。肝機能や胆道系の異常を早期に発見する手がかりとなります。",
    factors: {
      health: ["肝臓の機能状態", "胆道の通過性", "溶血の有無"],
      other: ["腸内細菌の状態", "抗生物質の使用", "便秘や下痢"],
    },
    expertKnowledge: "肝臓の機能状態、胆道の通過性、溶血の有無、腸内細菌の状態、抗生物質の使用、便秘や下痢",
    healthTips: ["適度な運動を心がけ、過度な飲酒を避ける", "バランスの取れた食事を摂る", "定期的な健康診断を受ける"],
  },
  {
    id: "urine-bilirubin",
    name: "ビリルビン",
    unit: "",
    normalRange: "陰性（-）",
    minValue: null,
    maxValue: null,
    icon: "liver",
    category: "尿検査",
    description: "肝臓や胆道の異常を示します",
    detailedDescription:
      "ビリルビンは赤血球が分解される際に生成される黄色い色素です。通常、尿中には出現しませんが、肝臓疾患や胆道閉塞があると尿中に排泄されます。陽性の場合、黄疸の原因が肝臓や胆道にあることを示唆します。",
    factors: {
      health: ["肝臓の機能状態", "胆道の通過性", "黄疸の有無"],
      other: ["肝炎やウイルス感染", "薬剤性肝障害", "胆石の有無"],
    },
    expertKnowledge: "肝臓の機能状態、胆道の通過性、黄疸の有無、肝炎やウイルス感染、薬剤性肝障害、胆石の有無",
    healthTips: ["適度な運動を心がけ、過度な飲酒を避ける", "バランスの取れた食事を摂る", "定期的な健康診断を受ける"],
  },
  {
    id: "urine-ketone",
    name: "ケトン",
    unit: "",
    normalRange: "陰性（-）",
    minValue: null,
    maxValue: null,
    icon: "blood",
    category: "尿検査",
    description: "脂肪の分解状態を示します",
    detailedDescription:
      "ケトン体は、糖質が不足して脂肪がエネルギー源として使われる際に生成される物質です。糖尿病の血糖コントロール不良、飢餓状態、激しい運動後などで陽性となります。糖尿病性ケトアシドーシスの早期発見に重要です。",
    factors: {
      health: ["血糖コントロールの状態"],
      diet: ["食事内容（低炭水化物食）"],
      other: ["絶食や飢餓状態", "激しい運動", "発熱や嘔吐", "妊娠悪阻"],
    },
    expertKnowledge:
      "糖尿病の血糖コントロール不良、飢餓状態、激しい運動後などで陽性となります。糖尿病性ケトアシドーシスの早期発見に重要です。",
    healthTips: ["適度な運動を心がけ、過度な飲酒を避ける", "バランスの取れた食事を摂る", "定期的な健康診断を受ける"],
  },
  {
    id: "urine-blood",
    name: "潜血",
    unit: "",
    normalRange: "陰性（-）",
    minValue: null,
    maxValue: null,
    icon: "kidney",
    category: "尿検査",
    description: "尿中の血液の有無を調べます",
    detailedDescription:
      "尿潜血検査は、尿中に赤血球やヘモグロビンが含まれているかを調べる検査です。陽性の場合、腎臓や尿路からの出血を示唆します。腎炎、尿路結石、膀胱炎、腫瘍などの可能性があり、形態観察により出血部位の推定も可能です。",
    factors: {
      other: ["尿路結石の有無", "尿路感染症", "腎炎や腎疾患", "外傷や手術後"],
      lifestyle: ["運動量"],
      health: ["月経（女性）"],
    },
    expertKnowledge: "尿路結石の有無、尿路感染症、腎炎や腎疾患、激しい運動後、月経（女性）、外傷や手術後",
    healthTips: ["適度な運動を心がけ、過度な飲酒を避ける", "バランスの取れた食事を摂る", "定期的な健康診断を受ける"],
  },
  {
    id: "urine-sediment-rbc",
    name: "赤血球",
    unit: "/HPF",
    normalRange: "0-4",
    minValue: 0,
    maxValue: 10,
    icon: "kidney",
    category: "尿検査",
    description: "尿中を観察した赤血球の数を示します",
    detailedDescription:
      "尿中を観察した赤血球の数を示します。尿路感染症や腎臓疾患、外傷、手術などにより増加することがあります。",
    factors: {
      other: ["尿路感染症", "腎臓疾患", "外傷", "手術"],
      lifestyle: ["運動量"],
      health: ["月経（女性）"],
    },
    expertKnowledge: "尿路感染症、腎臓疾患、外傷、手術、月経（女性）、運動量",
    healthTips: ["適度な運動を心がけ、過度な飲酒を避ける", "バランスの取れた食事を摂る", "定期的な健康診断を受ける"],
  },
]

const Page = () => {
  const [viewMode, setViewMode] = useState<"list" | "detail">("list")
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<"overview" | "details" | "factors" | "expert" | "tips">("overview")
  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({})
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  useEffect(() => {
    const saved = localStorage.getItem("healthCheckValues")
    if (saved) {
      setInputValues(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("healthCheckValues", JSON.stringify(inputValues))
  }, [inputValues])

  const handleCardClick = (item: any) => {
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

  const scrollToCategory = (category: string) => {
    const ref = categoryRefs.current[category]
    if (ref) {
      ref.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const categories = Array.from(new Set(TEST_ITEMS.map((item) => item.category)))

  const isOutOfRange = (value: string, normalRange: string) => {
    if (!value) return false
    const numValue = Number.parseFloat(value)
    if (isNaN(numValue)) return false

    const ranges = normalRange.split(",")
    for (const range of ranges) {
      const match = range.match(/(\d+\.?\d*)-(\d+\.?\d*)/)
      if (match) {
        const min = Number.parseFloat(match[1])
        const max = Number.parseFloat(match[2])
        if (numValue >= min && numValue <= max) return false
      }
    }
    return true
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

  if (viewMode === "detail" && selectedItem) {
    const userValue = inputValues[selectedItem.id]
    const isAbnormal = userValue && isOutOfRange(userValue, selectedItem.normalRange)

    return (
      <div className="min-h-screen bg-white p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={handleBackToList}
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
                  {selectedItem.normalRange} {selectedItem.unit}
                </p>
              </div>
              {userValue && (
                <div className="text-right">
                  <h2 className="text-sm font-semibold text-gray-700 mb-1">あなたの値</h2>
                  <p className={`text-lg font-bold ${isAbnormal ? "text-red-600" : "text-green-600"}`}>
                    {userValue} {selectedItem.unit}
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
              <div className="text-gray-700">{getIcon(selectedItem.icon)}</div>
              <h1 className="text-2xl font-bold text-gray-900">{selectedItem.name}について</h1>
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
              {selectedItem.expertKnowledge && (
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
              {selectedItem.healthTips && (
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
                  <p className="text-gray-700 leading-relaxed">{selectedItem.description}</p>
                  <p className="text-sm text-gray-500 mt-4">※ 基準値は検査機関や測定方法により異なる場合があります</p>
                </div>
              )}

              {activeTab === "details" && (
                <div>
                  <p className="text-gray-700 leading-relaxed">{selectedItem.detailedDescription}</p>
                </div>
              )}

              {activeTab === "factors" && (
                <div className="space-y-6">
                  {selectedItem.factors && typeof selectedItem.factors === "object" ? (
                    Object.entries(selectedItem.factors).map(([category, items]: [string, any]) => {
                      const IconComponent = getCategoryIcon(category)
                      return (
                        <div key={category}>
                          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <IconComponent className="w-5 h-5 text-gray-600" />
                            {getCategoryName(category)}
                          </h3>
                          <ul className="space-y-2 ml-7">
                            {items.map((factor: string, index: number) => (
                              <li key={index} className="flex items-start gap-2 text-gray-700">
                                <span className="text-gray-400 mt-1">•</span>
                                <span>{factor}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )
                    })
                  ) : (
                    <ul className="space-y-2">
                      {selectedItem.factors?.map((factor: string, index: number) => (
                        <li key={index} className="flex items-start gap-2 text-gray-700">
                          <span className="text-gray-400 mt-1">•</span>
                          <span>{factor}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {activeTab === "expert" && selectedItem.expertKnowledge && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <Info className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700 leading-relaxed">{selectedItem.expertKnowledge}</p>
                  </div>
                </div>
              )}

              {activeTab === "tips" && selectedItem.healthTips && (
                <div className="space-y-3">
                  {selectedItem.healthTips.map((tip: string, index: number) => (
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

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">健康診断結果入力</h1>
          <p className="text-gray-600">検査項目をクリックすると詳細情報が表示されます</p>
        </header>

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