<script setup lang="ts">
interface Props {
  //@ts-ignore
  items?: Array<any>,
  modelValue?: number,
  total: number
}

const props = withDefaults(defineProps<Props>(), {
  //@ts-ignore
  items: [],
  modelValue: 1,
  total: 1
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()
</script>

<template>
  <nav class="paginate">
    <ul class="paginateBox">
      <li class="paginateItem">
        <span class="paginateLink" @click="emit('update:modelValue', 1);">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-chevron-double-left paginateEvent" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M8.354 1.646a.5.5 0 0 1 0 .708L2.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
            <path fill-rule="evenodd" d="M12.354 1.646a.5.5 0 0 1 0 .708L6.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
          </svg>
        </span>
      </li>
      <li class="paginateItem">
        <span class="paginateLink" @click="emit('update:modelValue', (Number(modelValue) > 1) ? Number(modelValue) - 1 : 1);">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-chevron-left paginateEvent" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
          </svg>
        </span>
      </li>
      <li v-for="(item, index) in items" :key="'item-'+index" class="paginateItem">
        <span v-if="Number(item) === Number(modelValue)" class="paginateLink active">{{ item }}</span>
        <span v-else-if="item === '...'" class="paginateLink disabled">{{ item }}</span>
        <span v-else @click="emit('update:modelValue', item);" class="paginateLink">{{ item }}</span>
      </li>
      <li class="paginateItem">
        <span class="paginateLink" @click="emit('update:modelValue', (Number(modelValue) < Number(total)) ? Number(modelValue) + 1 : Number(total));">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-chevron-right paginateEvent" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
          </svg>
        </span>
      </li>
      <li class="paginateItem">
        <span class="paginateLink" @click="emit('update:modelValue', Number(total));">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-chevron-double-right paginateEvent" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708z"/>
            <path fill-rule="evenodd" d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708z"/>
          </svg>
        </span>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.paginateBox {
  margin-bottom: 1.25rem;
  display: flex;
  padding-left: 0;
  list-style: none;
}

.paginateItem {
  -webkit-transition: all 0.5s;
-ms-transition: all 0.5s;
  transition: all 0.5s;
  text-align: center;
  z-index: 1;
}

.paginateItem:first-child .paginateLink {
  border-top-left-radius: 0.75rem;
  border-bottom-left-radius: 0.75rem;
}

.paginateItem:last-child .paginateLink {
  border-top-right-radius: 0.75rem;
  border-bottom-right-radius: 0.75rem;
}

.paginateLink {
  padding: 0.5rem 0.75rem;
  position: relative;
  display: block;
  color: inherit;
  cursor: pointer;
  text-decoration: none;
  background-color: #fff;
  border: 0.0625rem solid rgba(0, 0, 0, 0.15);
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.paginateItem:not(:last-child) .paginateLink {
  border-right-width: 0;
}

.paginateItem .active {
  background-color: rgba(0, 0, 0, 0.15);
  border-color: rgba(0, 0, 0, 0.05);
  border-left-width: 0;
}

.paginateItem .disabled {
  cursor: not-allowed;
}

.paginateEvent {
  pointer-events: none;
}
</style>
