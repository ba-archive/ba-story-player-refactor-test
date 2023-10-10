<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { NodePlayer } from "./playerSubModules/nodePlayer";
import { StoryNode } from "./type";
defineProps<{ storyNodes: StoryNode[]; height: number; width: number }>();
const player = new NodePlayer();
const playerCanvas = ref<HTMLDivElement>();
onMounted(async () => {
  player.mouted(playerCanvas.value!);
  const testBg =
    "https://yuuka.cdn.diyigemt.com/image/ba-all-data/UIs/03_Scenario/01_Background/BG_Empty_KivotosStadium_Sunset.jpg";
});
onUnmounted(() => {
  player.unMounted();
});
</script>

<template>
  <div @click="console.log('click!')" class="player">
    <div ref="playerCanvas"></div>
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
  .dialog {
    bottom: 0;
    width: 100%;
    height: 30%;
    background-color: blue;
    position: absolute;
  }
}
</style>
