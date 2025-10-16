<template>
  <div class="main">
    <Button
        size="xl"
        class="main__button"
        @click="toggleAuthModal"
    >
      {{ 'Вхід' }}
    </Button>

    <AuthModal/>
  </div>
</template>

<script setup lang="ts">
import AuthModal from "~/components/AuthModal.vue";
import Button from "~/components/ui/Button.vue";

const {isAuthModalOpened} = storeToRefs(useAuthStore());

/**
 * Toggle Auth Modal
 */
const toggleAuthModal = (): void => {
  isAuthModalOpened.value = true;
}
</script>

<style lang="scss">
.main {
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;

  &__button {
    transition: box-shadow 0.3s ease, transform 0.2s ease;

    &:hover {
      box-shadow: 0 0 25px 6px rgba(1, 52, 79, 0.9),
      0 0 50px 20px rgba(1, 52, 79, 0.7),
      0 0 80px 35px rgba(1, 52, 79, 0.5);
      transform: translateY(-2px);
    }
  }
}
</style>