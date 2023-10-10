import { Application, Sprite } from "pixi.js";
import { HandlerMap, Server, StoryNode } from "../../type";

export class BgLayer extends Server {
  bgInstance?: Sprite;
  currentBgUrl: string;
  constructor(app: Application, handlerMap: HandlerMap) {
    super(app, handlerMap);
    handlerMap.getBgInstance = () => this.bgInstance;
    this.currentBgUrl = "";
  }
  async check(node: StoryNode, app: Application) {
    if (node.bg) {
      if (node.bg !== this.currentBgUrl) {
        const newBg = Sprite.from(node.bg);
        app.stage.addChild(newBg);
        this.bgInstance = newBg;
      }
    }
  }
}
