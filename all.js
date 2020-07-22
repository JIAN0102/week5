import zh from "./zh_TW.js";

VeeValidate.configure({
  classes: {
    valid: "is-valid",
    invalid: "is-invalid",
  },
});

VeeValidate.localize("tw", zh);

Vue.component("ValidationProvider", VeeValidate.ValidationProvider);
Vue.component("ValidationObserver", VeeValidate.ValidationObserver);

Vue.use(VueLoading);
Vue.component("loading", VueLoading);

new Vue({
  el: "#app",
  data: {
    isLoading: false,
    status: {
      loadingStatus: "",
    },
    products: [],
    tempProduct: {
      num: 0,
    },
    cart: [],
    cartTotal: 0,
    form: {
      name: "",
      email: "",
      tel: "",
      address: "",
      payment: "",
      message: "",
    },
    uuid: "9581c775-21da-48b3-9520-2da056c30643",
    apiPath: "https://course-ec-api.hexschool.io/api",
  },
  created() {
    this.getProducts();
    this.getCart();
  },
  methods: {
    getProducts(page = 1) {
      this.isLoading = true;
      const api = `${this.apiPath}/${this.uuid}/ec/products?page=${page}`;

      axios
        .get(api)
        .then((res) => {
          this.isLoading = false;
          this.products = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getProductDetail(id) {
      this.status.loadingStatus = id;
      const api = `${this.apiPath}/${this.uuid}/ec/product/${id}`;

      axios.get(api).then((res) => {
        this.tempProduct = res.data.data;
        this.$set(this.tempProduct, "num", 0);
        $("#productModal").modal("show");
        this.status.loadingStatus = "";
      });
    },
    getCart() {
      this.isLoading = true;
      const api = `${this.apiPath}/${this.uuid}/ec/shopping`;

      axios
        .get(api)
        .then((res) => {
          this.isLoading = false;
          this.cartTotal = 0;
          this.cart = res.data.data;

          this.cart.forEach((product) => {
            this.cartTotal += product.product.price * product.quantity;
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    addCart(product, quantity = 1) {
      this.status.loadingStatus = product.id;
      const api = `${this.apiPath}/${this.uuid}/ec/shopping`;

      const cartItem = {
        product: product.id,
        quantity,
      };

      axios
        .post(api, cartItem)
        .then((res) => {
          $("#productModal").modal("hide");
          this.getCart();
          this.status.loadingStatus = "";
        })
        .catch((err) => {
          console.log(err);
          $("#productModal").modal("hide");
          this.status.loadingStatus = "";
        });
    },
    removeCart(product) {
      this.isLoading = true;
      const api = `${this.apiPath}/${this.uuid}/ec/shopping/${product.product.id}`;

      axios
        .delete(api)
        .then((res) => {
          console.log(res);
          this.isLoading = false;
          this.getCart();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    removeAllCart() {
      this.isLoading = true;
      const api = `${this.apiPath}/${this.uuid}/ec/shopping/all/product`;

      axios
        .delete(api)
        .then((res) => {
          console.log(res);
          this.isLoading = false;
          this.getCart();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    changeQuantity(product, quantity) {
      this.isLoading = true;
      product.quantity =
        product.quantity + quantity < 0 ? 0 : product.quantity + quantity;

      const api = `${this.apiPath}/${this.uuid}/ec/shopping`;

      const cartItem = {
        product: product.product.id,
        quantity: product.quantity,
      };

      axios
        .patch(api, cartItem)
        .then((res) => {
          console.log(res);
          this.isLoading = false;
          this.getCart();
        })
        .catch((err) => {
          console.log(err);
          this.isLoading = false;
        });
    },
    submitOrder() {
      this.isLoading = true;
      const api = `${this.apiPath}/${this.uuid}/ec/orders`;

      axios
        .post(api, this.form)
        .then((res) => {
          if (res.data.data.id) {
            this.isLoading = false;
            $("#orderModal").modal("show");
            this.getCart();
          }
        })
        .catch((err) => {
          this.isLoading = false;
          console.log(err.res.data.errors);
        });
    },
  },
});
