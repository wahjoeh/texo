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
    <div class="auth-layout">
      <aside class="auth-showcase">
        <div class="auth-brand"><span class="auth-brand-mark">T</span><span>TEP <b>Practice</b></span></div>
        <div class="auth-showcase-copy">
          <span class="auth-showcase-kicker"><i /> TOEFL ITP PREPARATION</span>
          <h2>Belajar terarah.<br>Melangkah lebih yakin.</h2>
          <p>Latih setiap skill, ikuti perkembanganmu, dan siapkan diri untuk skor TOEFL yang lebih baik.</p>
        </div>
        <div class="auth-skill-grid" aria-hidden="true">
          <div><span>🎧</span><b>Listening</b></div>
          <div><span>✍️</span><b>Structure</b></div>
          <div><span>📖</span><b>Reading</b></div>
          <div><span>🏆</span><b>Full Test</b></div>
        </div>
        <div class="auth-showcase-foot"><span class="auth-foot-dot" /> Progres belajarmu tersimpan di satu tempat</div>
        <span class="auth-orbit auth-orbit-one" /><span class="auth-orbit auth-orbit-two" />
      </aside>

      <section class="auth-card">
        <div class="auth-card-heading">
          <div class="auth-mark">T</div>
          <div><p class="auth-eyebrow">AKUN TEP PRACTICE</p><h1>{{ isSignup ? 'Buat akun' : 'Selamat datang kembali' }}</h1></div>
        </div>
        <p class="auth-intro">{{ isSignup ? 'Daftar dengan email aktif untuk verifikasi akun.' : 'Masuk dengan email atau username.' }}</p>

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
      <p class="auth-privacy">Dengan melanjutkan, akunmu akan digunakan untuk menyimpan skor dan progres belajar.</p>
      </section>
    </div>
  </main>
</template>

<style>
.auth-page{min-height:100vh;display:grid;place-items:center;overflow:hidden;padding:34px clamp(16px,5vw,64px);background:radial-gradient(ellipse at 4% 7%,#e3ebff 0,transparent 28rem),radial-gradient(ellipse at 96% 87%,#dff4ed 0,transparent 27rem),#f4f7fb;font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;color:#172b4d}.auth-layout{width:min(1060px,100%);display:grid;grid-template-columns:minmax(0,1fr) minmax(390px,.83fr);align-items:stretch;border:1px solid #e1e8f2;border-radius:30px;background:#fff;box-shadow:0 28px 80px #192f501f}.auth-showcase{position:relative;isolation:isolate;display:flex;min-height:650px;flex-direction:column;overflow:hidden;padding:38px 42px;border-radius:29px 0 0 29px;background:linear-gradient(145deg,#15377f 0%,#2452b4 55%,#3f72d5 100%);color:#fff}.auth-brand{position:relative;z-index:1;display:flex;align-items:center;gap:11px;color:#fff;font-size:16px;font-weight:800;letter-spacing:-.03em}.auth-brand b{color:#d1def8;font-weight:500}.auth-brand-mark{width:39px;height:39px;display:grid;place-items:center;border:1px solid #ffffff42;border-radius:13px;background:#ffffff20;box-shadow:inset 0 1px #ffffff35;font-size:20px}.auth-showcase-copy{position:relative;z-index:1;margin:auto 0 29px}.auth-showcase-kicker{display:flex;align-items:center;gap:8px;color:#ccdcff;font-size:10px;font-weight:800;letter-spacing:.15em}.auth-showcase-kicker i,.auth-foot-dot{width:7px;height:7px;border-radius:50%;background:#7be0ba;box-shadow:0 0 0 4px #7be0ba25}.auth-showcase-copy h2{margin:18px 0 12px;color:#fff;font-size:clamp(32px,4vw,44px);line-height:1.14;letter-spacing:-.05em}.auth-showcase-copy p{max-width:405px;margin:0;color:#d4e1fb;font-size:13px;line-height:1.85}.auth-skill-grid{position:relative;z-index:1;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.auth-skill-grid div{display:flex;align-items:center;gap:10px;padding:12px;border:1px solid #ffffff28;border-radius:12px;background:#ffffff12;backdrop-filter:blur(8px)}.auth-skill-grid span{font-size:17px}.auth-skill-grid b{color:#f6f8ff;font-size:11px}.auth-showcase-foot{position:relative;z-index:1;display:flex;align-items:center;gap:9px;margin-top:22px;color:#cfddf7;font-size:10px}.auth-foot-dot{width:6px;height:6px}.auth-orbit{position:absolute;z-index:-1;border:1px solid #ffffff15;border-radius:50%;pointer-events:none}.auth-orbit-one{top:80px;right:-125px;width:330px;height:330px;box-shadow:0 0 0 25px #ffffff06,0 0 0 50px #ffffff05}.auth-orbit-two{top:175px;right:80px;width:150px;height:150px;background:#8bb1ff12}.auth-card{width:100%;align-self:center;padding:42px 38px;border:0;border-radius:0 29px 29px 0;background:linear-gradient(155deg,#fff,#fcfdff);box-shadow:none}.auth-card-heading{display:flex;align-items:center;gap:13px}.auth-mark{width:48px;height:48px;display:grid;place-items:center;flex:0 0 auto;border:1px solid #cbd9f4;border-radius:15px;background:linear-gradient(145deg,#386bd2,#2349aa);color:white;font-weight:800;font-size:23px;box-shadow:0 7px 16px #2349aa30}.auth-eyebrow{margin:0 0 5px;color:#6480b4;font-size:9px;font-weight:800;letter-spacing:.14em}.auth-card h1{margin:0;color:#192d4d;font-size:clamp(22px,2.4vw,28px);line-height:1.2;letter-spacing:-.04em}.auth-intro{margin:18px 0 24px;color:#6e7e95;font-size:12px;line-height:1.6}.auth-card form{display:grid;gap:8px}.auth-card label{margin-top:8px;color:#354762;font-size:11px;font-weight:700}.auth-card input{width:100%;box-sizing:border-box;padding:13px 14px;border:1px solid #dce4ef;border-radius:11px;background:#fbfcfe;color:#243750;font:inherit;font-size:12px;outline:none;transition:border-color .18s,box-shadow .18s,background .18s}.auth-card input::placeholder{color:#a0aabc}.auth-card input:focus{border-color:#6487d0;background:#fff;box-shadow:0 0 0 4px #4775c21a}.auth-submit{margin-top:14px;padding:13px 15px;border:1px solid #3158b8;border-radius:11px;background:linear-gradient(110deg,#3e70d7,#244ba8);color:white;font:inherit;font-size:12px;font-weight:800;box-shadow:0 7px 16px #315bbd2c;cursor:pointer;transition:transform .18s,box-shadow .18s,filter .18s}.auth-submit:hover:not(:disabled){transform:translateY(-1px);filter:brightness(1.05);box-shadow:0 10px 20px #315bbd38}.auth-submit:disabled{opacity:.55;cursor:not-allowed}.auth-switch{text-align:center;margin:19px 0 0;color:#6c7b90;font-size:11px}.auth-switch button{padding:3px 5px;border:0;border-radius:5px;background:none;color:#315bbd;font:inherit;font-weight:800;cursor:pointer}.auth-switch button:hover{background:#eff4ff}.auth-notice,.auth-error,.auth-success{padding:11px 12px;border:1px solid transparent;border-radius:11px;font-size:11px;line-height:1.6}.auth-notice{border-color:#dfe7f1;background:#f4f7fb;color:#52647c}.auth-error{border-color:#f1d7dc;background:#fff4f5;color:#a93345}.auth-success{border-color:#cfead9;background:#effaf3;color:#24764d}.auth-notice code{font-size:10px}.auth-privacy{margin:17px 0 0;color:#9aa5b5;font-size:9px;line-height:1.6;text-align:center}.auth-card input:focus-visible,.auth-submit:focus-visible,.auth-switch button:focus-visible{outline:3px solid #91aff0;outline-offset:2px}
@media(max-width:850px){.auth-page{padding:20px}.auth-layout{max-width:520px;grid-template-columns:1fr;border-radius:24px}.auth-showcase{min-height:0;padding:25px 28px;border-radius:23px 23px 0 0}.auth-showcase-copy{margin:30px 0 19px}.auth-showcase-copy h2{font-size:30px}.auth-showcase-copy p{font-size:11px}.auth-skill-grid{grid-template-columns:repeat(4,minmax(0,1fr));gap:7px}.auth-skill-grid div{flex-direction:column;gap:5px;padding:9px 4px;text-align:center}.auth-skill-grid b{font-size:9px}.auth-showcase-foot{margin-top:14px}.auth-card{padding:30px 32px;border-radius:0 0 23px 23px}}
@media(max-width:480px){.auth-page{place-items:start center;padding:12px}.auth-layout{border-radius:19px}.auth-showcase{padding:20px 20px 18px;border-radius:18px 18px 0 0}.auth-brand{font-size:14px}.auth-brand-mark{width:34px;height:34px}.auth-showcase-copy{margin:23px 0 15px}.auth-showcase-copy h2{margin:12px 0 7px;font-size:25px}.auth-showcase-copy p{font-size:10px;line-height:1.65}.auth-showcase-kicker{font-size:8px}.auth-skill-grid{gap:5px}.auth-skill-grid div{border-radius:9px;padding:7px 2px}.auth-skill-grid span{font-size:15px}.auth-skill-grid b{font-size:8px}.auth-showcase-foot{font-size:9px}.auth-card{padding:25px 21px 23px}.auth-card h1{font-size:23px}.auth-intro{margin:14px 0 19px}}
</style>
