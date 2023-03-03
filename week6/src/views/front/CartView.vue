<template>
  <div class="text-end">
    <button class="btn btn-outline-danger" type="button" :disabled="loadingStatus.loading"
            @click="removeCartAll()">清空購物車</button>
  </div>
  <table class="table align-middle">
    <thead>
      <tr>
        <th></th>
        <th>品名</th>
        <th style="width: 150px">數量/單位</th>
        <th>單價</th>
        <th>小計</th>
      </tr>
    </thead>
    <tbody>
      <template v-if="carts.carts">
        <tr v-for="item in carts.carts" :key="item.id">
          <td>
            <button type="button" class="btn btn-outline-danger btn-sm"
                    @click="removeCartProduct(item.id, item.product.title)"
                    :disabled="item.id === loadingStatus.loadingItem">
              <i class="fas fa-spinner fa-pulse"
                 v-if="loadingStatus.loading && loadingStatus.loadingItem === item.id"></i>
              x
            </button>
          </td>
          <td>
            {{ item.product.title }}
          </td>
          <td>
            <div class="input-group input-group-sm">
              <div class="input-group mb-3">
                <select name="" id="" class="form-select" v-model="item.qty"
                        @change="changeQty(item.product_id, item.id, item.qty)"
                        :disabled="item.id === loadingStatus.loadingItem">
                  <option :value="i" v-for="i in 20" :key="i + '101010'">{{ i }}</option>
                </select>
              </div>
            </div>
          </td>
          <td class="text-end">
            {{ item.product.price }}
          </td>
          <td class="text-end">
            {{ item.final_total }}
          </td>
        </tr>
      </template>
    </tbody>
    <tfoot>
      <tr>
        <td colspan="4" class="text-end">總計</td>
        <td class="text-end">{{ carts.total }}</td>
      </tr>
    </tfoot>
  </table>
</template>

<script>
const { VITE_APP_URL, VITE_APP_PATH } = import.meta.env

export default {
  data () {
    return {
      products: [],
      product: {},
      carts: [],
      cartStatus: false,
      isLoading: false,
      fullPage: true,
      loadingStatus: {
        loading: false,
        loadingItem: ''
      },
      order: {
        user: {
          email: '',
          name: '',
          tel: '',
          address: ''
        },
        message: ''
      }
    }
  },
  methods: {
    getProducts () {
      const url = `${VITE_APP_URL}api/${VITE_APP_PATH}/products/all`
      this.$http
        .get(url)
        .then((res) => {
          // console.log('🚀 ~ file: index.js:41 ~ this.$http.get ~ res', res);
          this.products = res.data.products
          // console.log( '🚀 ~ file: index.js:43 ~ this.$http.get ~ this.products', this.products );
        })
        .catch((err) => {
          alert(err.response.data.message)
        })
    },
    getProduct (id) {
      const url = `${VITE_APP_URL}api/${VITE_APP_PATH}/product/${id}`
      this.loadingStatus.loadingItem = id
      this.loadingStatus.loading = true
      this.$http
        .get(url)
        .then((res) => {
          this.loadingStatus.loadingItem = ''
          this.loadingStatus.loading = false
          this.product = res.data.product
          this.$refs.modal.show()
          // this.$refs.detailModal.openModal();
        })
        .catch((err) => {
          this.loadingStatus.loading = false
          alert(err.response.data.message)
        })
    },
    addToCart (id, qty = 1) {
      this.loadingStatus.loadingItem = id
      this.loadingStatus.loading = true
      const cart = {
        product_id: id,
        qty
      }
      const url = `${VITE_APP_URL}api/${VITE_APP_PATH}/cart`
      this.$http
        .post(url, { data: cart })
        .then((res) => {
          console.log('🚀 ~ file: index.js:54 ~ .then ~ res', res);
          this.loadingStatus.loadingItem = ''
          this.loadingStatus.loading = false
          // const { message } = res.data

          // Toast.fire({
          //   title: `${message}`,
          //   icon: 'success'
          // })
          // alert('商品已經加入到購物車！');
          this.getCart()
          this.$refs.modal.hide()
        })
        .catch((err) => {
          this.loadingStatus.loading = false
          alert(err.response.data.message)
        })
    },
    getCart () {
      const url = `${VITE_APP_URL}api/${VITE_APP_PATH}/cart`
      this.loadingStatus.loading = true
      this.$http
        .get(url)
        .then((res) => {
          this.loadingStatus.loadingItem = ''
          this.loadingStatus.loading = false
          this.carts = res.data.data

          // console.log(this.carts.carts.length);
          if (this.carts.carts.length === 0) {
            this.cartStatus = false
          } else {
            this.cartStatus = true
          }
          // console.log(this.cartStatus);
        })
        .catch((err) => {
          this.loadingStatus.loading = false
          alert(err.response.data.message)
        })
    },
    changeQty (product_id, id, qty) {
      this.loadingStatus.loadingItem = id
      const url = `${VITE_APP_URL}api/${VITE_APP_PATH}/cart/${id}`
      const data = {
        product_id,
        qty
      }
      this.$http
        .put(url, { data })
        .then(() => {
          this.getCart()
          alert(`該項商品數量已變更!`);
          this.loadingStatus.loadingItem = ''
        })
        .catch((err) => {
          alert(err.response.data.message)
        })
    },
    removeCartProduct (id, title) {
      this.loadingStatus.loadingItem = id
      const url = `${VITE_APP_URL}api/${VITE_APP_PATH}/cart/${id}`
      this.$http
        .delete(url)
        .then(() => {
          this.loadingStatus.loadingItem = ''
          alert(`${title}該項商品已經移除!`);
          // const { message } = res.data
          // Toast.fire({
          //   title: `${message}`,
          //   icon: 'success'
          // })
          this.getCart()
        })
        .catch((err) => {
          alert(err.response.data.message)
        })
    },
    removeCartAll () {
      // this.loadingStatus.loadingItem = id;
      const url = `${VITE_APP_URL}api/${VITE_APP_PATH}/carts`
      this.loadingStatus.loading = true
      this.$http
        .delete(url)
        .then(() => {
          this.loadingStatus.loadingItem = ''
          this.loadingStatus.loading = false
          this.cartStatus = false
          // const { message } = res.data
          // Toast.fire({
          //   title: `${message}`,
          //   icon: 'success'
          // })
          // alert(`清空購物車!`);
          this.getCart()
        })
        .catch((err) => {
          alert(err.response.data.message)
          this.loadingStatus.loading = false
        })
    },
    onSubmit () {
      // console.log('onSubmit');
      const url = `${VITE_APP_URL}/api/${VITE_APP_PATH}/order`
      this.loadingStatus.loading = true
      const data = this.order
      this.$http
        .post(url, { data })
        .then(() => {
          this.loadingStatus.loading = false
          // console.log('🚀 ~ file: index.js:206 ~ onSubmit.post ~ res', res);
        })
        .catch((err) => {
          alert(err.response.data.message)
          this.loadingStatus.loading = false
        })
    },
    isPhone (value) {
      const phoneNumber = /^(09)[0-9]{8}$/
      return phoneNumber.test(value) ? true : '需要正確的電話號碼'
    }
  },
  components: {
    // productModal,
    // cartComponent,
    // productList
  },
  mounted () {
    this.getProducts()
    this.getCart()
    // console.log( '🚀 ~ file: index.js:112 ~ addToCart ~ this.cartStatus', this.cartStatus );
  }
}
</script>
