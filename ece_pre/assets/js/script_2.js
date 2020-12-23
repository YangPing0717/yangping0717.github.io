new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  data: () => ({
    direction: 'top',
    fab: false,
    fling: false,
    hover: false,
    tabs: null,
    top: false,
    right: true,
    bottom: true,
    left: false,
    transition: 'scale-transition' }),


  computed: {
    activeFab() {
      switch (this.tabs) {
        case 'one':return { class: 'purple', icon: 'account_circle' };
        case 'two':return { class: 'red', icon: 'edit' };
        case 'three':return { class: 'green', icon: 'keyboard_arrow_up' };
        default:return {};}

    } },


  watch: {
    top(val) {
      this.bottom = !val;
    },
    right(val) {
      this.left = !val;
    },
    bottom(val) {
      this.top = !val;
    },
    left(val) {
      this.right = !val;
    } } });