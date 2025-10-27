"use client"
import { useState, useRef, useEffect } from "react"
import {
  Activity,
  Heart,
  Droplet,
  Droplets,
  Bone,
  Eye,
  ArrowLeft,
  ChevronRight,
  AlertCircle,
  Info,
  TrendingUp,
  Target,
  Stethoscope,
  Calculator,
} from "lucide-react"

const TEST_ITEMS = [
  {
    id: "ast",
    name: "AST（GOT）",
    unit: "U/L",
    normalRange: "10-40",
    icon: "liver",
    category: "肝機能検査",
    description: "肝臓や心臓の健康状態を示す酵素です",
    detailedDescription:
      "AST（アスパラギン酸アミノトランスフェラーゼ）は、肝臓、心臓、筋肉などに存在する酵素です。これらの臓器が損傷を受けると血液中に放出されます。特に肝炎、肝硬変、心筋梗塞などで上昇します。ALTと併せて評価することで、肝臓の状態をより正確に把握できます。",
    factors: [
      "体位（臥位・立位など）",
      "時間帯（朝・夕など）",
      "最近のアルコール摂取",
      "激しい運動や筋肉損傷",
      "服用している薬",
      "心臓疾患の有無",
    ],
  },
  {
    id: "alt",
    name: "ALT（GPT）",
    unit: "U/L",
    normalRange: "5-40",
    icon: "liver",
    category: "肝機能検査",
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
    id: "ggt",
    name: "γ-GT",
    unit: "U/L",
    normalRange: "男性: 10-50, 女性: 10-30",
    icon: "liver",
    category: "肝機能検査",
    description: "肝臓や胆道の状態を示す酵素です",
    detailedDescription:
      "γ-GT（ガンマ・グルタミルトランスフェラーゼ）は、肝臓や胆道に多く存在する酵素です。アルコール性肝障害や胆道疾患で特に上昇しやすく、アルコール摂取の影響を受けやすい指標です。慢性的な飲酒習慣がある場合、この値が高くなる傾向があります。",
    factors: [
      "アルコール摂取（最も影響大）",
      "服用している薬（抗てんかん薬など）",
      "肥満",
      "胆道系疾患",
      "脂肪肝",
      "喫煙",
    ],
  },
  {
    id: "urine-sugar",
    name: "尿糖",
    unit: "",
    normalRange: "陰性（-）",
    icon: "kidney",
    category: "尿検査",
    description: "尿中の糖の有無を調べます",
    detailedDescription:
      "尿糖検査は、尿中にブドウ糖が排泄されているかを調べる検査です。通常、血糖値が腎臓の再吸収能力を超えると（約160-180mg/dL以上）、尿中に糖が出現します。糖尿病のスクリーニングや血糖コントロールの評価に用いられます。",
    factors: [
      "血糖値の高さ",
      "腎臓の糖再吸収能力",
      "最近の食事内容",
      "妊娠（妊娠糖尿病）",
      "ストレスや発熱",
      "特定の薬剤（ステロイドなど）",
    ],
  },
  {
    id: "urine-protein",
    name: "蛋白",
    unit: "",
    normalRange: "陰性（-）",
    icon: "kidney",
    category: "尿検査",
    description: "尿中のタンパク質の有無を調べます",
    detailedDescription:
      "尿蛋白検査は、尿中にタンパク質が排泄されているかを調べる検査です。通常、腎臓は血液中のタンパク質をほとんど通さないため、尿中にはほとんど出現しません。陽性の場合、腎臓の機能低下や腎疾患の可能性があります。",
    factors: [
      "体位（立位で一時的に陽性になることも）",
      "激しい運動後",
      "発熱や脱水",
      "尿路感染症",
      "妊娠",
      "腎臓疾患の有無",
    ],
  },
  {
    id: "glucose",
    name: "血糖値（Glucose）",
    unit: "mg/dL",
    normalRange: "70-100",
    icon: "blood",
    category: "血液検査",
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
    category: "血液検査",
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
    name: "クレアチニン",
    unit: "mg/dL",
    normalRange: "男性: 0.65-1.09, 女性: 0.46-0.82",
    icon: "kidney",
    category: "生化学検査",
    description: "腎臓の働きを示す指標です",
    detailedDescription:
      "クレアチニンは筋肉の代謝産物で、通常は腎臓でろ過されて尿中に排泄されます。腎機能が低下すると血液中のクレアチニン値が上昇するため、腎臓の働きを評価する重要な指標となります。筋肉量の影響を受けるため、男性の方が女性より基準値が高くなります。",
    factors: [
      "筋肉量（筋肉質な人ほど高値）",
      "年齢（高齢者は低値傾向）",
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
    category: "血液検査",
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
  {
    id: "bun",
    name: "尿素窒素（BUN）",
    unit: "mg/dL",
    normalRange: "8-20",
    icon: "kidney",
    category: "生化学検査",
    description: "腎臓の働きとタンパク質代謝の状態を示します",
    detailedDescription:
      "尿素窒素（BUN）は、タンパク質が分解される際に生成される老廃物です。通常は腎臓でろ過されて尿中に排泄されます。腎機能が低下すると血液中のBUN値が上昇するため、腎臓の働きを評価する指標となります。また、脱水や高タンパク食でも上昇することがあります。",
    factors: [
      "腎臓の機能状態",
      "水分摂取量（脱水で上昇）",
      "タンパク質の摂取量",
      "消化管出血",
      "発熱や感染症",
      "服用している薬（ステロイド、利尿薬など）",
    ],
  },
  {
    id: "egfr",
    name: "e-GFR",
    unit: "mL/分/1.73m²",
    normalRange: "≥60",
    icon: "kidney",
    category: "生化学検査",
    description: "腎臓のろ過能力を推定する値です",
    detailedDescription:
      "e-GFR（推算糸球体濾過量）は、腎臓がどれだけ効率的に血液をろ過できるかを示す指標です。クレアチニン値、年齢、性別から計算されます。60未満で腎機能低下、30未満で中等度以上の腎機能低下と判断されます。慢性腎臓病（CKD）の診断と病期分類に用いられます。",
    factors: ["年齢（加齢とともに低下）", "性別", "筋肉量", "腎臓の健康状態", "高血圧や糖尿病の有無", "脱水状態"],
  },
  {
    id: "na",
    name: "Na（ナトリウム）",
    unit: "mEq/L",
    normalRange: "135-145",
    icon: "blood",
    category: "生化学検査",
    description: "体液のバランスを保つ重要な電解質です",
    detailedDescription:
      "ナトリウムは体液の浸透圧を調整し、神経や筋肉の機能を維持する重要な電解質です。水分バランスと密接に関係しており、脱水や過剰な水分摂取、腎臓や内分泌系の異常で変動します。低ナトリウム血症や高ナトリウム血症は、重篤な症状を引き起こすことがあります。",
    factors: [
      "水分摂取量",
      "発汗や嘔吐、下痢",
      "利尿薬の使用",
      "腎臓の機能",
      "ホルモンバランス（抗利尿ホルモンなど）",
      "心不全や肝硬変の有無",
    ],
  },
  {
    id: "k",
    name: "K（カリウム）",
    unit: "mEq/L",
    normalRange: "3.5-5.0",
    icon: "heart",
    category: "生化学検査",
    description: "心臓や筋肉の機能に重要な電解質です",
    detailedDescription:
      "カリウムは細胞内に多く存在し、神経伝達、筋肉収縮、心臓のリズム調整に重要な役割を果たします。高カリウム血症は不整脈のリスクがあり、低カリウム血症は筋力低下や不整脈を引き起こす可能性があります。腎臓の機能や薬剤の影響を受けやすい電解質です。",
    factors: [
      "腎臓の機能",
      "利尿薬やACE阻害薬の使用",
      "食事内容（果物、野菜の摂取）",
      "嘔吐や下痢",
      "インスリンの使用",
      "アルドステロンなどのホルモン",
    ],
  },
  {
    id: "cl",
    name: "Cl（クロール）",
    unit: "mEq/L",
    normalRange: "98-108",
    icon: "blood",
    category: "生化学検査",
    description: "体液の酸塩基バランスを調整する電解質です",
    detailedDescription:
      "クロール（塩素）は、ナトリウムとともに体液の浸透圧を維持し、酸塩基平衡の調整に関与する電解質です。胃液の成分でもあり、消化にも重要な役割を果たします。嘔吐、下痢、腎疾患、呼吸器疾患などで変動することがあります。",
    factors: [
      "嘔吐や下痢",
      "水分摂取量",
      "腎臓の機能",
      "呼吸状態（呼吸性アシドーシス・アルカローシス）",
      "利尿薬の使用",
      "代謝性疾患",
    ],
  },
  {
    id: "ca",
    name: "Ca（カルシウム）",
    unit: "mg/dL",
    normalRange: "8.5-10.5",
    icon: "bone",
    category: "生化学検査",
    description: "骨の健康と神経・筋肉機能に重要なミネラルです",
    detailedDescription:
      "カルシウムは骨や歯の主要成分であり、神経伝達、筋肉収縮、血液凝固にも重要な役割を果たします。副甲状腺ホルモンやビタミンDによって調整されています。高カルシウム血症は副甲状腺機能亢進症や悪性腫瘍で、低カルシウム血症はビタミンD欠乏や副甲状腺機能低下症で見られます。",
    factors: [
      "ビタミンDの状態",
      "副甲状腺ホルモンのバランス",
      "食事からのカルシウム摂取",
      "腎臓の機能",
      "骨代謝の状態",
      "悪性腫瘍の有無",
    ],
  },
  {
    id: "p",
    name: "P（リン）",
    unit: "mg/dL",
    normalRange: "2.5-4.5",
    icon: "bone",
    category: "生化学検査",
    description: "骨の形成とエネルギー代謝に重要なミネラルです",
    detailedDescription:
      "リンは骨や歯の構成成分であり、エネルギー代謝（ATP）や細胞膜の構成にも重要な役割を果たします。カルシウムと密接に関係しており、副甲状腺ホルモンやビタミンDによって調整されています。腎機能低下で高リン血症、副甲状腺機能亢進症で低リン血症となることがあります。",
    factors: [
      "腎臓の機能",
      "副甲状腺ホルモンのバランス",
      "ビタミンDの状態",
      "食事からのリン摂取（乳製品、肉類）",
      "骨代謝の状態",
      "インスリンの影響",
    ],
  },
  {
    id: "urine-ph",
    name: "pH",
    unit: "",
    normalRange: "5.0-7.5",
    icon: "kidney",
    category: "尿検査",
    description: "尿の酸性・アルカリ性を示します",
    detailedDescription:
      "尿のpHは、体内の酸塩基バランスや腎臓の機能を反映します。通常は弱酸性ですが、食事内容や代謝状態によって変動します。アルカリ性に傾くと尿路感染症の可能性があり、酸性に傾くと糖尿病や痛風のリスクが高まることがあります。",
    factors: [
      "食事内容（肉類で酸性、野菜で中性）",
      "尿路感染症の有無",
      "代謝性疾患",
      "薬剤の影響",
      "呼吸状態",
      "脱水状態",
    ],
  },
  {
    id: "urine-gravity",
    name: "比重",
    unit: "",
    normalRange: "1.010-1.025",
    icon: "kidney",
    category: "尿検査",
    description: "尿の濃さを示します",
    detailedDescription:
      "尿比重は、尿中に溶けている物質の濃度を示す指標です。腎臓の濃縮能力や体内の水分バランスを反映します。高値は脱水や糖尿病、低値は過剰な水分摂取や腎機能低下を示唆することがあります。",
    factors: ["水分摂取量", "発汗量", "腎臓の濃縮能力", "糖尿病の有無", "利尿薬の使用", "時間帯（朝は高値傾向）"],
  },
  {
    id: "urine-urobilinogen",
    name: "ウロビリノーゲン",
    unit: "",
    normalRange: "弱陽性（±）",
    icon: "liver",
    category: "尿検査",
    description: "肝臓や胆道の状態を示します",
    detailedDescription:
      "ウロビリノーゲンは、胆汁色素が腸内細菌によって分解されて生成される物質です。通常は弱陽性ですが、肝臓疾患や溶血性貧血で増加し、胆道閉塞で減少します。肝機能や胆道系の異常を早期に発見する手がかりとなります。",
    factors: ["肝臓の機能状態", "胆道の通過性", "溶血の有無", "腸内細菌の状態", "抗生物質の使用", "便秘や下痢"],
  },
  {
    id: "urine-bilirubin",
    name: "ビリルビン",
    unit: "",
    normalRange: "陰性（-）",
    icon: "liver",
    category: "尿検査",
    description: "肝臓や胆道の異常を示します",
    detailedDescription:
      "ビリルビンは赤血球が分解される際に生成される黄色い色素です。通常、尿中には出現しませんが、肝臓疾患や胆道閉塞があると尿中に排泄されます。陽性の場合、黄疸の原因が肝臓や胆道にあることを示唆します。",
    factors: ["肝臓の機能状態", "胆道の通過性", "黄疸の有無", "肝炎やウイルス感染", "薬剤性肝障害", "胆石の有無"],
  },
  {
    id: "urine-ketone",
    name: "ケトン",
    unit: "",
    normalRange: "陰性（-）",
    icon: "blood",
    category: "尿検査",
    description: "脂肪の分解状態を示します",
    detailedDescription:
      "ケトン体は、糖質が不足して脂肪がエネルギー源として使われる際に生成される物質です。糖尿病の血糖コントロール不良、飢餓状態、激しい運動後などで陽性となります。糖尿病性ケトアシドーシスの早期発見に重要です。",
    factors: [
      "血糖コントロールの状態",
      "食事内容（低炭水化物食）",
      "絶食や飢餓状態",
      "激しい運動",
      "発熱や嘔吐",
      "妊娠悪阻",
    ],
  },
  {
    id: "urine-blood",
    name: "潜血",
    unit: "",
    normalRange: "陰性（-）",
    icon: "kidney",
    category: "尿検査",
    description: "尿中の血液の有無を調べます",
    detailedDescription:
      "尿潜血検査は、尿中に赤血球やヘモグロビンが含まれているかを調べる検査です。陽性の場合、腎臓や尿路からの出血を示唆します。腎炎、尿路結石、膀胱炎、腫瘍などの可能性があり、形態観察により出血部位の推定も可能です。",
    factors: ["尿路結石の有無", "尿路感染症", "腎炎や腎疾患", "激しい運動後", "月経（女性）", "外傷や手術後"],
  },
  {
    id: "urine-sediment-rbc",
    name: "赤血球",
    unit: "/HPF",
    normalRange: "0-4",
    icon: "kidney",
    category: "尿検査 - 尿沈渣",
    description: "尿中の赤血球数を調べます",
    detailedDescription:
      "尿沈渣の赤血球検査は、顕微鏡で尿中の赤血球を直接観察する検査です。増加している場合、腎臓や尿路からの出血を示唆します。腎炎、尿路結石、膀胱炎、腫瘍などの可能性があり、形態観察により出血部位の推定も可能です。",
    factors: ["腎臓や尿路の疾患", "尿路結石", "尿路感染症", "激しい運動", "月経（女性）", "外傷"],
  },
  {
    id: "urine-sediment-wbc",
    name: "白血球",
    unit: "/HPF",
    normalRange: "0-4",
    icon: "kidney",
    category: "尿検査 - 尿沈渣",
    description: "尿中の白血球数を調べます",
    detailedDescription:
      "尿沈渣の白血球検査は、尿中の白血球を顕微鏡で観察する検査です。増加している場合、尿路感染症や腎盂腎炎などの炎症性疾患を示唆します。膀胱炎、前立腺炎、腎盂腎炎などで増加し、細菌尿を伴うことが多いです。",
    factors: ["尿路感染症の有無", "腎盂腎炎", "膀胱炎", "前立腺炎（男性）", "尿道炎", "腎結石による刺激"],
  },
  {
    id: "urine-sediment-squamous",
    name: "扁平上皮",
    unit: "/HPF",
    normalRange: "少数",
    icon: "kidney",
    category: "尿検査 - 尿沈渣",
    description: "尿道や外陰部からの上皮細胞です",
    detailedDescription:
      "扁平上皮は、尿道や外陰部の表面を覆う細胞です。尿中に少数見られるのは正常ですが、多数存在する場合は採尿時の混入や尿路の炎症を示唆することがあります。通常は臨床的意義は低いですが、採尿方法の適切性の指標となります。",
    factors: [
      "採尿方法（中間尿でない場合）",
      "外陰部の清潔度",
      "尿路炎",
      "膣炎（女性）",
      "皮膚の剥離",
      "長時間の尿の停滞",
    ],
  },
  {
    id: "urine-sediment-transitional",
    name: "移行上皮",
    unit: "/HPF",
    normalRange: "少数",
    icon: "kidney",
    category: "尿検査 - 尿沈渣",
    description: "膀胱や尿管の上皮細胞です",
    detailedDescription:
      "移行上皮は、腎盂、尿管、膀胱の内側を覆う細胞です。少数の出現は正常ですが、多数存在する場合は尿路の炎症、結石による刺激、腫瘍などの可能性があります。異型細胞が見られる場合は、尿路上皮癌の可能性も考慮されます。",
    factors: ["膀胱炎や尿路感染症", "尿路結石による刺激", "カテーテル留置", "尿路腫瘍", "尿路の炎症", "薬剤の影響"],
  },
  {
    id: "urine-sediment-bacteria",
    name: "細菌",
    unit: "",
    normalRange: "陰性（-）",
    icon: "kidney",
    category: "尿検査 - 尿沈渣",
    description: "尿中の細菌の有無を調べます",
    detailedDescription:
      "尿沈渣の細菌検査は、尿中に細菌が存在するかを顕微鏡で観察する検査です。通常、尿は無菌ですが、尿路感染症があると細菌が検出されます。白血球の増加を伴う場合、活動性の尿路感染症を示唆します。採尿後の時間経過でも増殖するため、新鮮尿での検査が重要です。",
    factors: [
      "尿路感染症の有無",
      "採尿方法（清潔でない場合）",
      "採尿後の時間経過",
      "免疫力の低下",
      "糖尿病の有無",
      "カテーテル留置",
    ],
  },
  {
    id: "total-cholesterol",
    name: "総コレステロール",
    unit: "mg/dL",
    normalRange: "150-219",
    icon: "heart",
    category: "脂質検査",
    description: "血液中の全てのコレステロールの総量です",
    detailedDescription:
      "総コレステロールは、血液中に含まれるすべてのコレステロール（LDL、HDL、VLDLなど）の合計値です。動脈硬化や心血管疾患のリスク評価に用いられます。高値は動脈硬化のリスクを高めますが、HDLコレステロールとのバランスも重要です。",
    factors: [
      "食事内容（高脂肪食、コレステロール摂取）",
      "遺伝的要因（家族性高コレステロール血症）",
      "運動量",
      "体重（肥満）",
      "年齢（加齢とともに上昇）",
      "服用している薬（スタチンなど）",
    ],
  },
  {
    id: "triglyceride-fasting",
    name: "中性脂肪（空腹時）",
    unit: "mg/dL",
    normalRange: "<150",
    icon: "heart",
    category: "脂質検査",
    description: "空腹時の血液中の中性脂肪量です",
    detailedDescription:
      "中性脂肪（トリグリセリド）は、体内の主要なエネルギー源です。空腹時に測定することで、脂質代謝の状態を正確に評価できます。高値は動脈硬化、脂肪肝、膵炎のリスクを高めます。食事の影響を受けやすいため、空腹時測定が重要です。",
    factors: [
      "食事内容（糖質、脂質、アルコール摂取）",
      "空腹時間（12時間以上の絶食が理想）",
      "運動量",
      "体重（肥満）",
      "糖尿病の有無",
      "アルコール摂取習慣",
    ],
  },
  {
    id: "triglyceride-postprandial",
    name: "中性脂肪（食後）",
    unit: "mg/dL",
    normalRange: "<175",
    icon: "heart",
    category: "脂質検査",
    description: "食後の血液中の中性脂肪量です",
    detailedDescription:
      "食後中性脂肪は、食事後の脂質代謝能力を評価する指標です。食後に著しく上昇する場合、動脈硬化のリスクが高まることが知られています。近年、食後高脂血症が心血管疾患の独立したリスク因子として注目されています。",
    factors: [
      "食事内容（特に脂質の量と質）",
      "食後の経過時間",
      "インスリン抵抗性",
      "糖尿病の有無",
      "肥満",
      "脂質代謝酵素の活性",
    ],
  },
  {
    id: "hdl-cholesterol",
    name: "HDL-コレステロール",
    unit: "mg/dL",
    normalRange: "≥40",
    icon: "heart",
    category: "脂質検査",
    description: "動脈硬化を防ぐ「善玉コレステロール」です",
    detailedDescription:
      "HDLコレステロールは「善玉コレステロール」と呼ばれ、血管壁に蓄積したコレステロールを肝臓に運び、動脈硬化を予防する働きがあります。高値であるほど心血管疾患のリスクが低下します。運動や適度なアルコール摂取で増加することが知られています。",
    factors: [
      "運動習慣（有酸素運動で増加）",
      "体重（肥満で低下）",
      "喫煙（喫煙で低下）",
      "適度なアルコール摂取（増加）",
      "遺伝的要因",
      "性別（女性の方が高値傾向）",
    ],
  },
  {
    id: "ldl-cholesterol",
    name: "LDL-コレステロール",
    unit: "mg/dL",
    normalRange: "<120",
    icon: "heart",
    category: "脂質検査",
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
    id: "non-hdl-cholesterol",
    name: "non HDL-コレステロール",
    unit: "mg/dL",
    normalRange: "<150",
    icon: "heart",
    category: "脂質検査",
    description: "動脈硬化リスクを示す総合的な指標です",
    detailedDescription:
      "non HDLコレステロールは、総コレステロールからHDLコレステロールを引いた値で、動脈硬化を引き起こす可能性のあるすべてのコレステロール（LDL、VLDL、IDLなど）を含みます。LDLコレステロールよりも心血管疾患のリスク予測に優れているとされています。",
    factors: [
      "食事内容（高脂肪食、高糖質食）",
      "運動量",
      "体重（肥満）",
      "糖尿病の有無",
      "遺伝的要因",
      "服用している薬",
    ],
  },
  {
    id: "rbc", // Added RBC count
    name: "赤血球数",
    unit: "×10⁴/μL",
    normalRange: "男性: 430-570, 女性: 380-500",
    icon: "blood",
    category: "血球検査",
    description: "血液中の赤血球の数を示します",
    detailedDescription:
      "赤血球は体中に酸素を運ぶ役割を担っています。赤血球の数が基準値より少ない場合（貧血）、酸素供給が不十分になる可能性があります。数が多い場合（多血症）は、血液が固まりやすくなるリスクがあります。",
    factors: [
      "鉄分、ビタミンB12、葉酸の摂取状況",
      "腎臓の機能（エリスロポエチン産生）",
      "慢性的な出血",
      "脱水状態",
      "骨髄の造血機能",
      "喫煙",
    ],
  },
  {
    id: "hb", // Added Hemoglobin
    name: "ヘモグロビン",
    unit: "g/dL",
    normalRange: "男性: 13.5-17.5, 女性: 12.0-15.5",
    icon: "blood",
    category: "血球検査",
    description: "赤血球に含まれる酸素運搬タンパク質です",
    detailedDescription:
      "ヘモグロビンは赤血球の主要成分であり、酸素を全身に運搬する役割を担っています。ヘモグロビン値が低い場合（貧血）は、倦怠感や息切れなどの症状が現れることがあります。高値の場合は、脱水や多血症が考えられます。",
    factors: ["鉄分の摂取状況", "ビタミンB12や葉酸の摂取", "慢性疾患", "腎臓の機能", "脱水状態", "喫煙"],
  },
  {
    id: "ht", // Added Hematocrit
    name: "ヘマトクリット",
    unit: "%",
    normalRange: "男性: 40-50, 女性: 35-45",
    icon: "blood",
    category: "血球検査",
    description: "血液全体に占める赤血球の容積の割合です",
    detailedDescription:
      "ヘマトクリット値は、血液全体のうち赤血球が占める体積の割合を示します。貧血の重症度を評価するのに役立ちます。低値は貧血、高値は脱水や多血症を示唆することがあります。",
    factors: ["赤血球数と平均赤血球容積", "脱水状態", "鉄欠乏", "出血", "腎臓の病気", "肺疾患"],
  },
  {
    id: "mcv",
    name: "MCV（平均赤血球容積）",
    unit: "fL",
    normalRange: "80-100",
    icon: "blood",
    category: "血球検査",
    description: "赤血球1個あたりの平均的な大きさを示します",
    detailedDescription:
      "MCV（Mean Corpuscular Volume）は、赤血球1個あたりの平均的な容積を示す指標です。貧血の種類を分類するのに重要な検査項目で、高値の場合は大球性貧血（ビタミンB12欠乏、葉酸欠乏など）、低値の場合は小球性貧血（鉄欠乏性貧血、地中海貧血など）が疑われます。",
    factors: [
      "鉄分の摂取状況",
      "ビタミンB12や葉酸の摂取",
      "アルコール摂取習慣",
      "甲状腺機能",
      "骨髄の状態",
      "慢性疾患の有無",
    ],
  },
  {
    id: "mch",
    name: "MCH（平均赤血球ヘモグロビン量）",
    unit: "pg",
    normalRange: "27-34",
    icon: "blood",
    category: "血球検査",
    description: "赤血球1個あたりに含まれるヘモグロビンの量を示します",
    detailedDescription:
      "MCH（Mean Corpuscular Hemoglobin）は、赤血球1個あたりに含まれるヘモグロビンの平均量を示す指標です。MCVと同様に貧血の分類に用いられます。低値の場合は鉄欠乏性貧血や慢性疾患による貧血、高値の場合はビタミンB12欠乏や葉酸欠乏による貧血が疑われます。",
    factors: [
      "鉄分の摂取状況",
      "ビタミンB12や葉酸の摂取",
      "慢性出血の有無",
      "骨髄の造血機能",
      "遺伝性血液疾患",
      "栄養状態",
    ],
  },
  {
    id: "mchc",
    name: "MCHC（平均赤血球ヘモグロビン濃度）",
    unit: "g/dL",
    normalRange: "32-36",
    icon: "blood",
    category: "血球検査",
    description: "赤血球の容積に対するヘモグロビンの濃度を示します",
    detailedDescription:
      "MCHC（Mean Corpuscular Hemoglobin Concentration）は、赤血球の容積に対するヘモグロビンの濃度を示す指標です。赤血球内のヘモグロビンの充満度を表します。低値の場合は鉄欠乏性貧血が疑われ、高値の場合は遺伝性球状赤血球症などが考えられます。MCVやMCHと併せて評価することで、貧血の原因をより正確に推定できます。",
    factors: ["鉄分の摂取状況", "慢性出血の有無", "赤血球の形態異常", "遺伝性血液疾患", "脱水状態", "測定機器の精度"],
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
      return <Droplets className={iconClass} /> // Changed from Droplet to Droplets
    case "bone":
      return <Bone className={iconClass} />
    default:
      return <Eye className={iconClass} />
  }
}

export default function Home() {
  const [inputValues, setInputValues] = useState<Record<string, string>>({})
  const [selectedTest, setSelectedTest] = useState<string | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [calculatedIndices, setCalculatedIndices] = useState<{
    mcv: number | null
    mch: number | null
    mchc: number | null
  }>({
    mcv: null,
    mch: null,
    mchc: null,
  })
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({})

  useEffect(() => {
    const savedValues = localStorage.getItem("healthCheckupValues")
    if (savedValues) {
      try {
        setInputValues(JSON.parse(savedValues))
      } catch (e) {
        console.error("Failed to load saved values:", e)
      }
    }
  }, [])

  useEffect(() => {
    if (Object.keys(inputValues).length > 0) {
      localStorage.setItem("healthCheckupValues", JSON.stringify(inputValues))
    }
  }, [inputValues])

  const selectedTestData = selectedTest ? TEST_ITEMS.find((test) => test.id === selectedTest) : null

  const groupedTests = TEST_ITEMS.reduce(
    (acc, test) => {
      if (!acc[test.category]) {
        acc[test.category] = []
      }
      acc[test.category].push(test)
      return acc
    },
    {} as Record<string, typeof TEST_ITEMS>,
  )

  const scrollToCategory = (category: string) => {
    const element = categoryRefs.current[category]
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const handleInputChange = (id: string, value: string) => {
    setInputValues((prev) => ({ ...prev, [id]: value }))
  }

  const calculateIndices = () => {
    const rbc = Number.parseFloat(inputValues["rbc"] || "0")
    const hb = Number.parseFloat(inputValues["hb"] || "0")
    const ht = Number.parseFloat(inputValues["ht"] || "0")

    if (rbc > 0 && hb > 0 && ht > 0) {
      // MCV = Ht / RBC × 10 (RBC unit: ×10^4/μL)
      const mcv = (ht / rbc) * 10

      // MCH = Hb / RBC × 10 (RBC unit: ×10^4/μL)
      const mch = (hb / rbc) * 10

      // MCHC = Hb / Ht × 100
      const mchc = (hb / ht) * 100

      setCalculatedIndices({
        mcv: Number.parseFloat(mcv.toFixed(1)),
        mch: Number.parseFloat(mch.toFixed(1)),
        mchc: Number.parseFloat(mchc.toFixed(1)),
      })

      // Also update inputValues for analysis
      setInputValues((prev) => ({
        ...prev,
        mcv: mcv.toFixed(1),
        mch: mch.toFixed(1),
        mchc: mchc.toFixed(1),
      }))
    }
  }

  const isOutOfRange = (testId: string, value: string): boolean => {
    if (!value) return false
    const test = TEST_ITEMS.find((t) => t.id === testId)
    if (!test) return false

    const numValue = Number.parseFloat(value)
    if (isNaN(numValue)) return false

    const range = test.normalRange
    if (range.includes("<")) {
      const max = Number.parseFloat(range.replace("<", "").replace("≥", "").trim())
      return numValue >= max
    } else if (range.includes("≥")) {
      const min = Number.parseFloat(range.replace("≥", "").trim())
      return numValue < min
    } else if (range.includes("-")) {
      const [min, max] = range.split("-").map((v) => Number.parseFloat(v.trim()))
      return numValue < min || numValue > max
    } else if (range.includes("陰性") || range.includes("少数") || range.includes("弱陽性")) {
      return false
    }
    return false
  }

  const handleRunAnalysis = () => {
    console.log("Running analysis with values:", inputValues)
    setShowResults(true)
  }

  const filledCount = Object.keys(inputValues).filter((key) => inputValues[key]).length

  const calculateRiskScores = () => {
    const scores = {
      liver: 0,
      kidney: 0,
      lipid: 0,
      diabetes: 0,
      overall: 0,
    }

    // Liver function risk
    const ast = Number.parseFloat(inputValues["ast"] || "0")
    const alt = Number.parseFloat(inputValues["alt"] || "0")
    const ggt = Number.parseFloat(inputValues["ggt"] || "0")

    if (ast > 40) scores.liver += ((ast - 40) / 40) * 30
    if (alt > 40) scores.liver += ((alt - 40) / 40) * 30
    if (ggt > 50) scores.liver += ((ggt - 50) / 50) * 40
    scores.liver = Math.min(100, scores.liver)

    // Kidney function risk
    const creatinine = Number.parseFloat(inputValues["creatinine"] || "0")
    const bun = Number.parseFloat(inputValues["bun"] || "0")
    const egfr = Number.parseFloat(inputValues["egfr"] || "100")

    if (creatinine > 1.09) scores.kidney += ((creatinine - 1.09) / 1.09) * 40
    if (bun > 20) scores.kidney += ((bun - 20) / 20) * 30
    if (egfr < 60) scores.kidney += ((60 - egfr) / 60) * 30
    scores.kidney = Math.min(100, scores.kidney)

    // Lipid risk
    const ldl = Number.parseFloat(inputValues["ldl-cholesterol"] || "0")
    const hdl = Number.parseFloat(inputValues["hdl-cholesterol"] || "100")
    const tg = Number.parseFloat(inputValues["triglyceride-fasting"] || "0")

    if (ldl > 120) scores.lipid += ((ldl - 120) / 120) * 40
    if (hdl < 40) scores.lipid += ((40 - hdl) / 40) * 30
    if (tg > 150) scores.lipid += ((tg - 150) / 150) * 30
    scores.lipid = Math.min(100, scores.lipid)

    // Diabetes risk
    const glucose = Number.parseFloat(inputValues["glucose"] || "0")
    const hba1c = Number.parseFloat(inputValues["hba1c"] || "0")

    if (glucose > 100) scores.diabetes += ((glucose - 100) / 100) * 50
    if (hba1c > 5.6) scores.diabetes += ((hba1c - 5.6) / 5.6) * 50
    scores.diabetes = Math.min(100, scores.diabetes)

    // Overall risk
    scores.overall = (scores.liver + scores.kidney + scores.lipid + scores.diabetes) / 4

    return scores
  }

  const detectAbnormalPatterns = () => {
    const patterns = []

    const ast = Number.parseFloat(inputValues["ast"] || "0")
    const alt = Number.parseFloat(inputValues["alt"] || "0")
    const ggt = Number.parseFloat(inputValues["ggt"] || "0")

    // Alcoholic liver disease pattern
    if (ast > 40 && alt > 40 && ggt > 50 && ast / alt > 1) {
      patterns.push({
        title: "アルコール性肝障害の可能性",
        description:
          "AST、ALT、γ-GTの3つが同時に上昇しており、特にAST/ALT比が1以上の場合、アルコール性肝障害の可能性が高いです。",
        severity: "high",
        relatedTests: ["AST（GOT）", "ALT（GPT）", "γ-GT"],
      })
    }

    // Non-alcoholic fatty liver pattern
    if (alt > ast && alt > 40 && ggt < 50) {
      patterns.push({
        title: "非アルコール性脂肪肝の可能性",
        description: "ALTがASTより高く、γ-GTが正常範囲の場合、非アルコール性脂肪肝（NAFLD）の可能性があります。",
        severity: "medium",
        relatedTests: ["ALT（GPT）", "AST（GOT）"],
      })
    }

    // Metabolic syndrome pattern
    const ldl = Number.parseFloat(inputValues["ldl-cholesterol"] || "0")
    const hdl = Number.parseFloat(inputValues["hdl-cholesterol"] || "100")
    const tg = Number.parseFloat(inputValues["triglyceride-fasting"] || "0")
    const glucose = Number.parseFloat(inputValues["glucose"] || "0")

    if (ldl > 120 && hdl < 40 && tg > 150 && glucose > 100) {
      patterns.push({
        title: "メタボリックシンドロームのリスク",
        description:
          "LDLコレステロール高値、HDLコレステロール低値、中性脂肪高値、血糖値高値が同時に見られる場合、メタボリックシンドロームのリスクが高まります。",
        severity: "high",
        relatedTests: ["LDL-コレステロール", "HDL-コレステロール", "中性脂肪（空腹時）", "血糖値（Glucose）"],
      })
    }

    // Kidney disease pattern
    const creatinine = Number.parseFloat(inputValues["creatinine"] || "0")
    const bun = Number.parseFloat(inputValues["bun"] || "0")
    const egfr = Number.parseFloat(inputValues["egfr"] || "100")

    if (creatinine > 1.09 && bun > 20 && egfr < 60) {
      patterns.push({
        title: "腎機能低下の可能性",
        description:
          "クレアチニン高値、尿素窒素高値、e-GFR低値が同時に見られる場合、慢性腎臓病（CKD）の可能性があります。",
        severity: "high",
        relatedTests: ["クレアチニン", "尿素窒素（BUN）", "e-GFR"],
      })
    }

    return patterns
  }

  const generateHealthActions = () => {
    const actions = []
    const scores = calculateRiskScores()

    if (scores.liver > 30) {
      actions.push({
        category: "肝機能改善",
        actions: [
          "アルコール摂取を週2日以上休肝日を設ける",
          "野菜を中心としたバランスの良い食事を心がける",
          "週3回、30分以上の有酸素運動を行う",
        ],
      })
    }

    if (scores.lipid > 30) {
      actions.push({
        category: "脂質管理",
        actions: [
          "飽和脂肪酸の摂取を控える（揚げ物、肉の脂身など）",
          "青魚（EPA・DHA）を週2回以上摂取する",
          "食物繊維を1日20g以上摂取する（野菜、海藻、きのこ類）",
        ],
      })
    }

    if (scores.diabetes > 30) {
      actions.push({
        category: "血糖管理",
        actions: [
          "炭水化物の摂取量を適正化する（1食あたり茶碗1杯程度）",
          "食事は野菜から食べ始める（ベジファースト）",
          "食後30分以内に軽い運動（散歩など）を行う",
        ],
      })
    }

    if (scores.kidney > 30) {
      actions.push({
        category: "腎機能保護",
        actions: [
          "塩分摂取を1日6g未満に制限する",
          "十分な水分補給を心がける（1日1.5〜2L）",
          "血圧管理に注意する（定期的な測定）",
        ],
      })
    }

    return actions
  }

  const generateConsultationRecommendations = () => {
    const recommendations = []
    const patterns = detectAbnormalPatterns()

    if (patterns.some((p) => p.severity === "high")) {
      recommendations.push({
        urgency: "high",
        department: "内科（消化器内科または腎臓内科）",
        reason: "複数の検査値に異常が見られ、早期の医療機関受診が推奨されます。",
        timing: "1週間以内",
      })
    } else if (patterns.some((p) => p.severity === "medium")) {
      recommendations.push({
        urgency: "medium",
        department: "内科",
        reason: "一部の検査値に異常が見られます。医師に相談することをお勧めします。",
        timing: "1ヶ月以内",
      })
    }

    // Specific department recommendations
    const scores = calculateRiskScores()

    if (scores.liver > 50) {
      recommendations.push({
        urgency: "high",
        department: "消化器内科",
        reason: "肝機能の数値が大きく基準値を超えています。",
        timing: "早急に",
      })
    }

    if (scores.kidney > 50) {
      recommendations.push({
        urgency: "high",
        department: "腎臓内科",
        reason: "腎機能の数値が大きく基準値を超えています。",
        timing: "早急に",
      })
    }

    return recommendations
  }

  if (showResults) {
    const scores = calculateRiskScores()
    const patterns = detectAbnormalPatterns()
    const healthActions = generateHealthActions()
    const consultations = generateConsultationRecommendations()

    return (
      <div className="min-h-screen bg-gray-50">
        <header className="border-b border-gray-200 bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
          <div className="container mx-auto px-4 py-4 max-w-4xl">
            <button
              onClick={() => setShowResults(false)}
              className="flex items-center gap-2 text-gray-900 hover:text-gray-600 transition-colors font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>入力画面に戻る</span>
            </button>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">分析結果</h1>
            <p className="text-gray-600">入力された検査値に基づく総合的な健康評価です</p>
          </div>

          {/* Overall Risk Score */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              総合リスク評価
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-1">{Math.round(scores.liver)}</div>
                <div className="text-sm text-gray-600">肝機能</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-1">{Math.round(scores.kidney)}</div>
                <div className="text-sm text-gray-600">腎機能</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-1">{Math.round(scores.lipid)}</div>
                <div className="text-sm text-gray-600">脂質</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-1">{Math.round(scores.diabetes)}</div>
                <div className="text-sm text-gray-600">血糖</div>
              </div>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-xl border border-gray-200">
              <div className="text-5xl font-bold text-gray-900 mb-2">{Math.round(scores.overall)}</div>
              <div className="text-lg text-gray-600">総合リスクスコア</div>
              <p className="text-sm text-gray-500 mt-2">0-30: 低リスク / 31-60: 中リスク / 61-100: 高リスク</p>
            </div>
          </div>

          {/* Abnormal Patterns */}
          {patterns.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                検出された異常パターン
              </h2>
              <div className="space-y-4">
                {patterns.map((pattern, index) => (
                  <div
                    key={index}
                    className={`p-6 rounded-xl border-2 ${
                      pattern.severity === "high" ? "bg-red-50 border-red-200" : "bg-yellow-50 border-yellow-200"
                    }`}
                  >
                    <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <AlertCircle
                        className={`w-5 h-5 ${pattern.severity === "high" ? "text-red-600" : "text-yellow-600"}`}
                      />
                      {pattern.title}
                    </h3>
                    <p className="text-gray-700 mb-3">{pattern.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {pattern.relatedTests.map((test, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-white rounded-lg text-sm font-medium text-gray-700 border border-gray-200"
                        >
                          {test}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Health Actions */}
          {healthActions.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5" />
                推奨される健康行動
              </h2>
              <div className="space-y-6">
                {healthActions.map((action, index) => (
                  <div key={index}>
                    <h3 className="font-bold text-gray-900 mb-3">{action.category}</h3>
                    <ul className="space-y-2">
                      {action.actions.map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-2 h-2 rounded-full bg-gray-900 mt-2"></span>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Medical Consultation */}
          {consultations.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Stethoscope className="w-5 h-5" />
                医療機関への受診推奨
              </h2>
              <div className="space-y-4">
                {consultations.map((consultation, index) => (
                  <div
                    key={index}
                    className={`p-6 rounded-xl border-2 ${
                      consultation.urgency === "high" ? "bg-red-50 border-red-200" : "bg-yellow-50 border-yellow-200"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold text-gray-900">{consultation.department}</h3>
                      <span
                        className={`px-3 py-1 rounded-lg text-sm font-medium ${
                          consultation.urgency === "high" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {consultation.timing}
                      </span>
                    </div>
                    <p className="text-gray-700">{consultation.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Back Button */}
          <div className="text-center">
            <button
              onClick={() => setShowResults(false)}
              className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-medium hover:bg-gray-800 transition-all shadow-sm"
            >
              入力画面に戻る
            </button>
          </div>

          {/* Disclaimer */}
          <div className="mt-12 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="flex gap-3">
              <Activity className="w-5 h-5 text-gray-900 flex-shrink-0 mt-0.5" />
              <div className="space-y-2 text-sm">
                <p className="font-medium text-gray-900">重要な注意事項</p>
                <p className="text-gray-700">
                  この分析結果は一般的な健康情報の提供を目的としており、医学的診断や治療の代替となるものではありません。検査結果の解釈や具体的な治療方針については、必ず医療専門家にご相談ください。
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (selectedTestData) {
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="border-b border-gray-200 bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
          <div className="container mx-auto px-4 py-4 max-w-4xl">
            <button
              onClick={() => setSelectedTest(null)}
              className="flex items-center gap-2 text-gray-900 hover:text-gray-600 transition-colors font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>一覧へ戻る</span>
            </button>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Title */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-900">
                {getIcon(selectedTestData.icon)}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{selectedTestData.name}について</h1>
                <p className="text-gray-600 mt-1">{selectedTestData.description}</p>
              </div>
            </div>
          </div>

          {/* What is this? */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">この項目について</h2>
            <p className="text-gray-700 leading-relaxed">{selectedTestData.detailedDescription}</p>
          </div>

          {/* Normal Range */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">基準値</h2>
            <p className="text-3xl font-bold text-gray-900">
              {selectedTestData.normalRange}
              {selectedTestData.unit && (
                <span className="text-lg font-normal ml-2 text-gray-600">{selectedTestData.unit}</span>
              )}
            </p>
            {/* Reference value disclaimer */}
            <div className="mt-4 bg-gray-50 rounded-xl p-4 border border-gray-200">
              <p className="text-sm text-gray-700">
                <strong>注意：</strong>
                この基準値は一般的な目安です。実際の健診結果に記載されている基準値を優先してください。基準値は検査機関や測定方法によって異なる場合があります。
              </p>
            </div>
          </div>

          {/* What if out of range */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              基準値外の場合に考えられること
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {selectedTestData.id === "ast" &&
                "ASTが基準値より高い場合、肝臓や心臓の細胞が損傷している可能性があります。肝炎、肝硬変、心筋梗塞などが考えられます。ALTと併せて評価することで、より正確な診断が可能です。"}
              {selectedTestData.id === "alt" &&
                "ALTが基準値より高い場合、肝臓の細胞が損傷している可能性があります。脂肪肝、アルコール性肝障害、ウイルス性肝炎などが考えられます。生活習慣の改善や医療機関での精密検査が推奨されます。"}
              {selectedTestData.id === "ggt" &&
                "γ-GTが基準値より高い場合、アルコール性肝障害や胆道疾患の可能性があります。特にアルコール摂取の影響を受けやすいため、飲酒習慣の見直しが重要です。"}
              {selectedTestData.id === "creatinine" &&
                "クレアチニンが基準値より高い場合、腎機能の低下が疑われます。慢性腎臓病、急性腎不全などの可能性があり、早期の医療機関受診が推奨されます。"}
              {selectedTestData.id === "ldl" &&
                "LDLコレステロールが基準値より高い場合、動脈硬化のリスクが高まります。食事療法、運動療法、必要に応じて薬物療法が推奨されます。"}
              {selectedTestData.id === "mcv" &&
                "MCVが基準値より低い場合、小球性貧血（鉄欠乏性貧血など）が疑われます。鉄分の摂取不足や吸収不良が原因のことがあります。高い場合は、大球性貧血（ビタミンB12欠乏、葉酸欠乏など）が疑われます。"}
              {selectedTestData.id === "mch" &&
                "MCHが基準値より低い場合、鉄欠乏性貧血などが疑われます。赤血球1個あたりのヘモグロビン量が少ない状態です。高い場合は、ビタミンB12や葉酸の欠乏が原因のことがあります。"}
              {selectedTestData.id === "mchc" &&
                "MCHCが基準値より低い場合、鉄欠乏性貧血などが疑われます。赤血球内のヘモグロビンの濃度が低い状態です。高い場合は、遺伝性球状赤血球症などが考えられます。"}
              {!["ast", "alt", "ggt", "creatinine", "ldl", "mcv", "mch", "mchc"].includes(selectedTestData.id) &&
                "基準値外の場合は、医療機関での精密検査や医師への相談が推奨されます。検査値は様々な要因で変動するため、総合的な評価が重要です。"}
            </p>
          </div>

          {/* Expert Knowledge */}
          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8 mb-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Info className="w-5 h-5" />
              知っておきたい専門知識
            </h2>
            <div className="space-y-3 text-gray-700">
              {(selectedTestData.id === "ast" || selectedTestData.id === "alt") && (
                <p className="leading-relaxed">
                  <strong>体位による影響：</strong>
                  特にASTやALTは、採血時の体位（立位から仰臥位への変化）によって血漿量が変動し、数値が影響を受けることが知られています。立位では血漿が濃縮され、仰臥位では希釈されるため、同じ条件で測定することが重要です。
                </p>
              )}
              {selectedTestData.id === "urine-protein" && (
                <p className="leading-relaxed">
                  <strong>起立性蛋白尿：</strong>
                  特に若年層で、立位時に一時的に尿蛋白が陽性になることがあります。これは腎臓の位置関係の変化により、一時的に蛋白が漏れ出る現象で、病的意義は低いことが多いです。
                </p>
              )}
              {selectedTestData.id === "ldl" && (
                <p className="leading-relaxed">
                  <strong>体位による影響：</strong>
                  LDLコレステロールも体位の影響を受けます。立位から仰臥位になると血漿量が増加し、見かけ上の濃度が低下することがあります。
                </p>
              )}
              {(selectedTestData.id === "mcv" || selectedTestData.id === "mch" || selectedTestData.id === "mchc") && (
                <p className="leading-relaxed">
                  <strong>貧血の分類：</strong>
                  MCV、MCH、MCHCは、貧血の種類を特定するための重要な指標です。これらの値と、赤血球数、ヘモグロビン、ヘマトクリットを総合的に評価することで、鉄欠乏性貧血、ビタミンB12欠乏性貧血、再生不良性貧血などの原因を特定しやすくなります。
                </p>
              )}
              <p className="leading-relaxed">
                検査値は単独で評価するのではなく、他の検査項目や臨床症状と併せて総合的に判断することが重要です。
              </p>
            </div>
          </div>

          {/* Factors that can affect the result */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">数値に影響を与える要因</h2>
            <ul className="space-y-3">
              {selectedTestData.factors.map((factor, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-2 h-2 rounded-full bg-gray-900 mt-2"></span>
                  <span className="text-gray-700">{factor}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Health Tips */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">健康維持のためのヒント</h2>
            <ul className="space-y-3">
              {(selectedTestData.id === "ast" || selectedTestData.id === "alt" || selectedTestData.id === "ggt") && (
                <>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-2 h-2 rounded-full bg-gray-900 mt-2"></span>
                    <span className="text-gray-700">アルコールの摂取を控えめにする</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-2 h-2 rounded-full bg-gray-900 mt-2"></span>
                    <span className="text-gray-700">バランスの取れた食事を心がける</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-2 h-2 rounded-full bg-gray-900 mt-2"></span>
                    <span className="text-gray-700">適度な運動を習慣化する</span>
                  </li>
                </>
              )}
              {selectedTestData.id === "ldl" && (
                <>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-2 h-2 rounded-full bg-gray-900 mt-2"></span>
                    <span className="text-gray-700">飽和脂肪酸の摂取を控える</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-2 h-2 rounded-full bg-gray-900 mt-2"></span>
                    <span className="text-gray-700">食物繊維を積極的に摂取する</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-2 h-2 rounded-full bg-gray-900 mt-2"></span>
                    <span className="text-gray-700">有酸素運動を週3回以上行う</span>
                  </li>
                </>
              )}
              {(selectedTestData.id === "creatinine" || selectedTestData.id === "bun") && (
                <>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-2 h-2 rounded-full bg-gray-900 mt-2"></span>
                    <span className="text-gray-700">十分な水分補給を心がける</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-2 h-2 rounded-full bg-gray-900 mt-2"></span>
                    <span className="text-gray-700">塩分の摂取を控える</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-2 h-2 rounded-full bg-gray-900 mt-2"></span>
                    <span className="text-gray-700">血圧管理に注意する</span>
                  </li>
                </>
              )}
              {(selectedTestData.id === "mcv" || selectedTestData.id === "mch" || selectedTestData.id === "mchc") && (
                <>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-2 h-2 rounded-full bg-gray-900 mt-2"></span>
                    <span className="text-gray-700">鉄分、ビタミンB12、葉酸をバランス良く摂取する</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-2 h-2 rounded-full bg-gray-900 mt-2"></span>
                    <span className="text-gray-700">アルコール摂取を控える</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-2 h-2 rounded-full bg-gray-900 mt-2"></span>
                    <span className="text-gray-700">貧血の症状（倦怠感、動悸など）に注意する</span>
                  </li>
                </>
              )}
              {!["ast", "alt", "ggt", "ldl", "creatinine", "bun", "mcv", "mch", "mchc"].includes(
                selectedTestData.id,
              ) && (
                <>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-2 h-2 rounded-full bg-gray-900 mt-2"></span>
                    <span className="text-gray-700">規則正しい生活習慣を心がける</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-2 h-2 rounded-full bg-gray-900 mt-2"></span>
                    <span className="text-gray-700">定期的な健康診断を受ける</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-2 h-2 rounded-full bg-gray-900 mt-2"></span>
                    <span className="text-gray-700">気になる症状があれば早めに医療機関を受診する</span>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Back Button */}
          <div className="text-center">
            <button
              onClick={() => setSelectedTest(null)}
              className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-medium hover:bg-gray-800 transition-all shadow-sm"
            >
              一覧へ戻る
            </button>
          </div>

          {/* Information Source Disclaimer */}
          <div className="mt-8 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-gray-900 flex-shrink-0 mt-0.5" />
              <div className="space-y-2 text-sm">
                <p className="font-medium text-gray-900">情報源について</p>
                <p className="text-gray-700">
                  本サイトの情報は、日本人間ドック学会、日本臨床検査医学会、厚生労働省などの公的機関が公開している情報を参考にしています。最新の医学的知見については、医療専門家にご相談ください。
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gray-900">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">健康診断結果入力</h1>
              <p className="text-xs text-gray-600">検査結果を入力してください</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Instructions */}
        <div className="mb-8 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <p className="text-gray-700 text-center">
            下記に検査値を入力し、「分析を実行」ボタンをクリックすると、AIによる健康アドバイスが表示されます。
          </p>
          {/* Auto-save notice */}
          <p className="text-sm text-gray-600 text-center mt-2">入力した値は自動的に保存されます</p>
        </div>

        {/* Table of Contents */}
        <div className="mb-8 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-gray-900" />
            検査項目一覧
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.keys(groupedTests).map((category) => (
              <button
                key={category}
                onClick={() => scrollToCategory(category)}
                className="flex items-center justify-between gap-2 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all text-left group border border-gray-200"
              >
                <span className="font-medium text-gray-900">{category}</span>
                <ChevronRight className="w-4 h-4 text-gray-900 group-hover:translate-x-1 transition-transform" />
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8 bg-white rounded-2xl border-2 border-gray-900 p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Calculator className="w-6 h-6" />
            赤血球指数の計算
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            赤血球数、ヘモグロビン濃度、ヘマトクリット値を入力すると、MCV、MCH、MCHCが自動計算されます。
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* RBC Input */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                赤血球数 (RBC)
                <span className="text-gray-600 ml-1">×10⁴/μL</span>
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="例: 450"
                value={inputValues["rbc"] || ""}
                onChange={(e) => handleInputChange("rbc", e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 transition-all text-lg font-semibold"
              />
            </div>

            {/* Hb Input */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                ヘモグロビン濃度 (Hb)
                <span className="text-gray-600 ml-1">g/dL</span>
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="例: 14.5"
                value={inputValues["hb"] || ""}
                onChange={(e) => handleInputChange("hb", e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 transition-all text-lg font-semibold"
              />
            </div>

            {/* Ht Input */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                ヘマトクリット値 (Ht)
                <span className="text-gray-600 ml-1">%</span>
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="例: 42.0"
                value={inputValues["ht"] || ""}
                onChange={(e) => handleInputChange("ht", e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 transition-all text-lg font-semibold"
              />
            </div>
          </div>

          <button
            onClick={calculateIndices}
            disabled={!inputValues["rbc"] || !inputValues["hb"] || !inputValues["ht"]}
            className="w-full px-6 py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm mb-6"
          >
            計算する
          </button>

          {/* Calculation Results */}
          {(calculatedIndices.mcv !== null || calculatedIndices.mch !== null || calculatedIndices.mchc !== null) && (
            <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">計算結果</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* MCV Result */}
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="text-sm text-gray-600 mb-1">MCV（平均赤血球容積）</div>
                  <div className="text-3xl font-bold text-gray-900">
                    {calculatedIndices.mcv !== null ? calculatedIndices.mcv : "-"}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">fL</div>
                  <div className="text-xs text-gray-500 mt-2">基準値: 80-100 fL</div>
                </div>

                {/* MCH Result */}
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="text-sm text-gray-600 mb-1">MCH（平均赤血球Hb量）</div>
                  <div className="text-3xl font-bold text-gray-900">
                    {calculatedIndices.mch !== null ? calculatedIndices.mch : "-"}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">pg</div>
                  <div className="text-xs text-gray-500 mt-2">基準値: 27-34 pg</div>
                </div>

                {/* MCHC Result */}
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="text-sm text-gray-600 mb-1">MCHC（平均赤血球Hb濃度）</div>
                  <div className="text-3xl font-bold text-gray-900">
                    {calculatedIndices.mchc !== null ? calculatedIndices.mchc : "-"}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">g/dL</div>
                  <div className="text-xs text-gray-500 mt-2">基準値: 32-36 g/dL</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-8 mb-8">
          {Object.entries(groupedTests).map(([category, tests]) => (
            <div
              key={category}
              ref={(el) => {
                categoryRefs.current[category] = el
              }}
              className="scroll-mt-24"
            >
              {/* Category Header */}
              <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-1 h-6 bg-gray-900 rounded-full"></span>
                  {category}
                </h2>
              </div>

              {/* Test Cards */}
              <div className="space-y-4">
                {tests.map((test) => {
                  const outOfRange = isOutOfRange(test.id, inputValues[test.id] || "")
                  const hasValue = inputValues[test.id] && inputValues[test.id].trim() !== ""

                  return (
                    <div
                      key={test.id}
                      className={`bg-white rounded-2xl border-2 overflow-hidden transition-all shadow-sm ${
                        outOfRange
                          ? "border-red-300 bg-red-50/30"
                          : hasValue
                            ? "border-green-300 bg-green-50/30"
                            : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="p-6">
                        <div className="flex items-start gap-4">
                          {/* Icon - clickable to view details */}
                          <button
                            onClick={() => setSelectedTest(test.id)}
                            className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-900 hover:bg-gray-200 transition-colors"
                          >
                            {getIcon(test.icon)}
                          </button>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 mb-3">
                              <div className="flex-1">
                                <button
                                  onClick={() => setSelectedTest(test.id)}
                                  className="text-left hover:text-gray-600 transition-colors flex items-center gap-2"
                                >
                                  <h3 className="text-lg font-bold text-gray-900">{test.name}</h3>
                                  <Info className="w-4 h-4 text-gray-400" />
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
                                inputMode="decimal"
                                className={`flex-1 px-4 py-3 bg-gray-50 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all text-lg font-semibold placeholder-gray-400 ${
                                  outOfRange
                                    ? "border-red-400 focus:border-red-500 focus:ring-red-500/10 text-red-900"
                                    : hasValue
                                      ? "border-green-400 focus:border-green-500 focus:ring-green-500/10 text-green-900"
                                      : "border-gray-200 focus:border-gray-900 focus:ring-gray-900/10 text-gray-900"
                                }`}
                              />
                              {test.unit && <span className="text-gray-600 font-medium min-w-[60px]">{test.unit}</span>}
                            </div>

                            {/* Visual feedback for out of range values */}
                            {outOfRange && (
                              <div className="flex items-center gap-2 text-xs text-red-700 bg-red-100 rounded-lg px-3 py-2 border border-red-200 mb-2">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                <span className="font-medium">この値は基準値の範囲外です</span>
                              </div>
                            )}

                            {/* Normal Range */}
                            <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
                              <span className="font-medium">基準値:</span>
                              <span>
                                {test.normalRange}
                                {test.unit && ` ${test.unit}`}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          {/* Input progress indicator */}
          {filledCount > 0 && (
            <p className="text-sm text-gray-600 mb-3">
              現在 <span className="font-bold text-gray-900">{filledCount}</span> 項目入力済み
            </p>
          )}
          <button
            onClick={handleRunAnalysis}
            className="px-12 py-5 bg-gray-900 text-white rounded-2xl font-bold text-lg hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            disabled={Object.keys(inputValues).length === 0}
          >
            分析を実行
          </button>
          <p className="text-sm text-gray-600 mt-3">AIによる健康アドバイスを取得します</p>
        </div>

        {/* Info Notice */}
        <div className="mt-12 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex gap-3">
            <Activity className="w-5 h-5 text-gray-900 flex-shrink-0 mt-0.5" />
            <div className="space-y-2 text-sm">
              <p className="font-medium text-gray-900">情報提供のみを目的としています</p>
              <p className="text-gray-700">
                このツールは一般的な健康情報を提供します。検査結果の解釈や医療アドバイスについては、必ず医療専門家にご相談ください。
              </p>
              {/* Information source reference */}
              <p className="text-gray-600 text-xs mt-2">
                参考：日本人間ドック学会、日本臨床検査医学会、厚生労働省の公開情報に基づいています
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
