import { Application } from "pixi.js";
import { HandlerMap, Server, StoryNode } from "../type";
import { BgLayer } from "../layers/bgLayer";

const registerServers: (typeof Server)[] = [BgLayer];
export class NodePlayer {
  app: Application;
  handlerMap: HandlerMap;
  servers: Server[];
  constructor() {
    this.app = new Application({ width: 1000, height: 1000 });
    this.handlerMap = { getBgInstance: () => undefined };
    this.servers = [];
    for (const serverClass of registerServers) {
      this.servers.push(new serverClass(this.app, this.handlerMap));
    }
  }
  mouted(parent: HTMLElement) {
    parent.appendChild(this.app.view);
  }
  async playNode(node: StoryNode) {
    const checkPromises: Promise<void>[] = [];
    for (const server of this.servers) {
      checkPromises.push(server.check(node, this.app, this.handlerMap));
    }
  }
  unMounted() {
    this.app.destroy();
  }
}
