import type { IAuth } from "@types/auth";

export const useAuthStore = defineStore('authStore', () => {
        const isAuthModalOpened = ref<boolean>(false);
        const user = ref<IAuth | undefined>(undefined);

        return {
            isAuthModalOpened,
            user,
        };
    },
    {
        persist: true
    });
