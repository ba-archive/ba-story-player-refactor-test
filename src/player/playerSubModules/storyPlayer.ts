import { StoryNode } from "../type";
import NodePlayer from "./nodePlayer";

export default class StoryPlayer {
  currentStoryIndex: number;
  storyNodes: StoryNode[];
  nodePlayer: NodePlayer;
  state: "playing" | "done";
  constructor(storyNodes: StoryNode[], nodePlayer: NodePlayer) {
    this.currentStoryIndex = 0;
    this.storyNodes = storyNodes;
    this.nodePlayer = nodePlayer;
    this.state = "done";
  }
  next() {}

  public get currentStoryNode(): StoryNode {
    return this.storyNodes[this.currentStoryIndex];
  }

  async play() {
    this.state = "playing";
    await this.nodePlayer.playNode(this.currentStoryNode);
    this.state = "done";
  }
  select() {}
  switch() {}
}
