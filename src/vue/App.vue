<script setup lang="ts">
import { ref } from 'vue'
import TableData from './components/TableData.vue'
import rawEntries from './assets/raw-entries.js'

const columns = [
  { prop: 'id', text: 'ID', type: 'checkbox' },
  { prop: 'name', text: 'Name', type: 'text', filter: true },
  { prop: 'position', text: 'Position', type: 'text', filter: true },
  { prop: 'office', text: 'Office', type: 'text', filter: true },
  { prop: 'extension', text: 'Exten.', type: 'text', filter: true },
  { prop: 'startdate', text: 'Start Date', type: 'text', filter: true },
  { prop: 'salary', text: 'Salary', type: 'text', filter: true }
]

const checks = ref([])
const filters = ref({})
const checkedRows = (rows: any[]) => {
  checks.value = rows
}
const filterColumns = (columns: any) => {
  filters.value = columns
}
</script>

<template>
  {{ filters }}
  <TableData :columns="columns" :entries="rawEntries" @checklist="checkedRows" :filter="true" @filter="filterColumns" />
</template>

<style>
#app {
  font-family: Avenir, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 1024px;
  color: #2c3e50;
  margin: 60px auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
}
    
.table tr {
  border-bottom: 1px solid rgba(0, 0, 0, 0.25);
}
    
.table thead {
  border-bottom: 2px solid rgba(0, 0, 0, 0.5);
}
    
.table tfoot {
  border-top: 2px solid rgba(0, 0, 0, 0.5);
}
    
.table tr:last-child {
  border-bottom-width: 0px;
}
    
.table tr th, .table tr td {
  text-align: left;
  vertical-align: top;
  padding: 0.75rem;
}
    
.tableBorder {
  border-top: 1px solid rgba(0, 0, 0, 0.25);
  border-right: 1px solid rgba(0, 0, 0, 0.25);
  border-bottom: 1px solid rgba(0, 0, 0, 0.25);
}
    
.tableBorder th, .tableBorder td {
  border-left: 1px solid rgba(0, 0, 0, 0.25);
}
    
.tableResponsive {
  overflow-x: auto;
}

.input {
  width: 100%;
}
</style>
