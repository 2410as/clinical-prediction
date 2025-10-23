"use client"
import { useState, useRef } from "react"
import { Activity, Heart, Droplet, Brain, Bone, Eye, ArrowLeft, ChevronRight } from "lucide-react"

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
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({})

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

  const handleRunAnalysis = () => {
    console.log("Running analysis with values:", inputValues)
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

          {/* Back Button */}
          <div className="text-center">
            <button
              onClick={() => setSelectedTest(null)}
              className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-medium hover:bg-gray-800 transition-all shadow-sm"
            >
              一覧へ戻る
            </button>
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
                {tests.map((test) => (
                  <div
                    key={test.id}
                    className="bg-white rounded-2xl border border-gray-200 overflow-hidden transition-all hover:border-gray-300 shadow-sm"
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
                                className="text-left hover:text-gray-600 transition-colors"
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
                              className="flex-1 px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 transition-all text-lg font-semibold text-gray-900 placeholder-gray-400"
                            />
                            {test.unit && <span className="text-gray-600 font-medium min-w-[60px]">{test.unit}</span>}
                          </div>

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
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
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
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
