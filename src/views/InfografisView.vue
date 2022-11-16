<script setup>
	import { ref, watch, onUpdated } from 'vue'
	import { useRoute } from 'vue-router';
	import { useActiveMeta } from 'vue-meta'
	import { getData, setMeta } from '@/composables/Api';
	import { getEnv, makeJudul, cleanTextP } from '@/composables/myfunc';
	//import ImgListGalleryAlbum from '@/components/partials/ImgListGalleryAlbum';
	//import OnProgresPage from '@/components/partials/OnProgresPage';
	import ogImage from "@/assets/img/logo-tpi.png"

	const _ = require("lodash");
	//const moment = require("moment");

	const data = ref({});
	const isReady = ref(false);
	const router = useRoute();
	const page = ref('');
	const env = getEnv();
	const currPage = ref(0);
	const maxPage = ref(1);

	const error = ref(null);

	const activeMeta = useActiveMeta()

	onUpdated(() => {
		if(data.value){
			var curr = _.find(data.value, function(e, i) {
				return i === currPage.value;
			});
			
			if(curr && page.value == 'infografis'){
				//console.log("update Meta galleri")
				var metaGbr = window.location.origin+ogImage;
				if(curr.guid_gambar){
					metaGbr = env.imgUrl+'posting/infografis/'+env.kunker+'/small/small_'+ curr.guid_gambar;
				}

				setMeta(activeMeta, curr.judul, curr.deskripsi, curr.penulis, metaGbr)
			}
		}
	})

	async function fetchData() {
		isReady.value = false;
		var routename = router.params.page ? router.params.page : 'infografis';
		page.value = routename
		try{
			let response = await getData("infografis_album");  
			data.value = response.data.infografis_album
			console.log(data.value)
		} catch(err){
			error.value = err.toString()
		}

		if(router.query.id){
			var id = router.query.id;
			setCurrPage(id)
		}
		
		isReady.value = true;
	}

	function setCurrPage(id){
		currPage.value = _.findKey(data.value, ['id', id]);
		maxPage.value = parseInt(currPage.value) +1
	}

	// fetch immediately
	fetchData()
	// ...then watch for url change
	watch(router, fetchData)	
</script>
<template>
	<div class="row g-5">
		<div class="col-md-12">
			<div v-if="error" class="alert alert-danger d-flex align-items-center" role="alert">
				<i class="bi bi-exclamation-triangle-fill"></i><div>&nbsp;Error : {{ error }}</div>
			</div>
			<template v-if="isReady">
				<template v-if="data">
					<h3 class="blog-post-title text-capitalize">Album Infografis</h3>
					<div class="row row-cols-1 row-cols-md-4 g-4">
						<template v-for="item in data" :key="item.id">
							<template v-if="item.guid_gambar">
								<div class="col">
									<div class="card">
										<img 
											:src="env.imgUrl+'posting/infografis/'+env.kunker+'/small/small_'+ item.guid_gambar" 
											class="card-img-top">
										<div class="card-body">
											<h5 class="card-title">{{item.judul}}</h5>
											<div v-html="cleanTextP(item.deskripsi)" class="small"></div>
											<router-link :to="{path : '/infografis/'+makeJudul(item.judul), query : {id: item.id} }" class="small stretched-link">[{{item.jum_gambar}} Gambar]</router-link>
										</div>
										<div class="card-footer" v-if="item.hari">
											<small class="text-muted">{{item.hari}}</small>
										</div>
									</div>
								</div>	
							</template>
						</template>
					</div>
				</template>
			</template>
		</div>
	</div>
</template>