<template>
  <div :class="['input-field', classComputed]"
  >
    <slot
        v-if="$slots.prepend"
        name="prepend"
    />

    <input
      :id
      ref="inputRef"
      :value="value"
      :type
      :inputmode
      :name
      :disabled
      v-bind="$attrs"
      @change="onChange"
      @focus="onFocus"
      @click="onFocus"
      @blur="onBlur"
      @keydown.enter="onEnter"
    />

  </div>
</template>

<script lang="ts" setup>
import { defu } from 'defu';

/**
 * Input component props interface
 * @typedef {Object} IProps
 * @property {string | number | symbol | null} [modelValue] - The value of the input field.
 * @property {'sm' | 'lg'} [size] - The size of the input field.
 * @property {string | number} [id] - The id of the input field.
 * @property {string} [name] - The name of the input field.
 * @property {string} [type] - The type of the input field.
 * @property {'text' | 'none' | 'search' | 'email' | 'tel' | 'numeric'} [inputmode] - The input mode for the field.
 * @property {boolean} [disabled] - Whether the input is disabled.
 * @property {boolean} [block] - Whether the input should be block level.
 * @property {boolean} [error] - Whether the input has an error.
 * @property {Object} [modelModifiers] - Modifiers for model value (e.g., trim).
 */
interface IProps {
  modelValue?: string | number | symbol | null;
  size?: 'sm' | 'lg';
  id?: string | number;
  name?: string;
  type?: string;
  inputmode?: 'text' | 'none' | 'search' | 'email' | 'tel' | 'numeric';
  disabled?: boolean;
  block?: boolean;
  error?: boolean;
  modelModifiers?: { trim?: boolean; };
}

const props = withDefaults(defineProps<IProps>(), {
  modelValue: '',
  type: 'text',
  inputmode: undefined,
  id: undefined,
  size: undefined,
  name: undefined,
  modelModifiers: () => ({}),
});

const propsParent = (inject('form-group', null) as any) ?? {};

const $emit = defineEmits(['update:modelValue', 'input', 'change', 'blur', 'focus', 'clear', 'enter', 'valid']);

const inputRef = ref();

/**
 * The model modifiers applied to the input field value
 */
const modelModifiers = ref(defu({}, props.modelModifiers, { trim: false }));

/**
 * Computed values based on parent and component props
 */
const id = computed(() => propsParent?.id?.value ?? props?.id);
const name = computed(() => propsParent?.name?.value ?? props?.name);
const block = computed(() => propsParent?.block?.value ?? props?.block);
const error = computed(() => propsParent?.error?.value ?? props?.error);
const value = computed(() => props.modelValue || '');

const focused = ref(false);

/**
 * Computed class list based on component state and props
 */
const classComputed = computed(() => {
  return [
    {
      'is-focus': focused.value,
      'is-disabled': props.disabled,
      'is-block': block.value,
      'is-error': error.value,
    },
    props.size && `input-field--${props.size}`,
  ];
});

/**
 * Event handler for input change
 * @param {Event} $event - The input event
 */
const onInput = ($event: Event): void => {
  updateInput(($event.target as HTMLInputElement).value);

  $emit('input', $event);
};

/**
 * Event handler for input change
 * @param {Event} $event - The change event
 */
const onChange = ($event: Event): void => {
  if (props.type === 'file') {
    const value = ($event.target as HTMLInputElement).files;

    $emit('change', value);
  } else {
    const value = ($event.target as HTMLInputElement).value;

    $emit('change', value);

    updateInput(($event.target as HTMLInputElement).value);

    if (modelModifiers.value?.trim) {
      ($event.target as HTMLInputElement).value = value.trim();
    }
  }
};

/**
 * Event handler for input focus
 * @param {any} $event - The focus event
 */
const onFocus = ($event: any): void => {
  focused.value = true;

  $emit('focus', $event);
};

/**
 * Event handler for input blur
 * @param {any} $event - The blur event
 */
const onBlur = ($event: any): void => {
  focused.value = false;

  $emit('blur', $event);
};

/**
 * Event handler for Enter key press
 */
const onEnter = (): void => {
  $emit('enter');
};

/**
 * Updates the input field value
 * @param {any} inputValue - The value to set for the input field
 */
const updateInput = (inputValue: any): void => {
  if (modelModifiers.value.trim) {
    inputValue = String(inputValue).trim();
  }

  $emit('update:modelValue', inputValue);
};

/**
 * Clears the input field value
 */
const clear = (): void => {
  updateInput('');
  inputRef?.value?.focus();
  $emit('clear');
};

defineOptions({
  inheritAttrs: false,
});

defineExpose({
  inputRef,
});
</script>

<style lang="scss">
.input-field {
  display: inline-flex;
  align-items: center;
  height: 36px;
  padding: 0;
  border: 1px solid $black250;
  border-radius: 8px;
  background: $white;
  transition: all .3s ease;
  color: $black300;
  box-shadow: none;

  &:hover {
    border-color: $blue;
  }

  &--xs {
    height: 40px;
    width: auto;
  }

  &--lg {
    height: 40px;
  }

  &.is-block {
    width: 100%;
  }

  &.is-disabled {
    background-color: $black50;
    border-color: $black250;

    input {
      color: $black400;
    }
  }

  &.is-focus:not(:disabled, .is-disabled ) {
    border-color: $blue;
    box-shadow: 0 0 8px rgba($blue, .5);
  }

  &.is-error:not(:disabled, .is-disabled) {
    border-color: $red;

    &.is-focus {
      box-shadow: 0 0 8px rgba($red, .5);
    }
  }

  input {
    position: relative;
    display: flex;
    width: 100%;
    border: none;
    font-size: 16px;
    font-weight: 500;
    padding: 0 12px;
    height: 100%;
    color: $black;
    background: none;
    border-radius: inherit;
    appearance: none;

    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus {
      box-shadow: 0 0 0 1000px $white inset;
    }

    &:active,
    &:focus {
      outline: none;
    }

    &::placeholder {
      color: $black400;
    }
  }

  .btn {
    margin: 0;
    padding: 0;
    min-width: 30px;
    height: 100%;
    color: currentColor;
    border: none;
    border-radius: 4px;

    &:hover {
      color: $blue;
    }

    &:has(+ .btn) {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }

    + .btn {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }

    .icon {
      width: 18px;
      height: 18px;
    }
  }

  &__clear.btn {
    width: 24px;

    .icon {
      width: 10px;
      height: 10px;
    }
  }
}
</style>