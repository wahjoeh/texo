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
          { heading: 'Mulai dari gambaran besar', body: 'Baca kalimat pertama dan terakhir paragraf untuk menangkap topiknya. Lalu tanyakan: apa yang ingin disampaikan penulis tentang topik tersebut? Topik biasanya berupa kata atau frasa, sedangkan ide utama adalah pernyataan lengkap tentang topik itu. Kalimat topik sering berada di awal paragraf, tetapi paragraf akademik juga dapat menyampaikan kesimpulan utama di bagian akhir.' },
          { heading: 'Kenali parafrasa dan cakupan', body: 'Jawaban TOEFL sering menyatakan ide yang sama dengan kata berbeda. Cocokkan maknanya, bukan kata yang persis sama. Pilihan yang terlalu luas biasanya menambahkan hal yang tidak dibahas; pilihan yang terlalu sempit hanya mengulang satu contoh. Cari jawaban yang mencakup sebagian besar paragraf tanpa menambah klaim baru.' },
        ],
        check: 'Jika sebuah pilihan hanya menyebut satu contoh atau angka, biasanya pilihan itu adalah detail, bukan ide utama.',
      },
      {
        id: 'scanning-details',
        title: 'Mencari detail dengan cepat',
        duration: '7 menit',
        objective: 'Menemukan fakta spesifik tanpa membaca ulang seluruh passage.',
        sections: [
          { heading: 'Tandai kata kunci', body: 'Sebelum mencari jawaban, tandai nama, tanggal, istilah, atau kata unik pada pertanyaan. Pindai passage untuk kata yang sama atau bentuknya, lalu periksa sinonim dan parafrasa. Angka, nama diri, dan istilah teknis biasanya lebih mudah ditemukan daripada kata umum.' },
          { heading: 'Baca konteks di sekitarnya', body: 'Setelah menemukan kata kunci, baca satu atau dua kalimat di sekitarnya. Periksa kata ganti seperti it, they, dan this untuk mengetahui rujukannya. Detail penting sering diparafrasekan dan tidak selalu memakai kata yang sama; jangan memilih jawaban hanya karena ada kecocokan kosakata.' },
        ],
        check: 'Jangan memilih jawaban hanya karena kata yang sama muncul di passage. Pastikan konteksnya menjawab pertanyaan.',
      },
      {
        id: 'inference-vocabulary',
        title: 'Inferensi dan kosakata konteks',
        duration: '9 menit',
        objective: 'Menyimpulkan informasi tersirat dan menebak arti kata dari konteks.',
        sections: [
          { heading: 'Simpulkan tanpa menambah asumsi', body: 'Jawaban inferensi harus didukung petunjuk pada passage. Gabungkan satu atau dua petunjuk teks untuk menarik kesimpulan yang masuk akal, tetapi jangan menambahkan pengetahuan luar. Hindari pilihan yang mungkin benar di dunia nyata namun tidak didukung bacaan.' },
          { heading: 'Gunakan petunjuk sekitar kata', body: 'Periksa kalimat sebelum dan sesudah kata sulit. Cari definisi, contoh, kontras seperti although atau unlike, dan hubungan sebab akibat. Perhatikan juga kelas katanya: kata benda, kata kerja, dan kata sifat tidak dapat saling menggantikan begitu saja. Uji pilihan dalam kalimat asli untuk melihat apakah maknanya tetap masuk akal.' },
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
          { heading: 'Dengarkan situasinya', body: 'Perhatikan siapa yang berbicara, hubungan mereka, dan di mana percakapan mungkin terjadi. Mahasiswa dan petugas perpustakaan, misalnya, mungkin membicarakan peminjaman atau fasilitas. Situasi membantu mempersempit prediksi, tetapi tetap dengarkan bukti sebelum memilih jawaban.' },
          { heading: 'Gunakan jeda untuk bersiap', body: 'Sebelum audio dimulai, baca pilihan jika tersedia. Catat perbedaan makna antarpilihan dan prediksi apakah soal menanyakan tempat, masalah, alasan, atau tindakan berikutnya. Jangan membaca semua pilihan berulang kali karena waktu persiapan terbatas.' },
        ],
        check: 'Pada percakapan pendek, pertanyaan sering menanyakan masalah, rencana, atau tindakan pembicara berikutnya.',
      },
      {
        id: 'key-details',
        title: 'Menangkap detail penting',
        duration: '8 menit',
        objective: 'Mencatat informasi seperti alasan, waktu, tempat, dan perubahan rencana.',
        sections: [
          { heading: 'Dengarkan makna, bukan setiap kata', body: 'Jangan berhenti memahami percakapan hanya karena melewatkan satu kata. Fokus pada penanda seperti because, however, first, dan instead. Catat inti informasi secara singkat—misalnya alasan, waktu, tempat—alih-alih mencoba menulis seluruh kalimat.' },
          { heading: 'Waspadai koreksi dan perubahan', body: 'Pembicara dapat mengubah informasi: “Let’s meet at two—actually, make that three.” Rencana terakhir biasanya yang berlaku. Kata but, actually, rather, dan instead sering mengisyaratkan koreksi atau kontras yang menjadi inti soal.' },
        ],
        check: 'Untuk pertanyaan detail, ingat hubungan antar informasi. Alasan sering muncul setelah because atau dituturkan dengan parafrasa.',
      },
      {
        id: 'purpose-attitude',
        title: 'Tujuan dan sikap pembicara',
        duration: '8 menit',
        objective: 'Mengenali maksud, opini, dan nada pembicara dari pilihan kata serta intonasi.',
        sections: [
          { heading: 'Bedakan ucapan dan maksud', body: 'Ungkapan seperti “That’s just great” dapat terdengar positif, tetapi intonasi dan konteksnya bisa menunjukkan sarkasme atau kekecewaan. Untuk soal imply, tujuan, atau attitude, cari maksud di balik ucapan, bukan hanya arti kamusnya.' },
          { heading: 'Cari petunjuk sikap', body: 'Perhatikan kata evaluatif, penekanan suara, keraguan, dan respons lawan bicara. Nada ragu, misalnya, dapat menunjukkan ketidaksetujuan yang disampaikan dengan sopan. Pilih tingkat emosi yang paling sesuai bukti—jangan menyimpulkan pembicara sangat marah jika percakapan hanya menunjukkan sedikit keberatan.' },
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
          { heading: 'Cari inti kalimat', body: 'Tentukan subjek dan kata kerja utama sebelum memeriksa frasa tambahan. Prepositional phrase dan klausa sisipan tidak mengubah inti kalimat. Coba tutup bagian di antara subjek dan kata kerja, lalu baca inti kalimatnya saja. Cara ini membantu menemukan bagian yang hilang atau kata kerja yang tidak cocok.' },
          { heading: 'Kenali klausa lengkap', body: 'Klausa independen memiliki subjek dan kata kerja serta dapat berdiri sebagai kalimat. Klausa dependent yang diawali because, although, atau when memerlukan klausa utama. Dalam soal isian, periksa apakah kalimat sudah memiliki subjek dan kata kerja sebelum memilih penghubung atau bentuk kata kerja.' },
        ],
        check: 'Ketika pilihan jawaban berbeda bentuk, periksa bagian yang hilang: subjek, kata kerja, penghubung, atau klausa.',
      },
      {
        id: 'subject-verb-agreement',
        title: 'Subject–verb agreement',
        duration: '7 menit',
        objective: 'Mencocokkan kata kerja dengan subjek utama, termasuk subjek yang dipisahkan frasa panjang.',
        sections: [
          { heading: 'Jangan terkecoh kata di tengah', body: 'Pada “The list of required courses is long”, subjeknya list, bukan courses. Abaikan frasa preposisi ketika mencocokkan subjek dan kata kerja. Trik cepat: tarik garis dari kata benda utama ke kata kerjanya agar kata benda dalam frasa tambahan tidak mengalihkan perhatian.' },
          { heading: 'Periksa jumlah dan waktu', body: 'Tentukan apakah subjek tunggal atau jamak, lalu cocokkan bentuk kata kerja dan konsistensi waktu kalimat. Waspadai pola “a number of” yang biasanya jamak dan “the number of” yang tunggal. Kata seperti each dan every juga umumnya memakai kata kerja tunggal.' },
        ],
        check: 'Tutup sementara frasa di antara subjek dan kata kerja. Baca kembali inti kalimat untuk memeriksa kecocokannya.',
      },
      {
        id: 'error-identification',
        title: 'Menemukan kesalahan kalimat',
        duration: '9 menit',
        objective: 'Memeriksa bagian bergaris bawah secara sistematis tanpa mengubah makna yang benar.',
        sections: [
          { heading: 'Periksa kategori satu per satu', body: 'Cek subject–verb, bentuk kata, agreement, parallel structure, pronoun, connector, dan modifier. Pemeriksaan berurutan mengurangi tebakan. Periksa juga artikel dan bentuk tunggal-jamak, terutama ketika kata benda dipisahkan dari bagian lain oleh frasa panjang.' },
          { heading: 'Uji seluruh kalimat', body: 'Setelah menemukan kandidat kesalahan, baca seluruh kalimat. Pastikan perbaikan sesuai grammar dan maknanya. Untuk parallel structure, bandingkan bentuk unsur yang dihubungkan oleh and, or, atau but. Jangan memilih bagian yang hanya terlihat asing; pastikan aturan tertentu memang dilanggar.' },
        ],
        check: 'Jangan menganggap kalimat harus memiliki kesalahan. Jika semua bagian benar, pilih opsi “No error” bila tersedia.',
      },
    ],
  },
]

export function getLearningPath(skillId) {
  return learningPaths.find(path => path.id === skillId) ?? null
}
