// middleware/auth.ts
import { useUserStore } from '~/stores/user';

export default defineNuxtRouteMiddleware((to, from) => {
  const userStore = useUserStore();

  const isAuthenticated = userStore.auth !== false;

  if (isAuthenticated && to.path === '/') {
    return navigateTo('/dashboard');
  }

  if (!isAuthenticated && to.path !== '/') {
    return navigateTo('/');
  }
});
