export const learningPaths = [
  {
    id: 'reading',
    title: 'Reading Comprehension',
    label: 'Reading',
    icon: '📖',
    color: 'blue',
    description: 'Strategi membaca cepat, menemukan ide utama, dan memahami detail bacaan akademik.',
    lessons: [
      {
        id: 'main-idea',
        title: 'Menemukan ide utama',
        duration: '8 menit',
        objective: 'Membedakan topik, ide utama, dan detail pendukung dalam sebuah paragraf.',
        sections: [
          { heading: 'Mulai dari gambaran besar', body: 'Baca kalimat pertama dan terakhir paragraf untuk menangkap topiknya. Setelah itu, tanyakan: apa yang ingin disampaikan penulis tentang topik tersebut?' },
          { heading: 'Kenali parafrasa', body: 'Jawaban TOEFL sering menyatakan ide yang sama dengan kata berbeda. Cocokkan maknanya, bukan kata yang persis sama.' },
        ],
        check: 'Jika sebuah pilihan hanya menyebut satu contoh atau angka, biasanya pilihan itu adalah detail, bukan ide utama.',
      },
      {
        id: 'scanning-details',
        title: 'Mencari detail dengan cepat',
        duration: '7 menit',
        objective: 'Menemukan fakta spesifik tanpa membaca ulang seluruh passage.',
        sections: [
          { heading: 'Tandai kata kunci', body: 'Sebelum mencari jawaban, tandai nama, tanggal, istilah, atau kata unik pada pertanyaan. Gunakan kata itu untuk memindai passage.' },
          { heading: 'Baca konteks di sekitarnya', body: 'Setelah menemukan kata kunci, baca satu atau dua kalimat di sekitarnya. Detail penting sering diparafrasekan dan tidak selalu memakai kata yang sama.' },
        ],
        check: 'Jangan memilih jawaban hanya karena kata yang sama muncul di passage. Pastikan konteksnya menjawab pertanyaan.',
      },
      {
        id: 'inference-vocabulary',
        title: 'Inferensi dan kosakata konteks',
        duration: '9 menit',
        objective: 'Menyimpulkan informasi tersirat dan menebak arti kata dari konteks.',
        sections: [
          { heading: 'Simpulkan tanpa menambah asumsi', body: 'Jawaban inferensi harus didukung petunjuk pada passage. Hindari pilihan yang mungkin benar di dunia nyata tetapi tidak didukung teks.' },
          { heading: 'Gunakan petunjuk sekitar kata', body: 'Periksa kalimat sebelum dan sesudah kata sulit. Cari definisi, contoh, kontras, atau hubungan sebab akibat yang membantu menjelaskan artinya.' },
        ],
        check: 'Untuk soal “the word X is closest in meaning to”, uji pilihan kata pada kalimat asli. Pilih yang menjaga makna kalimat.',
      },
    ],
  },
  {
    id: 'listening',
    title: 'Listening Comprehension',
    label: 'Listening',
    icon: '🎧',
    color: 'violet',
    description: 'Latih fokus pada tujuan percakapan, detail penting, dan maksud pembicara.',
    lessons: [
      {
        id: 'predict-context',
        title: 'Memprediksi konteks percakapan',
        duration: '7 menit',
        objective: 'Menggunakan situasi dan pembicara untuk memperkirakan arah percakapan.',
        sections: [
          { heading: 'Dengarkan situasinya', body: 'Perhatikan siapa yang berbicara dan di mana percakapan mungkin terjadi. Hubungan pembicara membantu mempersempit kemungkinan jawaban.' },
          { heading: 'Gunakan jeda untuk bersiap', body: 'Sebelum audio dimulai, baca pilihan jika tersedia. Catat perbedaan makna antarpilihan, bukan membaca semuanya berulang kali.' },
        ],
        check: 'Pada percakapan pendek, pertanyaan sering menanyakan masalah, rencana, atau tindakan pembicara berikutnya.',
      },
      {
        id: 'key-details',
        title: 'Menangkap detail penting',
        duration: '8 menit',
        objective: 'Mencatat informasi seperti alasan, waktu, tempat, dan perubahan rencana.',
        sections: [
          { heading: 'Dengarkan makna, bukan setiap kata', body: 'Jangan berhenti memahami percakapan hanya karena melewatkan satu kata. Fokus pada kata penanda seperti because, however, first, dan instead.' },
          { heading: 'Waspadai koreksi', body: 'Pembicara dapat mengubah informasi: “Let’s meet at two—actually, make that three.” Jawaban biasanya mengikuti keputusan terakhir.' },
        ],
        check: 'Untuk pertanyaan detail, ingat hubungan antar informasi. Alasan sering muncul setelah because atau dituturkan dengan parafrasa.',
      },
      {
        id: 'purpose-attitude',
        title: 'Tujuan dan sikap pembicara',
        duration: '8 menit',
        objective: 'Mengenali maksud, opini, dan nada pembicara dari pilihan kata serta intonasi.',
        sections: [
          { heading: 'Bedakan ucapan dan maksud', body: 'Ungkapan seperti “That’s just great” dapat terdengar positif, tetapi intonasi dan konteksnya bisa menunjukkan sarkasme atau kekecewaan.' },
          { heading: 'Cari petunjuk sikap', body: 'Perhatikan kata evaluatif, penekanan suara, keraguan, dan respons lawan bicara untuk memahami sikap pembicara.' },
        ],
        check: 'Jika ditanya “what does the speaker imply?”, pilih maksud yang paling didukung konteks, bukan arti harfiah satu kalimat.',
      },
    ],
  },
  {
    id: 'structure',
    title: 'Structure / Written Expression',
    label: 'Structure',
    icon: '✍️',
    color: 'teal',
    description: 'Pahami pola kalimat, kecocokan subject–verb, dan cara menemukan kesalahan grammar.',
    lessons: [
      {
        id: 'sentence-patterns',
        title: 'Pola dasar kalimat',
        duration: '8 menit',
        objective: 'Menemukan subjek dan kata kerja utama dalam kalimat akademik.',
        sections: [
          { heading: 'Cari inti kalimat', body: 'Tentukan subjek dan kata kerja utama sebelum memeriksa frasa tambahan. Prepositional phrase dan klausa sisipan tidak mengubah inti kalimat.' },
          { heading: 'Kenali klausa lengkap', body: 'Klausa independen memiliki subjek dan kata kerja serta dapat berdiri sebagai kalimat. Klausa dependent memerlukan klausa utama.' },
        ],
        check: 'Ketika pilihan jawaban berbeda bentuk, periksa bagian yang hilang: subjek, kata kerja, penghubung, atau klausa.',
      },
      {
        id: 'subject-verb-agreement',
        title: 'Subject–verb agreement',
        duration: '7 menit',
        objective: 'Mencocokkan kata kerja dengan subjek utama, termasuk subjek yang dipisahkan frasa panjang.',
        sections: [
          { heading: 'Jangan terkecoh kata di tengah', body: 'Pada “The list of required courses is long”, subjeknya list, bukan courses. Abaikan frasa preposisi ketika mencocokkan subjek dan kata kerja.' },
          { heading: 'Periksa jumlah dan waktu', body: 'Tentukan apakah subjek tunggal atau jamak, lalu cocokkan bentuk kata kerja dan konsistensi waktu kalimat.' },
        ],
        check: 'Tutup sementara frasa di antara subjek dan kata kerja. Baca kembali inti kalimat untuk memeriksa kecocokannya.',
      },
      {
        id: 'error-identification',
        title: 'Menemukan kesalahan kalimat',
        duration: '9 menit',
        objective: 'Memeriksa bagian bergaris bawah secara sistematis tanpa mengubah makna yang benar.',
        sections: [
          { heading: 'Periksa kategori satu per satu', body: 'Cek subject–verb, bentuk kata, agreement, parallel structure, pronoun, connector, dan modifier. Pemeriksaan berurutan mengurangi tebakan.' },
          { heading: 'Uji seluruh kalimat', body: 'Setelah menemukan kandidat kesalahan, baca seluruh kalimat. Pastikan perbaikan sesuai grammar dan maknanya.' },
        ],
        check: 'Jangan menganggap kalimat harus memiliki kesalahan. Jika semua bagian benar, pilih opsi “No error” bila tersedia.',
      },
    ],
  },
]

export function getLearningPath(skillId) {
  return learningPaths.find(path => path.id === skillId) ?? null
}
