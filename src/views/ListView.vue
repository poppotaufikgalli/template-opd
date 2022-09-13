<script setup>
	import { ref, watch } from 'vue'
	//import RightMenu from '@/components/partials/RightMenu';
	import { useRoute } from 'vue-router';
	import { getDataLimit } from '@/composables/Api';
	import { makeJudul } from '@/composables/myfunc';

	const data = ref({});
	const isReady = ref(false);
	const router = useRoute();
	const page = ref('');
	const routename = ref({})
	const limitLen = ref(5);
	const offsetLen = ref(0);
	const maxPage = ref(0); 
	const currPage = ref(0);
	//const dataLen = ref(0);
	//const datacount = ref(0);
	const disablePrev = ref(true)
	const disableNext = ref(false)

	const error = ref('')

	async function fetchData() {
		data.value = {}
		error.value = ''
		routename.value = router.params.routes;
		if(routename.value == 'kalendar_even'){
			routename.value = 'event';
		}

		if(routename.value == 'download_area'){
			routename.value = 'download';
		}

		try{
			let response = await getDataLimit(routename.value, null, null, limitLen.value, offsetLen.value);  
			//console.log(response.data)
			let rdata = response.data[routename.value]
			var Ldata = response.data.length;
			var Cdata = response.data.count;
			maxPage.value = Math.ceil(Ldata / limitLen.value);
			//console.log(maxPage.value)
			//console.log(response)
			let sdata = [];
			if(routename.value == 'berita'){
				page.value = "Berita"
				for (let i = rdata.length - 1; i >= 0; i--) {
					sdata[i] = {
						"id" : rdata[i].id,
						"judul" : rdata[i].judul_post,
						"tanggal_terbit" : rdata[i].tanggal_terbit,
						"user" : rdata[i].penulis,
					}
				}
				data.value = sdata	
			}else if(routename.value == 'pengumuman'){
				page.value = "Pengumuman"
				for (let i = rdata.length - 1; i >= 0; i--) {
					let tanggal_terbit = rdata[i].tanggal_terbit
					if(rdata[i].tgl_akhir != '0000-00-00 00:00:00' && rdata[i].tgl_akhir != null){
						tanggal_terbit = tanggal_terbit +' s/d '+ rdata[i].tanggal_akhir
					}
					sdata[i] = {
						"id" : rdata[i].id,
						"judul" : rdata[i].judul_pengumuman,
						"tanggal_terbit" : tanggal_terbit,
						"user" : rdata[i].post_user,
					}
				}
				data.value = sdata	
			}else if(routename.value == 'event'){
				page.value = "Kalendar Event"
				for (let i = rdata.length - 1; i >= 0; i--) {
					let tanggal_event_mulai = rdata[i].tanggal_event_mulai
					if(rdata[i].tgl_event_akhir != '0000-00-00 00:00:00' && rdata[i].tgl_event_akhir != 'null'){
						tanggal_event_mulai = tanggal_event_mulai +' s/d '+ rdata[i].tanggal_event_akhir
					}
					sdata[i] = {
						"id" : rdata[i].id,
						"judul" : rdata[i].judul_kalender_event,
						"tanggal_terbit" : tanggal_event_mulai,
						"user" : rdata[i].post_user,
					}
				}
				data.value = sdata	
			}else if(routename.value == 'gallery_album'){
				page.value = "Album Gallery"
				for (let i = rdata.length - 1; i >= 0; i--) {
					
					sdata[i] = {
						"id" : rdata[i].id,
						"judul" : rdata[i].judul_album,
						"tanggal_terbit" : rdata[i].tanggal_terbit,
						"user" : rdata[i].yg_ngupload,
					}
				}
				data.value = sdata	
			}

			if(offsetLen.value >= Ldata){
				disableNext.value = true;
				disablePrev.value = false;
			}else if(offsetLen.value == 0){
				disablePrev.value = true;
				disableNext.value = false;
			}else{
				disablePrev.value = false;
				disableNext.value = false;
			}

			
			if(Cdata >= Ldata){
				disablePrev.value = true;
				disableNext.value = true;	
			}

			if(limitLen.value + offsetLen.value >= Ldata){
				disableNext.value = true;
			}
			
			//console.log(data)
		} catch(err){
			error.value = err.toString()
			//console.log(error.value)
		}
		
		isReady.value = true;
	}

	function goto(key){
		if(key < maxPage.value){
			currPage.value = key
			offsetLen.value = limitLen.value * key;		
		}
	}

	// fetch immediately
	fetchData()
	// ...then watch for url change
	watch(router, fetchData)

	watch(offsetLen, fetchData)
</script>
<template>
	<div class="row g-5">
		<div class="col-md-8">
			<div class="list-template-opd mb-4 surface">
				<div class="list-header">
					<h4 class="list-title">
						<span>Daftar {{page}}</span>	
					</h4>
				</div>
				<div class="list-body">
					<template v-if="isReady">
						<article v-if="error || data.length == 0" class="blog-post blog-post-list pt-2 p-1 mt-2 mb-0 notAvailableCard">
							<div class="d-flex justify-content-center align-items-center gap-2" style="min-height: 35vh">
								<i class="bi bi-exclamation-triangle-fill text-danger h3"></i>
								<h3>Daftar {{page}} Belum Tersedia</h3>
							</div>
						</article>	
						<article v-for="item in data" :key="item.id" class="blog-post blog-post-list pt-2 p-1 mb-0">
							<router-link 
								:to="{path : '/'+routename+'/'+makeJudul(item.judul), query : {id: item.id} }" 
								class="fw-bold d-flex flex-column align-items-start"
							>
								{{ (item.judul).toUpperCase() }}
								<span class="badge info-post small">
									<i class="bi bi-calendar-fill"></i> {{ item.tanggal_terbit }}  |  
									<i class="bi bi-pen-fill"></i> Oleh {{item.user}}
								</span>
							</router-link>  
						</article>
						<nav v-if="maxPage" class="d-flex justify-content-end align-items-center gap-2 pt-2" aria-label="Pagination">
							<button @click="goto(0)" class="btn btn-sm btn-outline" :disabled="disablePrev">&lt;&lt;</button>
							<button @click="goto(currPage -1)" class="btn btn-sm btn-outline" :disabled="disablePrev">&lt;</button>
							<template v-for="(_, key) in maxPage" :key="key" >
								<button v-if="key > currPage -2 && key < currPage +2"
									@click="goto(key)" 
									class="btn btn-sm btn-outline" 
									:class="{active : currPage == key}"
								>
									{{key +1}}
								</button>	
							</template>
							<button @click="goto(currPage +1)" class="btn btn-sm btn-outline" :disabled="disableNext">&gt;</button>
							<button @click="goto(maxPage-1)" class="btn btn-sm btn-outline" :disabled="disableNext">&gt;&gt;</button>
						</nav>
					</template>
					<template v-else>
						<article v-for="index in 3" :key="index" class="blog-post blog-post-list border-bottom rounded overflow-hidden p-1 mb-1" aria-hidden="true">
							<span class="blog-post-title placeholder-glow">
								<span class="placeholder col-12"></span>
							</span>
							<p class="blog-post-meta small placeholder-glow">
								<span class="placeholder col-3"></span> | 
								<i class="bi bi-stack"></i> Kategori <span class="placeholder col-2"></span> |
								<i class="bi bi-tags-fill"></i> Tags : <span class="placeholder col-2"></span>
							</p>
						</article>
					</template>
				</div>
			</div>
		</div>
		<div class="col-md-4">
			<div class="list-template-opd surface">
				<div class="list-footer mb-4">
					<router-link :to="{path:'/list/berita'}" class="truncate-text">Daftar Berita</router-link>
				</div>
				<div class="list-footer mb-4">
					<router-link :to="{path:'/list/pengumuman'}" class="truncate-text">Daftar Pengumuman</router-link>
				</div>
				<div class="list-footer mb-4">
					<router-link :to="{path:'/list/kalendar_even'}" class="truncate-text">Daftar Kalendar Even</router-link>
				</div>
				<div class="list-footer mb-4">
					<router-link :to="{path:'/list/gallery_album'}" class="truncate-text">Daftar Album Gallery</router-link>
				</div>
			</div>
		</div>
	</div>
</template>