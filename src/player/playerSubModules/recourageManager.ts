import { StoryNode } from "../type";
import { Loader } from "pixi.js";

const resourcerManager = {
  loader: Loader.shared,
  async init() {},
  load(storyNodes: StoryNode[]) {
    for (const storyNode of storyNodes) {
      const bg = storyNode.bg;
      if (bg) {
        if (!this.loader.resources[bg.url]) {
          this.loader.add(bg.url, bg.url);
        }
      }
    }
    return new Promise<void>(resolve => {
      this.loader.load(() => resolve());
    });
  },
};

export default resourcerManager;
