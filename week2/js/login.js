import  {createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

// Api 位置
const apiUrl = `https://vue3-course-api.hexschool.io/`;
const apiPath = `ryanpro`;

// 建立 Vue 元件

createApp({
  data() {
    return {
      loginData: {
        username: '',
        password: ''
      },
    };
  },

  methods: {
    login() {
      axios.post(`${apiUrl}V2/admin/signin`, this.loginData)
        .then((res) => {
          console.log(res);
          const { token, expired } = res.data;
          // 儲存 cookie
          // expires 功能是設置有效時間
          document.cookie = `ryanpro=${token}; expires=${new Date(expired)}`;
          // 成功後，跳轉網頁。
          window.location = 'products.html';
        })
        .catch(error => {
          // 讓錯誤訊息得以展開 console.dir
          console.dir(error.data.message);
        })
    },
  },

}).mount('#app');


