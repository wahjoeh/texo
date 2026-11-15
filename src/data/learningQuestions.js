// Bank soal Learning Path lokal.
// Tambahkan soal baru ke array berdasarkan skill dan lessonId.
export const learningQuestions = {
  reading: {
    'main-idea': [
      {
        id: 'reading-main-idea-q1',
        prompt: 'Which sentence best expresses the main idea? “Urban trees lower summer temperatures. Their shade cools sidewalks, and their leaves release moisture into the air. As a result, neighborhoods with more trees are often cooler than nearby areas.”',
        options: {
          A: 'Trees are difficult to maintain in cities.',
          B: 'Urban trees help cool neighborhoods in more than one way.',
          C: 'Sidewalks are warmer than nearby buildings.',
          D: 'Most trees release moisture only in summer.',
        },
        correctOption: 'B',
        explanation: 'Kalimat B merangkum dua mekanisme yang disebutkan dan dampaknya pada suhu lingkungan; pilihan lain hanya detail atau tidak didukung teks.',
      },
    ],
    'scanning-details': [
      {
        id: 'reading-scanning-details-q1',
        prompt: 'According to the passage, what should a reader do after locating a keyword?',
        options: {
          A: 'Choose the answer containing the same word.',
          B: 'Read the surrounding sentences for context.',
          C: 'Skip the question and read the entire passage again.',
          D: 'Look only at the first sentence.',
        },
        correctOption: 'B',
        explanation: 'Kata kunci membantu menemukan lokasi informasi. Kalimat di sekitarnya perlu dibaca untuk memastikan konteks dan parafrasanya.',
      },
    ],
    'inference-vocabulary': [
      {
        id: 'reading-inference-vocabulary-q1',
        prompt: 'A passage says, “Unlike the fragile early models, the latest instrument remained intact after repeated impact tests.” What does “fragile” most nearly mean?',
        options: {
          A: 'Easily broken',
          B: 'Highly accurate',
          C: 'Recently designed',
          D: 'Expensive to repair',
        },
        correctOption: 'A',
        explanation: 'Kontras dengan model terbaru yang tetap utuh setelah benturan menunjukkan bahwa fragile berarti mudah rusak atau pecah.',
      },
    ],
  },
  listening: {
    'predict-context': [
      {
        id: 'listening-predict-context-q1',
        prompt: 'A student says, “I have a presentation tomorrow, but the projector in our room is not working.” What is the most likely purpose of the conversation?',
        options: {
          A: 'To ask for help finding a working projector',
          B: 'To cancel the presentation permanently',
          C: 'To explain how projectors are manufactured',
          D: 'To invite a professor to dinner',
        },
        correctOption: 'A',
        explanation: 'Konteks presentasi besok dan proyektor rusak paling kuat mengarah pada kebutuhan mencari bantuan atau perangkat pengganti.',
      },
    ],
    'key-details': [
      {
        id: 'listening-key-details-q1',
        prompt: 'A woman says, “Let’s meet at two—actually, make that three. My lab ends later than I expected.” When will they meet?',
        options: {
          A: 'At one',
          B: 'At two',
          C: 'At three',
          D: 'After dinner',
        },
        correctOption: 'C',
        explanation: 'Pembicara mengoreksi waktu awal dari pukul dua menjadi pukul tiga. Informasi terakhir adalah rencana yang berlaku.',
      },
    ],
    'purpose-attitude': [
      {
        id: 'listening-purpose-attitude-q1',
        prompt: 'A student says, “I thought the assignment was due Friday. I wish I had checked the course page.” How does the student probably feel?',
        options: {
          A: 'Regretful',
          B: 'Amused',
          C: 'Confident',
          D: 'Impatient with the instructor',
        },
        correctOption: 'A',
        explanation: 'Ungkapan “I wish I had checked” menunjukkan penyesalan karena tidak memeriksa informasi lebih awal.',
      },
    ],
  },
  structure: {
    'sentence-patterns': [
      {
        id: 'structure-sentence-patterns-q1',
        prompt: 'Choose the word that correctly completes the sentence: “The results of the experiment ___ published yesterday.”',
        options: {
          A: 'was',
          B: 'were',
          C: 'is',
          D: 'has',
        },
        correctOption: 'B',
        explanation: 'Subjek utama adalah “results” (jamak). Frasa “of the experiment” hanya menjelaskan results, jadi bentuk yang tepat adalah “were”.',
      },
    ],
    'subject-verb-agreement': [
      {
        id: 'structure-subject-verb-agreement-q1',
        prompt: 'Choose the correct verb: “The list of required courses ___ on the department website.”',
        options: {
          A: 'appear',
          B: 'appears',
          C: 'are appearing',
          D: 'have appeared',
        },
        correctOption: 'B',
        explanation: 'Subjek utama adalah “list” (tunggal), bukan “courses”. Karena itu kata kerja present yang sesuai adalah “appears”.',
      },
    ],
    'error-identification': [
      {
        id: 'structure-error-identification-q1',
        prompt: 'Which part contains an error? “The committee (A) have approved (B) the proposal (C) after reviewing the data (D).”',
        options: {
          A: 'The committee',
          B: 'have approved',
          C: 'the proposal',
          D: 'after reviewing the data',
        },
        correctOption: 'B',
        explanation: '“Committee” adalah collective noun tunggal pada konteks ini, sehingga kata kerjanya seharusnya “has approved”.',
      },
    ],
  },
}

export function getLearningQuestions(skill, lessonId) {
  return learningQuestions[skill]?.[lessonId] ?? []
}
