<script setup lang="ts">
import { ref } from "vue";
import Player from "./player/Player.vue";
import { StoryNode } from "./player/type";

const storyNodes = ref<StoryNode[]>([
  {
    ui: {
      menuState: true,
    },
    audio: {},
    text: {},
    effect: {},
    bg: {
      url: "https://yuuka.cdn.diyigemt.com/image/ba-all-data/UIs/03_Scenario/01_Background/BG_Empty_KivotosStadium_Sunset.jpg",
    },
    nextNodeIndex: -1,
  },
  {
    ui: {
      menuState: true,
    },
    audio: {},
    text: {},
    effect: {},
    bg: {
      url: "https://yuuka.cdn.diyigemt.com/image/ba-all-data/UIs/03_Scenario/01_Background/BG_CS_PV2_46.jpg",
    },
    nextNodeIndex: -1,
  },
]);
const flag = ref(true);
</script>

<template>
  <button @click="flag = !flag" class="flagButton">test</button>
  <Player :height="500" :width="1000" :story-nodes="storyNodes" v-if="flag" />
</template>

<style scoped>
.flagButton {
  position: absolute;
  left: 1%;
  top: 3%;
}
</style>
