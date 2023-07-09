import { defineStore } from "pinia";
import { ref } from "vue";
export const useUserStore = defineStore("userStore", () => {
 const someValue = ref(false);

 return {
  someValue
};
})