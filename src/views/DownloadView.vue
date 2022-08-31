<script setup>
	import { ref, watch } from 'vue'
	import { useRoute } from 'vue-router';
	import { getData } from '@/composables/Api';
	import { getEnv } from '@/composables/myfunc';
	//const _ = require("lodash");
	//const moment = require("moment");

	const data = ref({});
	const isReady = ref(false);
	const router = useRoute();
	const page = ref('');
	const env = getEnv();
	const error = ref(null);

	async function fetchData() {
		isReady.value = false;
		var id = router.query.id
		try{
			let response = await getData("download", "id", id);  
			data.value = response.data.download[0]
			console.log(data.value)
		} catch(err){
			error.value = err.toString()
		}
		
		isReady.value = true;
	}

	function downloadFile(filename) {
		window.open(env.apiUrl+'api/getDownloadArea/'+env.kunker+'/'+filename)
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
				<article class="blog-post blog-post-list rounded overflow-hidden mb-4 surface">
					<h3 class="blog-post-title text-capitalize">{{ data.nama_file }}</h3>
					<p class="blog-post-meta badge info-post small">
						<i class="bi bi-calendar-fill"></i> {{ data.tanggal_file }}  |  
						<i class="bi bi-pen-fill"></i> Oleh <router-link :to="{path: '/list/'+data.user_yg_buat, query: {type : 'user_yg_buat', page: page} }">{{data.user_yg_buat}}</router-link>
					</p>
					<table class="table table-bordered table-striped text-dark">
						<tr>
							<td>Deskripsi</td>
							<td>:</td>
							<td>{{data.deskripsi_file}}</td>
						</tr>
						<tr>
							<td>Jenis File</td>
							<td>:</td>
							<td>{{data.jenis_file}} ( {{data.icon_format}} )</td>
						</tr>
						<tr>
							<td>Kategori DIP</td>
							<td>:</td>
							<td>{{data.kategori_dip}}</td>
						</tr>
						<tr>
							<td>Peruntukan File</td>
							<td>:</td>
							<td>{{data.peruntukan}}</td>
						</tr>
						<tr>
							<td>Tanggal File</td>
							<td>:</td>
							<td>{{data.tanggal_file}}</td>
						</tr>
						<tr>
							<td>Tanggal Pembuatan</td>
							<td>:</td>
							<td>{{data.created_at}}</td>
						</tr>
						<tr>
							<td>Oleh</td>
							<td>:</td>
							<td>{{data.user_yg_buat}} / {{data.nunker}}</td>
						</tr>
					</table>
					<div class="float-end">
						<a @click="downloadFile(data.guid)" class="btn btn-sm btn-primary" target="_blank" download>Lihat / Download</a>
					</div>
				</article>
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