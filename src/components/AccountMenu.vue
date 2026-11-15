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
  <div v-if="user" class="account-menu-root">
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
        <small>@{{ username }}</small>
      </span>
      <svg class="account-chevron" :class="{ open: menuOpen }" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="m5 7.5 5 5 5-5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>

    <div v-if="menuOpen" class="account-dropdown" role="menu">
      <div class="account-identity">
        <strong>{{ displayName }}</strong>
        <span>{{ user.email }}</span>
      </div>
        <RouterLink to="/" role="menuitem" @click="menuOpen = false">Dashboard</RouterLink>
        <RouterLink to="/learn" role="menuitem" @click="menuOpen = false">Belajar</RouterLink>
      <RouterLink to="/profile" role="menuitem" @click="menuOpen = false">Atur Profil</RouterLink>
      <button type="button" role="menuitem" @click="signOut">Keluar</button>
    </div>
  </div>
</template>

<style scoped>
.account-menu-root{position:relative;z-index:30}.account-trigger{display:flex;align-items:center;gap:9px;min-height:52px;padding:5px 10px 5px 6px;border:1px solid #e1e8f1;border-radius:14px;background:#fff;color:#273449;text-align:left;cursor:pointer}.account-trigger:hover,.account-trigger[aria-expanded=true]{border-color:#b8c8e5;box-shadow:0 4px 14px #2349aa10}.account-avatar{width:38px;height:38px;display:grid;place-items:center;flex:0 0 auto;border-radius:12px;background:#eaf0ff;color:#2349aa;font-size:15px;font-weight:800}.account-copy{display:grid;gap:1px;min-width:74px;max-width:150px}.account-copy strong{overflow:hidden;color:#273449;text-overflow:ellipsis;white-space:nowrap;font-size:12px}.account-copy small{overflow:hidden;color:#8995a7;text-overflow:ellipsis;white-space:nowrap;font-size:10px}.account-chevron{width:16px;height:16px;flex:0 0 auto;color:#77849a;transition:transform .2s}.account-chevron.open{transform:rotate(180deg)}.account-dropdown{position:absolute;top:calc(100% + 8px);right:0;width:235px;padding:8px;border:1px solid #e5eaf1;border-radius:14px;background:#fff;box-shadow:0 18px 42px #102a4b1a}.account-identity{display:grid;gap:4px;padding:11px 12px 13px;border-bottom:1px solid #edf1f6}.account-identity strong{color:#1f2b40;font-size:12px}.account-identity span{overflow:hidden;color:#78859a;text-overflow:ellipsis;white-space:nowrap;font-size:11px}.account-dropdown a,.account-dropdown button{width:100%;display:block;padding:10px 12px;border:0;border-radius:8px;background:transparent;color:#38465c;text-align:left;text-decoration:none;font:inherit;font-size:12px;cursor:pointer}.account-dropdown a:hover,.account-dropdown button:hover{background:#f4f7fc}.account-dropdown button{color:#bf3e4c}@media(max-width:540px){.account-trigger{min-height:44px;gap:6px;padding:4px 7px 4px 4px}.account-avatar{width:34px;height:34px}.account-copy{min-width:0;max-width:90px}.account-copy small{display:none}.account-chevron{width:14px;height:14px}}
</style>
