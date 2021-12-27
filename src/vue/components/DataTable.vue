<script setup lang="ts">
import { ref, toRef } from 'vue'
import TableBox from './TableBox.vue'
import PaginateBox from './PaginateBox.vue'
import usePaginate from '../composables/usePaginate'

const props = defineProps<{ 
  columns: Array<any>,
  filter?: boolean,
  entries: Array<any>,
  footers?: Array<any[]>,
}>()

const emit = defineEmits<{
  (e: 'checklist', rows: any[]): void,
  (e: 'filter', columns: any): void
}>()

const getLimitPerPage = ref<number>(10)
const getCurrentPage = ref<number>(1)
const getEllipsis = ref<number>(2)

const { getOffset, getPages, paginatedEntries, getPagination } = usePaginate(toRef(props, 'entries'), getLimitPerPage, getCurrentPage, getEllipsis)

const checks = ref<any[]>([])
const filters = ref<any>({})
const checkedRows = (rows: any[]) => {
  checks.value = rows
  emit('checklist', checks.value)
}
const filterColumns = (columns: any) => {
  filters.value = columns
  emit('filter', filters.value)
}
</script>

<template>
  <TableBox :columns="columns" :entries="paginatedEntries" @checklist="checkedRows" :filter="filter" @filter="filterColumns" />
  <PaginateBox :items="getPagination" />
</template>

<style scoped>

</style>
