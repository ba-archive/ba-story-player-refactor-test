import { StoryNode } from "../type";
import NodePlayer from "./nodePlayer";
import { ComputedRef, Ref } from "vue";
import { storeToRefs } from "pinia";
import usePlayerStore from "../store";
import { waitMs } from "../utils";

export default class StoryPlayer {
  currentStoryIndex: Ref<number>;
  currentStoryNode: ComputedRef<StoryNode>;
  storyNodes: StoryNode[];
  nodePlayer: NodePlayer;
  state: "playing" | "done";
  errorCallback: () => void;
  constructor(
    storyNodes: StoryNode[],
    nodePlayer: NodePlayer,
    currentStoryIndex: Ref<number>,
    currentStoryNode: ComputedRef<StoryNode>,
    errorCallback: () => void
  ) {
    this.currentStoryIndex = currentStoryIndex;
    this.storyNodes = storyNodes;
    this.nodePlayer = nodePlayer;
    this.currentStoryNode = currentStoryNode;
    this.errorCallback = errorCallback;
    this.state = "done";
  }
  async next() {
    if (this.state !== "playing") {
      this.currentStoryIndex.value = this.currentStoryNode.value.nextNodeIndex;
      await this.play();
    }
  }

  async play() {
    this.state = "playing";
    const { auto, textDone, onOption, autoTimeOutMs } = storeToRefs(
      usePlayerStore()
    );
    await this.nodePlayer.playNode(this.currentStoryNode.value);
    const checkTextDone = (resolve: () => void) => {
      if (textDone.value) {
        resolve();
      } else {
        requestAnimationFrame(() => {
          checkTextDone(resolve);
        });
      }
    };
    try {
      await new Promise<void>(resolve => {
        checkTextDone(resolve);
      });
    } catch (error) {
      this.errorCallback();
    }

    this.state = "done";
    if (auto.value && !onOption.value) {
      await waitMs(autoTimeOutMs.value);
      if (auto.value) {
        this.next();
      }
    }
  }
  select(selectIndex: number) {
    this.currentStoryIndex.value = selectIndex;
    this.play();
  }
  async switch(index: number) {
    await this.nodePlayer.stop();
    this.currentStoryIndex.value = index;
    this.play();
  }
}
