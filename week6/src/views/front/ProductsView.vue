<template>
    這是產品列表頁面
    <table class="table">
      <tbody>
        <tr v-for="item in products" :key="item.id">
          <td>{{ item.title }}</td>
          <td><img :src="item.imageUrl" width="300" alt=""></td>
          <td>
            <RouterLink :to="`/product/${item.id}`" class="btn btn-outline-secondary">產品細節</RouterLink>
            <button type="button" class="btn btn-primary"
            @click="addToCart(item.id)">加入購物車</button>
          </td>
        </tr>
      </tbody>
    </table>
</template>

<script>
import { RouterLink } from 'vue-router'
const { VITE_APP_URL, VITE_APP_PATH } = import.meta.env

export default {
  data () {
    return {
      products: []
    }
  },
  components: {
    RouterLink
  },
  methods: {
    getProducts () {
      this.$http.get(`${VITE_APP_URL}api/${VITE_APP_PATH}/products/all`)
        .then((res) => {
          console.log(res)
          this.products = res.data.products
        })
    },
    addToCart (id) {
      const data = {
        product_id: id,
        qty: 1
      }

      this.$http.post(`${VITE_APP_URL}api/${VITE_APP_PATH}/cart`, { data })
        .then((res) => {
          console.log(res)
        })
    }
  },
  mounted () {
    this.getProducts()
  }
}
</script>
