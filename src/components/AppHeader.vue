<script>
  import CollapseMenu from '@/components/partials/CollapseMenu'
  import { getEnv } from '@/composables/myfunc';
  import { useTheme } from '@/composables/useTheme';

  export default {
    props: {
      opdInfo : {
          type: Object,
          default: () => {},
      },
      unker : {
          type: Object,
          default: () => {},
      },
      menu : {
          type: Object,
          default: () => {},
      },
      banner : {
          type: Object,
          default: () => {},
      },
    },
    components: {
      CollapseMenu,
    },
    methods: {
      trimRoute(namedRoute) {
        return namedRoute.replace(/\s+/g,'_').toLowerCase()
      },
      getMedsos(is){
        if(this.unker.medsos != "" && this.unker.medsos != undefined){
          var medsos = JSON.parse(this.unker.medsos);
          return medsos[is];
        }

        return null
      }
    },
    setup(){
      const logo = require('@/assets/img/logo-tpi.png');
      const { theme, toggleTheme } = useTheme();
      const env = getEnv();
      return{
        logo,
        env,
        theme,
        toggleTheme,
      }
    },
  }
</script>
<template>
  <header id="mainHeader" class="lh-1 py-2 bg-gradient">
    <div class="container">
      <div class="row flex-nowrap justify-content-between align-items-center">
        <div class="col-12 col-sm-8 pt-1">
          <a class="navbar-brand" href="/#">
            <div class="d-flex align-items-center">
              <div class="flex-shrink-0">
                <img v-bind:src="logo" height="30">
              </div>
              <div class="flex-grow-1 ms-3">
                <b class="text-wrap text-uppercase">{{unker.nunker}}</b>
              </div>
            </div>
          </a>
        </div>
        <div class="col-12 col-sm-4 d-flex justify-content-end align-items-center">
          <a v-if="getMedsos('facebook')" :href="getMedsos('facebook')" target="_blank" class="link-secondary">
            <i class="bi bi-facebook ps-3"></i>
          </a>
          <a v-if="getMedsos('instagram')" :href="getMedsos('instagram')" target="_blank" class="link-secondary">
            <i class="bi bi-instagram ps-3"></i>
          </a>
          <a v-if="getMedsos('youtube')" :href="getMedsos('youtube')" target="_blank" class="link-secondary">
            <i class="bi bi-youtube ps-3"></i>
          </a>
          <a class="btn btn-sm btn-outline-secondary ms-3" :href="env.apiUrl" target="_blank">Login</a>
        </div>
      </div>
    </div>
  </header>
  <div class="d-flex justify-content-center align-items-center" style="background-color: var(--app-navbar-bgcolor);">
    <div class="container">
      <div id="carouselMainCarousel" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-indicators">
          <template v-if="banner">
            <button v-for="(item, key) in banner" :key="key" type="button" data-bs-target="#carouselMainCarousel" :data-bs-slide-to="key" class="active" aria-current="true" :aria-label="item"></button>
          </template>
        </div>
        <div class="carousel-inner rounded">
          <template v-if="banner">
            <div v-for="(item, key) in banner" :key="key" class="carousel-item" :class="{active : key == 0}">
              <img :src="env.imgUrl+'banner/'+env.kunker+'/'+ item" :alt="item" class="d-block w-100">
            </div>  
          </template>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#carouselMainCarousel" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselMainCarousel" data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  </div>
  <div class="sticky-top shadow-sm p-0 mb-4">
    <nav id="mainNavbar" class="navbar navbar-expand-lg">
      <div class="container position-relative">
        <button class="navbar-toggler me-3" type="button" data-bs-toggle="collapse" data-bs-target="#menuNavHeader" aria-controls="menuNavHeader" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="menuNavHeader">
          <ul class="navbar-nav mx-auto mb-lg-0">
            <template v-if="menu && menu.length">
              <li v-for="(value, index) in menu" :key="index" :class="value.submenu ? 'nav-item dropdown':'nav-item'">
                <template v-if="value.submenu">
                  <a class="nav-link dropdown-toggle" href="/#" data-bs-toggle="dropdown">
                    {{value.nama_menu}}
                  </a>
                  <ul class="dropdown-menu bg-opd">
                    <CollapseMenu :submenu="value.submenu" :key="index" />
                  </ul>
                </template>
                <template v-else>
                  <template v-if="value.jenis_menu === 'M' && (value.id_post === null || value.id_post === '')">
                    <router-link class="nav-link" :to="{ path: '/'+trimRoute(value.nama_menu) }">{{value.nama_menu}}</router-link>
                  </template>
                  <template v-else-if="value.jenis_menu === 'M' && (value.id_post != null || value.id_post != '')">
                    <router-link class="nav-link" :to="{ path: '/pages/'+value.route, query: { id_post: value.id_post, nama_menu: value.nama_menu }}">{{value.nama_menu}}</router-link>   
                  </template>
                  <template v-else>
                    <!--<router-link :to="value.hyperlink" class="nav-link">{{value.nama_menu}}</router-link>-->
                    <a class="nav-link" :href="value.route" target="_blank">{{value.nama_menu}}</a>
                  </template>
                </template>
              </li>
            </template>
          </ul>
        </div>
        <div class="position-absolute end-0 top-0 p-2">
          <button @click="toggleTheme"
            class="btn btn-circle-sm d-flex align-items-center" 
            :class="theme === 'light' ? 'btn-outline-secondary' : 'btn-warning'"
          >
            <template v-if="theme === 'light'" >
              <i class="bi bi-moon-fill"></i>  
            </template>
            <template v-else>
              <i class="bi bi-brightness-high"></i>   
            </template>
          </button>
        </div>
      </div>
    </nav>
  </div>
</template>
