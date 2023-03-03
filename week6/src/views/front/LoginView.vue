<template>
  <div class="loginGroup">
    <div class="container">
      <div class="row justify-content-center">
        <h1 class="h3 mb-3 font-weight-normal text-center">
          請先登入
        </h1>
        <div class="col-8">
          <form id="form" class="form-signin" @submit.prevent="login">
            <div class="form-floating mb-3">
              <input type="email" v-model="loginData.username" class="form-control" id="username"
                     placeholder="name@example.com" required autofocus>
              <label for="username">Email address</label>
            </div>
            <div class="form-floating">
              <input type="password" v-model="loginData.password" class="form-control" id="password" placeholder="Password"
                     required>
              <label for="password">Password</label>
            </div>
            <button class="btn btn-lg btn-primary w-100 mt-3" type="submit">
              登入
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const { VITE_APP_URL } = import.meta.env
export default {
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
      this.$http.post(`${VITE_APP_URL}admin/signin`, this.loginData)
        .then((res) => {
          console.log(res);
          const { token, expired } = res.data;
          // 儲存 cookie
          // expires 功能是設置有效時間
          document.cookie = `ryanpro=${token}; expires=${new Date(expired)}`;
          // 成功後，跳轉網頁。
          // window.location = 'products.html';
          this.$router.push('/admin/products')
        })
        .catch(error => {
          // 讓錯誤訊息得以展開 console.dir
          console.dir(error.message);
        })
    },
  },

}
</script>

<style>
html, body{
  height: 100%;
}
.loginGroup{
  display: flex;
  justify-content: center;
  align-items: center;
}


.form-signin {
  width: 100%;
  max-width: 330px;
  padding: 15px;
  margin: auto;
}
</style>