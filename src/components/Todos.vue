<template>
  <div :class="['todos', {'is-loading': loading}]">
    <Transition v-if="!loading && todosList?.length" name="fade">
      <div class="todos__wrap">
        <h2 class="todos__title">Перелік завдань</h2>

        <form
            class="todos__create"
            @submit.prevent="createTodo"
        >
          <h3 class="todos__create-title">Додати завдання</h3>

          <FormGroup
              name="userId"
              label="ID користувача"
              :error="errors.userId"
              class="todos__create-item"
          >
            <Input
                ref="userIdRef"
                id="userId"
                placeholder="ID користувача"
                v-model="userIdValue"
                inputmode="numeric"
                size="lg"
                :modelModifiers="{ trim: true }"
                @input="setErrors({ userId: undefined })"
            />
          </FormGroup>

          <FormGroup
              name="title"
              label="Назва завдання"
              :error="errors.title"
              class="todos__create-item"
          >
            <Input
                v-model="titleValue"
                id="title"
                inputmode="text"
                size="lg"
                placeholder="Назва завдання"
                @input="setErrors({ title: undefined })"
            />
          </FormGroup>

          <Button
              type="submit"
              :loading="pendingCreating"
              :disabled="pendingCreating"
              size="sm"
              aria-label="Додати завдання"
              class="todos__create-button"
          >
            {{ 'Додати' }}
          </Button>

          <p v-if="globalError" class="todos__create-error">
            {{ globalError }}
          </p>
        </form>

        <div class="todos__filter">
          <FormGroup
              label="Статус"
              class="todos__filter-item"
          >
            <Select
                :selected="selectedStatus || statusOptions[0]"
                :options="statusOptions"
                block
                @select="selectedStatus = $event"
            />
          </FormGroup>

          <FormGroup
              label="ID користувача"
              class="todos__filter-item"
          >
            <Select
                :selected="selectedUserId || getUserIds[0]"
                :options="getUserIds"
                block
                @select="selectedUserId = $event"
            />
          </FormGroup>

          <FormGroup
              label="Пошук за назвою"
              name="searchTitle"
              class="todos__filter-item"
          >
            <Input
                ref="searchInputField"
                v-model.trim="searchPhrase"
                id="searchTitle"
                placeholder="Введіть текст"
                type="search"
                block
                size="lg"
            />
          </FormGroup>

          <Button
              type="submit"
              class="todos__filter-button"
              size="sm"
              aria-label="Відфільтрувати таблицю"
              @click="applyFilters"
          >
            {{ "Пошук" }}
          </Button>

          <Button
              v-show="areFiltersApplied"
              class="todos__filter-button--reset"
              aria-label="Скинути фільтр"
              variant="link-dashed"
              outline
              @click="resetFilters"
          >
            {{ "Скинути фільтр" }}
          </Button>
        </div>

        <div class="todos__table-wrap">
          <table class="todos__table">
            <thead class="todos__table-header">
            <tr class="todos__table-item">
              <th class="todos__table-item-column">ID користувача</th>
              <th class="todos__table-item-column">ID</th>
              <th class="todos__table-item-column">Назва</th>
              <th class="todos__table-item-column">Завершено</th>
              <th class="todos__table-item-column">Обрані</th>
            </tr>
            </thead>

            <tbody class="todos__table-body">
            <template v-for="(item, id) in getActualTodosList" :key="`item-${id}`">
              <tr class="todos__table-item">
                <template v-for="(value, index) in item" :key="`column-${index}`">
                  <td class="todos__table-item-column">
                    {{ value }}
                  </td>
                </template>

                <td class="todos__table-item-column">
                  <Button
                      iconOnly
                      variant="secondary"
                      aria-label="Додати в обране"
                      @click="toggleFavourite(item.id)"
                  >
                    <Favorite v-if="!isInFavourites(item.id)" class="todos__table-item-column-icon"/>
                    <FavoriteActive v-else class="todos__table-item-column-icon"/>
                  </Button>
                </td>
              </tr>
            </template>
            </tbody>
          </table>

          <p v-if="gettingTodosError" class="todos__table-error">
            {{ gettingTodosError }}
          </p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import Select from "~/components/ui/Select.vue";
import FormGroup from "~/components/ui/FormGroup.vue";
import Input from "~/components/ui/Input.vue";
import Favorite from '~/assets/icons/favorite.svg';
import FavoriteActive from '~/assets/icons/favorite-active.svg';
import Button from "~/components/ui/Button.vue";
import * as yup from "yup";
import {VALIDATORS} from "@constants";
import { configure as configureVeeValidate, useForm } from 'vee-validate';
import type {ITodo} from "@types/todos";

configureVeeValidate({
  validateOnChange: true,
  validateOnModelUpdate: false,
});

const statusOptions = [
  { value: 'all', label: 'Всі' },
  { value: 'completed', label: 'Завершені' },
  { value: 'uncompleted', label: 'Не завершені' },
  { value: 'favourites', label: 'Улюблені' }
];

/**
 * Apply filters
 */
const applyFilters = () => {
  filteredTodosList.value = getFilteredTodos(
      todosList.value,
      selectedStatus.value?.value,
      selectedUserId.value?.value,
      searchPhrase.value,
      favourites.value
  )

  if (filteredTodosList.value.length !== todosList.value.length) {
    areFiltersApplied.value = true;
  }
}

const loading = ref<boolean>(false);
const pendingCreating = ref<boolean>(false);
const todosList = ref<ITodo[]>([]);
const filteredTodosList = ref<ITodo[]>([]);
const selectedStatus = ref<{ value: string; label: string }>();
const selectedUserId = ref<{ value: number; label: string } | null>(null);
const searchPhrase = ref<string>('');
const favourites = ref<number[]>([])
const areFiltersApplied = ref<boolean>(false);
const globalError = ref<string | null>(null);
const gettingTodosError = ref<string | null>(null);

const { errors, defineField, setErrors, validate } = useForm({
  validationSchema: yup.lazy(() => {

    return yup.object({
      userId: yup.string().required("Це поле обов'язкове для заповлення").matches(VALIDATORS.numeric, "Введіть коректне ID користувача"),
      title: yup.string().required("Це поле обов'язкове для заповлення").matches(VALIDATORS.lettersOnly, "Введіть коректний заголовок"),
    });
  }),
  initialValues: {
    userId: '',
    title: ''
  },
});

const [userIdValue] = defineField('userId');
const [titleValue] = defineField('title');

/**
 * Get actual todos list value
 */
const getActualTodosList = computed(() => {
  return areFiltersApplied.value ? filteredTodosList.value : todosList.value
})

/**
 * Get user ids from todos list
 */
const getUserIds = computed(() => {
  const uniqueUserIds = [...new Set(todosList.value.map(item => item.userId))]

  return [
    { value: 0, label: 'Всі' },
    ...uniqueUserIds.map(id => ({ value: id, label: id }))
  ]
})

/**
 * Create new Todos
 */
const createTodo = async (): Promise<void> => {
  const { valid } = await validate();

  if (!valid) {
    return;
  }

  try {
    pendingCreating.value = true;

    const created = await $fetch('https://jsonplaceholder.typicode.com/todos', {
      method: 'POST',
      body: {
        userId: Number(userIdValue.value),
        id: todosList.value.length,
        title: titleValue.value.trim(),
        completed: false
      }
    })

    todosList.value.unshift(created as ITodo);
  } catch (err) {
    globalError.value = 'Вибачте, виникла помилка';
  } finally {
    pendingCreating.value = false;
  }
};

/**
 * Get list of Todos
 */
const getTodosList = async (): Promise<void> => {
  try {
    loading.value = true;

    todosList.value = await $fetch("https://jsonplaceholder.typicode.com/todos", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (todosList) {
      loading.value = false;
    }
  } catch (err) {
    loading.value = false;
    gettingTodosError.value = 'Вибачте, виникла помилка';
  }
}

const getFavourites = () => {
  const stored = localStorage.getItem('favourites');

  if (stored) {
    favourites.value = JSON.parse(stored);
  }
}

/**
 * Is item in favourites or not
 * @param id
 */
const isInFavourites = (id: number) => {
  return favourites.value.includes(id);
}

/**
 * Toggle click on a Favourite button
 * @param taskId
 */
function toggleFavourite(taskId: number) {
  if (isInFavourites(taskId)) {
    favourites.value = favourites.value.filter(id => id !== taskId)
  } else {
    favourites.value.push(taskId)
  }

  localStorage.setItem('favourites', JSON.stringify(favourites.value))
}

/**
 * Filter list by status
 * @param list
 * @param status
 * @param favourites
 */
const filterByStatus = (list: ITodo, status: string | undefined, favourites: number[]) => {
  if (status === 'completed') {
    return list.completed;
  } else if (status === 'uncompleted') {
    return !list.completed;
  } else  if (status === 'favourites') {
    return favourites.includes(list.id);
  }

  return true;
}

/**
 * Filter list by user id
 * @param list
 * @param userId
 */
const filterByUser = (list: ITodo, userId: number) => {
  if (!userId) {
    return true;
  }

  return list.userId === userId;
}

/**
 * Filter list by search query
 * @param list
 * @param query
 */
const filterBySearch = (list: ITodo, query: string) => {
  return list.title.toLowerCase().includes(query.toLowerCase());
}

/**
 * Get filtered list
 * @param todos
 * @param status
 * @param userId
 * @param query
 * @param favourites
 */
const getFilteredTodos = (todos: ITodo[], status: string | undefined, userId: number | null | undefined, query: string, favourites: number[]) => {
  let result = [...todos];

  if (status) {
    result = result.filter(todo => filterByStatus(todo, status, favourites));
  }

  if (userId) {
    result = result.filter(todo => filterByUser(todo, userId));
  }

  if (query && query.trim() !== '') {
    result = result.filter(todo => filterBySearch(todo, query));
  }

  return result
}

/**
 * Reset all filters
 */
const resetFilters = () => {
  areFiltersApplied.value = false;
  selectedStatus.value = statusOptions[0];
  selectedUserId.value = null;
  searchPhrase.value = '';
  filteredTodosList.value = todosList.value;
}

onMounted(() => {
  getTodosList();
  getFavourites();
})
</script>

<style lang="scss">
.todos {
  position: relative;

  &.is-loading {
    @include loader;
  }

  &__title {
    position: static;
    font-size: 28px;
    font-weight: bold;
    line-height: 32px;
    text-align: center;
    margin-bottom: 16px;
  }

  &__create {
    margin-bottom: 32px;
    
    &-title {
      margin-bottom: 16px;
    }

    &-item {
      display: block;
      width: 320px;
      margin-bottom: 16px;
    }

    &-button {
      margin-top: 10px;
    }

    &-error {
      font-size: 14px;
      text-align: left;
      margin-top: 10px;
    }
  }

  &__filter {
    position: static;
    display: flex;
    align-items: flex-end;
    flex-wrap: wrap;
    margin-bottom: 20px;
    gap: 16px;

    &-item {
      margin-right: 20px;

      .select-field {
        min-width: 150px;
      }
    }

    &-button--reset {
      margin-left: auto;
    }
  }

  .form-group__label {
    color: $white;
  }

  &__table {
    display: block;
    border-collapse: collapse;
    min-width: 700px;

    &-wrap {
      width: 100%;
      overflow-x: auto;
    }

    &-caption,
    &-header,
    &-body {
      display: block;
    }

    &-header {
      font-size: 16px;
    }

    &-item {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding: 20px;
      box-shadow: 0 0 6px rgba(255, 255, 255, 0.2),
      0 0 12px rgba(255, 255, 255, 0.15);

      &-column {
        display: flex;
        width: 100%;

        &:nth-of-type(1),
        &:nth-of-type(2),
        &:nth-of-type(4) {
          flex: 1;
        }

        &:nth-of-type(3) {
          flex: 2.5;
        }

        &:nth-of-type(5) {
          flex: .5;
        }

        @include md {
          &:nth-of-type(1),
          &:nth-of-type(2),
          &:nth-of-type(4) {
            flex: 1;
          }

          &:nth-of-type(3) {
            flex: 4;
          }

          &:nth-of-type(5) {
            flex: .5;
          }
        }

        &-icon {
          width: 24px;
          height: 24px;
          fill: $white;
        }
      }
    }

    &-error {
      font-size: 14px;
      text-align: center;
      margin-top: 10px;
    }
  }
}
</style>