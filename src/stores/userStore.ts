import { defineStore } from "pinia";
import { ref } from "vue";
export const useUserStore = defineStore("userStore", () => {
 const isLoggedIn = ref(false);

 return {
  isLoggedIn
};
})