import {createStore} from "vuex";
import mutations from "@/store/mutations";
import actions from "@/store/actions";

const state = {};
export default createStore({
  state,
  mutations,
  actions
});
