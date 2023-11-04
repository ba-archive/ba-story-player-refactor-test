<template>
  <div class="dialog" v-show="dialogContent">
    <div class="dialog__content">{{ dialogContent }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { TextLayer } from ".";

const props = defineProps<{ textLayerInstance: TextLayer }>();
const dialogContent = ref("");
props.textLayerInstance.addCheckMethod(async node => {
  if (node.text.dialog) {
    const dialogInfo = node.text.dialog;
    dialogContent.value = dialogInfo.content.reduce((pre, current) => {
      return pre + current.content;
    }, "");
  } else {
    dialogContent.value = "";
  }
});
</script>

<style lang="scss" scoped>
.dialog {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 30%;
  padding: 5% 10%;
  background-image: linear-gradient(
    to bottom,
    rgba(255, 0, 0, 0),
    rgba(19, 32, 45, 0.9) 30%
  );

  &__content {
    padding-top: 5%;
    text-align: left;
  }
}
</style>
