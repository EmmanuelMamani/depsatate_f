// stores/user.js o stores/user.ts
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    token: null,
    auth: false
  }),
  actions: {
    setUser(user, token) {
      this.user = user;
      this.token = token;
      this.auth=true
    },
    logout() {
      this.user = null;
      this.token = null;
      this.auth=false
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'auth',
        storage: typeof window !== 'undefined' ? localStorage : null,
      },
    ],
  },
});
