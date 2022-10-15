<script setup>
	import { ref, onBeforeMount, onMounted, watch } from 'vue';
	import { useMeta } from 'vue-meta'
	import { useRoute } from 'vue-router';
	import AppHeader from './components/AppHeader';
	import AppFooter from './components/AppFooter';
	import { getOPDInfo, } from './composables/Api';
	import ogImage from "@/assets/img/logo-tpi.png"

	const _ = require("lodash");

	const opdInfo = ref({});
	const unker = ref({});
	const nunker = ref({});
	const menu = ref({});
	const isReady = ref(false);
	const banner = ref({});
	const berita_populer = ref({});
	const pengumuman_khusus = ref({});
	const event_terbit = ref({});

	const router = useRoute();

	onBeforeMount(async() => {
		await getOPDInfo()
		.then(ret => {
			//console.log(ret)
			opdInfo.value = ret.data;
			unker.value = ret.data.unker;
			nunker.value = ret.data.unker.nunker;
			menu.value = ret.data.menu.lsmenu;
			//console.log(menu.value)
			banner.value = ret.data.banner;
			berita_populer.value = ret.data.berita_populer;
			pengumuman_khusus.value = ret.data.pengumuman_khusus;
			event_terbit.value = ret.data.event_terbit;

			//meta awal
			meta.description = `Website Resmi ${nunker.value} Kota Tanjungpinang`;
			meta.author = `${nunker.value} Kota Tanjungpinang`;
			var medsos = JSON.parse(unker.value.medsos);
			
			meta.og.title.content = `${meta.title} ${nunker.value} Kota Tanjungpinang`;
			meta.og.description.content = `${meta.title} ${nunker.value} Kota Tanjungpinang`;
			meta.og.site_name.content = `${nunker.value} Kota Tanjungpinang`;

			meta.twitter.title.content = `${meta.title} ${nunker.value} Kota Tanjungpinang`;
			meta.twitter.creator.content = medsos != null && medsos['twitter'] != undefined ? medsos['twitter'] : '';
			meta.twitter.description.content = `${meta.title} ${nunker.value} Kota Tanjungpinang`;

		});
	})

	onMounted(() => {
		if(opdInfo.value != ""){
			isReady.value = true;  
		}
	})

	const { meta } = useMeta({
		title: '',
		description: ``,
		author : ``,
		og: {
			title: {content: ''},
			description: {content: ''},
			type: {content: 'article'},
			url: {content: window.location.origin},
			image: {content: window.location.origin+ogImage}, 
			
			site_name: {content: ''},
		},
		twitter:{
			card:{ content: "summary"},
			site:{ content: window.location.origin},
			title:{ content: ''},
			description: {content: ''},
			creator:{ content: ""},
			image: {content: window.location.origin+ogImage}, 
		},
	})

	function changeTitle(){
		var metaTitle = ''
		if(router.params.judul){
			metaTitle = router.params.judul
			meta.description = `Website Resmi ${nunker.value} Kota Tanjungpinang`;
			metaTitle = metaTitle.replace(/[^a-zA-Z ]/g, " ")
			metaTitle = _.startCase(_.toLower(metaTitle))

			meta.title = metaTitle !='' ? metaTitle : "Beranda"	
			meta.og.title.content = `${meta.title}`;
			meta.og.description.content = `${meta.title} ${nunker.value} Kota Tanjungpinang`;

			meta.twitter.title.content = `${meta.title}`;
			meta.twitter.description.content = `${meta.title} ${nunker.value} Kota Tanjungpinang`;
			
		}else{
			metaTitle = router.name
			metaTitle = metaTitle.replace(/[^a-zA-Z ]/g, " ")
			metaTitle = _.startCase(_.toLower(metaTitle))

			meta.title = metaTitle !='' ? 'Halaman '+ metaTitle : "Halaman Beranda"	
			meta.description = `${meta.title} ${nunker.value} Kota Tanjungpinang`;
			meta.og.title.content = `${meta.title} ${nunker.value} Kota Tanjungpinang`;
			meta.og.description.content = `${meta.title} ${nunker.value} Kota Tanjungpinang`;

			meta.twitter.title.content = `${meta.title} ${nunker.value} Kota Tanjungpinang`;
			meta.twitter.description.content = `${meta.title} ${nunker.value} Kota Tanjungpinang`;
		}
		
	}

	watch(router, changeTitle)
</script>

<template :v-if="isReady">
	<metainfo>
		<template v-slot:title="{ content }">{{ content }} - {{ nunker }}</template>
	</metainfo>
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
