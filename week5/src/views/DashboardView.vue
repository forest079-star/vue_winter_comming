<template>
  這是『後台』頁面
  <router-link to="/admin/products">後台產品列表</router-link> |
  <router-link to="/admin/orders">後台訂單列表</router-link> |
  <router-link to="/">返回前台首頁</router-link> |
  <a href="#" @click.prevent="logout">登出</a>
  <hr>
  <RouterView></RouterView>
</template>

<script>
import { RouterView } from 'vue-router'
const { VITE_APP_URL } = import.meta.env
export default {
  components: {
    RouterView
  },
  methods: {
    logout() {
      document.cookie = `ryanpro=; expires=;`;
      this.$router.push('/login')
    },
    checkLogin() {
      const url = `${VITE_APP_URL}api/user/check`;
      console.log(url);
      this.$http.post(url)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          alert(err);
          this.$router.push('/login');
        });
    },
  },
  mounted() {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)ryanpro\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    this.$http.defaults.headers.common.Authorization = token;

    this.checkLogin();
  },
}
</script>