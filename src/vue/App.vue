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
  <div class="container mt-30px">
    <DataTable :columns="columns" :entries="entries" :filter="true" />
  </div>
</template>

<style>
@use base;
@use container;
</style>
