import {createApp} from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
//导入全局样式
import "@/assets/scss/global.scss";
//导入element-plus
import installElementPlus from "./plugins/element";
//导入iconfont
import '@/assets/fonts/iconfont.css'
const app = createApp(App);
app.use(store)
  .use(router)
  .mount("#app");

installElementPlus(app);
