<template>
  <div class="background" />

  <slot />
</template>

<style lang="scss">
.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.70) 0%, rgba(0, 0, 0, 0.70) 100%), url("@/assets/images/main-background.jpg") lightgray 50% / cover no-repeat;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
  z-index: -1;
}
</style>