import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

import BeritaView from '../views/BeritaView.vue'
import PengumumanView from '../views/PengumumanView.vue'
import KalenderView from '../views/KalenderView.vue'
import GalleryView from '../views/GalleryView.vue'
import GalleryItemView from '../views/GalleryItemView.vue'
import InfografisView from '../views/InfografisView.vue'
import InfografisDetailView from '../views/InfografisDetailView.vue'
import DownloadAreaView from '../views/DownloadAreaView.vue'
import DownloadView from '../views/DownloadView.vue'
import ArtikelView from '../views/ArtikelView.vue'
import StatistikView from '../views/StatistikView.vue'
import PranalaListView from '../views/PranalaListView.vue'
//import EventView from '../views/Post3View.vue'

import ListView from '../views/ListView.vue'
import PageView from '../views/PageView.vue'
import PostView from '../views/PostView.vue'
import LoadingPostView from '../views/LoadingPostView.vue'
//import PengumumanView from '../views/AboutView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/beranda',
    name: 'beranda',
    component: HomeView,
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
    path: '/kalendar_even/:judul?',
    name: 'kalendar_even',
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
    path: '/infografis/',
    name: 'infografis',
    component: InfografisView,
  },
  {
    path: '/infografis/:judul?',
    name: 'infografis_detail',
    component: InfografisDetailView,
  },
  {
    path: '/gallery_album/:judul?',
    name: 'gallery_album',
    component: GalleryView,
  },
  {
    path: '/gallery_item/:judul?',
    name: 'gallery_item',
    component: GalleryItemView,
  },
  {
    path: '/download_area/:judul?',
    name: 'download_area',
    component: DownloadAreaView,
  },
  {
    path: '/artikel/:judul?',
    name: 'artikel',
    component: ArtikelView,
  },
  {
    path: '/statistik/:judul?',
    name: 'statistik',
    component: StatistikView,
  },
  {
    path: '/download/:judul?',
    name: 'download',
    component: DownloadView,
  },
  {
    path: '/pranala/:judul?',
    name: 'pranala',
    component: PranalaListView,
  },
  {
    path: '/post/:judul',
    name: 'post',
    component: PostView,
  },
  {
    path: '/pages/:catchAll(.*)',
    name: 'pages',
    component: PageView,
  },
  {
    path: '/list/:routes',
    name: 'list',
    component: ListView,
  },
  {
    path: '/loadingPost',
    name: 'loadingPost',
    component: LoadingPostView,
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkExactActiveClass: 'active',
})

export default router
