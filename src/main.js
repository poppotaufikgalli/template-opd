import "bootstrap/dist/css/bootstrap.min.css"
import 'bootstrap-icons/font/bootstrap-icons.css';
//import "@/assets/css/blog.css"
// custom styles
import '@/assets/css/styles.scss'
//import "@/assets/css/template-opd.css"
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import VueGtag from "vue-gtag";

import { createMetaManager, defaultConfig } from "vue-meta";

import App from './App.vue'
import router from './router'

const pinia = createPinia();

const app = createApp(App).use(pinia).use(router)

app.use(createMetaManager(false, {
	...defaultConfig,
    ...{
        'author': {
            tag: 'meta',
            keyAttribute: 'name',
            valueAttribute: 'content'
        },
    }
}))

app.use(VueGtag, 
	{config: 
		{ id: process.env.VUE_APP_GTAG_ID }
	}, router
)

app.mount('#app')

import "bootstrap/dist/js/bootstrap.js";
