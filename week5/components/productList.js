export default {
  props: ['products', 'getProduct', 'addToCart', 'loadingStatus'],
  template: `
    <table class="table align-middle">
    <thead>
      <tr>
        <th>圖片</th>
        <th>商品名稱</th>
        <th>價格</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="product in products" :key="product.id">
        <td style="width: 200px">
          <div style="height: 100px; background-size: cover; background-position: center;"
                :style="{backgroundImage:  'url(' + product.imageUrl  + ')'  }"></div>
        </td>
        <td>
          {{ product.title}}
        </td>
        <td>
          <div v-if="product.price === product.origin_price" class="h5">{{ product.price }} 元</div>
          <div v-else>
            <del class="h6">原價 {{ product.origin_price }} 元</del>
            <div class="h5">現在只要 {{ product.price }} 元</div>
          </div>
        </td>
        <td>
          <div class="btn-group btn-group-sm">
            <button type="button" class="btn btn-outline-secondary" @click="getProduct(product.id)">
              <i class="fas fa-spinner fa-pulse"
                  v-if="loadingStatus.loading && loadingStatus.loadingItem === product.id"></i>
              查看更多
            </button>
            <button type="button" class="btn btn-outline-danger" @click="addToCart(product.id)">
              <i class="fas fa-spinner fa-pulse"
                  v-if="loadingStatus.loading && loadingStatus.loadingItem === product.id"></i>
              加到購物車
            </button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
  `,
};