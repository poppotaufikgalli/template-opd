import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

import BeritaView from '../views/BeritaView.vue'
import PengumumanView from '../views/PengumumanView.vue'
import KalenderView from '../views/KalenderView.vue'
import GalleryView from '../views/GalleryView.vue'
//import EventView from '../views/Post3View.vue'

import ListView from '../views/ListView.vue'
//import PageView from '../views/PageView.vue'
import PostView from '../views/PostView.vue'
import LoadingPostView from '../views/LoadingPostView.vue'
//import PengumumanView from '../views/AboutView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/beranda',
    name: 'beranda',
    component: HomeView
  },
  {
    path: '/berita/:judul?',
    name: 'berita',
    component: BeritaView,
  },
  {
    path: '/pengumuman/:judul?',
    name: 'pengumuman',
    component: PengumumanView,
  },
  {
    path: '/kalendareven/:judul?',
    name: 'kalendareven',
    component: KalenderView,
  },
  {
    path: '/event/:judul?',
    name: 'event',
    component: KalenderView,
  },
  {
    path: '/gallery/:judul?',
    name: 'gallery',
    component: GalleryView,
  },
  {
    path: '/gallery_album/:judul?',
    name: 'gallery_album',
    component: GalleryView,
  },
  {
    path: '/post/:judul',
    name: 'post',
    component: PostView
  },
  {
    path: '/list/:routes',
    name: 'list',
    component: ListView
  },
  {
    path: '/loadingPost',
    name: 'loadingPost',
    component: LoadingPostView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkExactActiveClass: 'active',
})

export default router
