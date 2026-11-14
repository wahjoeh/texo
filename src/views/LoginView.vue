<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

const router = useRouter()
const mode = ref('login')
const email = ref('')
const password = ref('')
const loading = ref(false)
const message = ref('')
const error = ref('')
const isSignup = computed(() => mode.value === 'signup')

async function submit() {
  message.value = ''
  error.value = ''
  if (!isSupabaseConfigured) {
    error.value = 'Supabase belum dikonfigurasi. Isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY.'
    return
  }

  loading.value = true
  try {
    const result = isSignup.value
      ? await supabase.auth.signUp({ email: email.value, password: password.value })
      : await supabase.auth.signInWithPassword({ email: email.value, password: password.value })
    if (result.error) throw result.error

    if (isSignup.value && !result.data.session) {
      message.value = 'Akun berhasil dibuat. Periksa email untuk mengonfirmasi akun, lalu masuk.'
      mode.value = 'login'
    } else {
      const redirect = router.currentRoute.value.query.redirect
      await router.replace(typeof redirect === 'string' ? redirect : '/')
    }
  } catch (err) {
    error.value = err.message || 'Tidak dapat memproses permintaan. Coba lagi.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="auth-page">
    <section class="auth-card">
      <div class="auth-mark">T</div>
      <p class="auth-eyebrow">TOEFL ITP SIMULATION</p>
      <h1>{{ isSignup ? 'Buat akun' : 'Selamat datang kembali' }}</h1>
      <p class="auth-intro">{{ isSignup ? 'Daftar untuk mulai berlatih.' : 'Masuk untuk melanjutkan latihanmu.' }}</p>

      <div v-if="!isSupabaseConfigured" class="auth-notice" role="status">
        Hubungkan proyek Supabase terlebih dahulu dengan mengisi <code>.env</code>. Lihat <code>.env.example</code>.
      </div>
      <p v-if="message" class="auth-success" role="status">{{ message }}</p>
      <p v-if="error" class="auth-error" role="alert">{{ error }}</p>

      <form @submit.prevent="submit">
        <label for="email">Email</label>
        <input id="email" v-model.trim="email" type="email" autocomplete="email" placeholder="nama@email.com" required>
        <label for="password">Kata sandi</label>
        <input id="password" v-model="password" type="password" :autocomplete="isSignup ? 'new-password' : 'current-password'" minlength="6" placeholder="Minimal 6 karakter" required>
        <button class="auth-submit" type="submit" :disabled="loading || !isSupabaseConfigured">
          {{ loading ? 'Memproses…' : isSignup ? 'Buat akun' : 'Masuk' }}
        </button>
      </form>

      <p class="auth-switch">
        {{ isSignup ? 'Sudah punya akun?' : 'Belum punya akun?' }}
        <button type="button" @click="mode = isSignup ? 'login' : 'signup'; message = ''; error = ''">
          {{ isSignup ? 'Masuk' : 'Daftar' }}
        </button>
      </p>
    </section>
  </main>
</template>

<style>
.auth-page{min-height:100vh;display:grid;place-items:center;padding:24px;background:linear-gradient(145deg,#f1f5ff,#f8fafc 50%,#e8f7f3);font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;color:#172033}.auth-card{width:min(100%,430px);padding:42px;background:white;border:1px solid #e5eaf2;border-radius:24px;box-shadow:0 24px 70px #18284816}.auth-mark{width:44px;height:44px;display:grid;place-items:center;border-radius:14px;background:#1e40af;color:white;font-weight:800;font-size:22px}.auth-eyebrow{margin:24px 0 8px;color:#53688e;font-size:11px;font-weight:800;letter-spacing:.14em}.auth-card h1{margin:0;font-size:28px;letter-spacing:-.04em}.auth-intro{margin:9px 0 26px;color:#64748b}.auth-card form{display:grid;gap:9px}.auth-card label{margin-top:9px;font-size:13px;font-weight:700}.auth-card input{width:100%;box-sizing:border-box;padding:13px 14px;border:1px solid #d8dfeb;border-radius:10px;font:inherit;outline:none}.auth-card input:focus{border-color:#3157b7;box-shadow:0 0 0 3px #3157b71c}.auth-submit{margin-top:14px;padding:13px;border:0;border-radius:10px;background:#2349aa;color:white;font:inherit;font-weight:700;cursor:pointer}.auth-submit:disabled{opacity:.5;cursor:not-allowed}.auth-switch{text-align:center;margin:22px 0 0;color:#64748b;font-size:14px}.auth-switch button{border:0;background:none;color:#2349aa;font:inherit;font-weight:700;cursor:pointer}.auth-notice,.auth-error,.auth-success{padding:12px;border-radius:10px;font-size:13px;line-height:1.5}.auth-notice{background:#f1f5f9;color:#475569}.auth-error{background:#fff1f2;color:#be123c}.auth-success{background:#ecfdf5;color:#047857}.auth-notice code{font-size:12px}@media(max-width:480px){.auth-card{padding:30px 24px}}
</style>
