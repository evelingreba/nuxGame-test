<template>
  <div :class="['form-group', classComputed]">
    <label
      v-if="label"
      :id
      :for="name"
      class="form-group__label"
    >
      {{ label }}
    </label>

    <slot />

    <small
      v-if="!!errorMessage"
      class="form-group__error"
    >
      {{ errorMessage }}
    </small>
  </div>
</template>

<script lang="ts" setup>
interface IProps {
  name?: string;
  label?: string;
  block?: boolean;
  error?: string | null;
}

const props = defineProps<IProps>();

const id = props?.name ? `${props.name}-${useId()}` : useId();

const classComputed = computed(() => {
  return [
    {
      'is-block': props.block,
      'is-error': !!props.error,
    },
  ];
});

const errorMessage = computed(() => {
  return typeof props?.error === 'string' ? props.error : null;
});

provide('form-group', {
  id,
  name: computed(() => props.name),
  block: computed(() => props.block),
  error: computed(() => !!props.error),
});
</script>

<style lang="scss">
.form-group {
  position: relative;
  display: inline-block;

  &.is-block {
    width: 100%;
  }

  &__label {
    display: block;
    width: 100%;
    margin-bottom: 5px;
    font-size: 12px;
    line-height: 14px;
    color: $black;
  }

  &__error {
    display: flex;
    width: 100%;
    margin: 5px 0 0;
    padding: 0;
    color: $red;
    font-size: 12px;
    line-height: 16px;
  }

  .textarea-field,
  .input-field {
    width: 100%;
    display: flex;
  }
}
</style>
