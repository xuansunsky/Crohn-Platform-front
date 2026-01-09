<template>
  <div class="max-w-[480px] mx-auto bg-slate-50 min-h-screen relative shadow-2xl border-x border-slate-200">

    <div class="sticky top-0 z-20 bg-white/80 backdrop-blur-md px-4 py-3 flex justify-between items-center shadow-sm">
      <h1 class="text-xl font-black tracking-tight text-slate-800">CroChat</h1>

      <button
          @click="showAddDialog = true"
          class="w-9 h-9 flex items-center justify-center bg-black text-white rounded-full active:scale-90 transition shadow-lg"
      >
        <i class="ri-add-line text-xl"></i>
      </button>
    </div>

    <div class="px-4 mt-4 mb-2">
      <div class="bg-slate-200 p-1 rounded-xl flex">
        <button
            @click="activeTab = 'friend'"
            :class="['flex-1 py-2 text-sm font-bold rounded-lg transition-all', activeTab === 'friend' ? 'bg-white shadow-sm text-black' : 'text-slate-500']"
        >
          好友列表
        </button>
        <button
            @click="activeTab = 'request'"
            :class="['flex-1 py-2 text-sm font-bold rounded-lg transition-all relative', activeTab === 'request' ? 'bg-white shadow-sm text-black' : 'text-slate-500']"
        >
          新申请
          <span v-if="requestList.length > 0" class="absolute top-1 right-3 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
      </div>
    </div>

    <div class="px-4 pb-20 space-y-3 mt-4">

      <template v-if="activeTab === 'friend'">
        <div class="relative mb-4">
          <i class="ri-search-line absolute left-3 top-2.5 text-slate-400"></i>
          <input type="text" placeholder="搜索好友..." class="w-full bg-white pl-9 pr-4 py-2.5 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black/5 shadow-sm">
        </div>

        <div
            v-for="friend in friendList"
            :key="friend.friendId"
            @click="openChat(friend)"
            class="flex items-center gap-4 bg-white p-4 rounded-2xl active:scale-95 transition-transform shadow-sm border border-slate-100 cursor-pointer"
        >
          <div class="relative">
            <img :src="friend.avatar" class="w-12 h-12 rounded-full bg-slate-100 object-cover">
          </div>
          <div class="flex-1">
            <div class="flex justify-between items-center">
              <h3 class="font-bold text-slate-800">{{ friend.nickname }}</h3>
              <span class="text-[10px] text-slate-400">刚刚</span>
            </div>
            <p class="text-xs text-slate-500 line-clamp-1 mt-0.5">点击开始聊天...</p>
          </div>
        </div>

        <div v-if="friendList.length === 0" class="text-center py-10 text-slate-400">
          <i class="ri-user-smile-line text-4xl mb-2 block"></i>
          <p class="text-sm">还没有好友，快去添加吧</p>
        </div>
      </template>

      <template v-else>
        <div v-for="req in requestList" :key="req.friendshipId" class="flex items-center gap-3 bg-white p-4 rounded-2xl shadow-sm border-l-4 border-yellow-400">
          <img :src="req.avatar" class="w-10 h-10 rounded-full bg-slate-100">
          <div class="flex-1">
            <h3 class="font-bold text-sm">{{ req.nickname }}</h3>
            <p class="text-[10px] text-slate-500">请求添加你为好友</p>
          </div>
          <button
              @click="handleAccept(req.friendshipId)"
              class="bg-black text-white text-xs px-3 py-1.5 rounded-lg font-bold active:scale-90 transition"
          >
            同意
          </button>
        </div>

        <div v-if="requestList.length === 0" class="text-center py-10 text-slate-400">
          <p class="text-sm">暂无新申请</p>
        </div>
      </template>

    </div>

    <el-dialog v-model="showAddDialog" title="添加好友" width="320px" align-center class="rounded-2xl">
      <div class="text-center">
        <p class="text-slate-500 text-xs mb-3">输入 ID 号码精确查找</p>
        <div class="bg-slate-100 px-3 py-2 rounded-xl flex items-center gap-2 mb-4">
          <span class="font-bold text-slate-400">ID:</span>
          <input v-model="targetId" type="number" class="bg-transparent flex-1 outline-none font-bold text-lg w-full" placeholder="102">
        </div>
        <button
            @click="sendRequest"
            :disabled="loading"
            class="w-full bg-black text-white py-2.5 rounded-xl font-bold shadow-lg active:scale-95 transition disabled:opacity-50"
        >
          {{ loading ? '发送中...' : '发送申请' }}
        </button>
      </div>
    </el-dialog>

    <div
        v-if="showChat"
        class="absolute inset-0 z-50 bg-slate-50 flex flex-col animate-slide-in"
    >
      <div class="bg-white px-4 py-3 flex items-center gap-3 shadow-sm border-b border-slate-100">
        <button @click="showChat = false" class="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center">
          <i class="ri-arrow-left-s-line text-2xl"></i>
        </button>
        <div class="flex-1">
          <h3 class="font-bold text-base">{{ currentFriend?.nickname }}</h3>
          <p class="text-[10px] text-green-500 flex items-center gap-1">
            <span class="w-1.5 h-1.5 bg-green-500 rounded-full"></span> 在线
          </p>
        </div>
        <button class="text-slate-400"><i class="ri-more-fill text-xl"></i></button>
      </div>

      <div class="flex-1 overflow-y-auto p-4 space-y-4" id="chat-container">

        <div v-for="msg in chatHistory" :key="msg.id">

          <div v-if="msg.senderId === currentFriend.friendId" class="flex justify-start gap-2">
            <img :src="currentFriend.avatar" class="w-8 h-8 rounded-full bg-slate-200 mt-1">
            <div class="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm text-sm max-w-[75%] leading-relaxed">
              {{ msg.content }}
            </div>
          </div>

          <div v-else class="flex justify-end gap-2">
            <div class="bg-black text-white p-3 rounded-2xl rounded-tr-none shadow-md text-sm max-w-[75%] leading-relaxed">
              {{ msg.content }}
            </div>
            <div class="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white text-xs font-bold mt-1">
              我
            </div>
          </div>

        </div>
      </div>

      <div class="p-3 bg-white border-t border-slate-100 flex items-end gap-2">
        <input
            v-model="inputMsg"
            @keydown.enter="sendMessage"
            type="text"
            placeholder="发消息..."
            class="flex-1 bg-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
        >
        <button
            @click="sendMessage"
            class="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition"
        >
          <i class="ri-send-plane-fill"></i>
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import http from '@/api/http' // 确保这里是你封装的axios
import { ElMessage } from 'element-plus'

// === 状态管理 ===
const activeTab = ref('friend') // friend | request
const showAddDialog = ref(false)
const loading = ref(false)

// === 数据 ===
const friendList = ref([])
const requestList = ref([])
// 当前正在聊天的人
const targetId = ref('') // 搜索用的ID
import { nextTick } from 'vue' // 🔥 记得引入 nextTick，用来做自动滚动

// === 聊天核心变量 ===
const showChat = ref(false)
const currentFriend = ref(null)
const chatHistory = ref([]) // 真实的聊天记录
const inputMsg = ref('')    // 输入框的内容
const chatContainerRef = ref(null) // 绑定聊天框的 DOM，为了自动滚动

// === 1. 打开聊天窗口 (加载历史记录) ===
const openChat = async (friend) => {
  currentFriend.value = friend
  showChat.value = true

  // 先清空旧数据，防止闪烁
  chatHistory.value = []

  try {
    // 调用后端：GET /api/chat/history?friendId=102
    const res = await http.get('/chat/history', {
      params: { friendId: friend.friendId }
    })

    if (res.status === 200) {
      chatHistory.value = res.data
      scrollToBottom() // 滚到底部看最新消息
    }
  } catch (e) {
    console.error('加载历史记录失败', e)
  }
}

// === 2. 发送消息 ===
const sendMessage = async () => {
  if (!inputMsg.value.trim()) return //哪怕只有一个空格也不让发

  const content = inputMsg.value
  // 清空输入框，让用户感觉发得很顺畅
  inputMsg.value = ''

  // 1. 先在前端“假装”上屏 (乐观更新)，这样体验极快，不用等后端返回
  // 临时造一条消息对象
  const tempMsg = {
    id: Date.now(),
    senderId: -1, // -1 代表我自己 (用于前端判断)
    content: content,
    type: 'text'
  }
  chatHistory.value.push(tempMsg)
  scrollToBottom()

  // 2. 真正发送给后端
  try {
    // POST /api/chat/send
    await http.post('/chat/send', {
      receiverId: currentFriend.value.friendId,
      content: content,
      type: 'text'
    })
    // 发送成功其实不用做啥，因为前端已经显示了
    // 严谨点可以在这里重新拉取一下历史记录，或者不做处理
  } catch (e) {
    ElMessage.error('发送失败，请重试')
    // 发送失败可以考虑把刚才那条消息标红 (这里先不搞那么复杂)
  }
}

// === 3. 自动滚动到底部 ===
const scrollToBottom = () => {
  nextTick(() => {
    const box = document.getElementById('chat-container')
    if (box) {
      box.scrollTop = box.scrollHeight
    }
  })
}
// === 核心功能 1: 获取列表 ===
const refreshData = async () => {
  try {
    // 并发请求，效率更高
    const [resFriends, resReqs] = await Promise.all([
      http.get('/friend/list'),
      http.get('/friend/requests')
    ])

    if (resFriends.status === 200) friendList.value = resFriends.data
    if (resReqs.status === 200) requestList.value = resReqs.data
  } catch (e) {
    console.error('刷新数据失败', e)
  }
}

// === 核心功能 2: 发起申请 ===
const sendRequest = async () => {
  if (!targetId.value) return ElMessage.warning('请输入ID')

  loading.value = true
  try {
    const res = await http.post('/friend/request', { addresseeId: Number(targetId.value) })
    if (res.status === 200) {
      ElMessage.success('申请已发送！')
      showAddDialog.value = false
      targetId.value = ''
    } else {
      ElMessage.error(res.message)
    }
  } catch (e) {
    ElMessage.error('发送失败')
  } finally {
    loading.value = false
  }
}

// === 核心功能 3: 同意好友 ===
const handleAccept = async (shipId) => {
  try {
    const res = await http.post(`/friend/accept/${shipId}`)
    if (res.status === 200) {
      ElMessage.success('已成为好友！')
      await refreshData() // 刷新列表
    }
  } catch (e) {
    ElMessage.error('操作失败')
  }
}

// === 核心功能 4: 打开聊天 ===

// 页面加载时执行
onMounted(() => {
  refreshData()
})
</script>

<style scoped>
/* 定义一个简单的滑入动画 */
.animate-slide-in {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

/* 隐藏滚动条但保留滚动功能 (Chrome/Safari) */
::-webkit-scrollbar {
  width: 0px;
  background: transparent;
}
</style>