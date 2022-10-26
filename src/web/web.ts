import { defineCustomElement } from 'vue'
import VueDataTable from '../vue/components/DataTable.vue'
import VuePaginationBox from '../vue/components/PaginationBox.vue'
import VueServerTable from '../vue/components/ServerTable.vue'

export const DataTable = defineCustomElement(VueDataTable)
export const PaginationBox = defineCustomElement(VuePaginationBox)
export const ServerTable = defineCustomElement(VueServerTable)

export function useTedirTable() {
  customElements.define('data-table', DataTable)
  customElements.define('pagination-box', PaginationBox)
  customElements.define('server-table', ServerTable)
}
