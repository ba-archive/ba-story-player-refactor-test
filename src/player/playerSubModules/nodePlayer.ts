import { Application } from "pixi.js";
import { HandlerMap, StoryNode } from "../type";
import { BgLayer } from "../layers/bgLayer";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { TextLayer } from "../playerSubLayers/textLayer";
const PIXIHeight = 1012.5;
gsap.registerPlugin(PixiPlugin);

const registerServers = {
  bg: BgLayer,
  text: TextLayer,
};
type RegisterServers = typeof registerServers;
type ServerInstances = {
  [server in keyof RegisterServers]: InstanceType<
    (typeof registerServers)[server]
  >;
};
export default class NodePlayer {
  app: Application;
  handlerMap: HandlerMap;
  serversInstance: ServerInstances;
  constructor(width: number) {
    this.app = new Application({ width: width, height: PIXIHeight });
    this.handlerMap = { getBgInstance: () => undefined };
    const tempInstances: Record<string, any> = {};
    for (const key of Object.keys(registerServers) as Array<
      keyof RegisterServers
    >) {
      tempInstances[key] = new registerServers[key](this.app, this.handlerMap);
    }
    this.serversInstance = tempInstances as ServerInstances;
  }
  mouted(parent: HTMLElement) {
    parent.appendChild(this.app.view);
  }
  async playNode(node: StoryNode) {
    const checkPromises: Promise<void>[] = [];
    for (const server of Object.values(this.serversInstance)) {
      checkPromises.push(server.check(node, this.app, this.handlerMap));
    }
    await Promise.all(checkPromises);
  }
  async stop() {
    const stopPromises: Promise<void>[] = [];
    for (const server of Object.values(this.serversInstance)) {
      stopPromises.push(server.stop());
    }
    await Promise.all(stopPromises);
  }
  unMounted() {
    this.app.destroy();
  }
}

export { PIXIHeight };
