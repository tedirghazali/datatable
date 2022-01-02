<script setup lang="ts">
import { ref } from 'vue'
import DataTable from './components/DataTable.vue'
import entries from './models/entries'

const columns = [
  { prop: 'id', text: 'ID', type: 'checkbox' },
  { prop: 'name', text: 'Name', type: 'text', filter: true },
  { prop: 'position', text: 'Position', type: 'text', filter: true, filterType: 'select' },
  { prop: 'office', text: 'Office', type: 'text', filter: true, filterType: 'select' },
  { prop: 'extension', text: 'Exten.', type: 'text', filter: true },
  { prop: 'startdate', text: 'Start Date', type: 'text', filter: true },
  { prop: 'salary', text: 'Salary', type: 'text', filter: true }
]
</script>

<template>
  <DataTable :columns="columns" :entries="entries" :filter="true" />
</template>

<style>
#app {
  font-family: Avenir, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 1024px;
  color: #2c3e50;
  margin: 30px auto;
}
</style>
