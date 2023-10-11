import { defineStore } from "pinia";

const usePlayerStore = defineStore("player", {
  state: () => {
    return {
      auto: false,
      autoTimeOutMs: 1200,
      textDone: true,
      onOption: false,
    };
  },
});

export default usePlayerStore;
