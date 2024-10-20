// stores/user.js o stores/user.ts
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    token: null,
    auth: false,
    refreshIntervalId: null,
  }),
  actions: {
    setUser(user, token) {
      this.user = user;
      this.token = token;
      this.auth = true;
      this.startTokenRefresh();
    },
    logout() {
      this.user = null;
      this.token = null;
      this.auth = false;
      this.stopTokenRefresh();
    },
    async refresh() {
      try {
        const response = await $fetch('http://127.0.0.1:8000/api/auth/refresh', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.token}`
          },
        });
        if (response.access_token) {
          this.token = response.access_token;
        }
      } catch (error) {
        console.error('Error al renovar el token:', error);
        this.logout();
      }
    },
    startTokenRefresh() {
      this.stopTokenRefresh();
      this.refreshIntervalId = setInterval(() => {
        this.refresh();
      }, 3500 * 1000);
    },
    stopTokenRefresh() {
      if (this.refreshIntervalId) {
        clearInterval(this.refreshIntervalId);
        this.refreshIntervalId = null;
      }
    }
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
