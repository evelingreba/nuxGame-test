<template>
  <Modal
      v-model="isAuthModalOpened"
      :contentClass="['auth-modal']"
      :loading="pendingAuth"
      @modal:close="closeAuthModal"
  >
    <template #header>{{ 'Вхід' }}</template>

    <form
        class="auth-modal__form"
        @submit.prevent="makeAuth"
    >
      <FormGroup
          name="name"
          label="Ім'я"
          block
          :error="errors.name"
          class="auth-modal__form-item"
      >
        <Input
            ref="nameRef"
            id="name"
            size="lg"
            placeholder="Введіть ім'я"
            v-model="nameValue"
            inputmode="text"
            :modelModifiers="{ trim: true }"
            @input="setErrors({ name: undefined })"
        />
      </FormGroup>

      <FormGroup
          block
          name="phone"
          label="Введіть номер телефону"
          :error="errors.phone"
          class="auth-modal__form-item"
      >
        <Input
            v-model="phoneValue"
            id="phone"
            type="tel"
            inputmode="tel"
            size="lg"
            placeholder="Номер телефону"
            :disabled="pendingAuth"
            @input="setErrors({ phone: undefined })"
        />
      </FormGroup>

      <Button
          type="submit"
          variant="primary"
          block
          size="lg"
          :loading="pendingAuth"
          :disabled="pendingAuth"
      >
        {{ 'Вхід' }}
      </Button>

      <p v-if="globalError" class="auth-modal__form-error">
        {{ globalError }}
      </p>
    </form>
  </Modal>
</template>
<script setup lang="ts">
import Modal from "~/components/ui/Modal.vue";
import {useAuthStore} from "~/stores/authStore";
import FormGroup from "~/components/ui/FormGroup.vue";
import * as yup from 'yup';
import {VALIDATORS} from '@constants';
import Button from "~/components/ui/Button.vue";
import Input from "~/components/ui/Input.vue";
import {configure as configureVeeValidate, useForm} from 'vee-validate';

configureVeeValidate({
  validateOnChange: true,
  validateOnModelUpdate: false,
});

const {isAuthModalOpened, user} = storeToRefs(useAuthStore());
const nameRef = ref();
const pendingAuth = ref<boolean>(false);

/**
 * Close Auth Modal
 */
const closeAuthModal = (): void => {
  isAuthModalOpened.value = false;
};

const {errors, defineField, setErrors, validate} = useForm({
  validationSchema: yup.lazy(() => {

    return yup.object({
      name: yup.string().required("Це поле обов'язкове для заповлення").matches(VALIDATORS.lettersOnly, "Введіть коректне ім'я"),
      phone: yup.string().required("Це поле обов'язкове для заповлення").matches(VALIDATORS.phone, "Введіть коректний номер телефону"),
    });
  }),
  initialValues: {
    name: '',
    phone: ''
  },
});

const [nameValue] = defineField('name');
const [phoneValue] = defineField('phone');
const globalError = ref<string | null>(null);

/**
 * Set focus on input
 */
const focus = (): void => {
  if (nameRef.value?.inputRef) {
    setTimeout(() => nameRef.value?.inputRef?.focus(), 10);
  }
};

/**
 * Make Auth
 */
const makeAuth = async (): Promise<void> => {
  const {valid} = await validate();

  if (!valid) {
    return;
  }

  try {
    pendingAuth.value = true;

    const usersList = ref([]);

    usersList.value = await $fetch("https://jsonplaceholder.typicode.com/users", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    user.value = usersList.value.find((user: any) => user.name === nameValue.value && user.phone === phoneValue.value);

    if (user.value) {
      pendingAuth.value = false;
      isAuthModalOpened.value = false;

      navigateTo('/customer');
    } else {
      globalError.value = 'Дані про цього користувача відсутні';
    }

    pendingAuth.value = false;
  } catch (err) {
    globalError.value = 'Дані про цього користувача відсутні';
  }
};

watchEffect(() => {
  if (isAuthModalOpened.value && nameRef.value?.inputRef) {
    focus();
  }
});
</script>

<style lang="scss">
.auth-modal__form {
  &-item {
    margin-bottom: 16px;
  }

  &-error {
    font-size: 14px;
    text-align: center;
    margin-top: 10px;
  }
}
</style>