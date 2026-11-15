const rankTiers = [
  { name: 'Bronze 1', min: 0, max: 329, color: 'bronze' },
  { name: 'Bronze 2', min: 330, max: 359, color: 'bronze' },
  { name: 'Bronze 3', min: 360, max: 399, color: 'bronze' },
  { name: 'Silver 1', min: 400, max: 419, color: 'silver' },
  { name: 'Silver 2', min: 420, max: 439, color: 'silver' },
  { name: 'Silver 3', min: 440, max: 459, color: 'silver' },
  { name: 'Gold 1', min: 460, max: 472, color: 'gold' },
  { name: 'Gold 2', min: 473, max: 486, color: 'gold' },
  { name: 'Gold 3', min: 487, max: 499, color: 'gold' },
  { name: 'Diamond 1', min: 500, max: 519, color: 'diamond' },
  { name: 'Diamond 2', min: 520, max: 539, color: 'diamond' },
  { name: 'Diamond 3', min: 540, max: 559, color: 'diamond' },
  { name: 'Platinum 1', min: 560, max: 579, color: 'platinum' },
  { name: 'Platinum 2', min: 580, max: 599, color: 'platinum' },
  { name: 'Platinum 3', min: 600, max: 619, color: 'platinum' },
  { name: 'Master 1', min: 620, max: 632, color: 'master' },
  { name: 'Master 2', min: 633, max: 646, color: 'master' },
  { name: 'Master 3', min: 647, max: 659, color: 'master' },
  { name: 'Grandmaster 1', min: 660, max: 679, color: 'grandmaster' },
  { name: 'Grandmaster 2', min: 680, max: 699, color: 'grandmaster' },
  { name: 'Grandmaster 3', min: 700, max: Number.POSITIVE_INFINITY, color: 'grandmaster' },
]

export function getToeflRank(score) {
  const numericScore = Number(score)
  if (!Number.isFinite(numericScore)) return null
  return rankTiers.find(tier => numericScore >= tier.min && numericScore <= tier.max) ?? null
}

export function getNextToeflRank(score) {
  const currentRank = getToeflRank(score)
  if (!currentRank) return null
  return rankTiers[rankTiers.indexOf(currentRank) + 1] ?? null
}
