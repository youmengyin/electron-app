<template>
  <div class="snow-container">
    <div
      class="snowflake"
      v-for="snowflake in snowflakes"
      :key="snowflake.id"
      :style="snowflake.style"
    >
      ❄
    </div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, onUnmounted } from 'vue'

interface SnowflakeStyle {
  left: string;
  fontSize: string;
  opacity: string;
  animationDuration: string;
  animationDelay: string;
  animationName: string;
  animationDirection: string;
  animationTimingFunction: string;
}

interface Snowflake {
  id: string;
  style: SnowflakeStyle;
}

// 配置选项
const props = withDefaults(defineProps<{
  density?: number;  // 雪花密度 (生成间隔，毫秒)
  minSize?: number;  // 最小雪花尺寸 (px)
  maxSize?: number;  // 最大雪花尺寸 (px)
  minDuration?: number; // 最小动画持续时间 (秒)
  maxDuration?: number; // 最大动画持续时间 (秒)
}>(), {
  density: 300,
  minSize: 10,
  maxSize: 25,
  minDuration: 5,
  maxDuration: 15
});

// 雪花数组
const snowflakes = ref<Snowflake[]>([]);

// 生成唯一ID
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

// 生成随机动画名称
const getRandomAnimation = (): string => {
  const animations = ['fall-1', 'fall-2', 'fall-3', 'fall'];
  return animations[Math.floor(Math.random() * animations.length)];
};

function createSnowflake(): void {
  const size = Math.random() * (props.maxSize - props.minSize) + props.minSize;
  const duration = Math.random() * (props.maxDuration - props.minDuration) + props.minDuration;

  const animName = getRandomAnimation();

  const snowflake: Snowflake = {
    id: generateId(),
    style: {
      left: `${Math.random() * 100}%`, // 随机水平位置
      fontSize: `${size}px`, // 随机大小
      opacity: `${Math.random() * 0.6 + 0.4}`, // 随机透明度 (0.4-1)
      animationDuration: `${duration}s`, // 随机动画时长
      animationDelay: `${Math.random() * 3}s`, // 随机动画延迟
      animationName: animName, // 随机动画类型
      animationDirection: 'infinite',
      animationTimingFunction: 'linear',
    }
  }

  snowflakes.value.push(snowflake);

  // 雪花飘落后移除
  setTimeout(() => {
    snowflakes.value = snowflakes.value.filter((item) => item.id !== snowflake.id);
  }, duration * 1000);

}
let interval: ReturnType<typeof setInterval> | null = null;

onBeforeMount(() => {
  // 初始化雪花
  // 先创建一些初始雪花
  for (let i = 0; i < 10; i++) {
    createSnowflake();
  }
  // 设置定时器持续创建雪花
  interval = setInterval(createSnowflake, props.density);
});

onUnmounted(() => {
  if (interval !== null) {
    clearInterval(interval);
    interval = null;
  }
});

</script>

<style lang="scss" scoped>
.snow-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  // 可以在这里设置背景
  // background: url(http://mms0.baidu.com/it/u=4004612276,3764837023&fm=253&app=138&f=JPEG?w=889&h=500) no-repeat center center fixed;
  // background-size: cover;
  // background-size: 100% 100%;
	/* background: #0a2a43; */
}

.snowflake {
  // width: 5px;
  // height: 5px;
  position: absolute;
  top: -5%;
  color: #fff; /* 雪花颜色 */
  // text-shadow: 0 0 5px rgba(255, 255, 255, 0.8); /* 发光效果 */
  user-select: none; /* 禁止选中 */
  z-index: 100000;
  // animation: fall-2 linear infinite;
  will-change: transform; /* 性能优化 */
}

/* 三种不同的飘落动画，增加自然感 */
@keyframes fall {

	to {
		transform: translateY(100vh); /* 雪花从顶部飘落到底部 */
	}
}
</style>


<style lang="scss">
@keyframes fall-1 {

  0% {
    transform: translateY(0) translateX(0) rotate(0deg);
  }
  25% {
    transform: translateY(25vh) translateX(15px) rotate(45deg);
  }
  50% {
    transform: translateY(50vh) translateX(-15px) rotate(90deg);
  }
  75% {
    transform: translateY(75vh) translateX(10px) rotate(135deg);
  }
  100% {
    transform: translateY(100vh) translateX(-10px) rotate(180deg);
  }
}

@keyframes fall-2 {
  0% {
    transform: translateY(0) translateX(0) rotate(0deg);
  }
  25% {
    transform: translateY(25vh) translateX(-20px) rotate(-45deg);
  }
  50% {
    transform: translateY(50vh) translateX(15px) rotate(-90deg);
  }
  75% {
    transform: translateY(75vh) translateX(-15px) rotate(-135deg);
  }
  100% {
    transform: translateY(100vh) translateX(10px) rotate(-180deg);
  }
}

@keyframes fall-3 {
  0% {
    transform: translateY(0) translateX(0) rotate(0deg) scale(1);
  }
  50% {
    transform: translateY(50vh) translateX(20px) rotate(180deg) scale(1.1);
  }
  100% {
    transform: translateY(100vh) translateX(-20px) rotate(360deg) scale(1);
  }
}
</style>
