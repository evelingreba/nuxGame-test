<template>
  <VueFinalModal
    v-model="isActive"
    teleportTo="body"
    :class="['modal', classComputed]"
    :contentClass="['modal__body', contentClass]"
    :reserveScrollBarGap="false"
    overlayTransition="vfm-fade"
    contentTransition="vfm-fade"
    @closed="onClosed"
  >
    <div
        class="modal__close"
        @click="onClosed"
    >
      <Close class="modal__close-icon" />
    </div>

    <div
        v-if="$slots.header"
        class="modal__header"
    >
      <div
        class="modal__header-inner"
      >
        <slot name="header" />
      </div>
    </div>

    <div class="modal__main">
      <slot />
    </div>

  </VueFinalModal>
</template>

<script lang="ts" setup>
import { VueFinalModal } from 'vue-final-modal';
import Close from '~/assets/icons/close.svg';

const $emit = defineEmits(['update:modelValue', 'modal:close']);

interface IProps {
  modelValue?: any;
  contentClass?: (string | { [key: string]: boolean })[];
  loading?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  modelValue: false,
  contentClass: undefined,
});

const isActive = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    $emit('update:modelValue', value);
  },
});

const classComputed = computed(() => {
  return [
    {
      'is-loading': props.loading,
    }
  ];
});

const onClosed = () => {
  $emit('modal:close');
};

const throttle = (callee: Function, timeout: number) => {
  let timer: any = null;

  return function perform(...args: any) {
    if (timer) {
      return;
    }

    timer = setTimeout(() => {
      callee(...args);
      clearTimeout(timer);
      timer = null;
    }, timeout);
  };
};

const onResize = throttle(() => {
  if (isActive.value) {
    const modalContainer = document.querySelector('.modal') as HTMLElement;

    if (modalContainer) {
      modalContainer.style.removeProperty('top');
      modalContainer.style.removeProperty('max-height');

      const modalBodyContainer = modalContainer.querySelector('.modal__body') as HTMLElement;
      const clientRect = modalContainer.getBoundingClientRect();
      const viewportHeight = window?.visualViewport?.height;

      modalContainer.style.maxHeight = `${viewportHeight}px`;
      modalContainer.style.top =
          window?.visualViewport?.height !== window?.innerHeight ? `${Math.abs(clientRect?.top)}px` : '0';

      modalBodyContainer.style.removeProperty('height');
      modalBodyContainer.style.removeProperty('max-height');
    }
  }
}, 50);

watch(
    () => props.modelValue,
    (value) => {
      if (value) {
        document.documentElement.classList.add('is-overlay');
      } else {
        document.documentElement.classList.remove('is-overlay');
      }
    }
);

onMounted(() => {
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', onResize);
    window.addEventListener('scroll', onResize);
  }
});

onUnmounted(() => {
  document.documentElement.classList.remove('is-overlay');

  if (window.visualViewport) {
    window.visualViewport.removeEventListener('resize', onResize);
    window.removeEventListener('scroll', onResize);
  }
});
</script>

<style lang="scss">
// vfm
.vfm--fixed {
  position: fixed;
}

.vfm--absolute {
  position: absolute;
}

.vfm--inset {
  inset: 0;
}

.vfm--overlay {
  z-index: -1;
  background-color: rgba(black, .6);
}

.vfm--prevent-none {
  pointer-events: none;
}

.vfm--prevent-auto {
  pointer-events: auto;
}

.vfm--outline-none:focus {
  outline: none;
}

@keyframes fade-in {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@keyframes fade-out {
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}

.vfm-fade-enter-active {
  animation: fade-in .3s ease;
}

.vfm-fade-leave-active {
  animation: fade-out .3s ease;
}

.vfm-bounce-back {
  transition-property: transform;
  transition-duration: .3s;
}

.vfm-slide-up-enter-active, .vfm-slide-up-leave-active, .vfm-slide-down-enter-active, .vfm-slide-down-leave-active {
  transition: transform .3s ease;
}

.vfm-slide-down-enter-from, .vfm-slide-down-leave-to {
  transform: translateY(100vh) !important;
}

.vfm-slide-up-enter-from, .vfm-slide-up-leave-to {
  transform: translateY(-100vh) !important;
}

.vfm-slide-right-enter-active, .vfm-slide-right-leave-active, .vfm-slide-left-enter-active, .vfm-slide-left-leave-active {
  transition: transform .3s ease;
}

.vfm-slide-right-enter-from, .vfm-slide-right-leave-to {
  transform: translate(100vw) !important;
}

.vfm-slide-left-enter-from, .vfm-slide-left-leave-to {
  transform: translate(-100vw) !important;
}

.vfm-swipe-banner-back, .vfm-swipe-banner-forward {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 27px;
  z-index: 10;
}

.vfm-swipe-banner-back {
  left: 0;
}

.vfm-swipe-banner-forward {
  right: 0;
}

.vfm {
  z-index: 1000;

  @include md {
    display: flex;
  }
}

// modal
.modal {
  width: 100%;
  height: 100%;
  top: 0;
  backface-visibility: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: env(safe-area-inset-top) 0 env(safe-area-inset-bottom);

  &__body {
    position: relative;
    background-color: white;
    width: 100%;
    display: flex;
    flex-direction: column;
    transform-origin: center;
    vertical-align: middle;
    overflow-y: auto;
    transform: translateZ(0);
    backface-visibility: hidden;
    min-height: auto;
    max-height: none;
    margin: auto;
    padding: env(safe-area-inset-top) 0 env(safe-area-inset-bottom);

    @include md {
      height: auto;
      max-height: 80dvh;
      max-width: 440px;
      margin-right: auto;
      border-radius: 5px;
    }
  }

  &__header {
    position: sticky;
    display: flex;
    z-index: 2;
    flex-shrink: 0;
    min-height: 23px;

    @include md {
      min-height: 29px;
    }

    &-inner {
      position: relative;
      width: 100%;
      line-height: 22px;
      font-weight: 500;
      background-color: white;
      border-bottom: 1px solid grey;
      padding: 15px 48px 15px 18px;
      font-size: 20px;

      @include md {
        padding: 18px 55px 18px 25px;
        font-size: 22px;
      }
    }
  }

  &__main {
    flex: 1;
    padding: 24px;
  }

  &.is-loading & {
    &__body {
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10;
        border-radius: 5px;
        background-color: rgba(white, .7);
      }

      &::after {
        z-index: 11;
      }
    }
  }

  &__close {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    right: 20px;
    top: 14px;
    color: darkgrey;
    z-index: 11;
    transition: all .3s ease-in-out;
    cursor: pointer;

    &:hover {
      color: black;
    }

    @include md {
      top: 14px;
      right: 20px;
    }

    &-icon {
      width: 15px;
      height: 15px;
    }
  }

  .vfm__overlay {
    position: fixed;
  }

  &--info & {
    &__close {
      top: 10px;
      right: 10px;
    }

    &__main {
      text-align: center;
      padding-top: 40px;
      padding-bottom: 40px;
    }
  }
}
</style>
