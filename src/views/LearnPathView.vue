<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '../lib/supabase'
import { getLearningPath } from '../data/learningPaths'
import '../assets/learn.css'
import '../assets/learning-theme.css'

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const saving = ref(false)
const questionLoading = ref(true)
const questionSaving = ref(false)
const errorMessage = ref('')
const questionError = ref('')
const completedLessons = ref([])
const lessonQuestions = ref([])
const questionIndex = ref(0)
const selectedOption = ref('')
const answerFeedback = ref(null)
const questionAttempts = ref(0)
let questionLoadToken = 0
const path = computed(() => getLearningPath(route.params.skill))
const lesson = computed(() => path.value?.lessons.find(item => item.id === route.params.lessonId) ?? null)
const completionCount = computed(() => completedLessons.value.length)
const progressPercent = computed(() => path.value ? Math.round(completionCount.value / path.value.lessons.length * 100) : 0)
const lessonIndex = computed(() => path.value?.lessons.findIndex(item => item.id === lesson.value?.id) ?? -1)
const isComplete = computed(() => lesson.value && completedLessons.value.includes(lesson.value.id))
const currentQuestion = computed(() => lessonQuestions.value[questionIndex.value] ?? null)

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
  questionLoading.value = false
  lessonQuestions.value = []
  questionIndex.value = 0
  selectedOption.value = ''
  answerFeedback.value = null
  questionAttempts.value = 0
  questionError.value = ''
  if (!lessonId || !supabase || !getLearningPath(skill)) return

  questionLoading.value = true
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (requestToken !== questionLoadToken) return
  if (userError || !user) {
    questionError.value = 'Sesi login tidak ditemukan. Silakan masuk kembali.'
    questionLoading.value = false
    return
  }

  const { data, error } = await supabase
    .from('learning_questions')
    .select('id, prompt, options, sort_order')
    .eq('skill', skill)
    .eq('lesson_id', lessonId)
    .eq('is_active', true)
    .order('sort_order')

  if (requestToken !== questionLoadToken) return
  if (error) {
    questionError.value = 'Contoh soal belum dapat dimuat. Terapkan migrasi bank soal di Supabase.'
    questionLoading.value = false
    return
  }
  const databaseQuestions = data ?? []
  const fallbackQuestion = getLearningPath(skill)?.lessons.find(item => item.id === lessonId)?.exampleQuestion
  lessonQuestions.value = databaseQuestions.length
    ? databaseQuestions
    : fallbackQuestion ? [fallbackQuestion] : []
  questionLoading.value = false

  if (lessonQuestions.value.length) {
    const questionIds = lessonQuestions.value.map(item => item.id)
    const { data: attempts } = await supabase
      .from('user_learning_answers')
      .select('question_id, attempt_count')
      .eq('user_id', user.id)
      .in('question_id', questionIds)
    if (requestToken !== questionLoadToken) return
    questionAttempts.value = attempts?.find(item => item.question_id === currentQuestion.value?.id)?.attempt_count ?? 0
  }
})

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

async function checkAnswer() {
  if (!currentQuestion.value || !selectedOption.value || questionSaving.value) return
  questionSaving.value = true
  questionError.value = ''
  answerFeedback.value = null
  const { data, error } = await supabase.rpc('submit_learning_answer', {
    p_question_id: currentQuestion.value.id,
    p_selected_option: selectedOption.value,
  })
  if (error) {
    questionError.value = 'Jawaban belum dapat disimpan. Pastikan migrasi bank soal sudah diterapkan.'
  } else {
    answerFeedback.value = Array.isArray(data) ? data[0] : data
    questionAttempts.value = answerFeedback.value?.attempts_count ?? questionAttempts.value
  }
  questionSaving.value = false
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
          <div class="learn-lesson-meta"><span>{{ path.label }}</span><span>{{ lesson.duration }}</span></div>
          <h2>{{ lesson.title }}</h2>
          <p class="learn-objective"><strong>Tujuan belajar</strong>{{ lesson.objective }}</p>
          <section v-for="(section, index) in lesson.sections" :key="section.heading" class="learn-content-section">
            <span class="learn-content-index">{{ String(index + 1).padStart(2, '0') }}</span><div><h3>{{ section.heading }}</h3><p>{{ section.body }}</p></div>
          </section>
          <aside class="learn-check-card"><span>💡 Cek pemahaman</span><p>{{ lesson.check }}</p></aside>

          <section class="learn-question-card" aria-label="Contoh soal">
            <div class="learn-question-heading"><span>LATIHAN SINGKAT</span><small v-if="questionAttempts">Sudah dicoba {{ questionAttempts }}×</small></div>
            <p v-if="questionLoading" class="learn-question-prompt">Memuat contoh soal…</p>
            <template v-else-if="currentQuestion">
              <p class="learn-question-prompt">{{ currentQuestion.prompt }}</p>
              <div class="learn-answer-options">
                <button v-for="[key, option] in Object.entries(currentQuestion.options ?? {})" :key="key" type="button" class="learn-answer-option" :class="{ selected: selectedOption === key }" :disabled="questionSaving" @click="selectedOption = key; answerFeedback = null">
                  <span>{{ key }}</span><span>{{ option }}</span>
                </button>
              </div>
              <button class="learn-check-answer" type="button" :disabled="!selectedOption || questionSaving" @click="checkAnswer">{{ questionSaving ? 'Memeriksa…' : 'Periksa jawaban' }}</button>
              <div v-if="answerFeedback" class="learn-answer-feedback" :class="{ correct: answerFeedback.is_correct }" role="status">
                <strong>{{ answerFeedback.is_correct ? 'Jawaban benar!' : 'Belum tepat, coba pahami pembahasannya.' }}</strong>
                <p>{{ answerFeedback.explanation }}</p>
              </div>
            </template>
            <p v-else-if="!questionError" class="learn-question-prompt">Belum ada soal untuk materi ini.</p>
            <p v-if="questionError" class="learn-error" role="alert">{{ questionError }}</p>
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
