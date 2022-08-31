<script setup>
  import { ref, onBeforeMount, onMounted } from 'vue';
  import AppHeader from './components/AppHeader';
  import AppFooter from './components/AppFooter';
  import { getOPDInfo, } from './composables/Api';

  const opdInfo = ref({});
  const unker = ref({});
  const nunker = ref({});
  const menu = ref({});
  const isReady = ref(false);
  const banner = ref({});
  const berita_populer = ref({});
  const pengumuman_khusus = ref({});
  const event_terbit = ref({});

  onBeforeMount(async() => {
    await getOPDInfo()
      .then(ret => {
        //console.log(ret)
        opdInfo.value = ret.data;
        unker.value = ret.data.unker;
        nunker.value = ret.data.unker.nunker;
        menu.value = ret.data.menu.lsmenu;
        banner.value = ret.data.banner;
        berita_populer.value = ret.data.berita_populer;
        pengumuman_khusus.value = ret.data.pengumuman_khusus;
        event_terbit.value = ret.data.event_terbit;
      });
  })

  onMounted(() => {
    if(opdInfo.value != ""){
      isReady.value = true;  
      document.title = "Selamat Datang di Website " +nunker.value
    }
  })
</script>

<template :v-if="isReady">
  <AppHeader :unker="unker" :menu="menu" :banner="banner" />
  <main class="container">
    <router-view v-slot="{ Component, route }">
      <transition name="route" mode="out-in">
        <div :key="route.name">  
          <component :is="Component"></component>
        </div>
      </transition>
    </router-view>
  </main>
  <AppFooter :unker="unker" :berita_populer="berita_populer" :pengumuman_khusus="pengumuman_khusus" :event_terbit="event_terbit"/>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.route-enter-from {
  opacity: 0;
  transform: translateY(100px);
}

.route-enter-active{
  transition: all 0.3s ease-out;
}

.route-leave-to {
  opacity: 0;
  transform: translateX(-100px);
}

.route-leave-active {
  transition: all 0.3s ease-in;
}
</style>
