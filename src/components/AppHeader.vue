<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabase'

const router = useRouter()
const user = ref(null)
const menuOpen = ref(false)
let authSubscription

const username = computed(() => user.value?.user_metadata?.username || user.value?.email?.split('@')[0] || 'Pengguna')
const displayName = computed(() => user.value?.user_metadata?.full_name || username.value)
const initials = computed(() => displayName.value.slice(0, 1).toUpperCase())

onMounted(async () => {
  if (!supabase) return
  const { data } = await supabase.auth.getSession()
  user.value = data.session?.user ?? null
  const { data: authData } = supabase.auth.onAuthStateChange((_event, session) => {
    user.value = session?.user ?? null
  })
  authSubscription = authData.subscription
})

onUnmounted(() => authSubscription?.unsubscribe())

async function signOut() {
  await supabase.auth.signOut()
  menuOpen.value = false
  await router.replace('/login')
}
</script>

<template>
  <header v-if="user" class="app-header">
    <RouterLink to="/" class="brand" aria-label="Ke dashboard">
      <span class="brand-mark">T</span>
      <span class="brand-name">TEP <span>Practice</span></span>
    </RouterLink>

    <div class="account-area">
      <button
        class="account-trigger"
        type="button"
        :aria-expanded="menuOpen"
        aria-haspopup="menu"
        @click="menuOpen = !menuOpen"
      >
        <span class="account-avatar">{{ initials }}</span>
        <span class="account-copy">
          <strong>{{ displayName }}</strong>
          <small>Akun saya</small>
        </span>
        <svg class="chevron" :class="{ 'chevron-open': menuOpen }" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="m5 7.5 5 5 5-5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>

      <div v-if="menuOpen" class="account-menu" role="menu">
        <div class="menu-identity">
          <strong>{{ displayName }}</strong>
          <span>@{{ username }} · {{ user.email }}</span>
        </div>
        <RouterLink to="/" role="menuitem" @click="menuOpen = false">Dashboard</RouterLink>
        <RouterLink to="/learn" role="menuitem" @click="menuOpen = false">Belajar</RouterLink>
        <RouterLink to="/profile" role="menuitem" @click="menuOpen = false">Atur Profil</RouterLink>
        <button type="button" role="menuitem" @click="signOut">Keluar</button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header{height:76px;position:sticky;top:0;z-index:20;display:flex;align-items:center;justify-content:space-between;padding:0 clamp(20px,5vw,72px);background:#fff;border-bottom:1px solid #e9eef5;box-shadow:0 4px 20px #102a4b08}.brand{display:inline-flex;align-items:center;gap:11px;color:#18243a;text-decoration:none}.brand-mark{width:38px;height:38px;display:grid;place-items:center;border-radius:12px;background:linear-gradient(145deg,#1e40af,#3567cf);color:white;font-size:20px;font-weight:800;box-shadow:0 5px 12px #2349aa30}.brand-name{font-size:16px;font-weight:800;letter-spacing:-.03em}.brand-name span{color:#718096;font-weight:500}.account-area{position:relative}.account-trigger{display:flex;align-items:center;gap:10px;padding:6px 10px 6px 6px;border:1px solid #e3e9f1;border-radius:14px;background:#fff;color:#273449;text-align:left;cursor:pointer;transition:border-color .2s,box-shadow .2s}.account-trigger:hover,.account-trigger[aria-expanded=true]{border-color:#b8c8e5;box-shadow:0 4px 14px #2349aa10}.account-avatar{width:38px;height:38px;display:grid;place-items:center;border-radius:12px;background:#eaf0ff;color:#2349aa;font-size:15px;font-weight:800}.account-copy{display:grid;gap:1px;min-width:100px}.account-copy strong{max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px}.account-copy small{color:#8995a7;font-size:11px}.chevron{width:17px;height:17px;margin-left:4px;color:#77849a;transition:transform .2s}.chevron-open{transform:rotate(180deg)}.account-menu{position:absolute;top:calc(100% + 10px);right:0;width:240px;padding:8px;background:#fff;border:1px solid #e5eaf1;border-radius:15px;box-shadow:0 18px 42px #102a4b1a}.menu-identity{display:grid;gap:4px;padding:12px 12px 14px;border-bottom:1px solid #edf1f6}.menu-identity strong{font-size:13px;color:#1f2b40}.menu-identity span{overflow:hidden;text-overflow:ellipsis;color:#78859a;font-size:12px;white-space:nowrap}.account-menu a,.account-menu button{width:100%;display:block;padding:11px 12px;border:0;border-radius:9px;background:transparent;color:#38465c;text-align:left;text-decoration:none;font:inherit;font-size:13px;cursor:pointer}.account-menu a:hover,.account-menu button:hover{background:#f4f7fc}.account-menu button{color:#bf3e4c}@media(max-width:540px){.app-header{height:68px;padding:0 16px}.account-trigger{gap:7px}.account-copy{min-width:0}.account-copy strong{max-width:100px}.account-copy small{display:none}.account-avatar{width:34px;height:34px}.brand-name{font-size:14px}.brand-mark{width:34px;height:34px}}
</style>
