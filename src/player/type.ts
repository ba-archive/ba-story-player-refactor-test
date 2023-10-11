import { Application, Sprite } from "pixi.js";

export type BGEffectType =
  | "BG_ScrollT_0.5"
  | "BG_Filter_Red"
  | "BG_Wave_F"
  | "BG_Flash"
  | "BG_UnderFire_R"
  | "BG_Love_L"
  | "BG_ScrollB_0.5"
  | "BG_Rain_L"
  | "BG_UnderFire"
  | "BG_WaveShort_F"
  | "BG_SandStorm_L"
  | ""
  | "BG_ScrollT_1.5"
  | "BG_Shining_L"
  | "BG_ScrollB_1.0"
  | "BG_Love_L_BGOff"
  | "BG_Dust_L"
  | "BG_ScrollL_0.5"
  | "BG_ScrollL_1.0"
  | "BG_Ash_Black"
  | "BG_Mist_L"
  | "BG_Flash_Sound"
  | "BG_ScrollL_1.5"
  | "BG_FocusLine"
  | "BG_ScrollR_1.5"
  | "BG_Shining_L_BGOff"
  | "BG_ScrollT_1.0"
  | "BG_ScrollB_1.5"
  | "BG_Filter_Red_BG"
  | "BG_Ash_Red"
  | "BG_Fireworks_L_BGOff_02"
  | "BG_ScrollR_0.5"
  | "BG_Snow_L"
  | "BG_Fireworks_L_BGOff_01"
  | "BG_ScrollR_1.0";
export interface BGEffectExcelTableItem {
  Name: number;
  Effect: BGEffectType;
  Scroll: "None" | "Vertical" | "Horizontal";
  ScrollTime: number;
  ScrollFrom: number;
  ScrollTo: number;
}
export type ZmcArgs =
  | {
      type: "move";
      position: [number, number];
      size: number;
      duration: number;
    }
  | {
      type: "instant";
      position: [number, number];
      size: number;
    };
export type OtherEffect =
  | {
      type: "wait";
      /**
       * 单位为ms
       */
      args: number;
    }
  | {
      type: "zmc";
      args: ZmcArgs;
    }
  | {
      type: "bgshake";
    };

export interface BGMExcelTableItem {
  Id: number;
  Path: string;
  LoopStartTime: number;
  LoopEndTime: number;
  LoopTranstionTime: number;
  LoopOffsetTime: number;
}

export interface Character {
  /**
   * 人物初始位置
   */
  initPosition: number;
  /**
   * 人物CharacterName, 请通过它获取人物spinedata
   */
  CharacterName: number;
  /**
   * 人物表情
   */
  face: string;
  state: "highlight" | "signal" | null;
  /**
   * 人物特效
   */
  effects: CharacterEffect[];
}
export interface CharacterEffect {
  type: CharacterEffectType;
  effect: string;
  async: boolean;
  arg?: string;
}
export type CharacterEffectType = "emotion" | "action" | "fx";

export type IL2dPlayQue = {
  name: string;
  animation: string;
  fadeTime?: number;
  secondFadeTime?: number;
  customFade?: Array<{
    customFadeTime: number;
    customFadeColor?: string;
    toSolidDuration?: number;
    solidStateDuration?: number;
    toNormalDuration?: number;
  }>;
  sounds?: {
    fileName: string;
    time: number;
    /**
     * 声音大小, 默认为2
     */
    volume?: number;
  }[];
  /** 和后一个动画是否fade */
  fade?: boolean;
};
export interface L2DStartArg {
  name: string;
  playQue: IL2dPlayQue[];
  spineSettings?: {
    [key: string]: {
      scale?: number; // 对单个 spine 文件进行设置
    };
  };
  /** 实际上是请求的路径 */
  otherSpine?: string[];
}

export interface Option {
  /**
   * 该选项指向的下一节点index
   */
  nextNodeIndex: number;
  /**
   * 选项文本
   */
  text: Text[];
}

export interface Speaker {
  /**
   * 人物姓名
   */
  name: string;
  /**
   * 人物所属
   */
  nickName: string;
}

export type StArgs = [number[], "serial" | "instant" | "smooth", number];
export type StText = {
  text: string;
  args: StArgs;
  middle: boolean;
};

/**
 * 文字特效类型,
 * `color`颜色
 * `fontsize` 字体大小
 * `ruby` 日文注音
 * `log` 大概没啥用
 */
export type TextEffectName =
  | "color"
  | "fontsize"
  | "ruby"
  | "log"
  | "tooltip"
  | "b";
export interface TextEffect {
  name: TextEffectName;
  /**
   * 特效参数
   */
  value: string[];
}
export interface Text {
  /**
   * 文本
   */
  content: string;
  /**
   * 显示文本前等待的时间
   */
  waitTime?: number;
  /**
   * 文字特效
   */
  effects: TextEffect[];
}

interface RawStoryNode {
  character: Character[];
  text: {
    st: StText[];
    dialog: {
      content: string;
      speaker?: Speaker;
    };
    popupImage: string;
    action: {
      type: "showTitle" | "showPlace";
      arg: string;
      translatior?: string;
    };
  };
  bg: {
    url: string;
    overlap?: number;
  };
  audio: {
    bgm: {
      url: string;
      bgmArgs: BGMExcelTableItem;
    };
    voice: string;
    sound: string;
  };
  ui: {
    menuState: boolean;
    option?: Option[];
  };
  l2d:
    | {
        state: "start";
        startArg: L2DStartArg;
      }
    | { state: "playing"; currentAnimation: string };
  effect: {
    bgEffect: BGEffectExcelTableItem;
    action: OtherEffect;
  };
  nextNodeIndex: number;
}

type PersistStoryNode = Pick<RawStoryNode, "ui" | "nextNodeIndex">;
type ParticalStoryNode = Partial<
  Pick<RawStoryNode, "character" | "bg" | "l2d">
>;
type PartialPropertyStoryNode = Pick<RawStoryNode, "audio" | "text" | "effect">;
type FinalPartialPropertyStoryNode = {
  [key in keyof PartialPropertyStoryNode]: Partial<
    PartialPropertyStoryNode[key]
  >;
};
export type StoryNode = PersistStoryNode &
  ParticalStoryNode &
  FinalPartialPropertyStoryNode;

export interface HandlerMap {
  getBgInstance: () => Sprite | undefined;
}
export class Server {
  constructor(app: Application, handlerMap: HandlerMap) {
    app;
    handlerMap;
  }
  async check(storyNode: StoryNode, app: Application, handlerMap: HandlerMap) {
    storyNode;
    app;
    handlerMap;
  }
  async stop() {}
  async resize(app: Application) {}
}
