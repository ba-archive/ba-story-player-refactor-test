import { defineStore } from "pinia";

const usePlayerStore = defineStore("player", {
  state: () => {
    return {
      auto: true,
      autoTimeOutMs: 1200,
      textDone: true,
      onOption: false,
    };
  },
});

export default usePlayerStore;
