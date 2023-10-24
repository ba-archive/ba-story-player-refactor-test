<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import NodePlayer, { PIXIHeight } from "./playerSubModules/nodePlayer";
import StoryManager from "./playerSubModules/storyManager";
import resourceManager from "./playerSubModules/recourageManager";
import usePlayerStore from "./store";
import { StoryNode } from "./type";
const props = defineProps<{
  storyNodes: StoryNode[];
  height: number;
  width: number;
  endCallback: () => void;
}>();
const pixiWidth = computed(() => (PIXIHeight * props.width) / props.height);
const nodePlayer = new NodePlayer(pixiWidth.value);
const playerStyle = computed(() => {
  return {
    height: `${props.height}px`,
    width: `${props.width}px`,
  };
});

const currentStoryIndex = ref(0);
const currentStoryNode = computed(() => {
  if (
    currentStoryIndex.value >= 0 &&
    currentStoryIndex.value < props.storyNodes.length
  ) {
    return props.storyNodes[currentStoryIndex.value];
  } else {
    props.endCallback();
    usePlayerStore().auto = false;
    return props.storyNodes[props.storyNodes.length - 1];
  }
});
const storyPlayer = new StoryManager(
  props.storyNodes,
  nodePlayer,
  currentStoryIndex,
  currentStoryNode,
  () => {}
);
const pixiCanvas = ref<HTMLDivElement>();

const pixiScale = computed(
  //比实际放大一点放置并隐藏解决缩放不精确的问题
  () => `scale(${(props.height + 1) / PIXIHeight})`
);
onMounted(async () => {
  nodePlayer.mouted(pixiCanvas.value!);
  await resourceManager.init();
  await resourceManager.load(props.storyNodes);
  await storyPlayer.play();
});
onUnmounted(() => {
  nodePlayer.unMounted();
});
</script>

<template>
  <div @click="storyPlayer.next" class="player" :style="playerStyle">
    <div ref="pixiCanvas"></div>
    <div class="dialog">
      <p>
        some dialog msgs<span @click.stop="console.log('popup!')">popup</span>
        more msgs
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.player {
  position: relative;
  overflow: hidden;
  .dialog {
    bottom: 0;
    width: 100%;
    height: 30%;
    background-color: blue;
    position: absolute;
  }
}
</style>

<style lang="scss">
.player {
  canvas {
    transform-origin: top left;
    transform: v-bind(pixiScale);
  }
}
</style>
./playerSubModules/storyManager
