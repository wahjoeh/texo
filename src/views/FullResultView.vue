<script setup>
import '../assets/full-result.css'
import '../assets/home-test-theme.css'
import { onMounted } from 'vue'
import { recordTestAttempt } from '../lib/scores'
import { getToeflRank } from '../utils/toeflRanks'

import {
  convertListeningScore,
  convertStructureScore,
  convertReadingScore,
  calculateToeflScore
}
from '../utils/toeflScore'

const listeningCorrect =
  Number(
    sessionStorage.getItem(
      'fullListeningCorrect'
    )
  )

const structureCorrect =
  Number(
    sessionStorage.getItem(
      'fullStructureCorrect'
    )
  )

const readingCorrect =
  Number(
    sessionStorage.getItem(
      'fullReadingCorrect'
    )
  )

const listeningScaled =
  convertListeningScore(
    listeningCorrect
  )

const structureScaled =
  convertStructureScore(
    structureCorrect
  )

const readingScaled =
  convertReadingScore(
    readingCorrect
  )

const finalScore =
  calculateToeflScore(
    listeningCorrect,
    structureCorrect,
    readingCorrect
  )
const finalRank = getToeflRank(finalScore)

onMounted(async () => {
  try {
    let attemptId = sessionStorage.getItem('fullTestAttemptId')
    if (!attemptId) {
      attemptId = crypto.randomUUID()
      sessionStorage.setItem('fullTestAttemptId', attemptId)
    }

    await recordTestAttempt(attemptId, [
      {
        testType: 'listening',
        score: listeningScaled,
        correct: listeningCorrect,
        total: 50,
        details: { source: 'full_test' },
      },
      {
        testType: 'structure',
        score: structureScaled,
        correct: structureCorrect,
        total: 40,
        details: { source: 'full_test' },
      },
      {
        testType: 'reading',
        score: readingScaled,
        correct: readingCorrect,
        total: 50,
        details: { source: 'full_test' },
      },
      {
        testType: 'full_test',
        score: finalScore,
        correct: listeningCorrect + structureCorrect + readingCorrect,
        total: 140,
        details: {
          listening: listeningScaled,
          structure: structureScaled,
          reading: readingScaled,
        },
      },
    ])
  } catch (error) {
    console.error('Unable to save the latest full-test score.', error)
  }
})
</script>

<template>

  <div class="result-page">

    <div class="result-card">

      <div class="result-header">

        <div class="trophy">
          🏆
        </div>

        <h1>
          TOEFL ITP Full Test Result
        </h1>

        <p>
          ETS TOEFL ITP Practice Tests
          Level 1 Volume 3
        </p>

      </div>

      <div class="score-grid">

        <div class="score-item">

          <h3>
            🎧 Listening
          </h3>

          <div class="scaled-score">
            {{ listeningScaled }}
          </div>

          <div class="correct-score">
            {{ listeningCorrect }}/50 Correct
          </div>

        </div>

        <div class="score-item">

          <h3>
            📝 Structure
          </h3>

          <div class="scaled-score">
            {{ structureScaled }}
          </div>

          <div class="correct-score">
            {{ structureCorrect }}/40 Correct
          </div>

        </div>

        <div class="score-item">

          <h3>
            📖 Reading
          </h3>

          <div class="scaled-score">
            {{ readingScaled }}
          </div>

          <div class="correct-score">
            {{ readingCorrect }}/50 Correct
          </div>

        </div>

      </div>

      <div class="final-score-box">

        <div class="final-label">
          Final TOEFL ITP Score
        </div>

        <div class="final-score">
          {{ finalScore }}
        </div>

        <span v-if="finalRank" class="full-test-rank" :class="`rank-${finalRank.color}`">
          {{ finalRank.name }}
        </span>

      </div>

      <RouterLink
        to="/"
        class="home-btn"
      >
        Back To Home
      </RouterLink>

    </div>

  </div>

</template>
