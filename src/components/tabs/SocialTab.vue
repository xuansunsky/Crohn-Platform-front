<template>
  <div class="min-h-screen bg-slate-50 pb-20">

    <div class="bg-white sticky top-0 z-10 px-4 pt-4 pb-2 shadow-sm">
      <div class="flex gap-6 text-lg font-bold text-slate-400">
        <button @click="switchTab('friend')" :class="{'text-black text-2xl': activeTab === 'friend'}" class="transition-all">好友</button>
        <button @click="switchTab('squad')" :class="{'text-black text-2xl': activeTab === 'squad'}" class="transition-all">小队</button>
        <button @click="switchTab('circle')" :class="{'text-black text-2xl': activeTab === 'circle'}" class="transition-all">圈子</button>
      </div>
    </div>

    <div class="p-4">

      <div class="bg-white p-3 rounded-xl flex items-center gap-2 mb-6 shadow-sm border border-slate-100">
        <i class="ri-search-line text-slate-400"></i>
        <input type="text" :placeholder="activeTab === 'friend' ? '搜索好友ID...' : '搜索小队口号...'" class="bg-transparent flex-1 outline-none text-sm font-bold">
        <button @click="handleAdd" class="bg-black text-white text-xs px-3 py-1.5 rounded-lg font-bold active:scale-90 transition">
          {{ activeTab === 'friend' ? '加好友' : '找组织' }}
        </button>
      </div>

      <div v-if="activeTab === 'friend'" class="space-y-4">
        <div
            v-for="item in friendList" :key="item.id"
            @click="openChat(item, 'friend')"
            class="flex items-center gap-4 bg-white p-4 rounded-2xl active:scale-95 transition-transform"
        >
          <div class="relative">
            <img :src="item.avatar" class="w-12 h-12 rounded-full bg-slate-200 object-cover border border-slate-100">
            <div v-if="item.unread > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{{ item.unread }}</div>
          </div>
          <div class="flex-1">
            <div class="flex justify-between items-center">
              <h3 class="font-bold text-slate-800">{{ item.name }}</h3>
              <span class="text-xs text-slate-400">{{ item.lastTime }}</span>
            </div>
            <p class="text-xs text-slate-500 line-clamp-1 mt-1">{{ item.lastMsg }}</p>
          </div>
        </div>
      </div>

      <div v-else-if="activeTab === 'squad'" class="space-y-4">
        <div
            v-for="item in squadList" :key="item.id"
            @click="openChat(item, 'group')"
            class="flex items-center gap-4 bg-white p-4 rounded-2xl active:scale-95 transition-transform border-l-4 border-black"
        >
          <div class="relative">
            <img :src="item.avatar" class="w-12 h-12 rounded-xl bg-slate-200 object-cover border border-slate-100">
            <div v-if="item.unread > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{{ item.unread }}</div>
          </div>
          <div class="flex-1">
            <div class="flex justify-between items-center">
              <h3 class="font-bold text-slate-800 flex items-center gap-2">
                {{ item.name }}
                <span class="bg-yellow-100 text-yellow-700 text-[10px] px-1.5 py-0.5 rounded">Lv.{{item.level}}</span>
              </h3>
              <span class="text-xs text-slate-400">{{ item.lastTime }}</span>
            </div>
            <p class="text-xs text-slate-500 line-clamp-1 mt-1">
              <span class="text-blue-500 mr-1">{{ item.lastSender }}:</span>
              {{ item.lastMsg }}
            </p>
          </div>
        </div>
      </div>

      <div v-else class="text-center text-slate-400 py-10">
        <p>圈子功能即将上线...</p>
      </div>

    </div>

    <div v-if="showChatWindow" class="fixed inset-0 z-50 bg-slate-50 flex flex-col">

      <div class="bg-white px-4 py-3 shadow-sm flex items-center justify-between">
        <button @click="closeChat" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100">
          <i class="ri-arrow-left-s-line text-xl"></i>
        </button>
        <div class="text-center">
          <h3 class="font-black text-lg">{{ currentSession?.name }}</h3>
          <p v-if="currentType === 'group'" class="text-xs text-slate-400">5位战友在线</p>
        </div>
        <button class="w-8 h-8 text-xl"><i class="ri-more-fill"></i></button>
      </div>

      <div class="flex-1 overflow-y-auto p-4 space-y-5 bg-slate-50" id="chat-box">
        <div v-for="msg in chatHistory" :key="msg.id" :class="['flex', msg.isMe ? 'justify-end' : 'justify-start']">

          <div v-if="!msg.isMe" class="flex gap-2 max-w-[85%] items-end">
            <img :src="msg.avatar" class="w-8 h-8 rounded-full bg-slate-200 mb-1">
            <div>
              <p v-if="currentType === 'group'" class="text-[10px] text-slate-400 ml-1 mb-1">{{ msg.senderName }}</p>

              <div class="bg-white p-3 rounded-2xl rounded-bl-none text-slate-700 text-sm shadow-sm border border-slate-200 leading-relaxed">
                {{ msg.text }}
              </div>
            </div>
          </div>

          <div v-else class="flex gap-2 max-w-[85%] flex-row-reverse items-end">
            <div class="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white text-xs mb-1">我</div>
            <div>
              <div class="bg-black text-white p-3 rounded-2xl rounded-br-none text-sm shadow-md leading-relaxed">
                {{ msg.text }}
              </div>
            </div>
          </div>

        </div>
      </div>

      <div class="bg-white p-4 border-t border-slate-100 flex gap-3 items-end pb-6">
        <button class="text-slate-400 text-xl mb-2"><i class="ri-emotion-line"></i></button>
        <textarea
            v-model="inputMsg"
            rows="1"
            class="flex-1 bg-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 resize-none transition-all"
            placeholder="说点什么..."
            @keydown.enter.prevent="sendMessage"
        ></textarea>
        <button
            @click="sendMessage"
            class="bg-black text-white w-10 h-10 rounded-full flex items-center justify-center active:scale-90 transition-transform mb-0.5 shadow-lg"
        >
          <i class="ri-send-plane-fill"></i>
        </button>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'

const activeTab = ref('friend')
const showChatWindow = ref(false)
const currentSession = ref(null) // 当前聊天的对象（人或群）
const currentType = ref('friend') // 'friend' 或 'group'
const inputMsg = ref('')

// === 1. 数据源 ===
const friendList = ref([
  { id: 1, name: '内江彭于晏', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix', lastMsg: '这周约吗？', lastTime: '10:42', unread: 1 },
  { id: 2, name: '消化科小护士', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Annie', lastMsg: '[语音] 10"', lastTime: '昨天', unread: 0 }
])

// 🔥 新增：小队列表
const squadList = ref([
  {
    id: 101,
    name: '绝不吃辣特工队',
    level: 3,
    avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=squad1',
    lastSender: '老王',
    lastMsg: '兄弟们，今天也没吃辣，打卡！',
    lastTime: '刚刚',
    unread: 5
  },
  {
    id: 102,
    name: '内江术后康复营',
    level: 1,
    avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=squad2',
    lastSender: '管理员',
    lastMsg: '注意保暖，最近降温了',
    lastTime: '12:00',
    unread: 0
  }
])

const chatHistory = ref([])

// === 2. 动作 ===
const switchTab = (tab) => activeTab.value = tab

const handleAdd = () => {
  if(activeTab.value === 'friend') alert('假装弹出了加好友的框！')
  else alert('假装弹出了搜索小队的框！')
}

// 打开聊天 (type 决定是私聊还是群聊)
const openChat = (item, type) => {
  currentSession.value = item
  currentType.value = type
  showChatWindow.value = true

  // 🔥 模拟加载不同的聊天记录
  if (type === 'friend') {
    chatHistory.value = [
      { id: 1, isMe: false, text: '兄弟，最近咋样？', avatar: item.avatar },
      { id: 2, isMe: true, text: '还行，正在全栈开发呢！' }
    ]
  } else {
    // 群聊数据：多了一个 senderName
    chatHistory.value = [
      { id: 1, isMe: false, senderName: '老王', text: '今天中午吃的清汤面，舒服！', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob' },
      { id: 2, isMe: false, senderName: '阿强', text: '羡慕啊，我还在输液', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack' },
      { id: 3, isMe: true, text: '坚持住兄弟！我也在吃面。' }
    ]
  }
  scrollToBottom()
}

const closeChat = () => showChatWindow.value = false

const sendMessage = () => {
  if (!inputMsg.value.trim()) return

  // 自己发消息
  chatHistory.value.push({
    id: Date.now(),
    isMe: true,
    text: inputMsg.value
  })

  inputMsg.value = ''
  scrollToBottom()

  // 模拟自动回复
  setTimeout(() => {
    chatHistory.value.push({
      id: Date.now() + 1,
      isMe: false,
      senderName: currentType.value === 'group' ? '自动回复机' : undefined,
      text: currentType.value === 'group' ? '收到！队长牛逼！' : '收到兄弟！',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robot'
    })
    scrollToBottom()
  }, 800)
}

const scrollToBottom = () => {
  nextTick(() => {
    const box = document.getElementById('chat-box')
    if (box) box.scrollTop = box.scrollHeight
  })
}
</script>