<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '../lib/supabase'
import { getLearningPath } from '../data/learningPaths'
import { getLearningQuestions } from '../data/learningQuestions'
import LearningQuestionCard from '../components/LearningQuestionCard.vue'
import '../assets/learn.css'
import '../assets/learning-theme.css'

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const saving = ref(false)
const errorMessage = ref('')
const completedLessons = ref([])
const lessonQuestions = ref([])
const questionAttempts = ref({})
const answerSaving = ref({})
const answerErrors = ref({})
const miniTestResults = ref({})
let questionLoadToken = 0
const path = computed(() => getLearningPath(route.params.skill))
const lesson = computed(() => path.value?.lessons.find(item => item.id === route.params.lessonId) ?? null)
const completionCount = computed(() => completedLessons.value.length)
const progressPercent = computed(() => path.value ? Math.round(completionCount.value / path.value.lessons.length * 100) : 0)
const lessonIndex = computed(() => path.value?.lessons.findIndex(item => item.id === lesson.value?.id) ?? -1)
const isComplete = computed(() => lesson.value && completedLessons.value.includes(lesson.value.id))
const lessonSequence = computed(() => {
  const sections = lesson.value?.sections ?? []
  const questions = lessonQuestions.value
  return [
    sections[0] ? { type: 'material', section: sections[0], number: 1 } : null,
    questions[0] ? { type: 'question', question: questions[0], stateKey: 'inline-1', number: 1 } : null,
    sections[1] ? { type: 'material', section: sections[1], number: 2 } : null,
    questions[1] ? { type: 'question', question: questions[1], stateKey: 'inline-2', number: 2 } : null,
  ].filter(Boolean)
})
const miniTestScore = computed(() => {
  if (!lessonQuestions.value.length) return null
  const results = lessonQuestions.value.map(question => miniTestResults.value[question.id])
  if (results.some(result => result === undefined)) return null
  return { correct: results.filter(Boolean).length, total: results.length }
})

watch(() => route.params.skill, async skill => {
  loading.value = true
  errorMessage.value = ''
  completedLessons.value = []
  if (!supabase || !getLearningPath(skill)) {
    loading.value = false
    return
  }

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    errorMessage.value = 'Sesi login tidak ditemukan. Silakan masuk kembali.'
    loading.value = false
    return
  }

  const { data, error } = await supabase
    .from('user_learning_progress')
    .select('lesson_id')
    .eq('user_id', user.id)
    .eq('skill', skill)

  if (route.params.skill !== skill) return
  if (error) errorMessage.value = 'Progres belum dapat dimuat. Pastikan migrasi database belajar sudah diterapkan.'
  else completedLessons.value = (data ?? []).map(row => row.lesson_id)
  loading.value = false
}, { immediate: true })

watch(() => route.fullPath, async () => {
  const skill = route.params.skill
  const lessonId = route.params.lessonId
  const requestToken = ++questionLoadToken
  lessonQuestions.value = getLearningQuestions(skill, lessonId)
  questionAttempts.value = {}
  answerSaving.value = {}
  answerErrors.value = {}
  miniTestResults.value = {}
  if (!lessonId || !supabase || !getLearningPath(skill) || !lessonQuestions.value.length) return

  const questionIds = lessonQuestions.value.map(item => item.id)
  const { data: { session } } = await supabase.auth.getSession()
  if (requestToken !== questionLoadToken || !session?.user) return
  const { data: attempts } = await supabase
    .from('user_learning_answers')
    .select('question_id, attempt_count')
    .eq('user_id', session.user.id)
    .in('question_id', questionIds)
  if (requestToken !== questionLoadToken) return
  questionAttempts.value = Object.fromEntries((attempts ?? []).map(item => [item.question_id, item.attempt_count]))
}, { immediate: true })

async function toggleCompletion() {
  if (!lesson.value || !supabase || saving.value) return
  saving.value = true
  errorMessage.value = ''
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    errorMessage.value = 'Sesi login tidak ditemukan. Silakan masuk kembali.'
    saving.value = false
    return
  }

  let result
  if (isComplete.value) {
    result = await supabase
      .from('user_learning_progress')
      .delete()
      .eq('user_id', user.id)
      .eq('skill', path.value.id)
      .eq('lesson_id', lesson.value.id)
  } else {
    result = await supabase
      .from('user_learning_progress')
      .upsert({ user_id: user.id, skill: path.value.id, lesson_id: lesson.value.id }, { onConflict: 'user_id,skill,lesson_id' })
  }

  if (result.error) errorMessage.value = 'Progres gagal disimpan. Pastikan migrasi database belajar sudah diterapkan.'
  else if (isComplete.value) completedLessons.value = completedLessons.value.filter(id => id !== lesson.value.id)
  else completedLessons.value = [...completedLessons.value, lesson.value.id]
  saving.value = false
}

function openLesson(index) {
  const target = path.value?.lessons[index]
  if (target) router.push(`/learn/${path.value.id}/${target.id}`)
}

function answerQuestion({ questionId, selectedOption, isCorrect, stateKey }) {
  if (!supabase || answerSaving.value[stateKey]) return
  answerSaving.value = { ...answerSaving.value, [stateKey]: true }
  answerErrors.value = { ...answerErrors.value, [stateKey]: '' }
  if (stateKey.startsWith('final-')) {
    miniTestResults.value = { ...miniTestResults.value, [questionId]: isCorrect }
  }

  supabase.rpc('record_learning_answer', {
    p_question_id: questionId,
    p_selected_option: selectedOption,
    p_is_correct: isCorrect,
  }).then(({ data, error }) => {
    if (error) {
      answerErrors.value = { ...answerErrors.value, [stateKey]: 'Jawaban sudah diperiksa, tetapi riwayatnya belum tersimpan.' }
      return
    }
    questionAttempts.value = { ...questionAttempts.value, [questionId]: Number(data) || (questionAttempts.value[questionId] ?? 0) + 1 }
  }).catch(() => {
    answerErrors.value = { ...answerErrors.value, [stateKey]: 'Jawaban sudah diperiksa, tetapi riwayatnya belum tersimpan.' }
  }).finally(() => {
    answerSaving.value = { ...answerSaving.value, [stateKey]: false }
  })
}
</script>

<template>
  <main class="learn-page">
    <div v-if="!path" class="learn-shell"><RouterLink to="/learn" class="learn-back">← Semua jalur belajar</RouterLink><section class="learn-empty"><h1>Jalur belajar tidak ditemukan</h1><p>Pilih salah satu skill yang tersedia.</p></section></div>
    <div v-else class="learn-shell">
      <RouterLink to="/learn" class="learn-back">← Semua jalur belajar</RouterLink>
      <div class="learn-workspace">
        <aside class="learn-outline">
          <div class="learn-outline-heading"><span class="learn-path-icon">{{ path.icon }}</span><div><span class="learn-eyebrow">LEARNING PATH</span><h1>{{ path.label }}</h1></div></div>
          <p class="learn-outline-description">{{ path.description }}</p>
          <div class="learn-outline-progress"><div class="learn-path-progress-copy"><span>Progres jalur</span><strong>{{ loading ? '…' : `${completionCount}/${path.lessons.length}` }}</strong></div><div class="learn-progress-track"><span :style="{ width: `${loading ? 0 : progressPercent}%` }" /></div></div>
          <nav class="learn-lesson-list" aria-label="Materi dalam jalur">
            <button v-for="(item, index) in path.lessons" :key="item.id" type="button" class="learn-lesson-link" :class="{ 'is-current': lesson?.id === item.id, 'is-complete': completedLessons.includes(item.id) }" @click="openLesson(index)">
              <span class="learn-lesson-state">{{ completedLessons.includes(item.id) ? '✓' : String(index + 1).padStart(2, '0') }}</span><span class="learn-lesson-link-copy"><strong>{{ item.title }}</strong><small>{{ item.duration }}</small></span>
            </button>
          </nav>
        </aside>

        <article v-if="lesson" class="learn-lesson-content">
          <div class="learn-lesson-meta"><span>{{ path.label }}</span><span>{{ lesson.duration }}</span><span>Materi · latihan · tes</span></div>
          <h2>{{ lesson.title }}</h2>
          <p class="learn-objective"><strong>Tujuan belajar</strong>{{ lesson.objective }}</p>
          <div class="learn-sequence">
            <template v-for="step in lessonSequence" :key="step.type === 'material' ? step.section.heading : step.stateKey">
              <section v-if="step.type === 'material'" class="learn-content-section learn-material-step">
                <span class="learn-content-index">{{ String(step.number).padStart(2, '0') }}</span>
                <div><span class="learn-material-label">MATERI {{ String(step.number).padStart(2, '0') }}</span><h3>{{ step.section.heading }}</h3><p>{{ step.section.body }}</p></div>
              </section>
              <LearningQuestionCard
                v-else
                :question="step.question"
                :state-key="step.stateKey"
                :question-number="step.number"
                title="Latihan materi"
                :attempts="questionAttempts[step.question.id] ?? 0"
                :saving="answerSaving[step.stateKey] ?? false"
                :save-error="answerErrors[step.stateKey] ?? ''"
                @answer="answerQuestion"
              />
            </template>
          </div>
          <aside class="learn-check-card"><span>💡 Cek pemahaman</span><p>{{ lesson.check }}</p></aside>

          <section v-if="lessonQuestions.length" class="learn-mini-test">
            <div class="learn-mini-test-heading"><span class="learn-mini-test-icon">✦</span><div><span class="learn-eyebrow">TES AKHIR SINGKAT</span><h3>Coba tanpa melihat materi</h3><p>Ulangi tiga soal untuk mengecek pemahamanmu.</p></div></div>
            <LearningQuestionCard
              v-for="(question, index) in lessonQuestions"
              :key="`final-${question.id}`"
              :question="question"
              :state-key="`final-${question.id}`"
              :question-number="index + 1"
              title="Tes akhir"
              :attempts="questionAttempts[question.id] ?? 0"
              :saving="answerSaving[`final-${question.id}`] ?? false"
              :save-error="answerErrors[`final-${question.id}`] ?? ''"
              @answer="answerQuestion"
            />
            <div v-if="miniTestScore" class="learn-mini-test-score" role="status">
              <span>{{ miniTestScore.correct === miniTestScore.total ? '🏆' : '📊' }}</span>
              <strong>Hasil tes akhir: {{ miniTestScore.correct }}/{{ miniTestScore.total }} benar</strong>
              <small>{{ miniTestScore.correct === miniTestScore.total ? 'Mantap, semua konsep sudah kamu kuasai.' : 'Baca lagi bagian yang perlu diperkuat, lalu coba kembali.' }}</small>
            </div>
          </section>

          <p v-if="errorMessage" class="learn-error" role="alert">{{ errorMessage }}</p>
          <div class="learn-lesson-actions">
            <button class="learn-complete-button" :class="{ completed: isComplete }" type="button" :disabled="loading || saving" @click="toggleCompletion">
              {{ saving ? 'Menyimpan…' : isComplete ? '✓ Selesai · Tandai belum selesai' : 'Tandai materi selesai' }}
            </button>
            <button v-if="lessonIndex < path.lessons.length - 1" class="learn-next-button" type="button" @click="openLesson(lessonIndex + 1)">Materi berikutnya →</button>
            <RouterLink v-else class="learn-next-button" to="/learn">Kembali ke semua jalur →</RouterLink>
          </div>
        </article>
        <section v-else class="learn-lesson-content learn-lesson-welcome">
          <span class="learn-eyebrow">MULAI JALUR BELAJAR</span><h2>Belajar {{ path.label }} secara bertahap</h2><p>Pilih materi di panel untuk mulai. Tandai materi selesai agar progres tersimpan dan kamu bisa melanjutkan kapan saja.</p>
          <button class="learn-complete-button" type="button" @click="openLesson(0)">Mulai materi pertama →</button>
        </section>
      </div>
    </div>
  </main>
</template>
