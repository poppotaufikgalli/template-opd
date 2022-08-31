import "bootstrap/dist/css/bootstrap.min.css"
import 'bootstrap-icons/font/bootstrap-icons.css';
//import "@/assets/css/blog.css"
// custom styles
import '@/assets/css/styles.scss'
//import "@/assets/css/template-opd.css"
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

const pinia = createPinia()

createApp(App).use(pinia).use(router).mount('#app')

import "bootstrap/dist/js/bootstrap.js"
