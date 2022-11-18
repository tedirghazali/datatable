<script setup>
import { ref, computed } from 'vue'
import { Inertia } from '@inertiajs/inertia'
import { Head, Link, useForm } from '@inertiajs/inertia-vue3'
import { pages, pagination } from 'alga-js/array'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';

const props = defineProps({
  entries: Array,
  info: Object
})

const limitPage = ref(props.info.limit || 10)
const currentPage = ref(props.info.page || 1)
const ellipsis = ref(4)
const sortColumn = ref(props.info.sort || 'id')
const sortBy = ref(props.info.sortBy || 'desc')
const searchInput = ref(props.info.search || '')
const searchBySelect = ref(props.info.searchBy || '')

const getPages = computed(() => {
  return pages(props.info.total, props.info.limit)
})

const getPagination = computed(() => {
  return pagination(getPages.value, currentPage.value, ellipsis.value)
})

const visitPage = (page) => {
  currentPage.value = page
  Inertia.visit(`/products/categories?limit=${limitPage.value}&page=${currentPage.value}&sort=${sortColumn.value}&sort_by=${sortBy.value}&search=${searchInput.value}&search_by=${searchBySelect.value}`)
}

const searchTimer = ref(null)
const searchTable = () => {
  clearTimeout(searchTimer.value)
  searchTimer.value = setTimeout(() => {
    Inertia.visit(`/products/categories?limit=${limitPage.value}&page=${currentPage.value}&sort=${sortColumn.value}&sort_by=${sortBy.value}&search=${searchInput.value}&search_by=${searchBySelect.value}`)
  }, 1000)
}

const sortTable = (col) => {
  if(sortColumn.value !== col) {
    sortColumn.value = col
  }
  sortBy.value = (sortBy.value === 'desc') ? 'asc' : 'desc'
}

const form = useForm({
  id: '',
  category_code: '',
  category_name: ''
})

const showModal = ref(false)

const createHandler = () => {
  showModal.value = true
  form.id = ''
  form.category_code = ''
  form.category_name = ''
}

const editHandler = (item) => {
  showModal.value = true
  form.id = item.id
  form.category_code = item.category_code
  form.category_name = item.category_name
}

const saveHandler = () => {
  if(form.id !== '') {
    form.put(route('products.categories.update', form.id), {
      onFinish: () => {
        form.reset('category_code', 'category_code')
      },
      onSuccess: () => {
        showModal.value = false
      }
    })
  } else {
    form.post(route('products.categories.store'), {
      onFinish: () => {
        form.reset('category_code', 'category_code')
      },
      onSuccess: () => {
        showModal.value = false
      }
    })
  }
}

const destroyHandler = (id) => {
  form.delete(route('products.categories.destroy', id))
}

const dropDownHandler = (e) => {
  if(e.target.parentElement.classList.contains('show')) {
    e.target.parentElement.classList.remove('show')
  } else {
    e.target.parentElement.classList.add('show')
  }
}

const dropItemHandler = (e) => {
  if(e.target.parentElement.parentElement.classList.contains('show')) {
    e.target.parentElement.parentElement.classList.remove('show')
  } else {
    e.target.parentElement.parentElement.classList.add('show')
  }
}

const ascStr = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-sort-up" viewBox="0 0 16 16">
  <path d="M3.5 12.5a.5.5 0 0 1-1 0V3.707L1.354 4.854a.5.5 0 1 1-.708-.708l2-1.999.007-.007a.498.498 0 0 1 .7.006l2 2a.5.5 0 1 1-.707.708L3.5 3.707V12.5zm3.5-9a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zM7.5 6a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zm0 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zm0 3a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1z"/>
</svg>`
const descStr = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-sort-down-alt" viewBox="0 0 16 16">
  <path d="M3.5 3.5a.5.5 0 0 0-1 0v8.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L3.5 12.293V3.5zm4 .5a.5.5 0 0 1 0-1h1a.5.5 0 0 1 0 1h-1zm0 3a.5.5 0 0 1 0-1h3a.5.5 0 0 1 0 1h-3zm0 3a.5.5 0 0 1 0-1h5a.5.5 0 0 1 0 1h-5zM7 12.5a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 0-1h-7a.5.5 0 0 0-.5.5z"/>
</svg>`
</script>

<template>
  <Head title="Categories" />

  <AuthenticatedLayout>
    <h2>Categories</h2>

    <div class="card cardBody p-0px mt-2rem">
      <div class="p-1.5rem d-flex justify-between">
        <div class="group pi-static">
          <span class="button groupItem">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="pointerEvents-none bi bi-search" viewBox="0 0 16 16">
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
            </svg>
          </span>
          <input type="search" v-model="searchInput" @input="searchTable" @keyup.enter="searchTable" class="input groupItem">
          <select v-model="searchBySelect" @change="searchTable" class="select groupItem w-auto">
            <option value="">All</option>
            <option value="code">Code</option>
            <option value="name">Name</option>
          </select>
        </div>
        <div>
          <button class="button fg-hexfff primary-light hover:primary-dark-20" @click="createHandler">Create</button>
        </div>
      </div>
      <div>
        <table class="table tableList bl-none br-none">
          <thead>
            <tr>
              <th class="w-50px">
                <div class="check">
                  <input type="checkbox" class="checkInput" />
                </div>
              </th>
              <th>
                <div class="d-flex justify-between items-center" @click="sortTable('code'); visitPage(1);">
                  <span>Category Code</span>
                  <span class="cursor-pointer" v-if="info.sort === 'code' && info.sortBy === 'asc'" v-html="ascStr"></span>
                  <span class="cursor-pointer" v-else v-html="descStr"></span>
                </div>
              </th>
              <th>
                <div class="d-flex justify-between items-center" @click="sortTable('name'); visitPage(1);">
                  <span>Category Name</span>
                  <span class="cursor-pointer" v-if="info.sort === 'name' && info.sortBy === 'asc'" v-html="ascStr"></span>
                  <span class="cursor-pointer" v-else v-html="descStr"></span>
                </div>
              </th>
              <th class="align-right w-80px">Action</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="entries.length < 1">
              <tr>
                <td colspan="4" class="align-center">
                  Still doesn't not have any data yet.
                </td>
              </tr>
            </template>
            <template v-else>
              <tr v-for="entry in entries" :key="entry.id">
                <td>
                  <div class="check">
                    <input type="checkbox" class="checkInput" :value="entry.id"/>
                  </div>
                </td>
                <td>{{ entry.category_code }}</td>
                <td>{{ entry.category_name }}</td>
                <td>
                  <div class="dropDown align-right">
                    <div class="button dropDownToggler" @click="dropDownHandler">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="pointerEvents-none bi bi-gear" viewBox="0 0 16 16">
                        <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
                        <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/>
                      </svg>
                    </div>
                    <div class="dropDownBackdrop" @click="dropDownHandler"></div>
                    <div class="dropDownMenu dropDownRight mnw-160px mt-5px">
                      <div class="dropDownItem cursor-pointer" @click="dropItemHandler($event); editHandler(entry);">Edit</div>
                      <div class="dropDownItem cursor-pointer" @click="dropItemHandler($event); destroyHandler(entry.id);">Delete</div>
                    </div>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
      <div class="p-1.5rem d-flex justify-between">
        <div class="d-flex items-center">
          <select v-model="limitPage" class="select w-80px" @change="visitPage(1)">
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
          <span class="pl-2" v-show="info.length">from {{ info.from }} to {{ (Number(info.length) <= Number(info.to)) ? info.length : info.to }} of {{ info.length }}</span>
        </div>
        <ul class="pagination dense">
          <li class="item"><span class="link" @click="visitPage(1)">&laquo;</span></li>
          <li class="item"><span class="link" @click="visitPage(Number(currentPage) > 1 ? Number(currentPage) - 1 : 1)">&lsaquo;</span></li>
          <template v-for="(pag, index) in getPagination" :key="index">
            <li class="item active" v-if="Number(pag) === Number(currentPage)" style="color: #fc0000;"><span class="link" aria-current="page">{{ pag }}</span></li>
            <li class="item ellipsis" v-else-if="pag === '...'"><span class="link">...</span></li>
            <li class="item" v-else><span class="link" @click="visitPage(pag)">{{ pag }}</span></li>
          </template>
          <li class="item"><span class="link" @click="visitPage(Number(currentPage) < Number(getPages) ? Number(currentPage) + 1 : getPages)">&rsaquo;</span></li>
          <li class="item"><span class="link" @click="visitPage(getPages)">&raquo;</span></li>
        </ul>
      </div>
    </div>
    <teleport to="body">
      <div class="modal" :class="{active: showModal}">
        <div class="modalDialog modalCenter" @click.self="showModal = false">
          <form @submit.prevent="saveHandler" class="modalContent fg-inherit">
            <div class="modalHeader">
              <h3 class="modalTitle">{{ form.id !== '' ? 'Edit' : 'Create' }} Category</h3>
              <div class="cursor-pointer" @click="showModal = false">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="pointerEvents-none bi bi-x-lg" viewBox="0 0 16 16">
                  <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                </svg>
              </div>
            </div>
            <div class="modalBody">
              <div>
                <label for="category_code">Category Code</label>
                <input id="category_code" type="text" class="input" :class="{invalid: form.errors.category_code}" v-model="form.category_code" required autofocus autocomplete="category_code" />
                <span class="invalidMessage">{{ form.errors.category_code }}</span>
              </div>
              <div class="mt-4">
                <label for="category_name">Category Name</label>
                <input id="category_name" type="text" class="input" :class="{invalid: form.errors.category_name}" v-model="form.category_name" required autocomplete="category_name" />
                <span class="invalidMessage">{{ form.errors.category_name }}</span>
              </div>
            </div>
            <div class="modalFooter">
              <div></div>
              <div>
                <button type="button" class="button" @click="showModal = false">Close</button>
                <button type="submit" class="button fg-hexfff primary-light hover:primary-light-25 ml-4" :class="{ 'opacity-0.25': form.processing }" :disabled="form.processing">
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </teleport>
  </AuthenticatedLayout>
</template>
