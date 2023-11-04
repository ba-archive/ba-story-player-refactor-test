<script setup lang="ts">
import { ref } from "vue";
import Player from "./player/Player.vue";
import { StoryNode } from "./player/type";
import testStory from "./testStory.json";

const storyNodes = ref<StoryNode[]>(testStory);
const flag = ref(true);
</script>

<template>
  <button @click="flag = !flag" class="flagButton">test</button>
  <Player
    :height="500"
    :width="1000"
    data-url="https://yuuka.cdn.diyigemt.com/image/ba-all-data"
    :story-nodes="storyNodes"
    v-if="flag"
    :end-callback="
      () => {
        console.log('end!');
      }
    "
  />
</template>

<style scoped>
.flagButton {
  position: absolute;
  left: 1%;
  top: 3%;
}
</style>
