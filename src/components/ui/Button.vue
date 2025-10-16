<template>
  <button
      :class="['btn', ...classComputed]"
  >
    <span
        v-if="$slots.default"
        class="btn__text"
    >
      <slot />
    </span>
    <slot name="append" />
  </button>
</template>

<script lang="ts" setup>

interface IProps {
  size?: 'sm' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'link' | 'link-dashed';
  block?: boolean;
  outline?: boolean;
  loading?: boolean;
  disabled?: boolean;
  iconOnly?: boolean;
  iconName?: string;
  iconSize?: string;
}

const props = defineProps<IProps>();

const classComputed = computed(() => {
  return [
    {
      'btn--block': props.block,
      'btn--outline': props.outline,
      'btn--loading': props.loading,
      'btn--disabled': props.disabled,
      'btn--icononly': props.iconOnly,
    },
    props.size && `btn--${props.size}`,
    props.variant && `btn--${props.variant}`,
  ];
});

</script>

<style lang="scss">
$this: '.btn';

.btn {
  background-color: $white;
  color: $black;
  position: relative;
  display: inline-flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  padding: 16px 24px;
  font-size: 18px;
  line-height: 20px;
  font-weight: 400;
  text-decoration: none;
  user-select: none;
  cursor: pointer;
  transition: $baseTransition;
  border: none;

  &:hover {
    border-color: $blue;
    background-color: $black200;
  }

  &--primary {
    background-color: $black;
    color: $white;

    &:hover {
      background-color: $blue;
    }
  }

  &--secondary {
    background-color: transparent;
    color: #fff;
    padding: 0;

    &:hover {
      background-color: transparent;
    }
  }

  &--link,
  &--link-dashed {
    padding: 0;
    margin: 0;
    border-radius: 0;
    text-decoration: none;
    transition: $baseTransition;
    background: none;

    @include hover {
      color: $black300;
      border-color: $black300;
      background: none;
    }
  }

  &--link-dashed {
    color: $white;
    border-bottom: 1px dashed $white;
  }

  &--sm {
    width: 246px;
    padding: 10px 10px;

    &#{$this}--outline {
      padding: 4px 14px;
    }
  }

  &--lg {
    width: 264px;
    padding: 22px 24px;
    font-size: 18px;
    box-shadow: 0 8px 24px 0 rgba(0, 0, 0, 25%);

    &#{$this}--outline {
      padding: 9px 15px;
    }
  }

  &--xl {
    width: 500px;
    padding: 26px 28px;
    font-size: 22px;
    box-shadow: 0 8px 24px 0 rgba(0, 0, 0, 25%);

    &#{$this}--outline {
      padding: 12px 15px;
    }
  }

  &--block {
    min-width: 100%;
  }

  &--link {
    color: $linkColor;
    font-size: 16px;

    &:hover {
      color: $linkColorHover
    }
  }

  &:focus {
    outline: none;
  }

  &--loading {
    pointer-events: none;
    cursor: default;

    &::before {
      z-index: 3;
      width: 30px;
      height: 30px;
      margin-top: -14px;

      @include loader;

      border-color: $white transparent $white transparent;
    }

    > * {
      opacity: 0;
    }
  }
}
</style>