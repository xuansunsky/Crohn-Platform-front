<template>
  <div class="min-h-screen flex items-center justify-center p-5 relative overflow-hidden font-sans
              bg-[radial-gradient(ellipse_at_top,_#1a2332_0%,_#0b1220_70%)]">

    <div class="absolute inset-0 z-0 opacity-50 pointer-events-none bg-[url('data:image/svg+xml,...')]"></div>

    <main class="relative z-10 w-full max-w-4xl p-8 rounded-[24px]
                 bg-[#191e32]/60 backdrop-blur-2xl border border-white/10
                 shadow-[0_40px_100px_rgba(0,0,0,0.5)]">

      <header class="mb-10 text-center">
        <h1 class="text-4xl font-extrabold bg-gradient-to-r from-[#ffb86c] to-[#ff6b6b] bg-clip-text text-transparent
                   drop-shadow-[0_2px_10px_rgba(255,184,108,0.3)]">
          皇家名册
        </h1>
        <p class="text-sm text-white/60 mt-2 tracking-widest uppercase">Kingdom Permission Control</p>
      </header>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
          <tr class="border-b border-white/10">
            <th class="p-4 text-xs font-semibold text-[#ffb86c]/80 uppercase tracking-tighter">用户</th>
            <th class="p-4 text-xs font-semibold text-[#ffb86c]/80 uppercase tracking-tighter">手机号</th>
            <th class="p-4 text-xs font-semibold text-[#ffb86c]/80 uppercase tracking-tighter">当前身份</th>
            <th class="p-4 text-xs font-semibold text-[#ffb86c]/80 uppercase tracking-tighter">操作</th>
          </tr>
          </thead>

          <tbody class="divide-y divide-white/5">
          <tr v-for="user in userList" :key="user.id" class="group hover:bg-white/[0.03] transition-colors">
            <td class="p-4">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-full flex items-center justify-center font-bold text-slate-900
                              bg-gradient-to-br from-[#ffb86c] to-[#ff6b6b]">
                  {{ user.nickName?.charAt(0) || '?' }}
                </div>
                <span class="font-medium text-white/90">{{ user.nickName }}</span>
              </div>
            </td>

            <td class="p-4 text-white/60 font-mono text-sm">{{ user.phoneNumber }}</td>

            <td class="p-4">
                <span v-if="user.roleId === 1"
                      class="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">
                  国王 (ADMIN)
                </span>
              <span v-else
                    class="px-3 py-1 rounded-full text-[11px] font-bold bg-white/10 text-white/50 border border-white/5">
                  平民 (USER)
                </span>
            </td>

            <td class="p-4">
              <div class="flex gap-2">
                <button v-if="user.roleId !== 1" @click="promote(user)"
                        class="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold
                                 border border-[#ffb86c]/50 text-[#ffb86c] hover:bg-[#ffb86c] hover:text-slate-900 transition-all">
                  <i class="ri-medal-line"></i> 敕封
                </button>
                <button v-else @click="demote(user)" :disabled="user.id === myId"
                        class="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold
                                 border border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white transition-all
                                 disabled:opacity-30 disabled:cursor-not-allowed">
                  <i class="ri-user-down-line"></i> 降职
                </button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <footer class="mt-10 flex justify-center">
        <button @click="router.back()"
                class="px-8 py-2 rounded-xl border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-all text-sm">
          返回大殿
        </button>
      </footer>
    </main>
  </div>
</template>

<script setup>
// JS 逻辑完全保留，只需专注于样式重构
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const userList = ref([])
const myId = ref(1) // 你自己的 ID

const fetchUsers = async () => {
  try {
    const res = await axios.get('/api/users/all', {
      headers: { Authorization: localStorage.getItem('token') }
    })
    if (res.data.status === 200) userList.value = res.data.data
  } catch (err) {
    console.error('获取名册失败', err)
  }
}

const updateRole = async (userId, roleId) => {
  try {
    const res = await axios.post('/api/users/updateRole', { userId, roleId }, {
      headers: { Authorization: localStorage.getItem('token') }
    })
    if (res.data.status === 200) fetchUsers()
  } catch (err) {
    console.error('操作失败', err)
  }
}

const promote = (u) => updateRole(u.id, 1)
const demote = (u) => updateRole(u.id, 2)

onMounted(fetchUsers)
</script>