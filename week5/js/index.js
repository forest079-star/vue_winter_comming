import { apiUrl, apiPath } from '../../js/config.js';
import { Toast } from '../../js/tootls.js';
import productModal from '../components/productModal.js';
import cartComponent from '../components/cartComponent.js';
import productList from '../components/productList.js';

// 載入所有規則
Object.keys(VeeValidateRules).forEach((rule) => {
  if (rule !== 'default') {
    VeeValidate.defineRule(rule, VeeValidateRules[rule]);
  }
});
// 讀取外部的資源
VeeValidateI18n.loadLocaleFromURL('./js/zh_TW.json');

// Activate the locale
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize('zh_TW'),
  validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
});

// VeeValidate.defineRule('email', VeeValidateRules['email']);
// VeeValidate.defineRule('required', VeeValidateRules['required']);

const { createApp } = Vue;

// const productModal = {
  
// }

const app = createApp({
  data() {
    return {
      products: [],
      product: {},
      carts: [],
      cartStatus: false,
      isLoading: false,
      fullPage: true,
      loadingStatus: {
        loading: false,
        loadingItem: '',
      },
      order: {
        user: {
          email: '',
          name: '',
          tel: '',
          address: '',
        },
        message: '',
      },
    };
  },
  methods: {
    getProducts() {
      const url = `${apiUrl}api/${apiPath}/products/all`;
      axios
        .get(url)
        .then((res) => {
          // console.log('🚀 ~ file: index.js:41 ~ axios.get ~ res', res);
          this.products = res.data.products;
          // console.log( '🚀 ~ file: index.js:43 ~ axios.get ~ this.products', this.products );
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    getProduct(id) {
      const url = `${apiUrl}api/${apiPath}/product/${id}`;
      this.loadingStatus.loadingItem = id;
      this.loadingStatus.loading = true;
      axios
        .get(url)
        .then((res) => {
          this.loadingStatus.loadingItem = '';
          this.loadingStatus.loading = false;
          this.product = res.data.product;
          this.$refs.modal.show();
          // this.$refs.detailModal.openModal();
        })
        .catch((err) => {
          this.loadingStatus.loading = false;
          alert(err.response.data.message);
        });
    },
    addToCart(id, qty = 1) {
      this.loadingStatus.loadingItem = id;
      this.loadingStatus.loading = true;
      const cart = {
        product_id: id,
        qty,
      };
      const url = `${apiUrl}api/${apiPath}/cart`;
      axios
      .post(url, { data: cart })
      .then((res) => {
          // console.log('🚀 ~ file: index.js:54 ~ .then ~ res', res);
          this.loadingStatus.loadingItem = '';
          this.loadingStatus.loading = false;
          const { message } = res.data;
          
          Toast.fire({
            title: `${message}`,
            icon: 'success',
          });
          // alert('商品已經加入到購物車！');
          this.getCart();
          this.$refs.modal.hide();
        })
        .catch((err) => {
          this.loadingStatus.loading = false;
          alert(err.response.data.message);
        });
    },
    getCart() {
      const url = `${apiUrl}api/${apiPath}/cart`;
      this.loadingStatus.loading = true;
      axios
        .get(url)
        .then((res) => {
          this.loadingStatus.loadingItem = '';
          this.loadingStatus.loading = false;
          this.carts = res.data.data;

          // console.log(this.carts.carts.length);
          if (this.carts.carts.length === 0) {
            this.cartStatus = false;
          } else {
            this.cartStatus = true;
          }
          // console.log(this.cartStatus);
        })
        .catch((err) => {
          this.loadingStatus.loading = false;
          alert(err.response.data.message);
        });
    },
    changeQty(product_id, id, qty) {
      this.loadingStatus.loadingItem = id;
      const url = `${apiUrl}api/${apiPath}/cart/${id}`;
      const data = {
        product_id,
        qty,
      };
      axios
      .put(url, { data })
      .then((res) => {
          this.getCart();     
          const { message } = res.data;
          Toast.fire({
            title: `${message}`,
            icon: 'success',
          });
          // alert(`該項商品數量已變更!`);
          this.loadingStatus.loadingItem = '';
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    removeCartProduct(id, title) {
      this.loadingStatus.loadingItem = id;
      const url = `${apiUrl}api/${apiPath}/cart/${id}`;
      axios
      .delete(url)
      .then((res) => {
        this.loadingStatus.loadingItem = '';
        // alert(`${title}該項商品已經移除!`);
          const { message } = res.data;
          Toast.fire({
            title: `${message}`,
            icon: 'success',
          });
          this.getCart();
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    removeCartAll() {
      // this.loadingStatus.loadingItem = id;
      const url = `${apiUrl}api/${apiPath}/carts`;
      this.loadingStatus.loading = true;
      axios
        .delete(url)
        .then((res) => {
          this.loadingStatus.loadingItem = '';
          this.loadingStatus.loading = false;
          this.cartStatus = false; 
          const { message } = res.data;
          Toast.fire({
            title: `${message}`,
            icon: 'success',
          });
          // alert(`清空購物車!`);
          this.getCart();
        })
        .catch((err) => {
          alert(err.response.data.message);
          this.loadingStatus.loading = false;
        });
    },
    onSubmit() {
      // console.log('onSubmit');
      const url = `${apiUrl}/api/${apiPath}/order`;
      this.loadingStatus.loading = true;
      const data = this.order;
      axios
        .post(url, { data })
        .then((res) => {
          this.loadingStatus.loading = false;
          // console.log('🚀 ~ file: index.js:206 ~ onSubmit.post ~ res', res);
        })
        .catch((err) => {
          alert(err.response.data.message);
          this.loadingStatus.loading = false;
        });
    },
    isPhone(value) {
      const phoneNumber = /^(09)[0-9]{8}$/;
      return phoneNumber.test(value) ? true : '需要正確的電話號碼';
    },
  },
  components: {
    productModal,
    cartComponent,
    productList,
  },
  mounted() {
    this.getProducts();
    this.getCart();
    // console.log( '🚀 ~ file: index.js:112 ~ addToCart ~ this.cartStatus', this.cartStatus );
  },
});

app.component('loading', VueLoading.Component);

app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);


app.use(VueLoading.LoadingPlugin);
app.mount("#app");

