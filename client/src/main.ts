import { createApp } from 'vue'
import 'element-plus/theme-chalk//index.css';
import 'element-plus/theme-chalk/dark/css-vars.css'
import './style.css'
import './package/dark.less'
import router from './router'
import store from "./store";
import ElementPlus from 'element-plus';
import App from './App.vue'

const app=createApp(App)
app.use(router)
app.use(store)
app.use(ElementPlus)
app.mount('#app')
