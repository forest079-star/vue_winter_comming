// 引入 vue
import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
import { apiUrl, apiPath } from '../../js/config.js';
import pagination from './pagination.js';
import delProductModal from './delProductModal.js';

// const apiUrl = 'https://vue3-course-api.hexschool.io/v2/';
// const apiPath = 'ryanpro';

let productModal = {};


const app = createApp({
  data() {
    return {
      products: [],
      targetProduct: {
        imagesUrl: [],
      },
      isNew: false,
      pageTotal: {},
      delProductModals: {},
    };
  },
  methods: {
    getProducts(page = 1) {
      const url = `${apiUrl}api/${apiPath}/admin/products/?page=${page}`;
      axios
        .get(url)
        .then((response) => {
          console.log(response);
          this.products = response.data.products;
          this.pageTotal = response.data.pagination;
          console.log(response.data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    openModal(state, product) {
      console.log(state);
      if (state === 'create') {
        productModal.show();
        this.isNew = true;

        // 帶入初始化資料
        this.targetProduct = {
          imagesUrl: [],
        };
      } else if (state === 'edit') {
        productModal.show();
        this.isNew = false;
        // 如果是編輯狀態會帶入編輯資料
        this.targetProduct = { ...product };
      } else if (state === 'delete') {
        this.delProductModals.show();
        this.isNew = false;
        // 如果是刪除狀態會帶入刪除資料
        this.targetProduct = { ...product }; // 取得ID
      }
    },
    updateProduct() {
      // console.log(`${apiUrl}api/${apiPath}/admin/product`);
      let url = `${apiUrl}api/${apiPath}/admin/product`;
      // 利用 isNew 判斷 API 如何運行
      let method = 'post';
      if (!this.isNew) {
        url = `${apiUrl}api/${apiPath}/admin/product/${this.targetProduct.id}`;
        method = 'put';
      }
      axios[method](url, { data: this.targetProduct })
        .then((res) => {
          this.getProducts();
          productModal.hide(); // 關掉 modal
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    deleteProduct() {
      const url = `${apiUrl}api/${apiPath}/admin/product/${this.targetProduct.id}`;
      axios
        .delete(url)
        .then(() => {
          this.getProducts();
          this.delProductModals.hide(); // 關掉 modal
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    createNewImage(){
      this.targetProduct.imagesUrl = [];
      this.targetProduct.imagesUrl.push('');
    },
  },
  components: {
    pagination,
    delProductModal,
  },
  mounted() {
    // 取出 token
    const tokenValue = document.cookie
      .split('; ')
      .find((row) => row.startsWith('ryanpro='))
      ?.split('=')[1];
    axios.defaults.headers.common['Authorization'] = tokenValue;
    this.getProducts();

    // console.log(bootstrap);
    // 初始化 Bootstrap Modal
    productModal = new bootstrap.Modal('#productModal');

    this.delProductModals = new bootstrap.Modal('#delProductModal');
    // 呼叫 Modal
    // productModal.show();
  },
});

// modal component 全域寫法
app.component('product-modal', {
  props: ['targetProduct', 'updateProduct', 'isNew', 'createNewImage'],
  template: '#product-modal-template',
});

app.mount('#app');
