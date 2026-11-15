<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  question: { type: Object, required: true },
  stateKey: { type: String, required: true },
  questionNumber: { type: Number, required: true },
  title: { type: String, default: 'Latihan singkat' },
  attempts: { type: Number, default: 0 },
  saving: { type: Boolean, default: false },
  saveError: { type: String, default: '' },
})

const emit = defineEmits(['answer'])
const selectedOption = ref('')
const feedback = ref(null)

watch(() => `${props.stateKey}:${props.question.id}`, () => {
  selectedOption.value = ''
  feedback.value = null
})

function checkAnswer() {
  if (!selectedOption.value || props.saving) return
  const isCorrect = selectedOption.value === props.question.correctOption
  feedback.value = { isCorrect, explanation: props.question.explanation }
  emit('answer', {
    questionId: props.question.id,
    selectedOption: selectedOption.value,
    isCorrect,
    stateKey: props.stateKey,
  })
}
</script>

<template>
  <section class="learn-question-card" :aria-label="`${title}, soal ${questionNumber}`">
    <div class="learn-question-heading">
      <span>{{ title }} · {{ String(questionNumber).padStart(2, '0') }}</span>
      <small v-if="attempts">Dicoba {{ attempts }}×</small>
    </div>
    <p class="learn-question-prompt">{{ question.prompt }}</p>
    <div class="learn-answer-options">
      <button
        v-for="[key, option] in Object.entries(question.options ?? {})"
        :key="key"
        type="button"
        class="learn-answer-option"
        :class="{ selected: selectedOption === key }"
        :disabled="saving"
        @click="selectedOption = key; feedback = null"
      >
        <span>{{ key }}</span><span>{{ option }}</span>
      </button>
    </div>
    <button class="learn-check-answer" type="button" :disabled="!selectedOption || saving" @click="checkAnswer">
      {{ saving ? 'Menyimpan…' : 'Periksa jawaban' }}
    </button>
    <div v-if="feedback" class="learn-answer-feedback" :class="{ correct: feedback.isCorrect }" role="status">
      <strong>{{ feedback.isCorrect ? 'Jawaban benar!' : 'Belum tepat, pelajari pembahasannya.' }}</strong>
      <p>{{ feedback.explanation }}</p>
    </div>
    <p v-if="saveError" class="learn-error" role="alert">{{ saveError }}</p>
  </section>
</template>
