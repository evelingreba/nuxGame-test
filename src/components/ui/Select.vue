<template>
  <div
    ref="selectRef"
    :class="['select-field', ...classComputed]"
  >
    <button
      ref="triggerRef"
      type="button"
      class="select-field__trigger"
      @click="toggle"
    >
      <span class="select-field__selected">{{ selectedLabel }}</span>

      <ArrowDown class="icon" />
    </button>

    <div
      ref="dropdownRef"
      class="select-field__dropdown"
    >
      <div
        ref="optionsRef"
        class="select-field__options"
      >
        <template v-if="!!options?.length">
          <div
            v-for="(option, idx) in options"
            :key="idx"
            :class="[
              'select-field__option',
              {
                'is-selected': selected?.value && option.value === selected.value,
              },
            ]"
            @click="onSelect(option)"
          >
            {{ option.label }}
          </div>
        </template>

        <div
          v-else
          class="select-field__options-empty"
        >
          {{ 'Дані відстутні' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import ArrowDown from '~/assets/icons/arrow-down.svg'
import {onClickOutside} from "@vueuse/core";

interface IOption {
  label: string | number | null;
  value: string | number | null;
  to?: string | Object;
}

interface IProps {
  id?: string | number;
  options: IOption[];
  selected?: IOption | null;
  placeholder?: string;
  block?: boolean;
  disabled?: boolean;
  loading?: boolean;
  error?: boolean;
  closeAfterSelect?: boolean;
}

provide('form-group', {
  error: false,
});

const props = withDefaults(defineProps<IProps>(), {
  id: undefined,
  selected: undefined,
  placeholder: undefined,
  closeAfterSelect: true,
});

const propsParent = (inject('form-group', null) as any) ?? {};

const $emit = defineEmits(['select', 'open', 'close']);

const selectRef = ref();
const triggerRef = ref();
const dropdownRef = ref();
const optionsRef = ref();
const isOpened = ref<boolean>(false);

const options = computed(() => {
  return props.options;
});

const selectedLabel = computed(() => (selected.value ? selected.value.label : props.placeholder));
const selectedValue = computed(() => props.selected?.value);
const selected = computed(() => {
  return (
    props.selected ??
    props.options?.filter((option) => {
      return option.value === selectedValue.value;
    })?.[0]
  );
});

const block = computed(() => propsParent?.block?.value ?? props?.block);
const error = computed(() => propsParent?.error?.value ?? props?.error);

const classComputed = computed(() => {
  return [
    {
      'is-opened': isOpened.value,
      'is-block': block.value,
      'is-loading': props.loading,
      'is-placeholder': props.placeholder && !selected.value,
      'is-disabled': props.disabled,
      'is-error': error.value,
    }
  ];
});

const toggle = () => {
  isOpened.value ? close() : open();
};

const open = () => {
  isOpened.value = true;

  $emit('open');
};

const close = () => {
  isOpened.value = false;

  $emit('close');
};

onClickOutside(selectRef, () => {
  close();
});

const onSelect = (option: IOption) => {
  $emit('select', option);

  if (props.closeAfterSelect) {
    close();
  }
};

defineExpose({
  selectRef,
});
</script>

<style lang="scss">
.select-field {
  display: inline-flex;
  align-self: flex-start;
  position: relative;
  max-width: 100%;
  border-radius: 8px;
  background-color: $white;
  color: $black;

  @include hover(true) {
    &__trigger {
      border-color: $blue;
    }
  }

  &--lg & {
    &__trigger {
      height: 40px;
    }
  }

  &.is-opened & {
    &__trigger {
      border-color: $blue;

      .icon:last-child {
        transform: rotate(-180deg);
      }
    }

    &__dropdown {
      opacity: 1;
      transform: translateY(0);
      pointer-events: all;
      box-shadow: 0 0 4px rgba($black, .25);
    }
  }

  &.is-block {
    width: 100%;
  }

  &.is-disabled,
  &:disabled {
    opacity: .5;
    pointer-events: none;
    cursor: default;
  }

  &.is-error:not(:disabled, .is-disabled) & {
    &__trigger {
      border-color: $red;
    }
  }

  &.is-opened.is-error & {
    &__trigger {
      box-shadow: 0 0 8px rgba($red, .5);
    }
  }

  &__trigger {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    height: 36px;
    color: $black;
    gap: 10px;
    font-size: 16px;
    padding: 0 30px 0 12px;
    border-radius: inherit;
    transition: $baseTransition;
    border: 1px solid $black250;
    z-index: 10;
    cursor: pointer;

    &:focus {
      border-color: $blue;
    }

    .icon {
      width: 16px;
      height: 16px;
      color: $black;
      transition: $baseTransition;

      &:last-child {
        position: absolute;
        right: 11px;
        width: 9px;
        height: 9px;
      }
    }
  }

  &__selected {
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__dropdown {
    position: absolute;
    z-index: 11;
    left: 0;
    top: calc(100% + 3px);
    min-width: 100%;
    opacity: 0;
    pointer-events: none;
    transform: translateY(20px);
    transition: $baseTransition;
    background: $white;
    border: 1px solid $black250;
    border-radius: inherit;
    overflow: hidden;
    box-shadow: 0 0 8px rgba($black250, 50%);
  }

  &__options {
    position: relative;
    display: flex;
    flex-direction: column;
    overflow: hidden auto;
    max-height: 250px;

    @include custom-scroll();

    &-empty {
      font-size: 14px;
      line-height: 20px;
      color: $black400;
      display: flex;
      align-items: center;
      padding: 0 12px;
      min-height: 36px;
    }
  }

  &__option {
    gap: 11px;
    display: inline-flex;
    align-items: center;
    text-align: left;
    padding: 8px 20px 8px 12px;
    font-size: 14px;
    line-height: 18px;
    transition: $baseTransition;
    border: none;
    cursor: pointer;

    @include hover {
      color: $black;
      background: $black100;
    }

    > .icon {
      width: 15px;
      height: 15px;
      color: $black;
      opacity: 0;
      transition: $baseTransition;
    }

    &.is-selected {
      color: $blue;

      > .icon {
        opacity: 1;
      }
    }
  }
}
</style>