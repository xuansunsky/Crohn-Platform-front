<template>
  <div class="music-controller" @click="toggleMusic">
    <div class="equalizer" :class="{ 'playing': isPlaying }">
      <span class="bar bar-1"></span>
      <span class="bar bar-2"></span>
      <span class="bar bar-3"></span>
      <span class="bar bar-4"></span>
    </div>
    <audio ref="audioPlayer" loop>
      <source src="https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3" type="audio/mpeg">      Your browser does not support the audio element.
    </audio>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isPlaying: false
    };
  },
  methods: {
    toggleMusic() {
      const player = this.$refs.audioPlayer;
      if (this.isPlaying) {
        player.pause();
      } else {
        player.play();
      }
      this.isPlaying = !this.isPlaying;
    },
    // 尝试自动播放（浏览器可能会拦截，所以需要这个方法）
    tryAutoPlay() {
      const player = this.$refs.audioPlayer;
      player.play().then(() => {
        this.isPlaying = true;
      }).catch(e => {
        console.log("浏览器阻止了自动播放，等待用户点击交互", e);
      });
    }
  },
  mounted() {
    // 页面加载后尝试播放
    this.tryAutoPlay();

    // 监听任意点击，如果还没播放，就趁机播放（这是绕过浏览器限制的黑科技）
    document.addEventListener('click', () => {
      if (!this.isPlaying) {
        this.tryAutoPlay();
      }
    }, { once: true }); // 只执行一次
  }
};
</script>

<style scoped>
/* 悬浮在右下角，极简风格 */
.music-controller {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  background: rgba(0, 0, 0, 0.6); /* 半透明黑 */
  backdrop-filter: blur(10px); /* 毛玻璃 */
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 9999;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.music-controller:hover {
  transform: scale(1.1);
  background: rgba(0, 0, 0, 0.8);
}

/* 模拟声波跳动 */
.equalizer {
  display: flex;
  align-items: flex-end;
  height: 20px;
  gap: 3px;
}

.bar {
  width: 3px;
  background-color: #fff;
  animation: bounce 1s infinite ease-in-out;
}

/* 只有播放时才跳动 */
.playing .bar {
  animation-play-state: running;
}
.equalizer:not(.playing) .bar {
  animation-play-state: paused;
  height: 3px; /* 暂停时变成一条直线 */
}

.bar-1 { animation-delay: 0.0s; height: 10px; }
.bar-2 { animation-delay: 0.2s; height: 18px; }
.bar-3 { animation-delay: 0.4s; height: 14px; }
.bar-4 { animation-delay: 0.1s; height: 8px; }

@keyframes bounce {
  0%, 100% { height: 5px; }
  50% { height: 20px; }
}
</style>