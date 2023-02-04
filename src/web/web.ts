import { defineCustomElement } from 'vue'
import VueDataTable from '../vue/components/DataTable.vue'
import VuePaginationBox from '../vue/components/PaginationBox.vue'
import VueServerTable from '../vue/components/ServerTable.vue'

//@ts-ignore
export const DataTable = defineCustomElement(VueDataTable)
//@ts-ignore
export const PaginationBox = defineCustomElement(VuePaginationBox)
//@ts-ignore
export const ServerTable = defineCustomElement(VueServerTable)

export function useTedirTable() {
  customElements.define('data-table', DataTable)
  customElements.define('pagination-box', PaginationBox)
  customElements.define('server-table', ServerTable)
}
