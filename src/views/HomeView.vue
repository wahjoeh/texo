<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabase'
import { getNextToeflRank, getToeflRank } from '../utils/toeflRanks'
import '../assets/home.css'
import '../assets/home-test-theme.css'

const router = useRouter()
const user = ref(null)
const latestScores = ref({})
const monthlyLeaderboard = ref([])
const leaderboardError = ref(false)
const scoresLoading = ref(true)
const leaderboardLoading = ref(true)
const username = computed(() => user.value?.user_metadata?.username || user.value?.email?.split('@')[0] || 'Pengguna')
const displayName = computed(() => user.value?.user_metadata?.full_name || username.value)
const fullTestBestScore = computed(() => latestScores.value.full_test?.bestScore)
const currentFullTestRank = computed(() => getToeflRank(fullTestBestScore.value))
const displayedFullTestRank = computed(() => currentFullTestRank.value ?? { name: 'Unranked', color: 'unranked' })
const nextFullTestRank = computed(() => getNextToeflRank(fullTestBestScore.value))
const pointsToNextRank = computed(() => nextFullTestRank.value
  ? Math.max(0, nextFullTestRank.value.min - Number(fullTestBestScore.value))
  : 0)
const currentMonth = new Intl.DateTimeFormat('id-ID', {
  month: 'long',
  year: 'numeric',
  timeZone: 'Asia/Jakarta',
}).format(new Date())

const scoreTypes = [
  { id: 'listening', label: 'Listening', icon: '🎧', color: 'blue', unit: 'Skor konversi' },
  { id: 'structure', label: 'Structure / Written', icon: '✍️', color: 'violet', unit: 'Skor konversi' },
  { id: 'reading', label: 'Reading', icon: '📖', color: 'teal', unit: 'Skor konversi' },
  { id: 'full_test', label: 'Full Test Simulation', icon: '🏆', color: 'amber', unit: 'Skor TOEFL ITP' },
]

onMounted(async () => {
  if (!supabase) {
    scoresLoading.value = false
    return
  }

  const { data } = await supabase.auth.getUser()
  user.value = data.user

  if (user.value) {
    const [progressResult, leaderboardResult] = await Promise.all([
      supabase
        .from('user_progress')
        .select('test_type, latest_score, best_score, average_score, attempts_count, total_correct, total_questions, last_attempt_at')
        .eq('user_id', user.value.id),
      supabase.rpc('get_monthly_full_test_leaderboard'),
    ])

    if (progressResult.error) {
      console.error('Unable to load latest TOEFL scores.', progressResult.error)
    } else {
      latestScores.value = Object.fromEntries((progressResult.data ?? []).map(row => [row.test_type, {
        score: row.latest_score,
        bestScore: row.best_score,
        averageScore: row.average_score,
        attemptsCount: row.attempts_count,
        totalCorrect: row.total_correct,
        totalQuestions: row.total_questions,
        takenAt: row.last_attempt_at,
      }]))
    }
    if (leaderboardResult.error) {
      console.error('Unable to load the monthly Full Test ranking.', leaderboardResult.error)
      leaderboardError.value = true
    } else {
      monthlyLeaderboard.value = leaderboardResult.data ?? []
    }
  }
  scoresLoading.value = false
  leaderboardLoading.value = false
})

function formatTakenAt(value) {
  return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
}

function isCurrentUser(player) {
  return player.username.toLowerCase() === username.value.toLowerCase()
}

const sections = [
  {
    id: 'listening',
    icon: '🎧',
    number: '01',
    title: 'Listening Comprehension',
    description: 'Latih kemampuan memahami percakapan dan monolog berbahasa Inggris.',
    detail: '2 paket latihan',
    color: 'blue',
  },
  {
    id: 'structure',
    icon: '✍️',
    number: '02',
    title: 'Written Expression',
    description: 'Asah pemahaman grammar dan temukan kesalahan dalam kalimat.',
    detail: '2 paket latihan',
    color: 'violet',
  },
  {
    id: 'reading',
    icon: '📖',
    number: '03',
    title: 'Reading Comprehension',
    description: 'Tingkatkan kecepatan membaca dan memahami bacaan akademik.',
    detail: '2 paket latihan',
    color: 'teal',
  },
  {
    id: 'full-test',
    icon: '📝',
    number: '04',
    title: 'Full TOEFL ITP Test',
    description: 'Simulasikan tes lengkap dengan tiga bagian dalam satu sesi.',
    detail: 'Simulasi lengkap',
    color: 'amber',
  },
]

function openSection(id) {
  router.push(`/${id}`)
}
</script>

<template>
  <main class="dashboard-page">
    <div class="dashboard-content">
      <section class="welcome-panel">
        <div class="welcome-copy">
          <span class="welcome-kicker"><span class="status-dot" /> RUANG LATIHAN TOEFL ITP</span>
          <h1>Halo, {{ displayName }} <span class="wave">👋</span></h1>
          <p>Siap meningkatkan skor TOEFL-mu? Pilih bagian latihan atau mulai simulasi lengkap hari ini.</p>
          <button class="welcome-action" type="button" @click="openSection('full-test')">
            Mulai simulasi penuh
            <span aria-hidden="true">→</span>
          </button>
        </div>
        <div class="welcome-illustration" :aria-label="`Rank ${displayedFullTestRank.name}`">
          <div class="orbit orbit-one" />
          <div class="orbit orbit-two" />
          <div class="hero-rank-display">
            <div class="hero-rank-emblem">
              <span aria-hidden="true">🏅</span>
              <img
                :src="`/rank-logos/${displayedFullTestRank.name.toLowerCase().replaceAll(' ', '-')}.png`"
                :alt="`${displayedFullTestRank.name} logo`"
                @error="$event.target.style.display = 'none'"
              >
            </div>
            <strong>{{ displayedFullTestRank.name }}</strong>
            <small v-if="currentFullTestRank && nextFullTestRank">{{ pointsToNextRank }} poin ke {{ nextFullTestRank.name }}</small>
            <small v-else-if="currentFullTestRank">Rank tertinggi · skor {{ fullTestBestScore }}</small>
            <small v-else>{{ scoresLoading ? 'Memuat rank…' : 'Selesaikan Full Test' }}</small>
          </div>
          <span class="spark spark-one">✦</span>
          <span class="spark spark-two">✧</span>
          <span class="spark spark-three">✦</span>
        </div>
      </section>

      <section class="latest-scores-section" aria-label="Skor terbaru">
        <div class="score-heading">
          <div>
            <span class="section-eyebrow">PERFORMA AKUNMU</span>
            <h2>Skor terbaru</h2>
          </div>
          <p>Hasil terakhir dari tiap tes, termasuk bagian dalam simulasi penuh.</p>
        </div>
        <div class="latest-score-grid">
          <article
            v-for="kind in scoreTypes"
            :key="kind.id"
            class="latest-score-card"
            :class="`latest-score-${kind.color}`"
          >
            <div class="latest-score-top">
              <span class="latest-score-icon">{{ kind.icon }}</span>
              <span class="latest-score-label">{{ kind.label }}</span>
            </div>
            <div class="latest-score-value">
              {{ scoresLoading ? '…' : latestScores[kind.id]?.score ?? '—' }}
            </div>
            <span
              v-if="kind.id === 'full_test' && latestScores[kind.id]"
              class="score-rank-badge"
              :class="`score-rank-${getToeflRank(latestScores[kind.id].score)?.color}`"
            >
              {{ getToeflRank(latestScores[kind.id].score)?.name }}
            </span>
            <div class="latest-score-unit">{{ kind.unit }}</div>
            <div class="latest-score-footer">
              <span v-if="latestScores[kind.id]">
                {{ latestScores[kind.id].attemptsCount }} tes · Terbaik {{ latestScores[kind.id].bestScore }} · Rata-rata {{ Number(latestScores[kind.id].averageScore).toFixed(1) }}
              </span>
              <span v-else>{{ scoresLoading ? 'Memuat hasil…' : 'Belum ada hasil tes' }}</span>
              <span v-if="latestScores[kind.id]">
                {{ latestScores[kind.id].totalCorrect }}/{{ latestScores[kind.id].totalQuestions }} jawaban benar keseluruhan
              </span>
              <time v-if="latestScores[kind.id]?.takenAt" :datetime="latestScores[kind.id].takenAt">
                Terakhir: {{ formatTakenAt(latestScores[kind.id].takenAt) }}
              </time>
            </div>
          </article>
        </div>
      </section>

      <div class="dashboard-lower">
      <section class="leaderboard-section" aria-label="Ranking Full Test bulanan">
        <div class="score-heading leaderboard-heading">
          <div>
            <span class="section-eyebrow">BERLAKU BULAN INI</span>
            <h2>Ranking Full Test</h2>
          </div>
          <span class="leaderboard-month">{{ currentMonth }}</span>
        </div>
        <div class="leaderboard-card">
          <div class="leaderboard-columns" aria-hidden="true">
            <span>Peringkat</span>
            <span>Pengguna</span>
            <span>Skor TOEFL ITP</span>
          </div>
          <ol v-if="monthlyLeaderboard.length" class="leaderboard-list">
            <li
              v-for="player in monthlyLeaderboard"
              :key="player.rank"
              class="leaderboard-row"
              :class="{ 'leaderboard-top-three': player.rank <= 3, 'leaderboard-current-user': isCurrentUser(player) }"
            >
              <span class="leaderboard-rank">
                <span v-if="player.rank === 1">🥇</span>
                <span v-else-if="player.rank === 2">🥈</span>
                <span v-else-if="player.rank === 3">🥉</span>
                <span v-else>{{ player.rank }}</span>
              </span>
              <span class="leaderboard-user">
                <span class="leaderboard-avatar">{{ player.username.slice(0, 1).toUpperCase() }}</span>
                <strong>{{ player.username }}</strong>
                <span v-if="isCurrentUser(player)" class="you-badge">Kamu</span>
              </span>
              <span class="leaderboard-score">
                <strong>{{ player.full_test_score }}</strong>
                <small :class="`score-rank-${getToeflRank(player.full_test_score)?.color}`">
                  {{ getToeflRank(player.full_test_score)?.name }}
                </small>
              </span>
            </li>
          </ol>
          <div v-else-if="leaderboardError" class="leaderboard-empty">
            <span>⚠️</span>
            <strong>Ranking gagal dimuat</strong>
            <p>Muat ulang halaman untuk mencoba lagi.</p>
          </div>
          <div v-else class="leaderboard-empty">
            <span>{{ leaderboardLoading ? 'Memuat ranking…' : '🏁' }}</span>
            <strong>{{ leaderboardLoading ? 'Mohon tunggu' : 'Belum ada skor bulan ini' }}</strong>
            <p>{{ leaderboardLoading ? 'Ranking sedang diperbarui.' : 'Jadilah yang pertama menyelesaikan Full Test bulan ini.' }}</p>
          </div>
          <p class="leaderboard-footnote">Skor tertinggi bulan ini berada di peringkat atas. Jika skor sama, hasil yang dicapai lebih dulu mendapat peringkat lebih tinggi.</p>
        </div>
      </section>

      <section class="practice-section">
        <div class="section-heading">
          <div>
            <span class="section-eyebrow">PILIH SESI LATIHAN</span>
            <h2>Latihan tes</h2>
          </div>
          <button class="learn-dashboard-link" type="button" @click="openSection('learn')">Buka learning path <span aria-hidden="true">→</span></button>
        </div>

        <div class="practice-grid">
          <button
            v-for="section in sections"
            :key="section.id"
            class="practice-card"
            :class="`practice-${section.color}`"
            type="button"
            @click="openSection(section.id)"
          >
            <span class="practice-topline">
              <span class="practice-icon">{{ section.icon }}</span>
              <span class="practice-number">{{ section.number }}</span>
            </span>
            <span class="practice-title">{{ section.title }}</span>
            <span class="practice-description">{{ section.description }}</span>
            <span class="practice-footer">
              <span>{{ section.detail }}</span>
              <span class="practice-arrow" aria-hidden="true">→</span>
            </span>
          </button>
        </div>
      </section>
      </div>

      <footer class="dashboard-footer">
        <span>TEP Practice · TOEFL ITP Simulation</span>
        <span>Belajar sedikit demi sedikit, hasilnya terasa.</span>
      </footer>
    </div>
  </main>
</template>
