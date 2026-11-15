<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

const router = useRouter()
const mode = ref('login')
const email = ref('')
const identifier = ref('')
const username = ref('')
const password = ref('')
const loading = ref(false)
const message = ref('')
const error = ref('')
const isSignup = computed(() => mode.value === 'signup')

async function submit() {
  message.value = ''
  error.value = ''
  if (!isSupabaseConfigured) {
    error.value = 'Supabase belum dikonfigurasi. Periksa variabel di file .env.'
    return
  }

  loading.value = true
  try {
    if (isSignup.value) {
      const { data, error: signupError } = await supabase.auth.signUp({
        email: email.value.trim(),
        password: password.value,
        options: {
          data: { username: username.value.trim().toLowerCase() },
          emailRedirectTo: window.location.origin,
        },
      })
      if (signupError) throw signupError

      if (data.session) {
        const redirect = router.currentRoute.value.query.redirect
        await router.replace(typeof redirect === 'string' ? redirect : '/')
      } else {
        message.value = 'Akun dibuat. Buka tautan verifikasi yang kami kirim ke email Anda, lalu masuk.'
        mode.value = 'login'
        identifier.value = email.value.trim()
        password.value = ''
      }
    } else {
      const { data, error: invokeError } = await supabase.functions.invoke('username-auth', {
        body: { action: 'login', identifier: identifier.value.trim(), password: password.value },
      })
      if (invokeError) throw invokeError
      if (data?.error) throw new Error(data.error)
      if (!data?.session?.access_token || !data?.session?.refresh_token) {
        throw new Error('Layanan autentikasi belum siap. Coba lagi nanti.')
      }

      const { error: sessionError } = await supabase.auth.setSession(data.session)
      if (sessionError) throw sessionError
      const redirect = router.currentRoute.value.query.redirect
      await router.replace(typeof redirect === 'string' ? redirect : '/')
    }
  } catch (err) {
    error.value = err.name === 'FunctionsHttpError'
      ? (isSignup.value ? 'Pendaftaran gagal. Periksa email dan pastikan username belum digunakan.' : 'Tidak dapat masuk. Periksa email/username dan kata sandi, atau verifikasi email terlebih dahulu.')
      : (err.message || 'Tidak dapat memproses permintaan. Coba lagi.')
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
      <p class="auth-intro">{{ isSignup ? 'Buat akun dengan email terverifikasi.' : 'Masuk dengan email atau username.' }}</p>

      <div v-if="!isSupabaseConfigured" class="auth-notice" role="status">
        Hubungkan proyek Supabase terlebih dahulu dengan mengisi <code>.env</code>. Lihat <code>.env.example</code>.
      </div>
      <p v-if="message" class="auth-success" role="status">{{ message }}</p>
      <p v-if="error" class="auth-error" role="alert">{{ error }}</p>

      <form @submit.prevent="submit">
        <template v-if="isSignup">
          <label for="email">Email</label>
          <input id="email" v-model.trim="email" type="email" autocomplete="email" placeholder="nama@email.com" required>
          <label for="username">Username</label>
          <input id="username" v-model.trim="username" type="text" autocomplete="username" minlength="3" maxlength="24" pattern="[A-Za-z0-9_]+" placeholder="3–24 huruf, angka, atau _" required>
        </template>
        <template v-else>
          <label for="identifier">Email atau username</label>
          <input id="identifier" v-model.trim="identifier" type="text" autocomplete="username" placeholder="Email atau username" required>
        </template>
        <label for="password">Kata sandi</label>
        <input id="password" v-model="password" type="password" :autocomplete="isSignup ? 'new-password' : 'current-password'" minlength="8" placeholder="Minimal 8 karakter" required>
        <button class="auth-submit" type="submit" :disabled="loading || !isSupabaseConfigured">
          {{ loading ? 'Memproses…' : isSignup ? 'Daftar' : 'Masuk' }}
        </button>
      </form>

      <p class="auth-switch">
        {{ isSignup ? 'Sudah punya akun?' : 'Belum punya akun?' }}
        <button type="button" @click="mode = isSignup ? 'login' : 'signup'; error = ''; message = ''">
          {{ isSignup ? 'Masuk' : 'Daftar' }}
        </button>
      </p>
    </section>
  </main>
</template>

<style>
.auth-page{min-height:100vh;display:grid;place-items:center;padding:24px;background:linear-gradient(145deg,#f1f5ff,#f8fafc 50%,#e8f7f3);font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;color:#172033}.auth-card{width:min(100%,430px);padding:42px;background:white;border:1px solid #e5eaf2;border-radius:24px;box-shadow:0 24px 70px #18284816}.auth-mark{width:44px;height:44px;display:grid;place-items:center;border-radius:14px;background:#1e40af;color:white;font-weight:800;font-size:22px}.auth-eyebrow{margin:24px 0 8px;color:#53688e;font-size:11px;font-weight:800;letter-spacing:.14em}.auth-card h1{margin:0;font-size:28px;letter-spacing:-.04em}.auth-intro{margin:9px 0 26px;color:#64748b}.auth-card form{display:grid;gap:9px}.auth-card label{margin-top:9px;font-size:13px;font-weight:700}.auth-card input{width:100%;box-sizing:border-box;padding:13px 14px;border:1px solid #d8dfeb;border-radius:10px;font:inherit;outline:none}.auth-card input:focus{border-color:#3157b7;box-shadow:0 0 0 3px #3157b71c}.auth-submit{margin-top:14px;padding:13px;border:0;border-radius:10px;background:#2349aa;color:white;font:inherit;font-weight:700;cursor:pointer}.auth-submit:disabled{opacity:.5;cursor:not-allowed}.auth-switch{text-align:center;margin:22px 0 0;color:#64748b;font-size:14px}.auth-switch button{border:0;background:none;color:#2349aa;font:inherit;font-weight:700;cursor:pointer}.auth-notice,.auth-error{padding:12px;border-radius:10px;font-size:13px;line-height:1.5}.auth-notice{background:#f1f5f9;color:#475569}.auth-error{background:#fff1f2;color:#be123c}.auth-notice code{font-size:12px}@media(max-width:480px){.auth-card{padding:30px 24px}}
.auth-success{padding:12px;border-radius:10px;background:#ecfdf5;color:#047857;font-size:13px;line-height:1.5}
</style>
