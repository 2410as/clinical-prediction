// 検査値の判定ロジック。UIに依存しない純粋関数だけを置く。

// normalRange は "10-40" や "3.5-5.0, 4.0-5.5" のような文字列。
// どれか1つの範囲に収まっていれば基準値内とみなす。
export const isOutOfRange = (value: string, normalRange: string): boolean => {
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
