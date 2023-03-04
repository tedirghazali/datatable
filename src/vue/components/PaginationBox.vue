<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { pagination } from 'alga-js/array'

const props = defineProps<{
  modelValue: number,
  pages: number,
  items?: string[],
  ellipsis?: number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void,
  (e: 'handler', value: number): void
}>()

const currentPage = ref<number>(props?.modelValue || 1)

watch(() => props.modelValue, () => {
  currentPage.value = props.modelValue
})

const getPagination = computed<any[]>(() => {
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

const emitCurrentPage = (page: number) => {
  currentPage.value = page
  emit('update:modelValue', currentPage.value)
  emit('handler', currentPage.value)
}
</script>

<template>
  <nav>
    <ul class="pagination dense">
      <li class="item">
        <span class="link" @click="emitCurrentPage(1)">
          &laquo;
        </span>
      </li>
      <li class="item">
        <span class="link" @click="emitCurrentPage((Number(currentPage) > 1) ? Number(currentPage) - 1 : 1)">
          &lsaquo;
        </span>
      </li>
      <li v-for="(item, index) in getPagination" :key="'item-'+index" class="item" :class="Number(item) === Number(currentPage) ? 'active' : ''">
        <span v-if="Number(item) === Number(currentPage)" class="link">{{ item }}</span>
        <span v-else-if="item === '...'" class="link">{{ item }}</span>
        <span v-else @click="emitCurrentPage(Number(item))" class="link">{{ item }}</span>
      </li>
      <li class="item">
        <span class="link" @click="emitCurrentPage((Number(currentPage) < Number(pages)) ? Number(currentPage) + 1 : Number(pages))">
          &rsaquo;
        </span>
      </li>
      <li class="item">
        <span class="link" @click="emitCurrentPage(Number(pages))">
          &raquo;
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
