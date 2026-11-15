# TOEFL ITP Simulation

## Supabase Auth

Pendaftaran meminta email, username, dan kata sandi. Supabase mengirim tautan verifikasi email; setelah verifikasi, pengguna dapat masuk menggunakan email atau username. Edge Function `username-auth` menerjemahkan username ke akun Supabase Auth. Trigger database menyimpan username unik untuk akun baru. Akun username-only lama tetap bisa masuk memakai username.

### Konfigurasi lokal

1. Atur `.env` di root proyek menggunakan `.env.example`:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
   ```

2. Instal Supabase CLI dan autentikasi, lalu hubungkan proyek:

   ```sh
   supabase login
   supabase link --project-ref YOUR_PROJECT_REF
   ```

3. Jalankan migrasi tabel username dan trigger pendaftaran, lalu deploy fungsi login:

   ```sh
   supabase db push --remote
   supabase functions deploy username-auth --no-verify-jwt
   ```

   Fungsi ini menerima permintaan login tanpa sesi sebelumnya, jadi deploy harus menggunakan `--no-verify-jwt`. Fungsi tetap melakukan autentikasi kata sandi melalui Supabase Auth.

4. Pastikan secret server `SUPABASE_SERVICE_ROLE_KEY` tersedia untuk Edge Function (Supabase biasanya menyediakannya otomatis). Secret ini hanya untuk server dan jangan pernah menaruhnya di `.env` frontend atau mengirimkannya ke browser. Runtime Supabase juga menyediakan `SUPABASE_URL` dan `SUPABASE_ANON_KEY` untuk fungsi.
5. Konfirmasi email sudah diaktifkan pada proyek TEXO. Atur Site URL dan Redirect URLs agar tautan verifikasi kembali ke domain website Anda. Supabase memerlukan SMTP khusus untuk mengirim email kepada pengguna umum; layanan email bawaan dibatasi untuk uji coba.
6. Jalankan ulang aplikasi dengan `npm run dev`. Username 3–24 karakter (huruf, angka, garis bawah) dan kata sandi minimal 8 karakter.

Semua halaman latihan memerlukan sesi Supabase yang valid. Gunakan fitur reset kata sandi Supabase jika ingin menambahkan alur pemulihan akun.

Riwayat setiap percobaan disimpan di `user_test_attempts`. Tabel `user_progress` merangkum jumlah tes, skor terbaik, rata-rata, dan jumlah jawaban benar per bagian. `user_latest_scores` menyimpan hasil terbaru. RLS membatasi riwayat dan ringkasan ke pemilik akun; trigger database memperbarui ringkasan saat hasil tes baru tersimpan. Hasil terbaru yang sudah ada sebelum riwayat dibuat dipertahankan sebagai satu catatan awal per jenis tes.

Ranking bulanan menampilkan 10 skor Full Test tertinggi dan mengisi slot yang kosong dengan skor simulasi bernama Indonesia. Nama/skor simulasi disimpan sekali per bulan, bukan akun Auth sungguhan, dan leaderboard menjelaskannya agar tidak disangka hasil pengguna nyata.

Pengguna dapat mengubah nama dan username melalui menu **Atur Profil**. Username diperiksa keunikannya oleh Edge Function; kata sandi baru memerlukan konfirmasi kata sandi saat ini.

Rank Full Test: Bronze 1 (0–329), Bronze 2 (330–359), Bronze 3 (360–399); Silver 1 (400–419), Silver 2 (420–439), Silver 3 (440–459); Gold 1 (460–472), Gold 2 (473–486), Gold 3 (487–499); Diamond 1 (500–519), Diamond 2 (520–539), Diamond 3 (540–559); Platinum 1 (560–579), Platinum 2 (580–599), Platinum 3 (600–619); Master 1 (620–632), Master 2 (633–646), Master 3 (647–659); Grandmaster 1 (660–679), Grandmaster 2 (680–699), Grandmaster 3 (700+).

Fitur **Belajar** tersedia di `/learn` dengan learning path Reading, Listening, dan Structure. Penyelesaian materi disimpan per pengguna di `user_learning_progress` dengan RLS. Bank soal contoh tersimpan di `learning_lessons` dan `learning_questions`; jawaban terbaru dan jumlah percobaan tersimpan per pengguna di `user_learning_answers`. Kunci jawaban diperiksa oleh fungsi `submit_learning_answer`, tidak dikirim bersama soal ke browser. Terapkan migrasi `supabase/migrations/20261114090000_user_learning_progress.sql` dan `supabase/migrations/20261114100000_seed_learning_questions.sql` ke proyek Supabase (`supabase db push --remote`) sebelum menggunakan progres dan contoh soal.

