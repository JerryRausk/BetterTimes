import { HttpService } from "@/services/httpService";
import { User } from "@prisma/client";
import { defineStore } from "pinia";
import { ref } from "vue";
export const useUserStore = defineStore("userStore", () => {
  // mock to make sure pinia is set up, not used
  const user = ref<User>();
  const initUser = async () => {
    user.value = await HttpService.get<User>("/api/user");
  };
  return {
    initUser,
  };
});
