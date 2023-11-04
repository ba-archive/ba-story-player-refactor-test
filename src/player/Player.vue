<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import NodePlayer, { PIXIHeight } from "./playerSubModules/nodePlayer";
import StoryManager from "./playerSubModules/storyManager";
import resourceManager, {
  setDataUrl,
} from "./playerSubModules/recourageManager";
import { ResourceMap, StoryNode } from "./type";
import Dialog from "./playerSubLayers/textLayer/Dialog.vue";
const props = defineProps<{
  storyNodes: StoryNode[];
  dataUrl: string;
  height: number;
  width: number;
  endCallback: () => void;
}>();
setDataUrl(props.dataUrl);
const pixiWidth = computed(() => (PIXIHeight * props.width) / props.height);
const nodePlayer = new NodePlayer(pixiWidth.value);
nodePlayer.handlerMap.getResources = <T extends keyof ResourceMap>(
  type: T,
  key: string
) => resourceManager.getResource(type, key);

const playerStyle = computed(() => {
  return {
    height: `${props.height}px`,
    width: `${props.width}px`,
  };
});

const currentStoryIndex = ref(0);
const auto = ref(false);
const currentStoryNode = computed(() => {
  if (
    currentStoryIndex.value >= 0 &&
    currentStoryIndex.value < props.storyNodes.length
  ) {
    return props.storyNodes[currentStoryIndex.value];
  } else {
    props.endCallback();
    auto.value = false;
    return props.storyNodes[props.storyNodes.length - 1];
  }
});
const storyManager = new StoryManager(
  props.storyNodes,
  nodePlayer,
  currentStoryIndex,
  currentStoryNode,
  auto,
  () => {}
);
const pixiCanvas = ref<HTMLDivElement>();

const pixiScale = computed(
  //比实际放大一点放置并隐藏解决缩放不精确的问题
  () => `scale(${(props.height + 1) / PIXIHeight})`
);

if (import.meta.env.DEV) {
  Reflect.set(window, "nodePlayer", nodePlayer);
  Reflect.set(window, "StoryManager", storyManager);
}
onMounted(async () => {
  nodePlayer.mouted(pixiCanvas.value!);
  await resourceManager.init();
  await resourceManager.load(props.storyNodes);
  await storyManager.play();
});
onUnmounted(() => {
  nodePlayer.unMounted();
});
</script>

<template>
  <div @click="storyManager.next" class="player" :style="playerStyle">
    <div ref="pixiCanvas"></div>
    <Dialog :text-layer-instance="nodePlayer.serversInstance.text"></Dialog>
  </div>
</template>

<style scoped lang="scss">
.player {
  position: relative;
  overflow: hidden;
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
