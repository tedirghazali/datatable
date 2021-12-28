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

const getLimitPerPage = ref<number>(7)
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
  <div class="tableWrap">
    <div class="tableTop">
      <div class="tableTopLeft"></div>
      <div class="tableTopRight"></div>
    </div>
    <TableBox :columns="columns" :entries="paginatedEntries" @checklist="checkedRows" :filter="filter" @filter="filterColumns" />
    <div class="tableBottom">
      <div class="tableBottomLeft">
        <div class="tableSelect">
          <select v-model="getLimitPerPage" class="tableSelectBox">
            <option :value="5">5</option>
            <option :value="7">7</option>
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
        </div>
        <div class="tableInfo">from {{ getOffset }} to {{ (Number(getOffset) + Number(getLimitPerPage)) - 1 }} of {{ getPages }}</div>
      </div>
      <div class="tableBottomRight">
        <PaginateBox :items="getPagination" v-model="getCurrentPage" :total="getPages" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.tableWrap {
  overflow-x: auto;
  overflow-y: hidden;
}

.tableTop, .tableBottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  padding-top: 10px;
  padding-bottom: 10px;
}

.tableBottomLeft {
  display: flex;
  justify-content: start;
  align-items: center;
  flex-wrap: nowrap;
  flex-grow: 1;
  gap: 10px;
}

.tableInfo {
  display: block;
  flex-grow: 1;
}

.tableSelectBox {
  position: relative;
  display: block;
  background: #fff;
  border: 0.0625rem solid rgba(0, 0, 0, 0.15);
  padding: 0.15rem 1rem;
  border-radius: 1rem;
  width: 80px;
  height: 37px;
  line-height: 2rem;
  box-sizing: border-box;
  cursor: pointer;
  font-family: inherit;
  outline: none;
  user-select: none;
  appearance: none;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  font-size: 0.875rem;
  font-weight: 400;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.tableSelect {
  position: relative;
}

.tableSelect::after {
  border-bottom: 2px solid rgba(0, 0, 0, 0.15);
  border-right: 2px solid rgba(0, 0, 0, 0.15);
  content: '';
  display: block;
  height: 8px;
  margin-top: -6px;
  pointer-events: none;
  position: absolute;
  right: 8px;
  top: 50%;
  margin-right: 10px;
  -webkit-transform-origin: 66% 66%;
  -ms-transform-origin: 66% 66%;
  transform-origin: 66% 66%;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
  -webkit-transition: all 0.15s ease-in-out;
  transition: all 0.15s ease-in-out;
  width: 8px;
}
</style>
