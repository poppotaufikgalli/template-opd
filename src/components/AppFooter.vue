<script>
  import FButton from './partials/FloatingButton';
  import { getEnv, makeJudul } from '@/composables/myfunc';

  export default {
    props: {
      unker : {
          type: Object,
          default: () => {},
      },
      berita_populer : {
          type: Object,
          default: () => {},
      },
      pengumuman_khusus : {
          type: Object,
          default: () => {},
      },
      event_terbit : {
          type: Object,
          default: () => {},
      },
    },
    components: {
      FButton,
    },
    methods: {
      trimRoute(namedRoute) {
        return namedRoute.replace(/\s+/g,'_').toLowerCase()
      },
      makeJudul(str){
        return makeJudul(str);
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
      const logoTik = require('@/assets/img/logo-tik.png');
      const env = getEnv();
      return{
        logo,
        env,
        logoTik,
      }
    },
  }
</script>
<template>
  <footer class="blog-footer mt-4" style="min-height: 20vh;">
    <div class="container">
      <div class="row g-4">
        <div class="col-md-5">
          <div class="row g-3">
            <div class="col-3 col-sm-4">
              <img v-bind:src="logo" class="img-fluid">
            </div>
            <div class="col-9 col-sm-8">
              <div class="d-flex flex-column small">
                <div class="list-template-opd px-1 mb-1 pb-1">
                  <div class="list-header">
                    <h3 class="list-title">
                      <span>Hubungi Kami</span>
                    </h3>
                  </div>
                  <div class="list-body">
                    <div class="d-flex justify-content-start border-bottom my-2 gap-2">
                      <p class="border-bottom fw-bold">{{unker.nunker}}</p>
                    </div>
                    <div class="d-flex justify-content-start border-bottom my-2 gap-2">
                      <i class="bi bi-map"></i> {{unker.alamat}}
                    </div>
                    <div class="d-flex justify-content-start border-bottom my-2 gap-2">
                      <i class="bi bi-envelope"></i> <span class="truncate-text">{{unker.email}}</span>
                    </div>
                    <div class="d-flex justify-content-start border-bottom my-2 gap-2">
                      <i class="bi bi-telephone"></i> {{unker.telp}}
                    </div>
                  </div>
                  <div class="list-footer d-flex justify-content-evenly gap-4">
                    <a v-if="getMedsos('facebook')" :href="getMedsos('facebook')" target="_blank" class="text-link d-flex flex-column align-items-center">
                      <i class="bi bi-facebook"></i> <span class="d-none d-sm-block">facebook</span>
                    </a>
                    <a v-if="getMedsos('instagram')" :href="getMedsos('instagram')" target="_blank" class="text-link d-flex flex-column align-items-center">
                      <i class="bi bi-instagram"></i> <span class="d-none d-sm-block">Instagram</span>
                    </a>
                    <a v-if="getMedsos('youtube')" :href="getMedsos('youtube')" target="_blank" class="text-link d-flex flex-column align-items-center">
                      <i class="bi bi-youtube"></i> <span class="d-none d-sm-block">Youtube</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="offset-md-3 col-sm-12 col-md-4">
          <div class="d-flex flex-column">
            <template v-if="berita_populer.length > 0">
              <div class="list-template-opd surface">
                <div class="list-header">
                  <h3 class="list-title">
                    <span>Berita Populer</span>
                  </h3>
                </div>
                <template v-for="(item) in berita_populer.slice(0,3)" :key="item.id">
                  <router-link 
                    :to="{path : '/berita/'+makeJudul(item.judul_post), query : {id: item.id} }" 
                    class="d-flex justify-content-between align-items-center border-bottom py-1"
                  >
                    <span class="truncate-text lh-1">{{item.judul_post}}</span>
                    <span class="badge info-post bg-transparent"><i class="bi bi-calendar-fill"></i>&nbsp;{{item.tanggal_terbit}}</span>
                  </router-link>
                </template>
              </div>  
            </template>
            <template v-if="pengumuman_khusus.length > 0">
              <div class="list-template-opd surface">
                <div class="list-header">
                  <h3 class="list-title">
                    <span>Pengumuman Khusus</span>
                  </h3>
                </div>
                <template v-for="(item) in pengumuman_khusus.slice(0,3)" :key="item.id">
                  <router-link 
                    :to="{path : '/berita/'+makeJudul(item.judul_pengumuman), query : {id: item.id} }" 
                    class="d-flex justify-content-between align-items-center border-bottom py-1"
                  >
                    <span class="truncate-text lh-1">{{item.judul_pengumuman}}</span>
                    <span class="badge info-post bg-transparent"><i class="bi bi-calendar-fill"></i>&nbsp;{{item.tanggal_terbit}}</span>
                  </router-link>
                </template>
              </div>  
            </template>
            <template v-if="event_terbit.length > 0">
              <div class="list-template-opd surface">
                <div class="list-header">
                  <h3 class="list-title">
                    <span>Kalender Event</span>
                  </h3>
                </div>
                <template v-for="(item) in event_terbit.slice(0,3)" :key="item.id">
                  <router-link 
                    :to="{path : '/berita/'+makeJudul(item.judul_kalender_event), query : {id: item.id} }" 
                    class="d-flex justify-content-between align-items-center border-bottom py-1"
                  >
                    <span class="truncate-text lh-1">{{item.judul_kalender_event}}</span>
                    <span class="badge info-post bg-transparent"><i class="bi bi-calendar-fill"></i>&nbsp;{{item.tanggal_event_mulai}}</span>
                  </router-link>
                </template>
              </div>
            </template>
          </div>
        </div> 
        <div class="col-md-12 text-center">
          <hr class="my-2">
          <p class="small">Design by <img v-bind:src="logoTik" height="25"> <a href="https://kominfo.tanjungpinangkota.go.id">Diskominfo Tanjungpinang</a>@2022</p>
        </div>
      </div>
      <FButton />
    </div>
  </footer>
</template>




     