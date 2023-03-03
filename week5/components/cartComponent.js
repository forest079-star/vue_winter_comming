export default {
  data() {
    return {};
  },
  props: [
    'cartStatus',
    'loadingStatus',
    'carts',
    'getCart',
    'changeQty',
    'removeCartProduct',
    'removeCartAll',
  ],
  template: /* html */ `
    <div class="text-center" v-if="!cartStatus">
      目前購物車沒有商品哦!趕快馬上選購!
    </div>
    <template v-else>
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
                        @click="removeCartProduct(item.id,item.product.title)"
                        :disabled="item.id ===loadingStatus.loadingItem">
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
                      <option :value="i" v-for="i in 20" :key="i+ '101010'">{{i}}</option>
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
  `,
};