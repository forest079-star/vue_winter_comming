// 引入 vue
import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

const apiUrl = 'https://vue3-course-api.hexschool.io/v2/';
const apiPath = 'ryanpro';
// /v2/api/{api_path/admin/products
let productModal = null;
let delProductModal = null;

createApp({
  data() {
    return {
      products: [],
      targetProduct: {
        imagesUrl: [],
      },
      isNew: false,
    };
  },
  methods: {
    checkAdmin() {
      const url = `${apiUrl}api/user/check`;
      axios
        .post(url)
        .then(() => {
          this.getProducts();
        })
        .catch((err) => {
          alert(err.data.message);
          window.location = 'login.html';
        });
    },
    getProducts() {
      const url = `${apiUrl}api/${apiPath}/admin/products/all`;
      axios
        .get(url)
        .then((response) => {
          // console.log(response);
          this.products = response.data.products;
          // console.log(this.products);
        })
        .catch((err) => {
          alert(err.data.message);
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
        delProductModal.show();
        this.isNew = false;
        // 如果是刪除狀態會帶入刪除資料
        this.targetProduct = { ...product }; // 取得ID
      }
      console.log('imageLength', this.targetProduct.imagesUrl.length);
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
          delProductModal.hide(); // 關掉 modal
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    createNewImages(){
      this.targetProduct.imagesUrl = [];
      this.targetProduct.imagesUrl.push('');
    }
  },
  mounted() {
    // 取出 token
    const tokenValue = document.cookie
      .split('; ')
      .find((row) => row.startsWith('ryanpro='))
      ?.split('=')[1];
    axios.defaults.headers.common['Authorization'] = tokenValue;
    this.checkAdmin();

    // console.log(bootstrap);
    // 初始化 Bootstrap Modal
    productModal = new bootstrap.Modal('#productModal');
    delProductModal = new bootstrap.Modal('#delProductModal');
    // 呼叫 Modal
    // productModal.show();
  },
}).mount('#app');
