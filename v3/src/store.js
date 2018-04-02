import Vue from 'vue';
import Vuex from 'vuex'
Vue.use(Vuex);


export default new Vue.Store({
  state: {
    node: {
      name: '',
      popularity: '',
      desc: '',
    }
  }
})