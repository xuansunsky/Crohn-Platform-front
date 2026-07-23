<template>
  <div class="flow-root">
    <div
      class="swipe-viewport"
      @touchstart="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
    >
      <div class="swipe-track" :style="{ transform: `translateX(-${page * 50}%)` }">

        <!-- Page 0：三个记录是主角，小魔娘负责接住每一次表达 -->
        <section class="swipe-page notebook-page">
          <header class="record-head">
            <div>
              <p class="record-eyebrow">FEELING NOTES</p>
              <h1>留下这一刻</h1>
              <p>{{ todayLabel }} · 本周 {{ weekFillLabel }}</p>
            </div>
            <div class="record-tools">
              <button type="button" @click="loadEntries(true)" aria-label="刷新"><i class="ri-refresh-line"></i></button>
              <button type="button" @click="openExport" :disabled="exporting" aria-label="导出"><i class="ri-download-2-line"></i></button>
            </div>
          </header>

          <JournalMascot mode="home" :tone="companionTone" :line="companionLine" />

          <section class="record-prompt">
            <span>今天想留下哪一种？</span>
            <p>不用完整，也不用写得漂亮。</p>
          </section>

          <div class="write-launch">
            <button type="button" class="launch-tile bright" @click="openWrite('bright')">
              <span class="launch-copy">
                <i class="ri-sun-line"></i>
                <strong>亮的</strong>
                <small>开心、松一口气、值得记住</small>
              </span>
              <img src="/media/journal-companion/bright.png" alt="" />
            </button>
            <button type="button" class="launch-tile calm" @click="openWrite('calm')">
              <span class="launch-copy">
                <i class="ri-cloud-line"></i>
                <strong>平常的</strong>
                <small>没什么大事，但这是我的一天</small>
              </span>
              <img src="/media/journal-companion/normal.png" alt="" />
            </button>
            <button type="button" class="launch-tile dark" @click="openWrite('dark')">
              <span class="launch-copy">
                <i class="ri-moon-line"></i>
                <strong>暗的</strong>
                <small>疼、累、孤独，或者说不上来</small>
              </span>
              <img src="/media/journal-companion/comfort.png" alt="" />
            </button>
          </div>

          <section class="nb-body">
            <header class="memory-head">
              <div><span>最近留下的感觉</span><small>她和你一起记得</small></div>
              <strong>{{ entries.length }} 条</strong>
            </header>

            <div v-if="entriesLoading" class="stream-empty">正在拿回你的记录…</div>
            <div v-else-if="!entries.length" class="stream-empty warm">
              <i class="ri-quill-pen-line"></i>
              <strong>这里还没有内容</strong>
              <span>从上面选一种感觉，写一句就好。</span>
            </div>

            <div v-else class="week-stack">
              <article v-for="week in weekGroups" :key="week.key" class="week-block">
                <header class="week-head">
                  <strong>{{ week.label }}</strong>
                  <span v-if="weekGroups.length > 1">{{ week.items.length }} 条</span>
                </header>
                <div class="entry-rows">
                  <button
                    v-for="(entry, idx) in week.items"
                    :key="entry.id"
                    type="button"
                    class="entry-row"
                    :class="entryTone(entry)"
                    @click="openLightbox(entry)"
                  >
                    <span class="entry-rail">
                      <span class="entry-dot"><i :class="toneIcon(entryTone(entry))"></i></span>
                      <span v-if="idx !== week.items.length - 1" class="entry-line"></span>
                    </span>
                    <span class="entry-main">
                      <span class="entry-meta">
                        <time>{{ formatFullTime(entry.createdAt) }} · {{ formatClock(entry.createdAt) }}</time>
                        <span class="entry-chip">{{ toneShortLabel(entryTone(entry)) }}</span>
                      </span>
                      <p class="entry-text">{{ entry.content || '留下一张图片' }}</p>
                      <span class="entry-echo"><i class="ri-heart-3-line"></i>{{ companionReply(entryTone(entry), entry.id || entry.createdAt) }}</span>
                      <span v-if="entryImageUrls(entry).length" class="entry-thumbs">
                        <img v-for="url in entryImageUrls(entry).slice(0, 3)" :key="url" :src="url" alt="" />
                        <span v-if="entryImageUrls(entry).length > 3" class="entry-thumb-more">+{{ entryImageUrls(entry).length - 3 }}</span>
                      </span>
                    </span>
                  </button>
                </div>
              </article>
            </div>
          </section>
        </section>

        <!-- Page 1：AI 对话（节气落地页 + 多轮聊天） -->
        <section class="swipe-page ai-page">
          <!-- 落地页：节气卡开场 + 6身份图片卡，点哪个直接开聊 -->
          <div v-if="aiView === 'home'" class="ai-home">
            <button class="ai-mini-back" @click="page = 0"><i class="ri-arrow-left-line"></i>一周两页</button>

            <div class="jieqi-card" :style="{ backgroundImage: jieqiBgLayers }">
              <div class="jieqi-scrim"></div>
              <p class="jieqi-eyebrow">{{ currentJieqi.name }} · 二十四节气</p>
              <h2 class="jieqi-date">{{ jieqiDateLabel }}</h2>
              <p class="jieqi-poem">{{ currentJieqi.poem }}</p>
          </div>

            <header class="ai-home-head">
              <p class="ai-eyebrow">CROHN · AI</p>
              <h1>找个身份，聊聊</h1>
            </header>

            <div class="home-roles">
              <button
                v-for="r in AI_ROLES"
                :key="r.id"
                type="button"
                class="role-card"
                :class="{ active: roleChooser?.id === r.id || (homeCustomOpen && r.id === 'custom') }"
                :style="{ backgroundImage: roleCardBgLayers(r) }"
                @click="startWithRole(r)"
              >
                <span class="role-icon" :style="{ background: r.grad }"><i :class="r.icon"></i></span>
                <span class="role-label">{{ r.label }}</span>
                <span class="role-desc">{{ r.desc }}</span>
          </button>
            </div>

            <transition name="fade">
              <div v-if="roleChooser" ref="roleChooserPanel" class="role-conversation-picker">
                <header>
                  <div>
                    <small>{{ roleChooser.label }}</small>
                    <strong>继续上次，还是重新开始？</strong>
                  </div>
                  <button type="button" @click="roleChooser = null"><i class="ri-close-line"></i></button>
                </header>
                <button type="button" class="new-role-conversation" @click="startNewRoleConversation">
                  <i class="ri-add-line"></i>
                  <span><strong>开始新对话</strong><small>打开一张新的聊天纸</small></span>
                </button>
                <div v-if="roleConversations.length" class="role-conversation-history">
                  <p>这个身份以前的对话</p>
                  <article
                    v-for="c in roleConversations"
                    :key="c.id"
                    @click="continueRoleConversation(c)"
                  >
                    <span><strong>{{ c.title || '新对话' }}</strong><small>{{ c.lastMessage || '还没开始聊' }}</small></span>
                    <time>{{ formatConvTime(c.updatedAt) }}</time>
                    <button type="button" title="删除这场对话" @click.stop="deleteConversation(c)">
                      <i class="ri-delete-bin-line"></i>
                    </button>
                  </article>
                </div>
                <p v-else class="role-conversation-empty">这个身份还没有旧对话。</p>
              </div>
            </transition>

            <transition name="fade">
              <div v-if="homeCustomOpen" class="home-custom">
                <textarea
                  v-model="customPrompt"
                  maxlength="60"
                  rows="2"
                  placeholder="想要的风格"
                ></textarea>
                <button class="home-custom-go" :disabled="!customPrompt.trim() || roleBusy" @click="openCustomStart">
                  开聊
                </button>
              </div>
            </transition>

          </div>

          <!-- 聊天界面：每个身份一张浅色氛围图 + 纸片气泡 -->
          <div v-else class="ai-chat" :style="{ backgroundImage: chatBgLayers(activeConv?.role) }">
            <header class="ai-chat-head">
              <button class="chat-back" @click="backToHome"><i class="ri-arrow-left-line"></i></button>
              <div class="chat-title">
                <p class="chat-title-main">{{ activeConv?.title || '对话' }}</p>
                <p class="chat-title-sub"><i :class="roleMeta(activeConv?.role).icon"></i>{{ roleMeta(activeConv?.role).label }}</p>
              </div>
              <span class="chat-role-btn" :style="{ background: roleMeta(activeConv?.role).grad }">
                <i :class="roleMeta(activeConv?.role).icon"></i>
              </span>
            </header>

            <div ref="scrollBox" class="chat-scroll">
              <div v-if="msgLoading" class="chat-loading">加载中</div>
              <div v-else-if="!messages.length" class="chat-intro">
                <p>{{ roleMeta(activeConv?.role).label }}</p>
              </div>
              <div v-for="m in messages" :key="m.id" class="msg" :class="m.sender === 'me' ? 'msg-me' : 'msg-ai'">
                <div
                  class="msg-bubble"
                  :class="{ 'msg-feature': m.sender === 'ai' && activeConv?.role === 'summary' }"
                  :style="m.sender === 'ai' ? { background: roleMeta(activeConv?.role).paper, color: roleMeta(activeConv?.role).ink } : {}"
                >
                  <span v-if="m.sender === 'ai' && activeConv?.role === 'summary'" class="msg-feature-tag"><i class="ri-sparkling-2-fill"></i>本次小结</span>
                  <div
                    v-if="m.sender === 'ai'"
                    class="msg-rich"
                    v-html="renderAiHtml(m.content, activeConv?.role)"
                    @click="handleAnswerClick"
                  ></div>
                  <p v-else v-for="(para, pi) in magazineParagraphs(m.content)" :key="pi" class="msg-para">{{ para }}</p>
                </div>
              </div>
          <div v-if="thinking" class="msg msg-ai">
                <div class="msg-bubble msg-typing" :style="{ background: roleMeta(activeConv?.role).paper }"><span></span><span></span><span></span></div>
          </div>
        </div>

        <div class="chat-input">
          <textarea
            v-model="draft"
            class="chat-textarea"
                :placeholder="streaming ? '正在回复...' : '说点什么'"
            rows="1"
            @keydown.enter.exact.prevent="send"
          ></textarea>
          <button class="chat-send" :class="{ 'chat-send-stop': streaming }" :disabled="!streaming && !draft.trim()" @click="send">
            <i v-if="streaming" class="ri-stop-fill"></i>
            <i v-else class="ri-send-plane-fill"></i>
          </button>
        </div>
      </div>
        </section>

      </div>
    </div>

    <div class="page-dots">
      <span :class="{ active: page === 0 }" @click="page = 0"></span>
      <span :class="{ active: page === 1 }" @click="page = 1"></span>
    </div>

    <transition name="fade">
      <div v-if="toastMsg" class="dance-toast">{{ toastMsg }}</div>
    </transition>

    <input ref="recordFileInput" class="hidden-input" type="file" accept="image/*" multiple @change="handleRecordFiles" />

    <transition name="sheetfade">
      <div v-if="writeTone" class="write-full" @click.self="closeWrite" @paste="handleRecordPaste">
        <div class="write-card" :class="writeTone">
          <header class="write-card-top">
            <button type="button" class="write-full-close" @click="closeWrite"><i class="ri-close-line"></i></button>
            <div class="write-character">
              <JournalMascot mode="stage" :tone="writeTone" />
            </div>
          </header>

          <div class="write-card-glass">
            <div class="write-heading">
              <span>{{ toneActionLabel(writeTone) }}</span>
              <p>{{ toneHint(writeTone) }}</p>
            </div>

            <div v-if="!writeDepth" class="depth-pick">
              <button type="button" class="depth-btn primary" @click="writeDepth = 'simple'">
                <i class="ri-quill-pen-line"></i><strong>写一句</strong><small>想到什么就写什么</small>
              </button>
              <button type="button" class="depth-btn soft" @click="enterRichWrite">
                <i class="ri-file-list-3-line"></i><strong>写细一点</strong><small>事情、感觉和身体</small>
              </button>
            </div>

            <template v-else-if="writeDepth === 'simple'">
              <textarea
                v-model="sparkDraft"
                class="write-full-textarea"
                :placeholder="tonePlaceholder(writeTone)"
                rows="5"
                autofocus
                @keydown.enter.ctrl.prevent="saveSpark"
              ></textarea>
            </template>

            <template v-else>
              <label class="rich-field glass">
                <span>发生了什么</span>
                <textarea v-model="richWhat" rows="3" placeholder="按你自己的说法写就好"></textarea>
              </label>
              <label class="rich-field glass">
                <span>{{ toneFeelLabel(writeTone) }}</span>
                <input v-model="richFeel" maxlength="80" placeholder="一个词也可以" />
              </label>
              <label class="rich-field glass">
                <span>身体现在怎么样</span>
                <input v-model="richBody" maxlength="80" placeholder="没什么也可以不写" />
              </label>
            </template>

            <div v-if="writeDepth && (recordImages.length || recordUploading)" class="image-strip on-dark">
              <div v-for="(image, i) in recordImages" :key="image.id" class="image-thumb" :class="{ pending: image.uploading, failed: image.error }">
                <img :src="image.previewUrl || image.url" alt="" />
                <span v-if="image.uploading" class="image-status">…</span>
                <button @click="removeRecordImage(i)"><i class="ri-close-line"></i></button>
              </div>
            </div>

            <div v-if="writeDepth" class="write-full-actions">
              <button type="button" class="spark-image" :disabled="recordUploading" @click="pickRecordImages"><i class="ri-image-add-line"></i><span>图片</span></button>
              <button
                type="button"
                class="spark-submit"
                :class="writeTone"
                :disabled="savingSpark || recordUploading || !canSaveWrite"
                @click="saveSpark"
              >
                <span>{{ savingSpark ? '正在收好…' : (editingEntry ? '保存改写' : '让她替我收好') }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <transition name="sheetfade">
      <div v-if="lightboxEntry" class="lightbox-mask" @click.self="lightboxEntry = null">
        <div class="lightbox-sheet">
          <div class="lightbox-handle"></div>
          <div class="lightbox-scroll">
            <div class="lightbox-companion" :class="entryTone(lightboxEntry)">
              <img :src="tonePortrait(entryTone(lightboxEntry))" alt="" />
              <div>
                <span>她当时这样接住你</span>
                <p>{{ companionReply(entryTone(lightboxEntry)) }}</p>
              </div>
            </div>
            <h2 class="lightbox-title">{{ toneDetailLabel(entryTone(lightboxEntry)) }}</h2>
            <div class="lightbox-meta">
              <span>{{ toneLongLabel(entryTone(lightboxEntry)) }}</span>
              <time>{{ formatFullTime(lightboxEntry.createdAt) }} {{ formatClock(lightboxEntry.createdAt) }}</time>
            </div>
            <div v-if="entryImageUrls(lightboxEntry).length" class="lightbox-images">
              <img v-for="url in entryImageUrls(lightboxEntry)" :key="url" :src="url" alt="" />
            </div>
            <p class="lightbox-content">{{ lightboxEntry.content || '这一刻只留下了一张图片。' }}</p>
            <div v-if="lightboxEntry.mood || lightboxEntry.statusText" class="lightbox-details">
              <p v-if="lightboxEntry.mood"><span>感觉</span>{{ lightboxEntry.mood }}</p>
              <p v-if="lightboxEntry.statusText"><span>身体</span>{{ lightboxEntry.statusText }}</p>
            </div>
            <button
              class="lightbox-card-btn secondary"
              @click="openWrite(lightboxEntry.tone === 'dark' ? 'dark' : (lightboxEntry.tone === 'calm' ? 'calm' : 'bright'), lightboxEntry); lightboxEntry = null"
            >
              <i class="ri-edit-line"></i>改写
            </button>
            <button class="lightbox-card-btn" :disabled="exporting" @click="exportEntryCard(lightboxEntry)">
              <i class="ri-magic-line"></i>{{ exporting ? '正在生成...' : '把这篇做成卡片图' }}
            </button>
          </div>
          <button class="lightbox-close" @click="lightboxEntry = null"><i class="ri-close-line"></i></button>
        </div>
      </div>
    </transition>

    <!-- 导出：选格式（长图 / PDF）→ 选范围 → 美丽导出 -->
    <transition name="sheetfade">
      <div v-if="exportSheetOpen" class="lightbox-mask" @click.self="exportSheetOpen = false">
        <div class="lightbox-sheet export-sheet">
          <div class="lightbox-handle"></div>
          <h2 class="export-title">美丽导出</h2>
          <p class="export-sub">杂志排版，导成长图或整本 PDF。</p>
          <div class="export-formats">
            <button type="button" class="export-format" :class="{ active: exportFormat === 'image' }" @click="exportFormat = 'image'">
              <i class="ri-image-2-line"></i>
              <strong>长图</strong>
              <span>一张长图，存相册随手发</span>
            </button>
            <button type="button" class="export-format" :class="{ active: exportFormat === 'pdf' }" @click="exportFormat = 'pdf'">
              <i class="ri-book-read-line"></i>
              <strong>PDF</strong>
              <span>整本装订，换页不腰斩</span>
          </button>
          </div>
          <div class="export-ranges">
            <button
              v-for="r in EXPORT_RANGES"
              :key="r.id"
              type="button"
              class="export-range"
              :class="{ active: exportRange === r.id }"
              @click="exportRange = r.id"
            >
              <strong>{{ r.label }}</strong>
              <span>{{ r.hint }}</span>
            </button>
          </div>
          <div v-if="exportRange === 'custom'" class="export-custom">
            <label>从<input v-model="exportFrom" type="date" /></label>
            <label>到<input v-model="exportTo" type="date" /></label>
          </div>
          <p class="export-count">{{ exportEntries.length ? `将导出 ${exportEntries.length} 篇` : '这个范围里没有日记' }}</p>
          <button class="export-go" :disabled="exporting || !exportEntries.length" @click="runExport">
            <i :class="exportFormat === 'pdf' ? 'ri-book-read-line' : 'ri-image-2-line'"></i>{{ exporting ? '正在排版生成...' : (exportFormat === 'pdf' ? '生成 PDF' : '生成长图') }}
          </button>
          <button class="lightbox-close" @click="exportSheetOpen = false"><i class="ri-close-line"></i></button>
        </div>
      </div>
    </transition>

    <!-- 长图/PDF 排版区：藏在屏幕外，html2canvas 从这里截；每个 ec-block 是 PDF 分页的最小单位 -->
    <div v-if="exportRendering" ref="exportCanvasRef" class="export-canvas">
      <header class="ec-head ec-block">
        <p class="ec-eyebrow">TWO PAGES · VOL.{{ new Date().getFullYear() }}</p>
        <h1>一周两页</h1>
        <p class="ec-range">{{ exportRangeLabel }} · 共 {{ exportEntries.length }} 页</p>
      </header>
      <article v-for="entry in exportEntries" :key="`ec-${entry.id}`" class="ec-entry ec-block">
        <h2>{{ peakValleyTitle(entry) }}</h2>
        <p class="ec-date">{{ formatFullTime(entry.createdAt) }} {{ formatClock(entry.createdAt) }}<template v-if="entry.mood"> · {{ entry.mood }}</template><template v-if="entry.statusText"> · {{ entry.statusText }}</template></p>
        <p class="ec-content">{{ entry.content }}</p>
        <div v-if="entryImageUrls(entry).length" class="ec-images">
          <img v-for="url in entryImageUrls(entry)" :key="url" :src="url" alt="" crossorigin="anonymous" />
        </div>
        <div class="ec-rule"></div>
      </article>
      <footer class="ec-foot ec-block">CROHN PARADISE · 只属于你的记录</footer>
    </div>

    <!-- 单篇卡片排版区：明信片风，html2canvas 从这里截 -->
    <div v-if="cardRendering && cardEntry" ref="cardCanvasRef" class="card-canvas" :style="{ background: noteArt(cardEntry).bg }">
      <span class="cc-motif" v-html="noteArt(cardEntry).motif"></span>
      <p class="cc-eyebrow">MY JOURNAL · {{ formatFullTime(cardEntry.createdAt) }}</p>
      <span class="cc-quote">&ldquo;</span>
      <h2 v-if="cardEntry.title" class="cc-title">{{ cardEntry.title }}</h2>
      <p class="cc-content">{{ cardEntry.content }}</p>
      <p v-if="cardEntry.mood || cardEntry.statusText" class="cc-mood">{{ [cardEntry.mood, cardEntry.statusText].filter(Boolean).join(' · ') }}</p>
      <footer class="cc-foot"><span></span>CROHN PARADISE<span></span></footer>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onUnmounted, ref, watch } from 'vue'
import http from '@/api/http'
import JournalMascot from './JournalMascot.vue'

const ok = (res) => res && (res.status === 200 || res.code === 200)

// ---- 页面切换（日记本 / AI） ----
const page = ref(0)
watch(page, (p) => {
  if (p === 1 && !convLoaded.value) loadConversations()
})

let touchStartX = 0
let touchStartY = 0
let touching = false
const onTouchStart = (e) => {
  const t = e.touches[0]
  touchStartX = t.clientX
  touchStartY = t.clientY
  touching = true
}
const onTouchMove = () => {}
const onTouchEnd = (e) => {
  if (!touching) return
  touching = false
  const t = e.changedTouches[0]
  const dx = t.clientX - touchStartX
  const dy = t.clientY - touchStartY
  if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.4) {
    if (dx < 0 && page.value === 0) page.value = 1
    else if (dx > 0 && page.value === 1) page.value = 0
  }
}

const toastMsg = ref('')
const toast = (m) => {
  toastMsg.value = m
  setTimeout(() => (toastMsg.value = ''), 1800)
}

const todayLabel = computed(() => {
  const d = new Date()
  const w = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][d.getDay()]
  return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()} · ${w}`
})
const companionTone = ref('calm')
const companionLine = ref('')
const TONE_META = {
  bright: {
    short: '亮', long: '亮起来的一刻', action: '记下亮的', icon: 'ri-sun-line',
    portrait: '/media/journal-companion/bright.png',
    placeholder: '刚刚发生了什么，让你心里亮了一下？',
    replies: ['这份开心，我和你一起收好。', '原来今天有这样一束光呀。', '看到你开心，我也分到一点。'],
  },
  calm: {
    short: '平', long: '平常的一刻', action: '记下平常的', icon: 'ri-cloud-line',
    portrait: '/media/journal-companion/normal.png',
    placeholder: '没什么大事也可以，写写此刻在想什么。',
    replies: ['平常的一天，也被我们认真看见了。', '这一刻没有被日子悄悄带走。', '嗯，我记得你今天这样生活过。'],
  },
  dark: {
    short: '暗', long: '有点暗的一刻', action: '记下暗的', icon: 'ri-moon-line',
    portrait: '/media/journal-companion/comfort.png',
    placeholder: '难受、疼、累，或者说不上来，都可以写。',
    replies: ['不用马上好起来，我先陪你待着。', '这份难受不需要解释，我听见了。', '你愿意写下来就已经够了，我在。'],
  },
}
const normalizeTone = (tone) => ['bright', 'calm', 'dark'].includes(tone) ? tone : 'calm'
const entryTone = (entry) => normalizeTone(entry?.tone)
const toneMeta = (tone) => TONE_META[normalizeTone(tone)]
const toneIcon = (tone) => toneMeta(tone).icon
const toneShortLabel = (tone) => toneMeta(tone).short
const toneLongLabel = (tone) => toneMeta(tone).long
const toneActionLabel = (tone) => toneMeta(tone).action
const toneDetailLabel = (tone) => tone === 'bright' ? '那一刻亮了起来' : tone === 'dark' ? '那一刻有点难受' : '那是平常的一刻'
const tonePortrait = (tone) => toneMeta(tone).portrait
const tonePlaceholder = (tone) => toneMeta(tone).placeholder
const companionReply = (tone, seed = '') => {
  const pool = toneMeta(tone).replies
  if (!seed) return pool[0]
  let sum = 0
  for (let i = 0; i < String(seed).length; i += 1) sum += String(seed).charCodeAt(i)
  return pool[sum % pool.length]
}

// ---- 一周两页：亮/平/暗可多记；角色只负责陪伴，不增加养成负担 ----
const entries = ref([])
const weekCount = ref(0)
const entriesLoading = ref(false)
const writeTone = ref(null) // 'bright' | 'dark' | null
const writeDepth = ref(null) // null | 'simple' | 'rich'
const editingEntry = ref(null)
const sparkDraft = ref('')
const richWhat = ref('')
const richFeel = ref('')
const richBody = ref('')
const savingSpark = ref(false)
const recordImages = ref([])
const recordUploading = ref(false)
const recordFileInput = ref(null)

const toneHint = (tone) => (tone === 'dark'
  ? '先写下来，不必现在想明白。'
  : tone === 'calm'
    ? '一句话就够了。'
    : '以后回来，还能看见。')
const toneFeelLabel = (tone) => (tone === 'dark' ? '这份难受像什么' : (tone === 'calm' ? '此刻是什么感觉' : '这份开心像什么'))

const peakValleyTitle = (entry) => {
  if (!entry) return ''
  if (entry.tone === 'dark') return '暗'
  if (entry.tone === 'bright') return '亮'
  if (entry.tone === 'calm') return '平'
  return '一页'
}
const untitledLabel = peakValleyTitle

const weekFillLabel = computed(() => {
  const n = weekCount.value || thisWeekItems.value.length
  return n ? `${n} 条` : '还空着'
})

const isoWeekKey = (value) => {
  const d = parseEntryDate(value)
  if (!d || Number.isNaN(d.getTime())) return 'unknown'
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  const dayNum = date.getUTCDay() || 7
  date.setUTCDate(date.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1))
  const weekNo = Math.ceil((((date - yearStart) / 86400000) + 1) / 7)
  return `${date.getUTCFullYear()}-W${`${weekNo}`.padStart(2, '0')}`
}
const currentWeekKey = () => isoWeekKey(new Date())

const weekRangeText = (key) => {
  if (!key || key === 'unknown') return ''
  const m = key.match(/(\d{4})-W(\d+)/)
  if (!m) return key
  return `${m[1]} 第 ${Number(m[2])} 周`
}

const thisWeekItems = computed(() => {
  const cur = currentWeekKey()
  return entries.value.filter(e => (e.tone === 'bright' || e.tone === 'dark' || e.tone === 'calm') && isoWeekKey(e.createdAt) === cur)
})

const weekGroups = computed(() => {
  const map = new Map()
  const cur = currentWeekKey()
  for (const entry of entries.value) {
    if (entry.tone !== 'bright' && entry.tone !== 'dark' && entry.tone !== 'calm') continue
    const key = isoWeekKey(entry.createdAt)
    if (!map.has(key)) {
      map.set(key, {
        key,
        label: key === cur ? '本周' : weekRangeText(key),
        items: [],
        sortAt: parseEntryDate(entry.createdAt)?.getTime() || 0,
      })
    }
    const g = map.get(key)
    g.items.push(entry)
    const t = parseEntryDate(entry.createdAt)?.getTime() || 0
    if (t > g.sortAt) g.sortAt = t
  }
  for (const g of map.values()) {
    g.items.sort((a, b) => (parseEntryDate(b.createdAt)?.getTime() || 0) - (parseEntryDate(a.createdAt)?.getTime() || 0))
  }
  if (!map.has(cur)) {
    map.set(cur, { key: cur, label: '本周', items: [], sortAt: Date.now() })
  }
  return Array.from(map.values()).sort((a, b) => b.sortAt - a.sortAt)
})

const loadWriteImages = (existing) => {
  recordImages.value.forEach(image => image.previewUrl && URL.revokeObjectURL(image.previewUrl))
  recordImages.value = []
  if (!existing?.imagesJson) return
  try {
    const urls = JSON.parse(existing.imagesJson)
    if (Array.isArray(urls)) {
      recordImages.value = urls.filter(Boolean).map((url, i) => ({
        id: `e-${i}-${url}`,
        file: null,
        previewUrl: '',
        url,
        uploading: false,
        error: false,
      }))
    }
  } catch { /* ignore */ }
}

const openWrite = (tone, existing = null) => {
  writeTone.value = normalizeTone(tone)
  companionTone.value = normalizeTone(tone)
  companionLine.value = ''
  editingEntry.value = existing || null
  writeDepth.value = null
  sparkDraft.value = ''
  richWhat.value = ''
  richFeel.value = ''
  richBody.value = ''
  if (existing) {
    const hasRich = !!(existing.mood || existing.statusText)
    if (hasRich) {
      writeDepth.value = 'rich'
      richWhat.value = existing.content || ''
      richFeel.value = existing.mood || ''
      richBody.value = existing.statusText || ''
    } else {
      writeDepth.value = 'simple'
      sparkDraft.value = existing.content || ''
    }
  }
  loadWriteImages(existing)
}
const enterRichWrite = () => {
  writeDepth.value = 'rich'
  if (sparkDraft.value.trim() && !richWhat.value.trim()) richWhat.value = sparkDraft.value
}
const closeWrite = () => {
  writeTone.value = null
  writeDepth.value = null
  editingEntry.value = null
  sparkDraft.value = ''
  richWhat.value = ''
  richFeel.value = ''
  richBody.value = ''
  recordImages.value.forEach(image => image.previewUrl && URL.revokeObjectURL(image.previewUrl))
  recordImages.value = []
}

const createLocalImages = (files) => Array.from(files || [])
  .filter(file => file && file.type?.startsWith('image/'))
  .slice(0, 6)
  .map(file => ({
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    file,
    previewUrl: URL.createObjectURL(file),
    url: '',
    uploading: true,
    error: false,
  }))

const uploadOneImage = async (image) => {
  const form = new FormData()
  form.append('file', image.file)
  const res = await http.post('/upload', form, {
    timeout: 120000,
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  if (ok(res) && res.data) return res.data
  throw new Error('上传失败')
}

const readPastedImages = (event) => {
  const items = Array.from(event.clipboardData?.items || [])
  return items
    .filter(item => item.kind === 'file' && item.type.startsWith('image/'))
    .map(item => item.getAsFile())
    .filter(Boolean)
}
const pickRecordImages = () => recordFileInput.value?.click()
const handleRecordFiles = async (event) => {
  await addRecordImages(event.target.files)
  event.target.value = ''
}
const handleRecordPaste = async (event) => {
  const files = readPastedImages(event)
  if (!files.length) return
  event.preventDefault()
  await addRecordImages(files)
}
const addRecordImages = async (files) => {
  if (recordUploading.value) return
  const localImages = createLocalImages(files)
  if (!localImages.length) return
  recordImages.value = [...recordImages.value, ...localImages].slice(0, 6)
  recordUploading.value = true
  try {
    await Promise.all(localImages.map(async (image) => {
      try {
        image.url = await uploadOneImage(image)
        image.uploading = false
      } catch (e) {
        image.uploading = false
        image.error = true
        console.error('日记图片上传失败', e)
      }
    }))
    if (localImages.some(image => image.url)) toast('图片加进来了')
  } finally {
    recordUploading.value = false
  }
}
const removeRecordImage = (index) => {
  const [removed] = recordImages.value.splice(index, 1)
  if (removed?.previewUrl) URL.revokeObjectURL(removed.previewUrl)
}
const recordReadyImages = computed(() => recordImages.value.map(image => image.url).filter(Boolean))
const canSaveWrite = computed(() => {
  if (writeDepth.value === 'simple') return !!(sparkDraft.value.trim() || recordReadyImages.value.length)
  if (writeDepth.value === 'rich') return !!(richWhat.value.trim() || richFeel.value.trim() || recordReadyImages.value.length)
  return false
})

const parseEntryDate = (value) => {
  if (!value) return null
  if (Array.isArray(value)) {
    const [y, m = 1, d = 1, h = 0, min = 0, s = 0] = value
    return new Date(y, m - 1, d, h, min, s)
  }
  return new Date(value)
}
const formatClock = (value) => {
  const d = parseEntryDate(value)
  if (!d || Number.isNaN(d.getTime())) return '--:--'
  const pad = (n) => `${n}`.padStart(2, '0')
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`
}
const formatFullTime = (value) => {
  const d = parseEntryDate(value)
  if (!d || Number.isNaN(d.getTime())) return ''
  const pad = (n) => `${n}`.padStart(2, '0')
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`
}
const entryImageUrls = (entry) => {
  if (!entry?.imagesJson) return []
  try {
    const parsed = JSON.parse(entry.imagesJson)
    return Array.isArray(parsed) ? parsed.filter(Boolean) : []
  } catch {
    return String(entry.imagesJson).split(',').map(s => s.trim()).filter(Boolean)
  }
}

const NOTE_ART = [
  { bg: 'linear-gradient(155deg, #7fb99d 0%, #4f8f74 60%, #2f6b53 100%)',
    motif: '<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M50 8C34 14 22 28 22 44c0 6 2 10 6 12 10-2 20-10 24-24 3-10 1-18-2-24Z" fill="#fff" fill-opacity="0.32"/><path d="M28 46C34 34 42 24 52 16" stroke="#fff" stroke-opacity="0.4" stroke-width="2" stroke-linecap="round"/></svg>' },
  { bg: 'linear-gradient(155deg, #6fa8dc 0%, #3f7cc2 60%, #2a5a99 100%)',
    motif: '<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 40c6-8 12-8 18 0s12 8 18 0 12-8 18 0" stroke="#fff" stroke-opacity="0.4" stroke-width="2.4" stroke-linecap="round"/><path d="M6 52c6-8 12-8 18 0s12 8 18 0 12-8 18 0" stroke="#fff" stroke-opacity="0.24" stroke-width="2.4" stroke-linecap="round"/></svg>' },
  { bg: 'linear-gradient(155deg, #a58fd8 0%, #7c63b8 60%, #5a4894 100%)',
    motif: '<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M40 12a16 16 0 1 0 12 26 13 13 0 0 1-12-26Z" fill="#fff" fill-opacity="0.32"/><circle cx="20" cy="46" r="3" fill="#fff" fill-opacity="0.28"/><circle cx="28" cy="52" r="2" fill="#fff" fill-opacity="0.2"/></svg>' },
  { bg: 'linear-gradient(155deg, #f2a35c 0%, #e07a3f 60%, #c65a2c 100%)',
    motif: '<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M32 10c4 10-2 14 2 22 6-2 10-8 8-16 8 6 12 18 6 28-6 9-20 10-27 2-7-8-4-20 3-27 3-3 6-6 8-9Z" fill="#fff" fill-opacity="0.3"/></svg>' },
  { bg: 'linear-gradient(155deg, #e08fa0 0%, #c45f76 60%, #9c435c 100%)',
    motif: '<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="6" fill="#fff" fill-opacity="0.32"/><circle cx="32" cy="32" r="14" stroke="#fff" stroke-opacity="0.22" stroke-width="1.6"/><circle cx="32" cy="32" r="22" stroke="#fff" stroke-opacity="0.14" stroke-width="1.6"/></svg>' },
]
const noteArt = (entry) => {
  const key = String(entry?.id || '0')
  let sum = 0
  for (let i = 0; i < key.length; i += 1) sum += key.charCodeAt(i)
  return NOTE_ART[sum % NOTE_ART.length]
}

const lightboxEntry = ref(null)
const openLightbox = (entry) => { lightboxEntry.value = entry }

const loadEntries = async (manual = false) => {
  entriesLoading.value = manual
  try {
    const res = await http.get('/dance/entries', { params: { limit: 200, mode: 'peakvalley' }, timeout: 30000 })
    if (ok(res) && res.data) {
      if (Array.isArray(res.data.entries)) entries.value = res.data.entries
      weekCount.value = res.data.weekCount || 0
    }
  } catch (e) {
    console.error('读取一周两页失败', e)
    if (manual) toast('暂时拿不到')
  } finally {
    entriesLoading.value = false
  }
}
const saveSpark = async () => {
  const tone = writeTone.value
  if (!tone || !writeDepth.value || savingSpark.value || recordUploading.value || !canSaveWrite.value) return
  const wasEdit = !!editingEntry.value
  let content = ''
  let mood = ''
  let statusText = ''
  if (writeDepth.value === 'simple') {
    content = sparkDraft.value.trim()
  } else {
    content = richWhat.value.trim()
    mood = richFeel.value.trim()
    statusText = richBody.value.trim()
    if (!content && mood) content = mood
  }
  if (!content && !recordReadyImages.value.length) return
  savingSpark.value = true
  try {
    const payload = {
      title: tone === 'bright' ? '亮' : (tone === 'calm' ? '平' : '暗'),
      content,
      mood,
      statusText,
      imagesJson: JSON.stringify(recordReadyImages.value),
      tone,
      ai: 'false',
    }
    if (editingEntry.value?.id) payload.id = String(editingEntry.value.id)
    const res = await http.post('/dance/entry', payload, { timeout: 30000 })
    if (ok(res) && res.data) {
      companionTone.value = tone
      companionLine.value = companionReply(tone, content || Date.now())
      toast(wasEdit ? '她替你重新收好了' : '她替你收好了这一刻')
      closeWrite()
      loadEntries(false)
    } else {
      toast(res?.message || '没存上')
    }
  } catch (e) {
    console.error('保存峰谷页失败', e)
    toast('没存上')
  } finally {
    savingSpark.value = false
  }
}

// ---- 美丽导出：杂志排版长图（PNG）/ 整本 PDF / 单篇卡片 ----
const exporting = ref(false)
const exportSheetOpen = ref(false)
const exportFormat = ref('image')          // image=长图 / pdf=整本
const exportRange = ref('all')
const exportFrom = ref('')
const exportTo = ref('')
const exportRendering = ref(false)
const exportCanvasRef = ref(null)
const cardRendering = ref(false)
const cardEntry = ref(null)
const cardCanvasRef = ref(null)

const EXPORT_RANGES = [
  { id: 'week', label: '近一周', hint: '最近 7 天' },
  { id: 'month', label: '近一月', hint: '最近 30 天' },
  { id: 'all', label: '全部', hint: '整本都要' },
  { id: 'custom', label: '自选', hint: '自己挑日期' },
]

const openExport = () => {
  if (!entries.value.length) { toast('还没有峰谷可以导出'); return }
  exportSheetOpen.value = true
}

const exportEntries = computed(() => {
  const list = entries.value
  const now = Date.now()
  let fromTs = -Infinity
  let toTs = Infinity
  if (exportRange.value === 'week') fromTs = now - 7 * 86400000
  else if (exportRange.value === 'month') fromTs = now - 30 * 86400000
  else if (exportRange.value === 'custom') {
    if (exportFrom.value) fromTs = new Date(`${exportFrom.value}T00:00:00`).getTime()
    if (exportTo.value) toTs = new Date(`${exportTo.value}T23:59:59`).getTime()
  }
  return list
    .filter(e => {
      const d = parseEntryDate(e.createdAt)
      if (!d || Number.isNaN(d.getTime())) return exportRange.value === 'all'
      const t = d.getTime()
      return t >= fromTs && t <= toTs
    })
    .slice()
    .sort((a, b) => {
      const ta = parseEntryDate(a.createdAt)?.getTime() || 0
      const tb = parseEntryDate(b.createdAt)?.getTime() || 0
      return ta - tb
    })
})

const exportRangeLabel = computed(() => {
  if (exportRange.value === 'week') return '近一周'
  if (exportRange.value === 'month') return '近一月'
  if (exportRange.value === 'custom') return `${exportFrom.value || '起点'} ~ ${exportTo.value || '今天'}`
  return '全部记录'
})

// 等排版区里的图片都加载完再截图，不然图片位置是空白
const waitImages = async (root) => {
  const imgs = Array.from(root?.querySelectorAll('img') || [])
  await Promise.all(imgs.map(img => img.complete
    ? Promise.resolve()
    : new Promise(resolve => { img.onload = resolve; img.onerror = resolve })))
}

const snapshotNode = async (node, scale = 2) => {
  const { default: html2canvas } = await import('html2canvas')
  return html2canvas(node, {
    scale,
    useCORS: true,
    backgroundColor: null,
    windowWidth: node.scrollWidth,
  })
}

const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const stamp = () => {
  const d = new Date()
  const pad = (n) => `${n}`.padStart(2, '0')
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`
}

const runExport = () => (exportFormat.value === 'pdf' ? exportPdf() : exportLongImage())

const exportLongImage = async () => {
  if (exporting.value || !exportEntries.value.length) return
  exporting.value = true
  exportRendering.value = true
  try {
    await nextTick()
    const node = exportCanvasRef.value
    await waitImages(node)
    const canvas = await snapshotNode(node)
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'))
    if (!blob) throw new Error('生成图片失败')
    downloadBlob(blob, `日记本长图_${stamp()}.png`)
    exportSheetOpen.value = false
    toast('长图生成好了')
  } catch (e) {
    console.error('导出长图失败', e)
    toast('长图没生成出来，再试一次')
  } finally {
    exportRendering.value = false
    exporting.value = false
  }
}

// PDF：每个 ec-block（一篇日记）整块搬进页面，放不下就换页——不腰斩
const exportPdf = async () => {
  if (exporting.value || !exportEntries.value.length) return
  exporting.value = true
  exportRendering.value = true
  try {
    await nextTick()
    const node = exportCanvasRef.value
    await waitImages(node)
    const { jsPDF } = await import('jspdf')

    const scale = 2
    const canvas = await snapshotNode(node, scale)
    const nodeTop = node.getBoundingClientRect().top
    const blocks = Array.from(node.querySelectorAll('.ec-block')).map(el => {
      const r = el.getBoundingClientRect()
      return { y: (r.top - nodeTop) * scale, h: r.height * scale }
    })

    const pdf = new jsPDF({ unit: 'pt', format: 'a4' })
    const pageW = pdf.internal.pageSize.getWidth()
    const pageH = pdf.internal.pageSize.getHeight()
    const margin = 34
    const contentW = pageW - margin * 2
    const contentH = pageH - margin * 2
    const pxPerPt = canvas.width / contentW   // 画布像素 → PDF 点

    let cursorY = margin
    let first = true
    for (const block of blocks) {
      let restY = block.y
      let restH = block.h
      while (restH > 0) {
        const blockPtH = restH / pxPerPt
        const spaceLeft = pageH - margin - cursorY
        // 整块放得下就整块放；一整页都放不下的超长块，切页高继续
        const slicePtH = Math.min(blockPtH, contentH)
        if (slicePtH > spaceLeft && !first) {
          pdf.addPage()
          cursorY = margin
        }
        const slicePxH = Math.round(slicePtH * pxPerPt)
        const slice = document.createElement('canvas')
        slice.width = canvas.width
        slice.height = slicePxH
        slice.getContext('2d').drawImage(canvas, 0, restY, canvas.width, slicePxH, 0, 0, canvas.width, slicePxH)
        pdf.addImage(slice.toDataURL('image/jpeg', 0.92), 'JPEG', margin, cursorY, contentW, slicePtH)
        cursorY += slicePtH
        restY += slicePxH
        restH -= slicePxH
        first = false
      }
    }

    pdf.save(`日记本_${stamp()}.pdf`)
    exportSheetOpen.value = false
    toast('PDF 生成好了')
  } catch (e) {
    console.error('导出PDF失败', e)
    toast('PDF 没生成出来，再试一次')
  } finally {
    exportRendering.value = false
    exporting.value = false
  }
}

// 单篇 → 明信片风卡片图
const exportEntryCard = async (entry) => {
  if (exporting.value || !entry) return
  exporting.value = true
  cardEntry.value = entry
  cardRendering.value = true
  try {
    await nextTick()
    const node = cardCanvasRef.value
    await waitImages(node)
    const canvas = await snapshotNode(node, 3)
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'))
    if (!blob) throw new Error('生成卡片失败')
    downloadBlob(blob, `日记卡片_${stamp()}.png`)
    toast('卡片生成好了')
  } catch (e) {
    console.error('生成卡片失败', e)
    toast('卡片没生成出来，再试一次')
  } finally {
    cardRendering.value = false
    cardEntry.value = null
    exporting.value = false
  }
}

loadEntries()

// ---- AI 对话：节气卡落地页 + 多轮聊天，身份自选、自动带日记背景 ----

// 每个身份配一张浅色氛围图（真实照片，放到 public/media/roles/ 下同名文件即可自动生效）
// 图还没放的时候，用 fallback 渐变兜底，不会露黑底
const AI_ROLES = [
  { id: 'guideline', label: '问问指南', desc: '查权威资料，结合健康日记', icon: 'ri-book-open-line', grad: 'linear-gradient(135deg,#2dd4bf,#0f766e)',
    photo: '/media/roles/teacher.png', fallback: 'linear-gradient(165deg, #edf9f6 0%, #d7f0e9 55%, #bde3d8 100%)',
    paper: 'rgba(237,249,246,0.96)', ink: '#163c35' },
  { id: 'summary', label: '总结员', desc: '梳理近况，说重点', icon: 'ri-file-list-3-line', grad: 'linear-gradient(135deg,#60a5fa,#6366f1)',
    photo: '/media/roles/summary.png', fallback: 'linear-gradient(165deg, #eef4fc 0%, #dce8f7 55%, #c9dcf2 100%)',
    paper: 'rgba(236,244,253,0.94)', ink: '#1f3350' },
  { id: 'teacher', label: '老师', desc: '专业中肯的指导', icon: 'ri-graduation-cap-line', grad: 'linear-gradient(135deg,#34d399,#0ea5e9)',
    photo: '/media/roles/teacher.png', fallback: 'linear-gradient(165deg, #eef8f0 0%, #d9efdd 55%, #c3e6cc 100%)',
    paper: 'rgba(234,248,236,0.94)', ink: '#1c3a26' },
  { id: 'madonna', label: '圣母', desc: '无条件包容安慰', icon: 'ri-heart-3-line', grad: 'linear-gradient(135deg,#fb7185,#f472b6)',
    photo: '/media/roles/madonna.png', fallback: 'linear-gradient(165deg, #fdf1f4 0%, #fbe1e8 55%, #f8d0dd 100%)',
    paper: 'rgba(253,240,244,0.94)', ink: '#4a2233' },
  { id: 'pressure', label: '鞭策者', desc: '不夸你，只说你欠的账', icon: 'ri-boxing-line', grad: 'linear-gradient(135deg,#f97316,#ef4444)',
    photo: '/media/roles/pressure.png', fallback: 'linear-gradient(165deg, #fef2e8 0%, #fce1cf 55%, #f8ceb0 100%)',
    paper: 'rgba(254,242,232,0.94)', ink: '#4a2c14' },
  { id: 'natural', label: '纯天然', desc: '不设人设，自然聊', icon: 'ri-seedling-line', grad: 'linear-gradient(135deg,#5eead4,#14b8a6)',
    photo: '/media/roles/natural.png', fallback: 'linear-gradient(165deg, #eefaf3 0%, #d9f1e2 55%, #c2e8cf 100%)',
    paper: 'rgba(234,250,241,0.94)', ink: '#183a2c' },
  { id: 'custom', label: '自定义', desc: '自己写想要的风格', icon: 'ri-quill-pen-line', grad: 'linear-gradient(135deg,#fbbf24,#f97316)',
    photo: '/media/roles/custom.png', fallback: 'linear-gradient(165deg, #fbf6ec 0%, #f3ead4 55%, #ecdfbe 100%)',
    paper: 'rgba(251,246,236,0.94)', ink: '#3d3320' },
]
const DEFAULT_ROLE_META = { label: '纯天然', icon: 'ri-seedling-line', grad: 'linear-gradient(135deg,#a78bfa,#6366f1)',
  photo: '/media/roles/natural.png', fallback: 'linear-gradient(165deg, #eefaf3 0%, #d9f1e2 55%, #c2e8cf 100%)',
  paper: 'rgba(234,250,241,0.94)', ink: '#183a2c' }
const roleMeta = (id) => AI_ROLES.find(r => r.id === id) || DEFAULT_ROLE_META

// 图片优先，图不存在时浏览器会跳过该层，露出后面的浅色渐变兜底——不会露黑
const chatBgLayers = (roleId) => {
  const m = roleMeta(roleId)
  return `linear-gradient(180deg, rgba(255,255,255,0.22), rgba(255,255,255,0.02) 26%, rgba(255,255,255,0.5) 100%), url('${m.photo}'), ${m.fallback}`
}
const roleCardBgLayers = (r) => `linear-gradient(180deg, rgba(20,20,20,0.02), rgba(20,20,20,0.42)), url('${r.photo}'), ${r.fallback}`
const historyCardBgLayers = (c) => {
  const m = roleMeta(c.role)
  return `linear-gradient(180deg, rgba(15,15,20,0.05), rgba(10,10,15,0.7)), url('${m.photo}'), ${m.fallback}`
}

// 长回复按段落切开，别糊成一坨字（AI 有空行就按空行分，没有就按句子攒段）
const magazineParagraphs = (content) => {
  const text = String(content || '').trim()
  if (!text) return []
  let paras = text.split(/\n{2,}/).map(s => s.trim()).filter(Boolean)
  if (paras.length <= 1) {
    const lines = text.split(/\n+/).map(s => s.trim()).filter(Boolean)
    if (lines.length > 1) {
      paras = lines
    } else if (text.length > 90) {
      const sentences = text.match(/[^。！？!?]+[。！？!?]?/g) || [text]
      paras = []
      let buf = ''
      for (const s of sentences) {
        buf += s
        if (buf.length >= 55) { paras.push(buf.trim()); buf = '' }
      }
      if (buf.trim()) paras.push(buf.trim())
    } else {
      paras = [text]
    }
  }
  return paras
}

const escapeHtml = (value) => String(value || '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;')

const PDF_CITATIONS = [
  { pattern: /【?ESPEN(?:\s*2023)?[^】\n]{0,40}?第\s*(\d+)\s*页】?/gi, id: 'espen-ibd-nutrition-2023' },
  { pattern: /【?IOIBD(?:\s*Dietary\s*Guidance)?(?:\s*2020)?[^】\n]{0,40}?第\s*(\d+)\s*页】?/gi, id: 'ioibd-dietary-guidance-2020' },
  { pattern: /【?CCF\s*Medical\s*Nutrition(?:\s*2025)?[^】\n]{0,40}?第\s*(\d+)\s*页】?/gi, id: 'ccf-medical-nutrition-2025' },
  { pattern: /【?NICE(?:\s*NG129)?[^】\n]{0,40}?第\s*(\d+)\s*页】?/gi, id: 'nice-crohn-management-ng129' },
]
const CCF_WEB_URL = 'https://www.crohnscolitisfoundation.org/patientsandcaregivers/diet-and-nutrition/what-should-i-eat'

const renderAiHtml = (content, role) => {
  let html = escapeHtml(content).replace(/\r\n/g, '\n')
  html = html.replace(/^###\s+(.+)$/gm, '<h4>$1</h4>')
    .replace(/^##\s+(.+)$/gm, '<h3>$1</h3>')
    .replace(/^#\s+(.+)$/gm, '<h2>$1</h2>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  if (role === 'guideline') {
    for (const citation of PDF_CITATIONS) {
      html = html.replace(citation.pattern, (label, page) =>
        `<button type="button" class="citation-link" data-document-id="${citation.id}" data-page="${page}">${label}<i class="ri-external-link-line"></i></button>`)
    }
    html = html.replace(/【?CCF[·:：]?\s*What Should I Eat with IBD\?[·:：]?\s*([^】\n]*)】?/gi, (label) =>
      `<a class="citation-link" href="${CCF_WEB_URL}" target="_blank" rel="noopener noreferrer">${label}<i class="ri-external-link-line"></i></a>`)
  }
  html = html.replace(/^(?:[-*]|\d+\.)\s+(.+)$/gm, '<div class="rich-list-item"><span>•</span><div>$1</div></div>')
  return html.split(/\n{2,}/).map(block => {
    const clean = block.trim()
    if (!clean) return ''
    if (/^<(?:h[234]|div class="rich-list-item")/.test(clean)) return clean.replace(/\n/g, '<br>')
    return `<p>${clean.replace(/\n/g, '<br>')}</p>`
  }).join('')
}

const handleAnswerClick = async (event) => {
  const link = event.target.closest('[data-document-id]')
  if (!link) return
  event.preventDefault()
  const documentId = link.dataset.documentId
  const page = Number(link.dataset.page || 1)
  // 必须在点击事件里先开窗口；手机浏览器会拦截 await 之后才执行的 window.open。
  const viewer = window.open('', '_blank')
  try {
    const res = await http.post(`/dance/guideline/document/${encodeURIComponent(documentId)}/ticket`)
    const ticket = res?.data?.ticket
    if (!ok(res) || !ticket) throw new Error('没有拿到阅读票据')
    const base = http.defaults.baseURL || '/api'
    const url = `${base}/dance/guideline/document/${encodeURIComponent(documentId)}?ticket=${encodeURIComponent(ticket)}#page=${page}`
    if (viewer) viewer.location.replace(url)
    else window.location.href = url
  } catch (error) {
    if (viewer) viewer.close()
    console.error('打开指南原文失败', error)
    toast('原文暂时打不开')
  }
}

// 二十四节气（近似公历日期），落地页顶部做成"小暑新晴，荷色满塘"那种卡
const JIEQI = [
  { name: '小寒', m: 1, d: 6, poem: '岁寒知松，静待春归' },
  { name: '大寒', m: 1, d: 20, poem: '寒尽春生，万物待苏' },
  { name: '立春', m: 2, d: 4, poem: '春归大地，万物初醒' },
  { name: '雨水', m: 2, d: 19, poem: '润物无声，草色遥看' },
  { name: '惊蛰', m: 3, d: 6, poem: '一声惊雷，虫醒草生' },
  { name: '春分', m: 3, d: 21, poem: '昼夜均分，燕子归来' },
  { name: '清明', m: 4, d: 5, poem: '烟雨清明，思念如织' },
  { name: '谷雨', m: 4, d: 20, poem: '雨生百谷，茶新叶嫩' },
  { name: '立夏', m: 5, d: 6, poem: '夏木成荫，蝉鸣渐起' },
  { name: '小满', m: 5, d: 21, poem: '麦穗渐满，未至盈时' },
  { name: '芒种', m: 6, d: 6, poem: '麦收稻种，忙碌人间' },
  { name: '夏至', m: 6, d: 21, poem: '白昼最长，荷叶田田' },
  { name: '小暑', m: 7, d: 7, poem: '小暑新晴，荷色满塘' },
  { name: '大暑', m: 7, d: 23, poem: '蝉噪林静，浮瓜沉李' },
  { name: '立秋', m: 8, d: 8, poem: '一叶知秋，暑退凉生' },
  { name: '处暑', m: 8, d: 23, poem: '暑气渐消，天高云淡' },
  { name: '白露', m: 9, d: 8, poem: '露从今夜白，秋意渐浓' },
  { name: '秋分', m: 9, d: 23, poem: '昼夜再平，桂香满庭' },
  { name: '寒露', m: 10, d: 8, poem: '露寒霜近，雁字南飞' },
  { name: '霜降', m: 10, d: 23, poem: '秋叶尽染，霜染枫红' },
  { name: '立冬', m: 11, d: 7, poem: '冬藏万物，暖炉初燃' },
  { name: '小雪', m: 11, d: 22, poem: '雪意未浓，寒意先行' },
  { name: '大雪', m: 12, d: 7, poem: '江山素裹，围炉夜话' },
  { name: '冬至', m: 12, d: 22, poem: '昼短夜长，团圆如愿' },
]
const currentJieqi = computed(() => {
  const now = new Date()
  let current = JIEQI[JIEQI.length - 1]
  for (const j of JIEQI) {
    if (new Date(now.getFullYear(), j.m - 1, j.d) <= now) current = j
    else break
  }
  return current
})
const jieqiDateLabel = computed(() => {
  const d = new Date()
  const j = currentJieqi.value
  const start = new Date(d.getFullYear(), j.m - 1, j.d)
  // 跨年的情况（1月初还在冬至里）：节气开始日在未来说明是去年的
  if (start > d) start.setFullYear(start.getFullYear() - 1)
  const dayN = Math.floor((d - start) / 86400000) + 1
  const base = `${d.getMonth() + 1}月${d.getDate()}日`
  return dayN <= 1 ? `${base} · 今日入${j.name}` : `${base} · ${j.name}第${dayN}天`
})
const jieqiBgLayers = computed(() =>
  `linear-gradient(180deg, rgba(10,20,14,0.05), rgba(8,16,12,0.5)), url('/media/season-hero.png'), linear-gradient(150deg, #eef6ec 0%, #dcefe0 45%, #bfe0cb 75%, #a9d3c4 100%)`
)

const formatConvTime = (value) => {
  const d = parseEntryDate(value)
  if (!d || Number.isNaN(d.getTime())) return ''
  const pad = (n) => `${n}`.padStart(2, '0')
  const today = new Date()
  const sameDay = d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth() && d.getDate() === today.getDate()
  if (sameDay) return `今天 ${pad(d.getHours())}:${pad(d.getMinutes())}`
  return `${d.getMonth() + 1}.${d.getDate()}`
}

// 对话列表
const aiView = ref('home')
const conversations = ref([])
const convLoading = ref(false)
const convLoaded = ref(false)
const loadConversations = async () => {
  convLoading.value = true
  try {
    const res = await http.get('/dance/conversations', { timeout: 20000 })
    if (ok(res) && Array.isArray(res.data)) conversations.value = res.data
    convLoaded.value = true
  } catch (e) {
    console.error('读取对话列表失败', e)
  } finally {
    convLoading.value = false
  }
}
const deleteConversation = async (c) => {
  try {
    const res = await http.delete(`/dance/conversation/${c.id}`)
    if (ok(res)) conversations.value = conversations.value.filter(item => item.id !== c.id)
  } catch (e) {
    console.error('删除对话失败', e)
    toast('删不掉，再试试')
  }
}

const customPrompt = ref('')
const roleBusy = ref(false)
const roleChooser = ref(null)
const roleChooserPanel = ref(null)
const roleConversations = computed(() => {
  if (!roleChooser.value) return []
  return conversations.value.filter(c => c.role === roleChooser.value.id)
})

// 点身份后只展示这个身份的旧对话，让用户明确选择新开或继续。
const homeCustomOpen = ref(false)
const startWithRole = (r) => {
  roleChooser.value = r
  homeCustomOpen.value = false
  nextTick(() => roleChooserPanel.value?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }))
}
const startNewRoleConversation = () => {
  const role = roleChooser.value
  if (!role) return
  if (role.id === 'custom') {
    roleChooser.value = null
    homeCustomOpen.value = true
    return
  }
  createAndOpen(role.id, '')
}
const continueRoleConversation = (conversation) => {
  roleChooser.value = null
  openConversation(conversation)
}
const openCustomStart = () => {
  if (!customPrompt.value.trim()) return
  createAndOpen('custom', customPrompt.value.trim())
}
const createAndOpen = async (role, prompt) => {
  if (roleBusy.value) return
  if (role === 'custom' && !prompt) return
  roleBusy.value = true
  try {
    const res = await http.post('/dance/conversation', { role, customPrompt: prompt || '', diaryCount: '24' }, { timeout: 20000 })
    if (ok(res) && res.data) {
      conversations.value = [res.data, ...conversations.value]
      roleChooser.value = null
      homeCustomOpen.value = false
      customPrompt.value = ''
      openConversation(res.data)
    }
  } catch (e) {
    console.error('新建对话失败', e)
    toast('没成功')
  } finally {
    roleBusy.value = false
  }
}

// 聊天
const activeConv = ref(null)
const messages = ref([])
const msgLoading = ref(false)
const draft = ref('')
const thinking = ref(false)
const streaming = ref(false)
const scrollBox = ref(null)
let msgSeq = 1
let currentStreamId = null
let currentAbort = null

const scrollChatToBottom = () => {
  nextTick(() => {
    const el = scrollBox.value
    if (el) el.scrollTop = el.scrollHeight
  })
}
const openConversation = async (conv) => {
  activeConv.value = conv
  aiView.value = 'chat'
  messages.value = []
  msgLoading.value = true
  try {
    const res = await http.get(`/dance/conversation/${conv.id}/messages`, { timeout: 20000 })
    if (ok(res) && res.data) {
      if (res.data.conversation) activeConv.value = res.data.conversation
      if (Array.isArray(res.data.messages)) {
        messages.value = res.data.messages.map(m => ({ id: `s${m.id}`, sender: m.sender, content: m.content }))
      }
    }
  } catch (e) {
    console.error('读取对话失败', e)
  } finally {
    msgLoading.value = false
    scrollChatToBottom()
  }
}
const backToHome = () => {
  if (streaming.value) stopStreaming()
  aiView.value = 'home'
  loadConversations()
}

const stopStreaming = async () => {
  if (currentAbort) currentAbort.abort()
  if (currentStreamId) {
    try { await http.post('/dance/chat/stop', null, { params: { streamId: currentStreamId } }) } catch (e) {}
  }
  streaming.value = false
  thinking.value = false
}

const send = async () => {
  if (streaming.value) { stopStreaming(); return }
  const text = draft.value.trim()
  if (!text || thinking.value || !activeConv.value) return
  draft.value = ''
  messages.value.push({ id: `l${msgSeq++}`, sender: 'me', content: text })
  scrollChatToBottom()
  thinking.value = true
  streaming.value = true

  const streamId = `${Date.now()}-${Math.random().toString(36).slice(2)}`
  currentStreamId = streamId
  // 用下标定位数组元素来改内容：直接改原始对象引用不会触发 Vue 响应式（会导致"憋着最后一次性出全部"）
  let aiIndex = -1
  const ensureAiIndex = () => {
    if (aiIndex !== -1) return aiIndex
    messages.value.push({ id: `l${msgSeq++}`, sender: 'ai', content: '' })
    aiIndex = messages.value.length - 1
    thinking.value = false
    scrollChatToBottom()
    return aiIndex
  }

  const controller = new AbortController()
  currentAbort = controller
  try {
    const token = (await import('@/utils/authToken')).getValidToken()
    const base = http.defaults.baseURL || ''
    const params = new URLSearchParams({ content: text, streamId })
    const resp = await fetch(`${base}/dance/conversation/${activeConv.value.id}/chat/stream?${params.toString()}`, {
      headers: { Authorization: 'Bearer ' + token },
      signal: controller.signal,
    })
    if (!resp.ok || !resp.body) throw new Error('连接失败')

    const reader = resp.body.getReader()
    const decoder = new TextDecoder('utf-8')
    let buffer = ''
    const handleBlock = (block) => {
      let eventName = 'message'
      const dataLines = []
      for (const raw of block.split('\n')) {
        if (raw.startsWith('event:')) eventName = raw.slice(6).trim()
        else if (raw.startsWith('data:')) dataLines.push(raw.slice(5).replace(/^ /, ''))
      }
      if (!dataLines.length) return
      const dataStr = dataLines.join('\n')
      let payload = ''
      try { payload = JSON.parse(dataStr).t || '' } catch { payload = dataStr }
      if (eventName === 'token') {
        const idx = ensureAiIndex()
        messages.value[idx].content += payload
        scrollChatToBottom()
      } else if (eventName === 'done') {
        streaming.value = false
        thinking.value = false
      }
    }
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      let sep
      while ((sep = buffer.indexOf('\n\n')) !== -1) {
        handleBlock(buffer.slice(0, sep))
        buffer = buffer.slice(sep + 2)
      }
    }
    if (buffer.trim()) handleBlock(buffer)
    if (aiIndex === -1) { const idx = ensureAiIndex(); messages.value[idx].content = '先帮你记下了。' }
  } catch (e) {
    if (e.name !== 'AbortError') {
      console.error('对话失败', e)
      const idx = ensureAiIndex()
      if (!messages.value[idx].content) messages.value[idx].content = '我这边没接稳，你的话已经先记下了。'
    }
  } finally {
    thinking.value = false
    streaming.value = false
    currentStreamId = null
    currentAbort = null
    scrollChatToBottom()
  }
}

onUnmounted(() => {
  if (currentAbort) currentAbort.abort()
  recordImages.value.forEach(image => image.previewUrl && URL.revokeObjectURL(image.previewUrl))
})
</script>

<style scoped>
.flow-root { position: relative; width: 100%; height: 100%; overflow: hidden; background: #05070d; }
.swipe-viewport { position: relative; width: 100%; height: 100%; overflow: hidden; touch-action: pan-y; }
.swipe-track { display: flex; width: 200%; height: 100%; transition: transform 0.34s cubic-bezier(0.22, 1, 0.36, 1); }
.swipe-page { width: 50%; height: 100%; flex-shrink: 0; overflow-y: auto; }
.hidden-input { display: none; }

.fade-enter-active,.fade-leave-active { transition: opacity 0.28s ease; }
.fade-enter-from,.fade-leave-to { opacity: 0; }
.dance-toast {
  position: fixed; top: 14%; left: 50%; transform: translateX(-50%); z-index: 600;
  background: rgba(15,23,42,0.92); color: #fff; font-size: 13px; font-weight: 800;
  padding: 10px 18px; border-radius: 999px; border: 1px solid rgba(255,255,255,0.16); backdrop-filter: blur(12px);
}

.page-dots { position: absolute; top: 12px; left: 50%; transform: translateX(-50%); z-index: 20; display: flex; gap: 6px; }
.page-dots span { width: 16px; height: 4px; border-radius: 999px; background: rgba(17,24,39,0.14); transition: background 0.2s, width 0.2s; }
.page-dots span.active { background: #6366f1; width: 22px; }

/* 三个感觉记录：角色是陪伴者，记录本身才是页面主角 */
.notebook-page {
  background:
    radial-gradient(circle at 92% 4%, rgba(237, 220, 231, .58), transparent 24%),
    radial-gradient(circle at 5% 26%, rgba(249, 230, 199, .5), transparent 23%),
    #fbf8f4;
  padding: calc(22px + env(safe-area-inset-top)) 17px calc(34px + env(safe-area-inset-bottom));
  color: #2e2420;
}
.record-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; padding: 17px 3px 14px; }
.record-eyebrow { color: #ad8d7f; font-size: 9.5px; font-weight: 900; letter-spacing: .22em; }
.record-head h1 { margin-top: 6px; color: #33251f; font-family: Georgia, "Noto Serif SC", serif; font-size: 28px; font-weight: 900; line-height: 1.15; }
.record-head p:not(.record-eyebrow) { margin-top: 7px; color: #9d8e87; font-size: 11px; font-weight: 700; }
.record-tools { display: flex; gap: 7px; padding-top: 2px; }
.record-tools button { width: 36px; height: 36px; display: grid; place-items: center; border: 1px solid rgba(78,55,45,.07); border-radius: 13px; background: rgba(255,255,255,.76); color: #77655c; box-shadow: 0 12px 24px -20px rgba(52,34,27,.45); }
.record-tools button:disabled { opacity: .45; }
.record-prompt { margin: 20px 2px 10px; }
.record-prompt span { color: #4d3c34; font-size: 14px; font-weight: 900; }
.record-prompt p { margin-top: 3px; color: #a29289; font-size: 10.5px; font-weight: 650; }
.write-launch { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 8px; }
.launch-tile { position: relative; height: 142px; overflow: hidden; border: 1px solid rgba(83,58,47,.07); border-radius: 22px; text-align: left; box-shadow: 0 18px 34px -28px rgba(65,42,33,.48); transition: transform .17s ease, box-shadow .17s ease; }
.launch-tile:active { transform: scale(.975); box-shadow: 0 10px 20px -18px rgba(65,42,33,.42); }
.launch-tile.bright { background: linear-gradient(155deg, #fff9e9, #f8e0ae); }
.launch-tile.calm { background: linear-gradient(155deg, #fffdf9, #eadfd9); }
.launch-tile.dark { background: linear-gradient(155deg, #f8f4f8, #ddd0df); }
.launch-tile::after { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, transparent 38%, rgba(255,255,255,.88) 70%, rgba(255,255,255,.98)); }
.launch-tile img { position: absolute; z-index: 0; top: 4px; right: -19px; width: 91px; height: 112px; object-fit: contain; object-position: top center; filter: drop-shadow(0 10px 10px rgba(67,43,51,.11)); }
.launch-copy { position: absolute; z-index: 2; inset: auto 9px 10px; }
.launch-copy i { display: grid; place-items: center; width: 25px; height: 25px; margin-bottom: 5px; border-radius: 9px; color: #fff; font-size: 13px; }
.launch-tile.bright .launch-copy i { background: #e9aa36; }
.launch-tile.calm .launch-copy i { background: #a77f72; }
.launch-tile.dark .launch-copy i { background: #745d78; }
.launch-copy strong { display: block; color: #3f302a; font-size: 13px; font-weight: 950; }
.launch-copy small { display: -webkit-box; min-height: 2.7em; margin-top: 3px; overflow: hidden; color: #8f7e75; font-size: 9.5px; font-weight: 650; line-height: 1.35; -webkit-box-orient: vertical; -webkit-line-clamp: 2; line-clamp: 2; }
.memory-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 10px; margin: 25px 2px 14px; }
.memory-head div span { display: block; color: #44342d; font-family: Georgia, "Noto Serif SC", serif; font-size: 16px; font-weight: 900; }
.memory-head div small { display: block; margin-top: 3px; color: #ad9e96; font-size: 9.5px; font-weight: 700; }
.memory-head > strong { padding: 4px 9px; border-radius: 999px; background: #eee7e2; color: #968278; font-size: 9.5px; font-weight: 900; }

.week-stack { display: flex; flex-direction: column; gap: 26px; margin-top: 4px; }
.week-block { padding: 0; }
.week-head {
  display: flex; align-items: baseline; justify-content: space-between; gap: 10px;
  margin-bottom: 14px; padding-bottom: 9px; border-bottom: 1px solid rgba(160,139,98,0.2);
}
.week-head strong { font-size: 16px; font-weight: 950; color: #201a10; font-family: Georgia, "Noto Serif SC", serif; }
.week-head span {
  font-size: 10.5px; font-weight: 800; color: #a08b62; letter-spacing: 0.03em;
  padding: 3px 10px; border-radius: 999px; background: rgba(160,139,98,0.1);
}

/* 时间轴日记条：左侧一条装订线串起亮/暗小圆点，右侧纸片卡各自独立 */
.entry-rows { display: flex; flex-direction: column; }
.entry-row {
  position: relative; width: 100%; text-align: left; padding: 0 0 16px;
  background: transparent; border: none;
  display: flex; align-items: flex-start; gap: 12px;
}
.entry-row:last-child { padding-bottom: 0; }
.entry-rail { position: relative; flex-shrink: 0; width: 30px; display: flex; flex-direction: column; align-items: center; }
.entry-dot {
  width: 30px; height: 30px; border-radius: 50%; flex-shrink: 0; z-index: 1;
  display: flex; align-items: center; justify-content: center; font-size: 13px;
  box-shadow: 0 6px 14px -8px rgba(0,0,0,0.4);
}
.entry-row.bright .entry-dot { color: #8a6218; background: linear-gradient(160deg, #ffe8b8, #f6c453); }
.entry-row.calm .entry-dot { color: #2f4a3d; background: linear-gradient(160deg, #dcebe2, #a8c4b0); }
.entry-row.dark .entry-dot { color: #f3e9df; background: linear-gradient(160deg, #7a6f65, #4a3f37); }
.entry-line { flex: 1; width: 1px; min-height: 14px; margin-top: 4px; background: linear-gradient(180deg, rgba(160,139,98,0.32), rgba(160,139,98,0.04)); }
.entry-main {
  flex: 1; min-width: 0; padding: 13px 14px 12px; border-radius: 16px;
  background: #fff; border: 1px solid rgba(17,24,39,0.05); box-shadow: 0 12px 24px -20px rgba(17,24,39,0.22);
  transition: transform 0.15s ease;
}
.entry-row.dark .entry-main { background: #f7f2f7; }
.entry-row.calm .entry-main { background: #faf7f4; }
.entry-row:active .entry-main { transform: scale(0.985); }
.entry-meta { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.entry-meta time { font-size: 10.5px; font-weight: 750; color: #a8a29a; letter-spacing: 0.02em; }
.entry-chip { flex-shrink: 0; font-size: 9.5px; font-weight: 900; letter-spacing: 0.05em; padding: 2px 9px; border-radius: 999px; }
.entry-row.bright .entry-chip { color: #8a6218; background: #fff3d6; }
.entry-row.calm .entry-chip { color: #745e53; background: #eee4df; }
.entry-row.dark .entry-chip { color: #f5edf6; background: #725c77; }
.entry-text { margin: 8px 0 0; color: #382a24; font-family: Georgia, "Noto Serif SC", serif; font-size: 14px; font-weight: 600; line-height: 1.65; display: -webkit-box; -webkit-line-clamp: 3; line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.entry-echo { display: flex; align-items: flex-start; gap: 5px; margin-top: 9px; padding-top: 8px; border-top: 1px solid rgba(80,55,44,.06); color: #a08c82; font-size: 9.5px; font-weight: 700; line-height: 1.45; }
.entry-echo i { flex-shrink: 0; margin-top: 1px; color: #bd8d9e; font-size: 11px; }
.entry-thumbs { display: flex; gap: 6px; margin-top: 10px; }
.entry-thumbs img { width: 46px; height: 46px; border-radius: 10px; object-fit: cover; flex-shrink: 0; }
.entry-thumb-more {
  width: 46px; height: 46px; flex-shrink: 0; border-radius: 10px; display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 800; color: #97896c; background: rgba(160,139,98,0.12);
}

.write-full { position: fixed; inset: 0; z-index: 920; display: flex; align-items: flex-end; justify-content: center; padding-top: calc(28px + env(safe-area-inset-top)); background: rgba(43,32,29,.48); backdrop-filter: blur(9px); }
.write-card { position: relative; width: 100%; max-width: 480px; max-height: 92dvh; display: flex; flex-direction: column; overflow: hidden; border-radius: 30px 30px 0 0; background: #fbf8f4; box-shadow: 0 -20px 60px -30px rgba(39,25,21,.62); }
.write-card-top { position: relative; flex: 0 0 clamp(220px, 35dvh, 280px); min-height: 0; overflow: hidden; }
.write-character { position: absolute; inset: 0; }
.write-full-close { position: absolute; z-index: 6; top: 13px; right: 14px; width: 34px; height: 34px; display: grid; place-items: center; border: 1px solid rgba(72,51,43,.08); border-radius: 50%; background: rgba(255,255,255,.85); color: #6d5b53; font-size: 18px; box-shadow: 0 10px 22px -18px rgba(42,27,22,.5); backdrop-filter: blur(12px); }
.write-card-glass { position: relative; z-index: 4; flex: 1; min-height: 0; overflow-y: auto; margin-top: -23px; padding: 23px 18px calc(18px + env(safe-area-inset-bottom)); border-top: 1px solid rgba(85,62,53,.07); border-radius: 25px 25px 0 0; background: #fbf8f4; overscroll-behavior: contain; -webkit-overflow-scrolling: touch; }
.write-card-glass::before { content: ""; display: block; width: 34px; height: 3px; margin: -12px auto 15px; border-radius: 999px; background: rgba(104,78,67,.13); }
.write-heading { margin-bottom: 14px; }
.write-heading span { display: flex; align-items: center; gap: 6px; color: #634d43; font-family: Georgia, "Noto Serif SC", serif; font-size: 16px; font-weight: 950; }
.write-heading p { margin-top: 5px; color: #9d8d85; font-size: 10.5px; font-weight: 650; line-height: 1.5; }
.depth-pick { display: grid; grid-template-columns: 1fr 1fr; gap: 9px; }
.depth-btn { min-height: 88px; display: flex; flex-direction: column; align-items: flex-start; justify-content: center; padding: 13px; border: 1px solid rgba(78,55,45,.07); border-radius: 18px; background: #fff; text-align: left; box-shadow: 0 13px 26px -24px rgba(50,32,25,.48); }
.depth-btn i { color: #a57570; font-size: 17px; }
.depth-btn strong { margin-top: 6px; color: #3f302a; font-size: 13px; font-weight: 950; }
.depth-btn small { margin-top: 3px; color: #a3948d; font-size: 9px; font-weight: 650; }
.depth-btn.primary { background: #f8ece7; }
.depth-btn.soft { background: #f3eeeb; }
/* 输入框：白玻璃上再浮一张微微泛黄的纸，靠投影分层，不靠颜色对比 */
.write-full-textarea {
  width: 100%; min-height: 150px; padding: 16px; resize: none; outline: none; border: 1px solid rgba(20,16,10,0.06);
  border-radius: 20px;
  background: #fffaf0;
  color: #2b2013; font-size: 16px; line-height: 1.75; font-weight: 550; font-family: Georgia, "Noto Serif SC", serif;
  box-shadow: 0 10px 22px -16px rgba(40,30,20,0.18);
}
.write-full-textarea::placeholder { color: rgba(60,45,25,0.4); }
.rich-field { display: flex; flex-direction: column; gap: 6px; margin-top: 12px; }
.rich-field:first-child { margin-top: 0; }
.rich-field span { font-size: 11px; font-weight: 900; letter-spacing: 0.08em; color: rgba(40,32,22,0.55); }
.rich-field.glass textarea, .rich-field.glass input {
  width: 100%; border: 1px solid rgba(20,16,10,0.06); outline: none; border-radius: 16px; padding: 12px 14px;
  background: #fffaf0;
  color: #2b2013; font-size: 15px; font-weight: 600; font-family: Georgia, "Noto Serif SC", serif;
  box-shadow: 0 8px 18px -14px rgba(40,30,20,0.16);
}
.rich-field.glass textarea::placeholder, .rich-field.glass input::placeholder { color: rgba(60,45,25,0.36); }
.rich-field textarea { resize: none; line-height: 1.6; }
.image-strip.on-dark { margin-top: 12px; }
.write-full-actions { display: grid; grid-template-columns: 66px 1fr; gap: 9px; margin-top: 14px; }
.spark-submit.bright { background: linear-gradient(135deg, #f3cc75, #e9a96e); color: #412c1b; }
.spark-submit.calm { background: linear-gradient(135deg, #d7b7ab, #b88980); color: #fff; }
.spark-submit.dark { background: linear-gradient(135deg, #947699, #6e5874); color: #fff; }
.image-strip { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; padding: 10px 0 2px; }
.image-thumb { position: relative; width: 100%; aspect-ratio: 1; border-radius: 12px; overflow: hidden; background: #eef2f7; border: 1px solid rgba(17,24,39,0.06); }
.image-thumb img { width: 100%; height: 100%; object-fit: cover; }
.image-thumb button { position: absolute; top: 3px; right: 3px; width: 20px; height: 20px; border-radius: 999px; background: rgba(15,23,42,0.72); color: #fff; display: flex; align-items: center; justify-content: center; }
.image-thumb.pending img { filter: saturate(0.8) brightness(0.72); }
.image-thumb.failed img { filter: grayscale(1) brightness(0.55); }
.image-status { position: absolute; left: 6px; bottom: 6px; padding: 3px 7px; border-radius: 999px; font-size: 10px; font-weight: 900; color: #fff; background: rgba(15,23,42,0.76); }
.image-status.error { background: rgba(220,38,38,0.82); }
.spark-actions { display: grid; grid-template-columns: 1fr 48px; gap: 10px; margin-top: 12px; }
.spark-submit,.spark-image { min-height: 46px; border-radius: 15px; display: flex; align-items: center; justify-content: center; gap: 7px; font-size: 13px; font-weight: 900; }
.spark-submit { box-shadow: 0 15px 28px -20px rgba(76,48,40,.6); }
.spark-submit:disabled,.spark-image:disabled { opacity: 0.48; }
.spark-image { color: #715f57; background: #fff; border: 1px solid rgba(72,50,42,.07); font-size: 14px; }
.spark-image i { font-size: 17px; }
.spark-image span { font-size: 9.5px; }

.nb-body { margin-top: 0; }
.stream-head { display: flex; align-items: center; justify-content: space-between; padding: 0 2px 10px; }
.stream-head span { font-size: 12px; font-weight: 700; color: #9ca3af; }
.stream-head button { width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; border-radius: 9px; color: #6b7280; background: #eef2f7; }
.stream-empty { padding: 26px 14px; border-radius: 12px; text-align: center; font-size: 13px; line-height: 1.7; color: #9ca3af; background: #f2f0ea; border: 1px solid rgba(17,24,39,0.04); }

/* 相册网格 */
.gallery-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
.gallery-tile { position: relative; border-radius: 18px; overflow: hidden; aspect-ratio: 0.82; background: #eee; box-shadow: 0 10px 24px -18px rgba(15,23,42,0.32); }
.gallery-tile img { width: 100%; height: 100%; object-fit: cover; }
.gallery-count { position: absolute; top: 8px; right: 8px; display: flex; align-items: center; gap: 3px; padding: 3px 7px; border-radius: 999px; background: rgba(15,23,42,0.55); color: #fff; font-size: 10px; font-weight: 800; }
.gallery-overlay { position: absolute; left: 0; right: 0; bottom: 0; padding: 20px 10px 10px; background: linear-gradient(180deg, transparent, rgba(0,0,0,0.68)); }
.gallery-overlay p { font-size: 12px; line-height: 1.4; color: #fff; font-weight: 650; display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; font-family: Georgia, "Noto Serif SC", serif; }
.gallery-overlay time { display: block; margin-top: 4px; font-size: 10px; color: rgba(255,255,255,0.72); font-weight: 700; }
.gallery-note { position: relative; width: 100%; height: 100%; padding: 16px 14px 14px; display: flex; flex-direction: column; justify-content: flex-end; overflow: hidden; }
.gallery-note::before {
  content: ""; position: absolute; inset: 0; pointer-events: none; mix-blend-mode: overlay; opacity: 0.5;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E");
}
.gallery-note-motif { position: absolute; right: -6px; bottom: -6px; width: 78px; height: 78px; opacity: 0.9; pointer-events: none; }
.gallery-note-motif :deep(svg) { width: 100%; height: 100%; }
.gallery-note-quote { position: relative; font-family: Georgia, serif; font-size: 40px; line-height: 0.6; color: rgba(255,255,255,0.4); margin-bottom: 6px; }
.gallery-note-title { position: relative; font-size: 14.5px; line-height: 1.4; color: #fff; font-weight: 900; font-family: Georgia, "Noto Serif SC", serif; margin-bottom: 4px; display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.gallery-note p { position: relative; font-size: 13.5px; line-height: 1.6; color: #fff; font-weight: 600; display: -webkit-box; -webkit-line-clamp: 5; line-clamp: 5; -webkit-box-orient: vertical; overflow: hidden; white-space: pre-wrap; font-family: Georgia, "Noto Serif SC", serif; text-shadow: 0 1px 8px rgba(0,0,0,0.12); }
.gallery-note time { position: relative; margin-top: 8px; font-size: 10px; color: rgba(255,255,255,0.62); font-weight: 700; }

/* 时间线 */
.day-stack { display: flex; flex-direction: column; gap: 14px; }
.day-page { padding: 4px 0; }
.day-header { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 12px; }
.day-date-chip { display: flex; align-items: center; gap: 10px; }
.day-date-num { font-size: 22px; line-height: 1; font-weight: 950; color: #172033; font-family: Georgia, "Noto Serif SC", serif; }
.day-date-sep { width: 1px; height: 18px; background: rgba(17,24,39,0.12); flex-shrink: 0; }
.day-date-info { display: flex; flex-direction: column; gap: 2px; }
.day-date-info em { font-style: normal; font-size: 11.5px; font-weight: 800; color: #111827; }
.day-date-info small { display: flex; align-items: center; gap: 6px; font-size: 10.5px; font-weight: 650; color: #9ca3af; }
.day-label { width: fit-content; padding: 2px 7px; border-radius: 999px; font-size: 9.5px; font-weight: 800; color: #6f9c82; background: #ecf3ea; border: 1px solid rgba(17,24,39,0.04); }
.day-count { flex-shrink: 0; font-style: normal; font-size: 11px; font-weight: 700; color: #9ca3af; }
.entry-list { display: flex; flex-direction: column; gap: 4px; }
/* 杂志文章式条目：标题（衬线大字）→ 时间行 → 正文 → 细分隔线 */
.entry-card { position: relative; padding: 14px 2px 4px; cursor: pointer; }
.entry-title { font-size: 18.5px; line-height: 1.35; font-weight: 900; color: #201a10; font-family: Georgia, "Noto Serif SC", serif; word-break: break-word; }
.entry-dateline { margin-top: 5px; font-size: 11px; font-weight: 750; letter-spacing: 0.04em; color: #a08b62; }
.entry-content { margin-top: 8px; font-size: 15px; line-height: 1.85; font-weight: 500; color: #3a3428; white-space: pre-wrap; word-break: break-word; font-family: Georgia, "Noto Serif SC", serif; display: -webkit-box; -webkit-line-clamp: 6; line-clamp: 6; -webkit-box-orient: vertical; overflow: hidden; }
.entry-images { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; margin-top: 10px; }
.entry-images img { width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 10px; }
.entry-rule { margin-top: 14px; height: 1px; background: linear-gradient(90deg, rgba(160,139,98,0.35), rgba(17,24,39,0.04)); }
.entry-card:last-child .entry-rule { display: none; }

/* AI 页（对话） */
.ai-page { position: relative; color: #1f2937; background: #F5F1E7; overflow: hidden; isolation: isolate; }
@keyframes spin { to { transform: rotate(360deg); } }

/* 落地页 */
.ai-home {
  position: relative; z-index: 1; height: 100%; overflow-y: auto; overscroll-behavior: contain;
  padding: 44px 20px calc(90px + env(safe-area-inset-bottom));
  display: flex; flex-direction: column;
}
.ai-mini-back { display: inline-flex; align-items: center; gap: 4px; margin-bottom: 16px; padding: 6px 12px 6px 8px; border-radius: 999px; background: rgba(255,255,255,0.85); border: 1px solid rgba(17,24,39,0.06); color: #475569; font-size: 12px; font-weight: 800; box-shadow: 0 6px 16px -12px rgba(15,23,42,0.25); align-self: flex-start; }

/* 节气卡：落地页开场 */
.jieqi-card {
  position: relative; overflow: hidden; border-radius: 24px; padding: 22px 20px; min-height: 148px;
  display: flex; flex-direction: column; justify-content: flex-end;
  background-size: cover, cover, cover; background-position: center, center, center; background-repeat: no-repeat, no-repeat, no-repeat;
  box-shadow: 0 20px 44px -28px rgba(15,23,42,0.45);
}
.jieqi-scrim { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(10,20,14,0.02), rgba(8,16,12,0.5)); }
.jieqi-eyebrow { position: relative; font-size: 11px; font-weight: 900; letter-spacing: 0.14em; color: rgba(255,255,255,0.86); text-shadow: 0 2px 10px rgba(0,0,0,0.3); }
.jieqi-date { position: relative; margin-top: 6px; font-size: 26px; font-weight: 950; color: #fff; font-family: Georgia, "Noto Serif SC", serif; text-shadow: 0 2px 14px rgba(0,0,0,0.35); }
.jieqi-poem { position: relative; margin-top: 6px; font-size: 13px; font-weight: 700; color: rgba(255,255,255,0.92); letter-spacing: 0.02em; text-shadow: 0 2px 10px rgba(0,0,0,0.3); }

.ai-home-head { margin: 18px 0 20px; }
.ai-eyebrow { font-size: 10.5px; font-weight: 900; letter-spacing: 0.24em; color: #6f9c82; }
.ai-home-head h1 { margin-top: 8px; font-size: 27px; font-weight: 950; letter-spacing: 0; color: #1f2937; font-family: Georgia, "Noto Serif SC", serif; }
.ai-home-sub { margin-top: 8px; font-size: 12.5px; line-height: 1.7; color: #7c8a8b; font-weight: 600; max-width: 290px; }

/* 落地页身份卡片：图片背景（还没放真图时用浅色渐变兜底，不露黑） */
.home-roles { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 9px; }

.home-custom { margin-top: 12px; padding: 14px; border-radius: 18px; background: rgba(255,255,255,0.7); border: 1px solid rgba(17,24,39,0.06); backdrop-filter: blur(20px); box-shadow: 0 14px 30px -24px rgba(15,23,42,0.3); }
.home-custom textarea {
  width: 100%; padding: 10px 12px; border-radius: 12px; resize: none; outline: none; font-family: inherit;
  background: rgba(255,255,255,0.9); border: 1px solid rgba(17,24,39,0.08); color: #1f2937; font-size: 13.5px; line-height: 1.6; font-weight: 600;
}
.home-custom textarea::placeholder { color: #9aa39a; }
.home-custom-go { width: 100%; margin-top: 10px; padding: 12px; border-radius: 13px; background: linear-gradient(135deg, #fbbf24, #f97316); color: #1c120a; font-size: 13.5px; font-weight: 900; }
.home-custom-go:disabled { opacity: 0.5; }

.role-conversation-picker {
  margin-top: 12px; padding: 15px; border-radius: 22px;
  background: rgba(255,255,255,0.78); border: 1px solid rgba(17,24,39,0.06);
  backdrop-filter: blur(20px); box-shadow: 0 18px 38px -28px rgba(15,23,42,0.42);
}
.role-conversation-picker header { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.role-conversation-picker header div { display: flex; flex-direction: column; gap: 3px; }
.role-conversation-picker header small { color: #0f766e; font-size: 11px; font-weight: 900; }
.role-conversation-picker header strong { color: #1f2937; font-size: 16px; font-weight: 950; }
.role-conversation-picker header button { width: 32px; height: 32px; border-radius: 11px; color: #64748b; background: rgba(15,23,42,0.05); }
.new-role-conversation { width: 100%; margin-top: 13px; padding: 13px; display: flex; align-items: center; gap: 11px; text-align: left; border-radius: 16px; color: #fff; background: linear-gradient(135deg,#14b8a6,#0f766e); }
.new-role-conversation > i { font-size: 22px; }
.new-role-conversation span,.role-conversation-history article > span { min-width: 0; display: flex; flex: 1; flex-direction: column; gap: 3px; }
.new-role-conversation strong,.role-conversation-history strong { font-size: 13.5px; font-weight: 900; }
.new-role-conversation small { color: rgba(255,255,255,0.78); font-size: 11px; }
.role-conversation-history { margin-top: 15px; display: flex; flex-direction: column; gap: 8px; }
.role-conversation-history > p { color: #718096; font-size: 11px; font-weight: 850; }
.role-conversation-history article { width: 100%; padding: 11px 10px 11px 12px; display: flex; align-items: center; gap: 9px; text-align: left; border-radius: 14px; background: rgba(255,255,255,0.8); border: 1px solid rgba(17,24,39,0.06); cursor: pointer; }
.role-conversation-history strong { color: #263238; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.role-conversation-history small { color: #7c8a8b; font-size: 11px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.role-conversation-history time { flex-shrink: 0; color: #94a3b8; font-size: 10px; font-weight: 750; }
.role-conversation-history article > button { flex-shrink: 0; width: 30px; height: 30px; display: grid; place-items: center; border-radius: 10px; color: #b56b6b; background: rgba(248,113,113,0.1); font-size: 14px; }
.role-conversation-history article > button:active { color: #fff; background: #ef7171; }
.role-conversation-empty { margin-top: 13px; padding: 12px; text-align: center; border-radius: 14px; color: #7c8a8b; background: rgba(255,255,255,0.45); font-size: 12px; font-weight: 650; }

.history-dock {
  margin-top: 20px; padding: 14px; border-radius: 26px;
  background: rgba(255,255,255,0.55);
  border: 1px solid rgba(17,24,39,0.05); backdrop-filter: blur(18px);
  box-shadow: 0 20px 48px -36px rgba(15,23,42,0.35);
}
.history-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 2px 2px 12px; }
.history-head div { display: flex; flex-direction: column; gap: 3px; }
.history-head span { font-size: 10.5px; font-weight: 950; letter-spacing: 0.14em; color: #6f9c82; }
.history-head strong { font-size: 16px; font-weight: 950; color: #1f2937; }
.history-head button {
  width: 32px; height: 32px; border-radius: 12px; display: flex; align-items: center; justify-content: center;
  color: #64748b; background: rgba(255,255,255,0.8); border: 1px solid rgba(17,24,39,0.06);
}
.history-list { display: flex; flex-direction: column; gap: 10px; }

/* 历史对话：壁纸卡片——图 + 角色名 + 上次聊到什么 + 时间 */
.conv-card {
  position: relative; overflow: hidden; min-height: 118px; padding: 14px; cursor: pointer;
  border-radius: 20px; display: flex; flex-direction: column; justify-content: flex-end;
  background-size: cover, cover, cover; background-position: center, center, center; background-repeat: no-repeat, no-repeat, no-repeat;
  box-shadow: 0 16px 34px -26px rgba(15,23,42,0.5);
}
.conv-card:active { transform: scale(0.985); }
.conv-role-chip {
  position: absolute; top: 12px; left: 12px; display: inline-flex; align-items: center; gap: 5px;
  padding: 4px 10px 4px 8px; border-radius: 999px; color: #fff; font-size: 10.5px; font-weight: 800;
  box-shadow: 0 8px 18px -10px rgba(0,0,0,0.5); width: fit-content;
}
.conv-item-body { position: relative; }
.conv-item-title { font-size: 14.5px; font-weight: 850; color: #fff; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-shadow: 0 2px 10px rgba(0,0,0,0.3); }
.conv-item-preview { margin-top: 4px; font-size: 11.5px; font-weight: 600; color: rgba(255,255,255,0.85); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-shadow: 0 2px 8px rgba(0,0,0,0.3); }
.conv-item-meta { margin-top: 5px; font-size: 10px; font-weight: 700; color: rgba(255,255,255,0.65); }
.conv-empty { margin-top: 6px; text-align: center; font-size: 13px; color: #7c8a8b; font-weight: 650; }
.conv-empty-soft {
  padding: 13px 14px; border-radius: 16px; background: rgba(255,255,255,0.5);
  border: 1px dashed rgba(17,24,39,0.12);
}
.conv-del {
  position: absolute; top: 10px; right: 10px; z-index: 2; flex-shrink: 0; width: 28px; height: 28px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center; color: #fff; background: rgba(15,23,42,0.35); font-size: 14px; backdrop-filter: blur(6px);
}
.conv-del:active { background: rgba(248,113,113,0.6); }

.start-mask {
  position: absolute; inset: 0; z-index: 120; display: flex; align-items: flex-end; justify-content: center;
  width: 100%; min-height: 100%; box-sizing: border-box; padding: 18px 18px calc(18px + env(safe-area-inset-bottom));
  background: linear-gradient(180deg, rgba(15,23,42,0.08), rgba(15,23,42,0.58)); backdrop-filter: blur(8px);
}
.start-sheet {
  position: relative; width: 100%; max-width: 430px; max-height: calc(100% - 12px); overflow-y: auto; margin: 0 auto; padding: 18px;
  box-sizing: border-box;
  border-radius: 28px; color: #0f172a;
  background: linear-gradient(180deg, rgba(248,250,252,0.98), rgba(226,232,240,0.94));
  border: 1px solid rgba(255,255,255,0.82); box-shadow: 0 28px 70px -28px rgba(2,6,23,0.72);
}
.start-close { position: absolute; top: 14px; right: 14px; width: 32px; height: 32px; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #475569; background: rgba(15,23,42,0.06); font-size: 18px; }
.start-role { display: flex; align-items: center; gap: 12px; padding-right: 38px; }
.start-role-icon { width: 48px; height: 48px; border-radius: 17px; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 22px; box-shadow: 0 14px 30px -18px rgba(15,23,42,0.9); }
.start-role div { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
.start-role span { font-size: 11px; font-weight: 900; letter-spacing: 0.12em; color: #64748b; }
.start-role strong { font-size: 20px; font-weight: 950; color: #0f172a; }
.start-title { margin-top: 16px; font-size: 13px; line-height: 1.6; font-weight: 800; color: #475569; }
.start-options { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; margin-top: 12px; }
.start-option { min-height: 76px; padding: 12px; border-radius: 18px; text-align: left; background: rgba(255,255,255,0.74); border: 1px solid rgba(148,163,184,0.22); box-shadow: 0 10px 24px -22px rgba(15,23,42,0.55); }
.start-option strong { display: block; font-size: 16px; font-weight: 950; color: #111827; }
.start-option span { display: block; margin-top: 5px; font-size: 11px; line-height: 1.45; font-weight: 700; color: #64748b; }
.start-option.active { color: #fff; background: linear-gradient(135deg, #14b8a6, #2563eb); border-color: rgba(255,255,255,0.78); box-shadow: 0 16px 32px -20px rgba(20,184,166,0.8); }
.start-option.active strong,.start-option.active span { color: #fff; }
.start-go { width: 100%; min-height: 48px; margin-top: 14px; border-radius: 18px; display: flex; align-items: center; justify-content: center; gap: 8px; color: #fff; background: linear-gradient(135deg, #111827, #2563eb 58%, #14b8a6); font-size: 14px; font-weight: 950; box-shadow: 0 18px 34px -22px rgba(37,99,235,0.72); }
.start-go:disabled { opacity: 0.58; }

/* 聊天界面：浅色氛围图 + 纸片气泡 */
.ai-chat {
  position: relative; z-index: 1; height: 100%; display: flex; flex-direction: column;
  background-size: cover, cover, cover; background-position: center, center, center; background-repeat: no-repeat, no-repeat, no-repeat;
}
.ai-chat-head { display: flex; align-items: center; gap: 12px; padding: 44px 16px 12px; border-bottom: 1px solid rgba(17,24,39,0.06); background: rgba(255,255,255,0.55); backdrop-filter: blur(20px); }
.chat-back { width: 36px; height: 36px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; border-radius: 13px; background: rgba(255,255,255,0.75); border: 1px solid rgba(17,24,39,0.06); color: #334155; font-size: 18px; }
.chat-title { flex: 1; min-width: 0; }
.chat-title-main { font-size: 16px; font-weight: 900; color: #1f2937; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.chat-title-sub { display: flex; align-items: center; gap: 4px; margin-top: 3px; font-size: 11.5px; color: #6b7c7d; font-weight: 700; }
.chat-role-btn { width: 40px; height: 40px; flex-shrink: 0; border-radius: 13px; display: inline-flex; align-items: center; justify-content: center; color: #fff; font-size: 18px; box-shadow: 0 8px 20px -12px rgba(0,0,0,0.4); }
.chat-scroll { flex: 1; overflow-y: auto; padding: 18px 16px 14px; }
.chat-loading { text-align: center; font-size: 12.5px; color: #64748b; padding: 20px; }
.chat-intro { padding: 14px 16px; border-radius: 16px; background: rgba(255,255,255,0.66); border: 1px solid rgba(17,24,39,0.06); margin-bottom: 16px; backdrop-filter: blur(10px); }
.chat-intro p { font-size: 12.5px; line-height: 1.7; color: #46534f; font-weight: 650; }

/* 纸片气泡：用户白色便签，AI 按身份配色纸张，长回复自动分段 */
.msg { display: flex; flex-direction: column; margin-bottom: 16px; }
.msg-me { align-items: flex-end; }
.msg-ai { align-items: flex-start; }
.msg-bubble { max-width: 86%; padding: 13px 16px; font-size: 15px; line-height: 1.75; font-weight: 550; word-break: break-word; }
.msg-me .msg-bubble { background: rgba(255,253,247,0.94); color: #23271f; border-radius: 4px 18px 18px 18px; box-shadow: 0 10px 22px -14px rgba(60,50,30,0.4); }
.msg-ai .msg-bubble { border-radius: 18px 18px 18px 4px; box-shadow: 0 10px 22px -14px rgba(20,30,25,0.32); font-family: Georgia, "Noto Serif SC", serif; }
.msg-para { margin: 0; }
.msg-para + .msg-para { margin-top: 10px; }
.msg-rich :deep(p) { margin: 0; }
.msg-rich :deep(p + p) { margin-top: 11px; }
.msg-rich :deep(h2), .msg-rich :deep(h3), .msg-rich :deep(h4) { margin: 14px 0 6px; line-height: 1.45; color: inherit; font-family: inherit; }
.msg-rich :deep(h2:first-child), .msg-rich :deep(h3:first-child), .msg-rich :deep(h4:first-child) { margin-top: 0; }
.msg-rich :deep(h2) { font-size: 17px; }
.msg-rich :deep(h3) { font-size: 16px; }
.msg-rich :deep(h4) { font-size: 15px; }
.msg-rich :deep(strong) { font-weight: 950; color: #143d35; }
.msg-rich :deep(.rich-list-item) { display: flex; align-items: flex-start; gap: 8px; margin: 5px 0; }
.msg-rich :deep(.rich-list-item > span) { color: #0f766e; font-weight: 950; }
.msg-rich :deep(.citation-link) { display: inline-flex; align-items: center; gap: 3px; margin: 2px 1px; padding: 2px 7px; border: 0; border-radius: 8px; background: rgba(15,118,110,0.1); color: #0b665e; font: inherit; font-size: 0.9em; font-weight: 850; line-height: 1.55; text-decoration: none; cursor: pointer; vertical-align: baseline; }
.msg-rich :deep(.citation-link:active) { transform: scale(0.97); background: rgba(15,118,110,0.18); }
.msg-rich :deep(.citation-link i) { font-size: 0.9em; }
.msg-feature { max-width: 92% !important; padding: 18px 18px 16px !important; border-radius: 22px !important; box-shadow: 0 20px 42px -22px rgba(0,0,0,0.3) !important; }
.msg-feature-tag { display: inline-flex; align-items: center; gap: 4px; margin-bottom: 10px; padding: 4px 10px; border-radius: 999px; font-size: 10.5px; font-weight: 900; letter-spacing: 0.04em; background: rgba(0,0,0,0.08); }
.msg-feature .msg-para:first-of-type { font-size: 16px; line-height: 1.85; }
.msg-typing { display: flex; gap: 5px; align-items: center; }
.msg-typing span { width: 7px; height: 7px; border-radius: 50%; background: rgba(80,90,80,0.5); animation: blink 1.2s infinite; }
.msg-typing span:nth-child(2) { animation-delay: 0.2s; }
.msg-typing span:nth-child(3) { animation-delay: 0.4s; }
@keyframes blink { 0%,60%,100% { opacity: 0.3; } 30% { opacity: 1; } }

.chat-input { display: flex; align-items: flex-end; gap: 10px; padding: 12px 16px; padding-bottom: calc(12px + env(safe-area-inset-bottom)); border-top: 1px solid rgba(17,24,39,0.06); background: rgba(255,255,255,0.6); backdrop-filter: blur(20px); }
.chat-textarea { flex: 1; max-height: 120px; background: rgba(255,255,255,0.92); border: 1px solid rgba(17,24,39,0.08); border-radius: 18px; padding: 11px 15px; color: #111827; font-size: 15px; line-height: 1.5; font-weight: 600; outline: none; resize: none; font-family: inherit; }
.chat-textarea::placeholder { color: #9ca3af; }
.chat-send { width: 46px; height: 46px; flex-shrink: 0; border-radius: 50%; background: linear-gradient(135deg, #14b8a6, #0f766e); color: #fff; font-size: 18px; display: flex; align-items: center; justify-content: center; box-shadow: 0 12px 28px rgba(20,184,166,0.24); }
.chat-send:disabled { opacity: 0.45; }
.chat-send-stop { background: linear-gradient(135deg, #ef4444, #dc2626); }

/* 身份卡片：图片背景 + 底部渐变文字条（落地页选身份用） */
.role-card {
  position: relative; overflow: hidden; text-align: left; padding: 12px 11px; border-radius: 16px; min-height: 108px;
  display: flex; flex-direction: column; justify-content: flex-end;
  background-size: cover, cover, cover; background-position: center, center, center; background-repeat: no-repeat, no-repeat, no-repeat;
  box-shadow: 0 14px 28px -20px rgba(15,23,42,0.4);
  transition: transform 0.16s ease;
}
.role-card:active { transform: scale(0.96); }
.role-card.active { box-shadow: 0 0 0 2px rgba(255,255,255,0.8), 0 14px 28px -18px rgba(0,0,0,0.5); }
.role-icon { display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 9px; color: #fff; font-size: 14px; margin-bottom: 8px; box-shadow: 0 6px 14px -8px rgba(0,0,0,0.5); }
.role-label { display: block; font-size: 13px; font-weight: 900; color: #fff; text-shadow: 0 2px 8px rgba(0,0,0,0.35); }
.role-desc { display: block; margin-top: 2px; font-size: 9.5px; line-height: 1.3; color: rgba(255,255,255,0.82); font-weight: 600; text-shadow: 0 2px 6px rgba(0,0,0,0.3); }

/* 详情弹层 */
.sheetfade-enter-active,.sheetfade-leave-active { transition: opacity 0.3s ease; }
.sheetfade-enter-from,.sheetfade-leave-to { opacity: 0; }
.lightbox-mask { position: fixed; inset: 0; z-index: 700; background: rgba(5,5,10,0.62); backdrop-filter: blur(4px); display: flex; align-items: flex-end; }
.lightbox-sheet { position: relative; width: 100%; max-height: 82vh; display: flex; flex-direction: column; background: #FBF9F5; border-radius: 24px 24px 0 0; padding: 10px 18px calc(20px + env(safe-area-inset-bottom)); }
.lightbox-handle { width: 36px; height: 4px; border-radius: 999px; background: rgba(17,24,39,0.14); margin: 4px auto 14px; }
.lightbox-scroll { overflow-y: auto; padding-top: 34px; }
.lightbox-companion { display: grid; grid-template-columns: 68px 1fr; gap: 11px; align-items: center; min-height: 86px; margin-bottom: 15px; padding: 8px 13px 8px 5px; overflow: hidden; border-radius: 20px; background: #f2e7e2; }
.lightbox-companion.bright { background: #fff1d0; }
.lightbox-companion.dark { background: #ebe1ec; }
.lightbox-companion img { width: 68px; height: 84px; align-self: end; object-fit: contain; object-position: bottom center; }
.lightbox-companion span { color: #a18d83; font-size: 9.5px; font-weight: 900; letter-spacing: .08em; }
.lightbox-companion p { margin-top: 4px; color: #493831; font-family: Georgia, "Noto Serif SC", serif; font-size: 13px; font-weight: 750; line-height: 1.55; }
.lightbox-title { color: #3a2c26; font-family: Georgia, "Noto Serif SC", serif; font-size: 20px; font-weight: 900; }
.lightbox-images { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; margin-top: 14px; margin-bottom: 14px; }
.lightbox-images img { width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 12px; }
.lightbox-meta { display: flex; flex-wrap: wrap; gap: 10px; font-size: 12px; font-weight: 700; color: #9ca3af; }
.lightbox-meta time { margin-left: auto; }
.lightbox-content { margin-top: 10px; font-size: 15.5px; line-height: 1.85; color: #342721; font-weight: 500; white-space: pre-wrap; word-break: break-word; font-family: Georgia, "Noto Serif SC", serif; }
.lightbox-details { display: grid; gap: 7px; margin-top: 14px; }
.lightbox-details p { padding: 10px 12px; border-radius: 13px; background: #f1ece8; color: #5b4940; font-size: 12px; font-weight: 700; line-height: 1.55; }
.lightbox-details span { margin-right: 8px; color: #aa9185; font-size: 9.5px; font-weight: 900; letter-spacing: .08em; }
.lightbox-close { position: absolute; z-index: 4; top: 14px; right: 14px; width: 30px; height: 30px; border-radius: 999px; background: rgba(255,255,255,.88); border: 1px solid rgba(17,24,39,.06); color: #6f625b; display: flex; align-items: center; justify-content: center; font-size: 17px; box-shadow: 0 10px 20px -17px rgba(43,30,24,.5); }
.lightbox-card-btn { width: 100%; margin-top: 10px; min-height: 46px; border-radius: 15px; display: flex; align-items: center; justify-content: center; gap: 7px; font-size: 13.5px; font-weight: 900; color: #3d3320; background: linear-gradient(135deg, #fde68a, #f6c453); box-shadow: 0 14px 30px -20px rgba(217,160,50,0.8); }
.lightbox-card-btn.secondary { margin-top: 18px; color: #765f54; background: #f1ebe7; border: 1px solid rgba(88,61,50,.07); box-shadow: none; }
.lightbox-card-btn:disabled { opacity: 0.55; }

/* 导出面板 */
.export-sheet { max-height: 88vh; overflow-y: auto; }
.export-title { font-size: 20px; font-weight: 950; color: #201a10; font-family: Georgia, "Noto Serif SC", serif; }
.export-sub { margin-top: 5px; font-size: 12px; font-weight: 650; color: #97896c; }
.export-formats { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 14px; }
.export-format {
  padding: 13px 12px 11px; border-radius: 16px; text-align: left;
  background: #fff; border: 1.5px solid rgba(17,24,39,0.07); box-shadow: 0 10px 24px -22px rgba(15,23,42,0.4);
}
.export-format i { font-size: 20px; color: #a08b62; }
.export-format strong { display: block; margin-top: 6px; font-size: 15px; font-weight: 950; color: #201a10; }
.export-format span { display: block; margin-top: 3px; font-size: 10.5px; line-height: 1.45; font-weight: 700; color: #97896c; }
.export-format.active { border-color: #d9a032; background: #fdf6e6; box-shadow: 0 12px 26px -18px rgba(217,160,50,0.65); }
.export-format.active i { color: #d9a032; }
.export-ranges { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; margin-top: 12px; }
.export-range { padding: 10px 6px; border-radius: 13px; text-align: center; background: #fff; border: 1.5px solid rgba(17,24,39,0.07); }
.export-range strong { display: block; font-size: 12.5px; font-weight: 900; color: #201a10; }
.export-range span { display: block; margin-top: 3px; font-size: 9.5px; font-weight: 700; color: #a3a3a3; }
.export-range.active { border-color: #d9a032; background: #fdf6e6; }
.export-custom { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 10px; }
.export-custom label { display: flex; align-items: center; gap: 6px; font-size: 11.5px; font-weight: 800; color: #97896c; }
.export-custom input { flex: 1; min-width: 0; height: 36px; padding: 0 8px; border-radius: 10px; outline: none; font-size: 12px; font-weight: 700; color: #201a10; background: #fff; border: 1px solid rgba(17,24,39,0.08); }
.export-count { margin-top: 12px; text-align: center; font-size: 12px; font-weight: 750; color: #6f6048; }
.export-go {
  width: 100%; margin-top: 10px; min-height: 48px; border-radius: 16px;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  font-size: 14.5px; font-weight: 950; color: #2b2010;
  background: linear-gradient(135deg, #fbbf24, #f59e0b); box-shadow: 0 16px 34px -20px rgba(217,160,50,0.85);
}
.export-go:disabled { opacity: 0.5; }

/* 长图/PDF 排版画布：固定宽度藏在屏幕外，杂志内页排版 */
.export-canvas {
  position: fixed; left: -10000px; top: 0; width: 720px; z-index: -1;
  padding: 64px 58px 46px; box-sizing: border-box;
  background: linear-gradient(180deg, #fdfaf3 0%, #f8f2e4 100%); color: #201a10;
}
.ec-head { text-align: center; padding-bottom: 38px; }
.ec-eyebrow { font-size: 13px; font-weight: 900; letter-spacing: 0.3em; color: #a08b62; }
.ec-head h1 { margin-top: 12px; font-size: 46px; font-weight: 950; color: #201a10; font-family: Georgia, "Noto Serif SC", serif; }
.ec-range { margin-top: 10px; font-size: 14px; font-weight: 750; color: #97896c; }
.ec-entry { padding: 26px 0 4px; }
.ec-entry h2 { font-size: 24px; line-height: 1.4; font-weight: 900; color: #201a10; font-family: Georgia, "Noto Serif SC", serif; word-break: break-word; }
.ec-date { margin-top: 7px; font-size: 12.5px; font-weight: 750; letter-spacing: 0.05em; color: #a08b62; }
.ec-content { margin-top: 12px; font-size: 16.5px; line-height: 1.95; font-weight: 500; color: #3a3428; white-space: pre-wrap; word-break: break-word; font-family: Georgia, "Noto Serif SC", serif; }
.ec-images { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 14px; }
.ec-images img { width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 10px; }
.ec-rule { margin-top: 24px; height: 1px; background: linear-gradient(90deg, rgba(160,139,98,0.4), rgba(17,24,39,0.05)); }
.ec-foot { padding-top: 30px; text-align: center; font-size: 11.5px; font-weight: 900; letter-spacing: 0.24em; color: #b3a382; }

/* 单篇卡片画布：明信片 3:4，颜色跟相册便签一致 */
.card-canvas {
  position: fixed; left: -10000px; top: 0; width: 540px; min-height: 720px; z-index: -1;
  padding: 52px 46px 40px; box-sizing: border-box; overflow: hidden;
  display: flex; flex-direction: column; color: #fff;
}
.cc-motif { position: absolute; right: -16px; bottom: -16px; width: 200px; height: 200px; opacity: 0.85; pointer-events: none; }
.cc-motif :deep(svg) { width: 100%; height: 100%; }
.cc-eyebrow { position: relative; font-size: 12px; font-weight: 900; letter-spacing: 0.24em; color: rgba(255,255,255,0.75); }
.cc-quote { position: relative; margin-top: 26px; font-family: Georgia, serif; font-size: 84px; line-height: 0.55; color: rgba(255,255,255,0.4); }
.cc-title { position: relative; margin-top: 18px; font-size: 30px; line-height: 1.4; font-weight: 950; font-family: Georgia, "Noto Serif SC", serif; word-break: break-word; }
.cc-content { position: relative; margin-top: 16px; font-size: 19px; line-height: 2; font-weight: 550; white-space: pre-wrap; word-break: break-word; font-family: Georgia, "Noto Serif SC", serif; text-shadow: 0 1px 10px rgba(0,0,0,0.14); }
.cc-mood { position: relative; margin-top: 18px; font-size: 13px; font-weight: 800; color: rgba(255,255,255,0.78); }
.cc-foot { position: relative; margin-top: auto; padding-top: 34px; display: flex; align-items: center; justify-content: center; gap: 12px; font-size: 11px; font-weight: 900; letter-spacing: 0.26em; color: rgba(255,255,255,0.66); }
.cc-foot span { flex: 1; height: 1px; background: rgba(255,255,255,0.3); }
</style>
