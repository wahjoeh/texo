<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabase'

const router = useRouter()
const user = ref(null)
const name = ref('')
const username = ref('')
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const loading = ref(true)
const savingProfile = ref(false)
const savingPassword = ref(false)
const profileMessage = ref('')
const profileError = ref('')
const passwordMessage = ref('')
const passwordError = ref('')

onMounted(async () => {
  if (!supabase) {
    await router.replace('/login')
    return
  }

  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) {
    await router.replace('/login')
    return
  }

  user.value = data.user
  name.value = data.user.user_metadata?.full_name || ''
  username.value = data.user.user_metadata?.username || ''
  loading.value = false
})

async function saveProfile() {
  profileError.value = ''
  profileMessage.value = ''
  const normalizedName = name.value.trim()
  const normalizedUsername = username.value.trim().toLowerCase()

  if (normalizedName.length < 2 || normalizedName.length > 60) {
    profileError.value = 'Nama harus terdiri dari 2–60 karakter.'
    return
  }
  if (!/^[a-z0-9_]{3,24}$/.test(normalizedUsername)) {
    profileError.value = 'Username harus 3–24 karakter, hanya huruf, angka, atau garis bawah.'
    return
  }
  if (!supabase || !user.value) return

  savingProfile.value = true
  try {
    const { error: nameError } = await supabase.auth.updateUser({
      data: { ...user.value.user_metadata, full_name: normalizedName },
    })
    if (nameError) throw nameError

    if (normalizedUsername !== user.value.user_metadata?.username) {
      const { data, error } = await supabase.functions.invoke('username-auth', {
        body: { action: 'update_username', username: normalizedUsername },
      })
      if (error) {
        if (error.name === 'FunctionsHttpError') {
          const responseError = await error.context?.json?.().catch(() => null)
          throw new Error(responseError?.error || 'Username tidak dapat diperbarui.')
        }
        throw error
      }
      if (data?.error) throw new Error(data.error)
    }

    const { data: refreshed, error: refreshError } = await supabase.auth.refreshSession()
    if (refreshError) throw refreshError
    user.value = refreshed.user
    name.value = refreshed.user.user_metadata?.full_name || normalizedName
    username.value = refreshed.user.user_metadata?.username || normalizedUsername
    profileMessage.value = 'Profil berhasil diperbarui.'
  } catch (error) {
    profileError.value = error.message || 'Profil tidak dapat diperbarui.'
  } finally {
    savingProfile.value = false
  }
}

async function changePassword() {
  passwordError.value = ''
  passwordMessage.value = ''

  if (!currentPassword.value) {
    passwordError.value = 'Masukkan kata sandi saat ini.'
    return
  }
  if (newPassword.value.length < 8 || newPassword.value.length > 72) {
    passwordError.value = 'Kata sandi baru harus 8–72 karakter.'
    return
  }
  if (newPassword.value !== confirmPassword.value) {
    passwordError.value = 'Konfirmasi kata sandi baru tidak cocok.'
    return
  }
  if (!supabase || !user.value?.email) return

  savingPassword.value = true
  try {
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: user.value.email,
      password: currentPassword.value,
    })
    if (verifyError) throw new Error('Kata sandi saat ini salah.')

    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword.value })
    if (updateError) throw updateError

    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
    passwordMessage.value = 'Kata sandi berhasil diubah.'
  } catch (error) {
    passwordError.value = error.message || 'Kata sandi tidak dapat diubah.'
  } finally {
    savingPassword.value = false
  }
}
</script>

<template>
  <main class="profile-page">
    <div class="profile-content">
      <RouterLink to="/" class="profile-back">← Kembali ke dashboard</RouterLink>
      <div class="profile-heading">
        <span class="profile-heading-icon">⚙</span>
        <div>
          <span class="profile-eyebrow">PENGATURAN AKUN</span>
          <h1>Atur Profil</h1>
          <p>Kelola nama, username, dan kata sandi akunmu.</p>
        </div>
      </div>

      <p v-if="loading" class="profile-loading">Memuat profil…</p>

      <template v-else>
        <section class="profile-card">
          <div class="profile-card-heading">
            <div class="profile-card-icon">👤</div>
            <div>
              <h2>Informasi profil</h2>
              <p>Email akun tidak dapat diubah dari halaman ini.</p>
            </div>
          </div>

          <form class="profile-form" @submit.prevent="saveProfile">
            <label for="profile-email">Email</label>
            <input id="profile-email" :value="user.email" type="email" disabled>

            <label for="profile-name">Nama</label>
            <input id="profile-name" v-model="name" type="text" maxlength="60" autocomplete="name" placeholder="Nama yang ingin ditampilkan" required>

            <label for="profile-username">Username</label>
            <input id="profile-username" v-model.trim="username" type="text" minlength="3" maxlength="24" pattern="[A-Za-z0-9_]+" autocomplete="username" placeholder="contoh: naya_01" required>
            <small class="profile-hint">3–24 karakter. Gunakan huruf, angka, atau garis bawah.</small>

            <p v-if="profileError" class="profile-error" role="alert">{{ profileError }}</p>
            <p v-if="profileMessage" class="profile-success" role="status">{{ profileMessage }}</p>
            <button class="profile-submit" type="submit" :disabled="savingProfile">
              {{ savingProfile ? 'Menyimpan…' : 'Simpan profil' }}
            </button>
          </form>
        </section>

        <section class="profile-card">
          <div class="profile-card-heading">
            <div class="profile-card-icon password-icon">🔒</div>
            <div>
              <h2>Ubah kata sandi</h2>
              <p>Konfirmasi dengan kata sandi saat ini sebelum menggantinya.</p>
            </div>
          </div>

          <form class="profile-form" @submit.prevent="changePassword">
            <label for="current-password">Kata sandi saat ini</label>
            <input id="current-password" v-model="currentPassword" type="password" autocomplete="current-password" required>

            <label for="new-password">Kata sandi baru</label>
            <input id="new-password" v-model="newPassword" type="password" minlength="8" maxlength="72" autocomplete="new-password" placeholder="Minimal 8 karakter" required>

            <label for="confirm-password">Ulangi kata sandi baru</label>
            <input id="confirm-password" v-model="confirmPassword" type="password" minlength="8" maxlength="72" autocomplete="new-password" required>

            <p v-if="passwordError" class="profile-error" role="alert">{{ passwordError }}</p>
            <p v-if="passwordMessage" class="profile-success" role="status">{{ passwordMessage }}</p>
            <button class="profile-submit" type="submit" :disabled="savingPassword">
              {{ savingPassword ? 'Memproses…' : 'Ubah kata sandi' }}
            </button>
          </form>
        </section>
      </template>
    </div>
  </main>
</template>

<style scoped>
.profile-page{min-height:calc(100vh - 76px);padding:36px 20px 60px;background:#f5f7fb;color:#233149}.profile-content{width:min(760px,100%);margin:0 auto}.profile-back{display:inline-block;margin-bottom:22px;color:#526b98;text-decoration:none;font-size:13px;font-weight:600}.profile-back:hover{color:#2349aa}.profile-heading{display:flex;align-items:center;gap:15px;margin-bottom:26px}.profile-heading-icon{width:54px;height:54px;display:grid;place-items:center;border:1px solid #e3eaf5;border-radius:17px;background:#fff;font-size:23px}.profile-eyebrow{color:#7587a5;font-size:10px;font-weight:700;letter-spacing:.14em}.profile-heading h1{margin:3px 0;color:#24334b;font-size:27px;font-weight:700;letter-spacing:-.03em}.profile-heading p{margin:0;color:#8592a5;font-size:12px}.profile-card{margin-top:17px;padding:24px 27px;border:1px solid #e7ecf3;border-radius:18px;background:#fff;box-shadow:0 5px 20px #1a315008}.profile-card-heading{display:flex;align-items:center;gap:12px;padding-bottom:18px;border-bottom:1px solid #eef1f5}.profile-card-icon{width:40px;height:40px;display:grid;place-items:center;border-radius:12px;background:#edf2ff;font-size:18px}.password-icon{background:#fff4e6}.profile-card-heading h2{margin:0;color:#2b3a51;font-size:15px;font-weight:700}.profile-card-heading p{margin:3px 0 0;color:#929daf;font-size:11px}.profile-form{display:grid;gap:8px;margin-top:18px}.profile-form label{margin-top:7px;color:#4c5b71;font-size:12px;font-weight:600}.profile-form input{width:100%;padding:12px 13px;border:1px solid #dce3ed;border-radius:10px;background:#fff;color:#26354c;font:inherit;font-size:13px;outline:none;transition:border-color .2s,box-shadow .2s}.profile-form input:focus{border-color:#6b8dd4;box-shadow:0 0 0 3px #4775c21a}.profile-form input:disabled{background:#f6f8fb;color:#8b97a8}.profile-hint{color:#96a1b0;font-size:10px}.profile-submit{justify-self:start;margin-top:10px;padding:11px 17px;border:0;border-radius:10px;background:#244bad;color:#fff;font:inherit;font-size:12px;font-weight:700;cursor:pointer}.profile-submit:hover{background:#1d3f96}.profile-submit:disabled{opacity:.6;cursor:wait}.profile-error,.profile-success{margin:7px 0 0;padding:10px 12px;border-radius:9px;font-size:12px;line-height:1.5}.profile-error{background:#fff1f2;color:#b92f48}.profile-success{background:#ecfdf5;color:#087854}.profile-loading{padding:30px;color:#718198;text-align:center;font-size:13px}@media(max-width:540px){.profile-page{padding:24px 14px 40px}.profile-card{padding:19px 17px}.profile-heading h1{font-size:24px}}
</style>
