<template>
  <div v-if="isMounted && user" class="customer-info">
    <h1 class="customer-info__title">
      {{ `Особистий кабінет користувача ${user?.name}` }}
    </h1>

    <div class="customer-info__list">
      <div class="customer-info__list-wrap">
        <h2 class="customer-info__list-subtitle">Інформація про користувача</h2>

        <p class="customer-info__list-item">
          <span class="customer-info__list-item-title">Ім’я: </span>
          {{ user.name }}
        </p>

        <p class="customer-info__list-item">
          <span class="customer-info__list-item-title">Нікнейм: </span>
          {{ user.username }}
        </p>

        <p class="customer-info__list-item">
          <span class="customer-info__list-item-title">Електронна пошта: </span>
          <a :href="'mailto:' + user.email" class="customer-info__list-item-link">
            {{ user.email }}
          </a>
        </p>

        <p class="customer-info__list-item">
          <span class="customer-info__list-item-title">Телефон: </span>
          {{ user.phone }}
        </p>

        <p class="customer-info__list-item">
          <span class="customer-info__list-item-title">Вебсайт: </span>
          <a :href="'https://' + user.website" target="_blank" class="customer-info__list-item-link">
            {{ user.website }}
          </a>
        </p>
      </div>


      <div class="customer-info__list-wrap">
        <h2 class="customer-info__list-subtitle">Адреса проживання</h2>

        <p class="customer-info__list-item">
          <span class="customer-info__list-item-title">Вулиця: </span>
          {{ user.address.street }}
        </p>

        <p class="customer-info__list-item">
          <span class="customer-info__list-item-title">Квартира / офіс: </span>
          {{ user.address.suite }}
        </p>

        <p class="customer-info__list-item">
          <span class="customer-info__list-item-title">Місто: </span>
          {{ user.address.city }}
        </p>

        <p class="customer-info__list-item">
          <span class="customer-info__list-item-title">Поштовий індекс: </span>
          {{ user.address.zipcode }}
        </p>

        <p class="customer-info__list-item">
          <span class="customer-info__list-item-title">Координати: </span>
          {{ user.address.geo.lat }}, {{ user.address.geo.lng }}
        </p>
      </div>

      <div class="customer-info__list-wrap">
        <h2 class="customer-info__list-subtitle">Компанія</h2>

        <p class="customer-info__list-item">
          <span class="customer-info__list-item-title">Назва: </span>
          {{ user.company.name }}
        </p>

        <p class="customer-info__list-item">
          <span class="customer-info__list-item-title">Слоган: </span>
          {{ user.company.catchPhrase }}
        </p>

        <p class="customer-info__list-item">
          <span class="customer-info__list-item-title">Спеціалізація: </span>
          {{ user.company.bs }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user } = storeToRefs(useAuthStore());
const isMounted = ref(false);

onMounted(() => {
  isMounted.value = true;
})
</script>

<style lang="scss">
.customer-info {
  &__title {
    font-size: 34px;
    line-height: 40px;
  }

  &__list {
    &-wrap {
      padding: 20px;
      box-shadow: 0 0 6px rgba(255, 255, 255, 0.2),
      0 0 12px rgba(255, 255, 255, 0.15);
    }

    &-subtitle {
      margin-bottom: 16px;
    }

    &-item-link {
      color: $linkColor;
    }
  }
}
</style>