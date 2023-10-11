import { Application } from "pixi.js";
import { HandlerMap, Server, StoryNode } from "../type";
import { BgLayer } from "../layers/bgLayer";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
const PIXIHeight = 1012.5;
gsap.registerPlugin(PixiPlugin);

const registerServers: (typeof Server)[] = [BgLayer];
export default class NodePlayer {
  app: Application;
  handlerMap: HandlerMap;
  servers: Server[];
  constructor(width: number) {
    this.app = new Application({ width: width, height: PIXIHeight });
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
    await Promise.all(checkPromises);
  }
  async stop() {
    const stopPromises: Promise<void>[] = [];
    for (const server of this.servers) {
      stopPromises.push(server.stop());
    }
    await Promise.all(stopPromises);
  }
  unMounted() {
    this.app.destroy();
  }
}

export { PIXIHeight };
