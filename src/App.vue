<script setup>
  import { ref, onBeforeMount } from 'vue';
  import AppHeader from './components/AppHeader';
  import AppFooter from './components/AppFooter';
  import { getOPDInfo } from './composables/Api';

  const opdInfo = ref({});
  const menu = ref({});
  const isReady = ref(false);

  onBeforeMount(async() => {
    const response = await getOPDInfo();
    opdInfo.value = response.data.data;
    menu.value = response.data.menu.lsmenu;
    //console.log(response.data)

    isReady.value = true;
    //console.log("BA")
    //menu.value = response.data.menu.lsmenu;

    //console.log(response.data)
    //console.log(menu)
  })

  

</script>

<template :v-if="isReady">
  <AppHeader :opdInfo="opdInfo" :menu="menu" />
  <main class="container">
    <router-view/>
  </main>
  <AppFooter />
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
