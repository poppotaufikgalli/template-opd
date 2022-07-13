<script setup>
	import { ref, watch } from 'vue'
	import ItemList from '@/components/partials/ItemList';
	import RightMenu from '@/components/partials/RightMenu';
	import LoadingPostView from '@/views/LoadingPostView';
	import { useRoute } from 'vue-router';
	import { getBerita, getData } from '@/composables/Api';

	const data = ref({});
	const isReady = ref(false);
	const router = useRoute();

	async function fetchData() {
		console.log(router.name)
		if(router.name == 'berita'){
			const response = await getBerita()
			var resval = response.data.berita
			var nval = [];
			for (var i = resval.length - 1; i >= 0; i--) {
				nval[i] = {
					"id" : resval[i].id_post,
					"judul" : resval[i].post_judul,
					"isi" : resval[i].post_isi,
					"gambar" : resval[i].post_gambar,
					"tgl_terbit" : resval[i].tgl_terbit,
					"post_user" : resval[i].post_user,
					"jml_klik" : resval[i].jml_klik,
				} 
			}
			
			data.value = nval;	
		}else{
			const response = await getData(router.name)
			console.log(response)
			//data.value = await response.json()
			//data.value = response.data.berita;
		}
		
		isReady.value = true;
	}

	// fetch immediately
	fetchData()
	// ...then watch for url change
	watch(router, fetchData)
</script>
<template>
	<div class="row g-5">
		<div class="col-md-8">
			<ItemList :data="data" v-if="isReady" />
			<div v-else>
				<LoadingPostView />
				<LoadingPostView />	
			</div>
		</div>
		<div class="col-md-4">
			<RightMenu />
		</div>
	</div>
</template>