import { defineStore } from "pinia";
import api from "../api/axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    email: null as any,
    token: localStorage.getItem("token") || "",
  }),
  actions: {
    async login(email: string, password: string) {
      const res = await api.post("/auth/login", { email, password });
      this.token = res.data.data.token;
      localStorage.setItem("token", this.token);
      this.email = res.data.data.email;
    },
    logout() {
      this.email = null;
      this.token = "";
      localStorage.removeItem("token");
    },
  },
});
