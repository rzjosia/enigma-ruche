import Vue from "vue";
import Vuex from "vuex";
import * as alertPopping from "./modules/alert-popping";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: { alertPopping },
});
