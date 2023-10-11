import { Application, Sprite } from "pixi.js";
import { HandlerMap, Server, StoryNode } from "../../type";
import { gsap } from "gsap";

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
      if (node.bg.url !== this.currentBgUrl) {
        const newBg = Sprite.from(node.bg.url);
        if (node.bg.overlap) {
          newBg.alpha = 0;
          initBg(newBg, app);
          this.loadBgOverlap(newBg, node.bg.overlap, app);
        } else {
          initBg(newBg, app);
        }
        this.bgInstance = newBg;
      }
    }
  }
  async loadBgOverlap(instance: Sprite, overlap: number, app: Application) {
    const oldInstance = this.bgInstance;
    const tl = gsap.timeline();
    instance.zIndex = -99;

    await tl.fromTo(
      instance,
      { alpha: 0 },
      { alpha: 1, duration: overlap / 1000 }
    );

    oldInstance && app.stage.removeChild(oldInstance);
  }
  async resize(app: Application) {
    if (this.bgInstance) {
      initBg(this.bgInstance, app);
    }
  }
}

const StandardWith = 1902;
const StandardWithPadding = 64;
/**
 * 计算图片 cover 样式尺寸 - utils
 */
export function initBg(background: Sprite, app: Application) {
  // 计算规则
  // 1.优先满足纵向宽度
  // 2.带上padding, 大小为1920px: 64px
  // **不能用stage的height和width** 他们可以超出视口
  const viewportWidth = app.screen.width;
  const viewportHeight = app.screen.height;
  const rawWidth = background.width / background.scale.x;
  const rawHeight = background.height / background.scale.y;
  const padding = (rawWidth / StandardWith) * StandardWithPadding;
  const finalWidth = viewportWidth + padding * 2;
  const scale = finalWidth / rawWidth;
  const finalHeight = rawHeight * scale;
  const x = -((finalWidth - viewportWidth) / 2);
  const y = -((finalHeight - viewportHeight) / 2);

  background.position.set(x, y);
  background.scale.set(scale);
  app.stage.addChild(background);
}
