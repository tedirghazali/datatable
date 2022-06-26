<script setup lang="ts">
import { ref, computed } from 'vue'
import { pagination } from 'alga-js/array'

const props = defineProps<{
  modelValue: number,
  pages: number,
  items?: string[],
  ellipsis?: number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

const currentPage = ref(props?.modelValue || 1)

const getPagination = computed(() => {
  let newPagination = []
  if(props?.items) {
    newPagination = props?.items || []
  } else {
    const totalPages = props.pages
    const positionOfEllipsis = props?.ellipsis || 2
    newPagination = pagination(totalPages, currentPage.value, positionOfEllipsis)
  }
  return newPagination
})

const emitCurrentPage = (page) => {
  currentPage.value = page
  emit('update:modelValue', currentPage.value)
}
</script>

<template>
  <nav>
    <ul class="pagination dense">
      <li class="item">
        <span class="link" @click="emitCurrentPage(1)">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-chevron-double-left" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M8.354 1.646a.5.5 0 0 1 0 .708L2.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
            <path fill-rule="evenodd" d="M12.354 1.646a.5.5 0 0 1 0 .708L6.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
          </svg>
        </span>
      </li>
      <li class="item">
        <span class="link" @click="emitCurrentPage((Number(currentPage) > 1) ? Number(currentPage) - 1 : 1)">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-chevron-left" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
          </svg>
        </span>
      </li>
      <li v-for="(item, index) in getPagination" :key="'item-'+index" class="item" :class="Number(item) === Number(currentPage) ? 'active' : ''">
        <span v-if="Number(item) === Number(currentPage)" class="link">{{ item }}</span>
        <span v-else-if="item === '...'" class="link">{{ item }}</span>
        <span v-else @click="emitCurrentPage(Number(item))" class="link">{{ item }}</span>
      </li>
      <li class="item">
        <span class="link" @click="emitCurrentPage((Number(currentPage) < Number(pages)) ? Number(currentPage) + 1 : Number(pages))">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-chevron-right" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
          </svg>
        </span>
      </li>
      <li class="item">
        <span class="link" @click="emitCurrentPage(Number(pages))">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-chevron-double-right" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708z"/>
            <path fill-rule="evenodd" d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708z"/>
          </svg>
        </span>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
@use pagination {
  type: dense;
}
</style>
