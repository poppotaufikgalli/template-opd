<script setup>
	import { ref, watch } from 'vue'
	import { useRoute } from 'vue-router';
	import { getData } from '@/composables/Api';
	import { getEnv, cleanTextP } from '@/composables/myfunc';
	//import OnProgresPage from '@/components/partials/OnProgresPage';

	//const _ = require("lodash");
	//const moment = require("moment");

	const data = ref({});
	const isReady = ref(false);
	const router = useRoute();

	const judul = ref('');
	const env = getEnv();
	const error = ref(null)

	async function fetchData() {
		isReady.value = false;
		judul.value = router.params.judul
		try{
			let response = await getData("infografis_album", "id_infografis_album", router.query.id);  
			data.value = response.data.infografis_album
			console.log(data.value)
		} catch(err){
			error.value = err.toString()
		}
	
		isReady.value = true;
	}

	function downloadFile(filename) {
		window.open(env.apiUrl+'api/getDownloadInfografis/'+env.kunker+'/'+filename)
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
				<template v-if="data.length > 0">
					<h3 class="blog-post-title text-capitalize">{{ judul }}</h3>

					<div class="row row-cols-1 row-cols-md-2 g-4">
						<template v-for="item in data" :key="item.id">
							<template v-if="item.guid">
								<div class="col">
									<div class="card">
										<img 
											:src="env.imgUrl+'posting/infografis/'+env.kunker+'/small/small_'+ item.guid" 
											class="card-img-top">
										<div class="card-body">
											<h5 class="card-title">{{item.judul}}</h5>
											<div v-html="cleanTextP(item.deskripsi)" class="small"></div>
											<a @click="downloadFile(item.guid)" target="_blank" class="stretched-link" download>[{{item.jum_gambar}} Lihat]</a>
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
			<div v-else class="loading">
				<article class="blog-post blog-post-list border-bottom rounded overflow-hidden p-1 pb-4 mb-1" aria-hidden="true">
					<h4 class="blog-post-title placeholder-glow">
						<span class="placeholder col-12"></span>
					</h4>
					<p class="blog-post-meta placeholder-glow">
						<span class="placeholder col-9"></span>
					</p>
					<div class="card-text row">
						<svg height="220" class="col-6">
							<rect width="100%" height="100%" fill="#868e96"></rect>
						</svg>
						<p class="col placeholder-glow d-flex flex-column gap-2">
							<span class="small placeholder col-12"></span>
							<span class="small placeholder col-11"></span>
							<span class="small placeholder col-10"></span>
							<span class="small placeholder"></span>
							<span class="small placeholder col-10"></span>
						</p>
					</div>
				</article>
			</div>
		</div>
	</div>
</template>