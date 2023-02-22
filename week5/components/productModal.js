export default {
  props: ['product', 'addToCart', 'getProducts'],
  data() {
    return {
      modal: {},
      tempProduct: {},
      qty: 1,
    };
  },
  template: /*html*/ `    
    <div class="modal fade" id="productModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
        aria-hidden="true" ref="modal">
      <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>{{ product.title }}</span>
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-sm-6">
                <img class="img-fluid" :src="product.imageUrl"  alt="">
              </div>
              <div class="col-sm-6">
                <span class="badge bg-primary rounded-pill">{{ product.category }}</span>
                <p>商品描述：{{ product.description }}</p>
                <p>商品內容：{{ product.content }}</p>
                <div v-if="product.price === product.origin_price" class="h5">{{ product.price }} 元</div>
                <template v-else>
                  <del class="h6">原價 {{ product.origin_price }} 元</del>
                  <div class="h5">現在只要 {{ product.price }} 元</div>
                </template >
                <div>
                  <div class="input-group">
                    <select name="" id=""  class="form-select" v-model="qty">
                      <option :value="i" v-for="i in 20" :key="i+'1212'">{{i}}</option>
                    </select>
                    <button type="button" class="btn btn-primary" @click="$emit('add-to-cart', product.id, qty)">加入購物車</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  methods: {
    show() {
      this.modal.show();
    },
    hide() {
      this.modal.hide();
    },
  },
  mounted() {
    this.modal = new bootstrap.Modal(this.$refs.modal);
    console.log('🚀 ~ file: index.js:38 ~ mounted ~ this.modal', this.modal);
  },
};