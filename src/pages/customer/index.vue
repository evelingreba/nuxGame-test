<template>
  <div class="customer">
    <CustomerInfo class="customer__info-block" />
    <Todos />
  </div>
</template>

<script setup lang="ts">

</script>

<style lang="scss">
.customer {
  @include width-limiter;

  padding: 30px 0;
  color: $white;
  line-height: 27px;

  &__info-block {
    margin-bottom: 32px;
  }
}
</style>