<script setup>
	import { ref, watch, computed } from 'vue'
	import { useRoute } from 'vue-router';
	import { getData } from '@/composables/Api';
	import { getEnv, makeJudul } from '@/composables/myfunc';
	import OnProgresPage from '@/components/partials/OnProgresPage';

	const _ = require("lodash");
	const moment = require("moment");

	const data = ref({});
	const isReady = ref(false);
	const router = useRoute();
	const page = ref('');
	const env = getEnv();
	const currPage = ref(0);
	const maxPage = ref(1);
	const id_gallery_album = ref(0)
	//const hari_ini = ref({})
	const error = ref(null)

	async function fetchData() {
		isReady.value = false;
		var routename = router.params.page ? router.params.page : 'gallery';
		page.value = routename
		try{
			let response = await getData(routename);  
			data.value = response.data.gallery
			//console.log(data.value)
		} catch(err){
			error.value = err.toString()
		}

		if(router.query.id){
			var id = router.query.id;
			setCurrPage(id)
		}
		
		isReady.value = true;
	}

	const galleryToday = computed(()=> {
		var currentDate =  moment(new Date()).format('YYYY-MM-DD hh:mm:ss');
		return _.filter(data.value, (o) => {
			return moment(o.tgl_gambar).isSame(currentDate, 'day');
		});
	})

	const galleryLainnya = computed(()=> {
		return _.filter(data.value, (o) => {
			return o.id_gallery_album == id_gallery_album.value;
		});
	})

	function setCurrPage(id){
		currPage.value = _.findKey(data.value, ['id', id]);
		id_gallery_album.value = _.find(data.value, ['id', id]).id_gallery_album;
		maxPage.value = parseInt(currPage.value) +1
	}

	function downloadFile(filename) {
		window.open(env.apiUrl+'api/getDownloadGallery/'+env.kunker+'/'+filename)
	}

	// fetch immediately
	fetchData()
	// ...then watch for url change
	watch(router, fetchData)	
</script>
<template>
	<div class="row g-5">
		<div class="col-md-8">
			<div v-if="error" class="alert alert-danger d-flex align-items-center" role="alert">
				<i class="bi bi-exclamation-triangle-fill"></i><div>&nbsp;Error : {{ error }}</div>
			</div>
			<template v-if="isReady">
				<template v-if="data.length > 0">
					<article v-for="item in data.slice(currPage, maxPage)" :key="item.id" class="blog-post blog-post-list rounded overflow-hidden mb-4 surface">
						<h3 class="blog-post-title text-capitalize">{{ item.judul_gallery }}</h3>
						<p class="blog-post-meta badge info-post small">
							<i class="bi bi-calendar-fill"></i> {{item.tgl_gambar}}  |  
							<i class="bi bi-pen-fill"></i> Oleh <router-link :to="{path: '/list/'+item.user_yg_buat, query: {type : 'user_yg_buat', page: page} }">{{item.user_yg_buat}}</router-link>
						</p>
						<br/>
						<template v-if="item.gambar">
							<div class="d-flex justify-content-center">
								<img 
									:src="env.imgUrl+'posting/galeri/'+env.kunker+'/original/'+ item.gambar" 
									:alt="item.judul_kalender_event"
									class="img-fluid mb-4" 
									style="object-fit: contain; overflow: hidden;" 
								>	
							</div>
						</template>
						<table class="table small">
							<tr>
								<td width="20%">Keterangan Gallery</td>
								<td>:</td>
								<td width="80%">{{item.ket_gallery}}</td>
							</tr>
							<tr>
								<td>Judul Album Gallery</td>
								<td>:</td>
								<td>{{item.judul_album}}</td>
							</tr>
							<tr>
								<td></td>
								<td></td>
								<td>
									<div class="d-flex justify-content-start align-items-center gap-2">
										<a @click="downloadFile(item.gambar)" class="btn btn-sm btn-primary" target="_blank" download><i class="bi bi-cloud-download"></i> | Lihat / Donwload File</a>
									</div>
								</td>
							</tr>
						</table>
						<hr>
						<p class="blog-post-meta badge info-post small mb-1">
							<i class="bi bi-box"></i> Unit Kerja : {{ item.nunker }}
						</p>
					</article>
				</template>
				<template v-else>
					<OnProgresPage />
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
		<template v-if="isReady">
			<div class="col-md-4">
				<div class="position-sticky" style="top: 4rem;">
					<template v-if="galleryToday.length > 0">
						<div class="list-template-opd surface">
							<div class="list-header">
								<h5 class="list-title">
									<span>{{page}} Berlangsung</span>	
								</h5>
							</div>
							<div class="list-body">
								<template v-for="(item) in galleryToday" :key="item.id">
									<router-link 
										:to="{path : '/gallery_item/'+makeJudul(item.judul_gallery), query : {id: item.id} }" 
										class="truncate-text l-2 fw-bold"
										:class="{isActive : currPage == item.id}"
									>
										<span>{{item.judul_gallery}}</span>
									</router-link>
								</template>
							</div>
						</div>
					</template>

					<template v-if="data.length > 0">
						<div class="list-template-opd surface">
							<div class="list-header">
								<h5 class="list-title">
									<span>{{page}} Lainnya</span>	
								</h5>
							</div>
							<div class="list-body">
								<template v-for="(item) in galleryLainnya" :key="item.id">
									<router-link 
										:to="{path : '/gallery_item/'+makeJudul(item.judul_gallery), query : {id: item.id} }" 
										class="truncate-text l-2 fw-bold"
										:class="{isActive : currPage === item.id}"
									>
										<span>{{item.judul_gallery}}</span>
									</router-link>
								</template>
							</div>
						</div>
					</template>
					<div class="list-template-opd surface">
						<div class="list-footer">
							<router-link :to="{path:'/list/gallery_album'}" class="truncate-text">Lihat Daftar Album Gallery</router-link>
						</div>
					</div>
				</div>
			</div>
		</template>
	</div>
</template>