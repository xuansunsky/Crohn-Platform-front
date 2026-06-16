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
        <p class="text-sm text-white/60 mt-2 tracking-widest uppercase">Paradise Permission Control</p>
      </header>

      <!-- IBD 战友认证审核 -->
      <section class="mb-10">
        <div class="flex items-center gap-2 mb-4">
          <i class="ri-shield-check-fill text-[#ffb86c] text-lg"></i>
          <h2 class="text-lg font-bold text-white/90">战友认证审核</h2>
          <span class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#ffb86c]/20 text-[#ffb86c]">{{ pendingList.length }} 待审</span>
        </div>

        <p v-if="pendingList.length === 0" class="text-sm text-white/40 py-6 text-center">暂无待审核的认证申请</p>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div v-for="v in pendingList" :key="v.userId"
               class="rounded-2xl bg-black/20 border border-white/10 p-4 flex gap-4">
            <div class="shrink-0 grid grid-cols-2 gap-1.5 w-24">
              <a
                v-for="url in proofImagesOf(v)"
                :key="url"
                :href="url"
                target="_blank"
                class="block aspect-square rounded-xl overflow-hidden bg-black/40 border border-white/10"
              >
                <img :src="url" class="w-full h-full object-cover">
              </a>
            </div>
            <div class="flex-1 min-w-0 flex flex-col">
              <div class="flex items-center gap-2">
                <img v-if="v.avatar" :src="v.avatar" class="w-6 h-6 rounded-full object-cover">
                <span class="font-bold text-white/90 truncate">{{ v.nickname || ('用户 ' + v.userId) }}</span>
              </div>
              <p class="text-[11px] text-white/40 mt-1">点击左侧图片核验证明材料</p>
              <div class="flex gap-2 mt-auto pt-3">
                <button @click="review(v.userId, true)"
                        class="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border border-emerald-500/50 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all">
                  <i class="ri-check-line"></i> 通过
                </button>
                <button @click="review(v.userId, false)"
                        class="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white transition-all">
                  <i class="ri-close-line"></i> 驳回
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

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
                  {{ user.nickname?.charAt(0) || '?' }}
                </div>
                <span class="font-medium text-white/90">{{ user.nickname }}</span>
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getAllUsers, updaterole } from '@/api/user.js'
import http from '@/api/http'

const router = useRouter()
const userList = ref([])
const myId = ref(1)
const pendingList = ref([])

const fetchUsers = async () => {
  try {
    const res = await getAllUsers()
    if (res.status === 200) userList.value = res.data
  } catch (err) {
    console.error('获取名册失败', err)
  }
}

const updateRole = async (userId, roleId) => {
  try {
    const res = await updaterole({ userId, roleId })
    if (res.status === 200) await fetchUsers()
  } catch (err) {
    console.error('操作失败', err)
  }
}

const promote = (u) => updateRole(u.id, 1)
const demote = (u) => updateRole(u.id, 2)

const proofImagesOf = (v) => {
  if (!v) return []
  if (Array.isArray(v.proofImageUrls)) return v.proofImageUrls.filter(Boolean)
  if (v.proofImagesJson) {
    try {
      const list = JSON.parse(v.proofImagesJson)
      if (Array.isArray(list)) return list.filter(Boolean)
    } catch (e) {}
  }
  return v.proofImageUrl ? [v.proofImageUrl] : []
}

const fetchPending = async () => {
  try {
    const res = await http.get('/verify/pending')
    if (res.status === 200 && res.data) pendingList.value = res.data
  } catch (err) {
    console.error('获取认证申请失败', err)
  }
}

const review = async (userId, approve) => {
  try {
    const res = await http.post('/verify/review', { userId, approve })
    if (res.status === 200) {
      pendingList.value = pendingList.value.filter(v => v.userId !== userId)
    }
  } catch (err) {
    console.error('审核失败', err)
  }
}

onMounted(() => {
  fetchUsers()
  fetchPending()
})
</script>
