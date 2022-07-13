<script>
  import CollapseMenu from '@/components/partials/CollapseMenu'

  export default {
    props: {
      opdInfo : {
          type: Object,
          default: () => {},
      },
      menu : {
          type: Object,
          default: () => {},
      },
    },
    components: {
      CollapseMenu,
    },
    setup(){
      const logo = require('@/assets/img/logo-tpi.png');
      const topImg = require('@/assets/img/top-image.jpeg');
      return{
        logo,
        topImg,
      }
    },
  }
</script>
<template>
  <header id="mainHeader" class="lh-1 py-2 bg-gradient">
    <div class="container">
      <div class="row flex-nowrap justify-content-between align-items-center">
        <div class="col-4 pt-1">
          <a class="navbar-brand" href="#">
            <!--<img v-bind:src="logo" height="30">-->
            <img v-bind:src="logo" height="30">
            <b class="ms-3">{{opdInfo.akronim_opd}}</b>
          </a>
        </div>
        <div class="col-4 d-flex justify-content-end align-items-center">
          <a class="link-secondary" href="#" aria-label="Search">
            <i class="bi bi-search mx-3"></i>
          </a>
          <a href="https://www.facebook.com/KominfoTanjungpinang/" target="_blank" class="link-secondary">
            <i class="bi bi-facebook ps-3"></i>
          </a>
          <a href="https://www.instagram.com/diskominfotanjungpinang/?hl=id" target="_blank" class="link-secondary">
            <i class="bi bi-instagram ps-3"></i>
          </a>
          <a href="https://www.youtube.com/channel/UCIDcbQa_Hyjq-5ZXNDaO2Hg" target="_blank" class="link-secondary">
            <i class="bi bi-youtube ps-3"></i>
          </a>
          <a class="btn btn-sm btn-outline-secondary ms-3" href="#">Login</a>
        </div>
      </div>
    </div>
  </header>
  <div class="d-flex align-items-center" style="max-height: 30vh; overflow: hidden;">
    <img :src="topImg" class="img-fluid">
  </div>
  <div class="sticky-top shadow-sm p-0 mb-4">
    <nav id="mainNavbar" class="navbar navbar-expand-lg">
      <div class="container">
        <button class="navbar-toggler me-3" type="button" data-bs-toggle="collapse" data-bs-target="#menuNavHeader" aria-controls="menuNavHeader" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="menuNavHeader">
          <ul class="navbar-nav mx-auto mb-lg-0">
            <template v-if="menu && menu.length">
              <li v-for="(value, index) in menu" :key="index" :class="value.submenu ? 'nav-item dropdown':'nav-item'">
                <template v-if="value.submenu">
                  <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">
                    {{value.nama_menu}}
                  </a>
                  <ul class="dropdown-menu bg-opd">
                    <CollapseMenu :submenu="value.submenu" :key="index" />
                  </ul>
                </template>
                <template v-else>
                  <template v-if="value.jenis_menu === 'M' && (value.id_post === null || value.id_post === '')">
                    <!--<a href="/#" class="nav-link">{{value.nama_menu}}</a>-->
                    <router-link class="nav-link" :to="{ path: '/'+value.route }">{{value.nama_menu}}</router-link>
                  </template>
                  <template v-else-if="value.jenis_menu === 'M' && (value.id_post != null || value.id_post != '')">
                    <router-link class="nav-link" :to="{ path: '/post/'+value.route, query: { id: value.id_post}}">{{value.nama_menu}}</router-link>   
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
      </div>
    </nav>
  </div>
</template>
