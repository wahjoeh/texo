<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabase'
import { learningPaths } from '../data/learningPaths'
import '../assets/learn.css'
import '../assets/learning-theme.css'

const router = useRouter()
const loading = ref(true)
const progressError = ref('')
const completedBySkill = ref({})
const totalLessons = computed(() => learningPaths.reduce((total, path) => total + path.lessons.length, 0))
const totalCompleted = computed(() => Object.values(completedBySkill.value).reduce((total, lessons) => total + lessons.length, 0))

onMounted(async () => {
  if (!supabase) {
    loading.value = false
    return
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    const { data, error } = await supabase
      .from('user_learning_progress')
      .select('skill, lesson_id')
      .eq('user_id', user.id)

    if (error) {
      console.error('Unable to load learning progress.', error)
      progressError.value = 'Terapkan migrasi database belajar di Supabase agar progres dapat dimuat dan disimpan.'
    }
    else {
      completedBySkill.value = (data ?? []).reduce((progress, row) => {
        progress[row.skill] ??= []
        progress[row.skill].push(row.lesson_id)
        return progress
      }, {})
    }
  }
  loading.value = false
})

function progressFor(path) {
  const complete = completedBySkill.value[path.id]?.length ?? 0
  return { complete, percent: Math.round((complete / path.lessons.length) * 100) }
}

function continuePath(path) {
  const completed = completedBySkill.value[path.id] ?? []
  const nextLesson = path.lessons.find(lesson => !completed.includes(lesson.id)) ?? path.lessons[0]
  router.push(`/learn/${path.id}/${nextLesson.id}`)
}
</script>

<template>
  <main class="learn-page">
    <div class="learn-shell">
      <RouterLink to="/" class="learn-back">← Dashboard</RouterLink>
      <section class="learn-hero">
        <span class="learn-eyebrow">BELAJAR TERARAH</span>
        <h1>Bangun kemampuan TOEFL-mu, satu langkah setiap hari.</h1>
        <p>Pilih skill, ikuti materi secara bertahap, dan progresmu tersimpan di akun.</p>
        <div class="learn-overall-progress">
          <div class="learn-overall-copy"><span>Progres semua jalur</span><strong>{{ loading ? '…' : `${totalCompleted} / ${totalLessons} materi` }}</strong></div>
          <div class="learn-progress-track"><span :style="{ width: `${loading ? 0 : Math.round(totalCompleted / totalLessons * 100)}%` }" /></div>
        </div>
      </section>

      <section class="learn-path-section">
        <div class="learn-section-heading">
          <div><span class="learn-eyebrow">PILIH SKILL</span><h2>Learning path</h2></div>
          <span class="learn-path-count">{{ learningPaths.length }} jalur · {{ totalLessons }} materi</span>
        </div>
        <p v-if="progressError" class="learn-error" role="alert">{{ progressError }}</p>
        <div class="learn-path-grid">
          <article v-for="path in learningPaths" :key="path.id" class="learn-path-card" :class="`learn-${path.color}`">
            <div class="learn-path-top"><span class="learn-path-icon">{{ path.icon }}</span><span class="learn-path-tag">{{ path.lessons.length }} materi</span></div>
            <h3>{{ path.title }}</h3>
            <p>{{ path.description }}</p>
            <div class="learn-path-progress-copy"><span>Progres</span><strong>{{ loading ? '…' : `${progressFor(path).complete}/${path.lessons.length}` }}</strong></div>
            <div class="learn-progress-track"><span :style="{ width: `${loading ? 0 : progressFor(path).percent}%` }" /></div>
            <button class="learn-path-button" type="button" @click="continuePath(path)">
              {{ progressFor(path).complete === path.lessons.length && !loading ? 'Ulangi jalur' : progressFor(path).complete ? 'Lanjutkan belajar' : 'Mulai belajar' }}
              <span aria-hidden="true">→</span>
            </button>
          </article>
        </div>
      </section>
      <footer class="learn-footer">Materi belajar tersimpan per akun. Selesaikan satu materi untuk memperbarui progres jalur.</footer>
    </div>
  </main>
</template>
