# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about IDE Support for Vue in the [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support).
# Supabase Auth

1. Buat proyek di [Supabase](https://supabase.com/) dan buka **Project Settings → API**.
2. Salin Project URL dan publishable/anon key ke file `.env` pada root proyek (gunakan `.env.example` sebagai format):

   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

3. Di Supabase, buka **Authentication → URL Configuration** dan atur Site URL ke URL aplikasi, misalnya `http://localhost:5173` saat pengembangan. Tambahkan juga URL produksi ke daftar Redirect URLs.
4. Jalankan `npm run dev`. Pengunjung bisa mendaftar menggunakan email dan kata sandi pada halaman login. Jika konfirmasi email aktif, pengguna perlu mengonfirmasi email sebelum masuk.

Semua halaman latihan memerlukan sesi Supabase yang valid. Key yang digunakan di aplikasi adalah publishable/anon key; jangan pernah memasukkan `service_role` key ke aplikasi browser.
