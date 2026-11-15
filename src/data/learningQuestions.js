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
      {
        id: 'reading-main-idea-q2',
        prompt: 'Coral reefs provide shelter for many fish. They also reduce the force of waves before those waves reach the shore. Which idea best summarizes the passage?',
        options: { A: 'Coral reefs have important benefits for marine life and coastlines.', B: 'Most fish live close to the shore.', C: 'Waves are stronger near coral reefs.', D: 'Scientists have stopped studying coral reefs.' },
        correctOption: 'A',
        explanation: 'Pilihan A menyatukan dua manfaat utama yang disebutkan; pilihan lain bertentangan atau mempersempit isi bacaan.',
      },
      {
        id: 'reading-main-idea-q3',
        prompt: 'A paragraph explains that public libraries lend books, provide internet access, and host free community classes. What is its main idea?',
        options: { A: 'Libraries are mainly places to borrow novels.', B: 'Community classes should charge a fee.', C: 'Public libraries offer several services to their communities.', D: 'Internet access is unavailable at home.' },
        correctOption: 'C',
        explanation: 'Semua detail mendukung gagasan umum bahwa perpustakaan menyediakan beragam layanan bagi masyarakat.',
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
      {
        id: 'reading-scanning-details-q2',
        prompt: '“The research team began its coastal survey in 2018 and repeated it every two years.” In what year did the survey begin?',
        options: { A: '2014', B: '2018', C: '2020', D: '2022' },
        correctOption: 'B',
        explanation: 'Kata kunci “began” menunjuk langsung pada tahun 2018; tahun lain adalah waktu pengulangan atau tidak disebutkan.',
      },
      {
        id: 'reading-scanning-details-q3',
        prompt: '“The observatory uses a 2.4-meter telescope to study distant galaxies.” Which instrument does it use?',
        options: { A: 'A radio transmitter', B: 'A weather balloon', C: 'A microscope', D: 'A 2.4-meter telescope' },
        correctOption: 'D',
        explanation: 'Detail alat disebut eksplisit. Cocokkan informasi spesifik, bukan memilih alat lain yang juga digunakan dalam sains.',
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
      {
        id: 'reading-inference-vocabulary-q2',
        prompt: '“The committee viewed the proposal with skepticism because it contained few supporting details.” What does “skepticism” most nearly mean?',
        options: { A: 'Strong enthusiasm', B: 'Careful doubt', C: 'Complete agreement', D: 'Unexpected relief' },
        correctOption: 'B',
        explanation: 'Minimnya bukti membuat komite meragukan proposal tersebut; skepticism berarti sikap ragu atau tidak mudah percaya.',
      },
      {
        id: 'reading-inference-vocabulary-q3',
        prompt: '“After the heavy rains, the narrow mountain trail became impassable.” What does “impassable” mean?',
        options: { A: 'Impossible or unsafe to travel through', B: 'Easy to find', C: 'Recently repaired', D: 'Far from the mountain' },
        correctOption: 'A',
        explanation: 'Hujan deras membuat jalur tidak dapat dilewati dengan aman; arti tersebut sesuai konteks kalimat.',
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
      {
        id: 'listening-predict-context-q2',
        prompt: 'A student tells a librarian, “The printer stopped halfway through my application, and the deadline is today.” What is the student most likely going to ask?',
        options: { A: 'Where to buy a new computer', B: 'How to apply for a library card', C: 'For help printing the application', D: 'When the library was built' },
        correctOption: 'C',
        explanation: 'Masalah printer dan tenggat hari ini menunjukkan bahwa bantuan mencetak adalah kebutuhan paling masuk akal.',
      },
      {
        id: 'listening-predict-context-q3',
        prompt: 'A traveler says, “I left my ticket at the hotel, and boarding starts in ten minutes.” What will the traveler probably do next?',
        options: { A: 'Ask someone to retrieve or reissue the ticket', B: 'Book a hotel room', C: 'Cancel the airport', D: 'Start a new trip next month' },
        correctOption: 'A',
        explanation: 'Masalah langsungnya adalah tiket yang tertinggal sementara boarding segera dimulai, jadi ia kemungkinan meminta bantuan terkait tiket.',
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
      {
        id: 'listening-key-details-q2',
        prompt: 'A man says, “The review session was planned for Friday, but the professor moved it to Thursday afternoon.” When is the session?',
        options: { A: 'Friday morning', B: 'Thursday afternoon', C: 'Wednesday afternoon', D: 'Saturday' },
        correctOption: 'B',
        explanation: 'Perubahan rencana menyebut waktu yang baru secara langsung: Kamis sore.',
      },
      {
        id: 'listening-key-details-q3',
        prompt: 'A passenger hears, “The 8:15 bus is delayed. It will now depart at 8:40 from Gate 6.” When and where does it depart?',
        options: { A: '8:15, Gate 6', B: '8:40, Gate 5', C: '8:40, Gate 6', D: '8:50, Gate 8' },
        correctOption: 'C',
        explanation: 'Catat waktu dan lokasi terbaru setelah pengumuman koreksi: pukul 8:40 dari Gate 6.',
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
      {
        id: 'listening-purpose-attitude-q2',
        prompt: 'After a colleague accidentally deletes a file, another says with a tired sigh, “Well, that was a brilliant idea.” What is the speaker’s attitude?',
        options: { A: 'Sincere admiration', B: 'Sarcastic frustration', C: 'Fear of computers', D: 'Excitement about the file' },
        correctOption: 'B',
        explanation: 'Kata-katanya terdengar memuji, tetapi situasi dan desahan menunjukkan sindiran serta rasa kesal.',
      },
      {
        id: 'listening-purpose-attitude-q3',
        prompt: 'A student says, “I have been studying since dawn. I could really use a break.” What does the student imply?',
        options: { A: 'The student wants to continue studying all night.', B: 'The student has not started studying.', C: 'The student would like to rest for a while.', D: 'The student wants a different class.' },
        correctOption: 'C',
        explanation: 'Ungkapan “could use a break” secara tidak langsung menyatakan bahwa pembicara ingin beristirahat.',
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
      {
        id: 'structure-sentence-patterns-q2',
        prompt: 'Choose the correct verb: “Because the roads ___ icy, the school delayed the opening.”',
        options: { A: 'were', B: 'was', C: 'be', D: 'is' },
        correctOption: 'A',
        explanation: 'Subjek “roads” berbentuk jamak dan peristiwanya terjadi di masa lampau, sehingga “were” tepat.',
      },
      {
        id: 'structure-sentence-patterns-q3',
        prompt: 'Choose the phrase that completes the sentence: “The report, which includes data from five universities, ___ the need for further research.”',
        options: { A: 'emphasize', B: 'emphasizes', C: 'emphasizing', D: 'to emphasize' },
        correctOption: 'B',
        explanation: 'Subjek utama adalah “The report” (tunggal). Klausa “which includes…” hanya sisipan, jadi kata kerja utamanya “emphasizes”.',
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
      {
        id: 'structure-subject-verb-agreement-q2',
        prompt: 'Choose the correct verb: “A number of applicants ___ selected for the interview.”',
        options: { A: 'has been', B: 'have been', C: 'is', D: 'was' },
        correctOption: 'B',
        explanation: 'Frasa “a number of” berarti beberapa dan diikuti kata kerja jamak: “have been”.',
      },
      {
        id: 'structure-subject-verb-agreement-q3',
        prompt: 'Choose the correct verb: “The number of applicants ___ increased this year.”',
        options: { A: 'have', B: 'are', C: 'has', D: 'were' },
        correctOption: 'C',
        explanation: 'Subjeknya adalah “The number” (tunggal), bukan “applicants”, sehingga kata kerja yang tepat adalah “has”.',
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
      {
        id: 'structure-error-identification-q2',
        prompt: 'Which part contains an error? “Each of the samples (A) were stored (B) in a sealed container (C) overnight (D).”',
        options: { A: 'Each of the samples', B: 'were stored', C: 'in a sealed container', D: 'overnight' },
        correctOption: 'B',
        explanation: '“Each” adalah subjek tunggal. Kata kerja yang benar adalah “was stored”, bukan “were stored”.',
      },
      {
        id: 'structure-error-identification-q3',
        prompt: 'Which part contains an error? “The new policy (A) requires every employee (B) to submits (C) a weekly report (D).”',
        options: { A: 'The new policy', B: 'requires every employee', C: 'to submits', D: 'a weekly report' },
        correctOption: 'C',
        explanation: 'Setelah “to” infinitive, gunakan bentuk dasar kata kerja: “to submit”, bukan “to submits”.',
      },
    ],
  },
}

export function getLearningQuestions(skill, lessonId) {
  return learningQuestions[skill]?.[lessonId] ?? []
}
