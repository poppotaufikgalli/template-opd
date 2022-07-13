<script setup>
	import { ref, watch, computed } from 'vue'
	import { useRoute } from 'vue-router';
	import { getData } from '@/composables/Api';
	import { beautifyDate2, getEnv, cleanTextP, makeJudul } from '@/composables/myfunc';

	const _ = require("lodash");
	const moment = require("moment");

	const data = ref({});
	const isReady = ref(false);
	const router = useRoute();
	const page = ref('');
	const env = getEnv();
	const currPage = ref(0);
	const maxPage = ref(1);
	//const hari_ini = ref({})
	const error = ref(null)

	async function fetchData() {
		console.log("KalendarEvent")
		isReady.value = false;
		var routename = router.params.page ? router.params.page : 'event';
		page.value = routename
		try{
			let response = await getData(routename);  
			console.log(response)
			data.value = response.data.event
			//getRekapBerita();
			//console.log(data)
			//todayItem()
			//let a = _.groupBy(data.value, 'thn_terbit')
			
			//console.log(a)
		} catch(err){
			error.value = err.toString()
		}

		if(router.query.id){
			var id = router.query.id;
			console.log(id)
			setCurrPage(id)
		}
		
		isReady.value = true;
	}

	const searchEventAktif = computed(()=> {
		var currentDate =  moment(new Date()).format('YYYY-MM-DD hh:mm:ss');
		//return _.filter(data.value, { tgl_event_mulai: 'Y' >= currentDate && tgl_event_akhir <= currentDate });
		return _.filter(data.value, (o) => {
			return moment(currentDate).isBetween( moment(o.tgl_event_mulai).format('YYYY-MM-DD hh:mm:ss'), moment(o.tgl_event_akhir).format('YYYY-MM-DD hh:mm:ss') );
		});
	})

	/*const searchToday = computed(()=> {
		var currentDate =  moment(new Date()).format('YYYY-MM-DD');
		return _.filter(data.value, (o) => {
			return moment(o.tgl_mulai_terbit).isSame(currentDate, 'day');
		});
	})*/

	function setCurrPage(id_kalender_event){
		currPage.value = _.findKey(data.value, ['id_kalender_event', id_kalender_event]);
		maxPage.value = parseInt(currPage.value) +1
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
				<article v-for="item in data.slice(currPage, maxPage)" :key="item.id_kalender_event" class="blog-post blog-post-list rounded overflow-hidden p-1 mb-1">
					<h3 class="blog-post-title text-capitalize text-center">{{ item.judul_kalender_event }}</h3>
					<div class="d-flex flex-column justify-content-center align-items-center mb-2">
						<template v-if="item.gambar">
							<div class="overflow-hidden mb-4" style="max-height: 500px;">
								<img 
									:src="env.imgUrl+'posting/'+(item.tipe_post == 'halaman' ? 'halaman' : 'event')+'/'+env.kunker+'/'+ item.gambar" 
									:alt="item.judul_kalender_event"
									style="object-fit: contain; overflow: hidden;" 
								>	
							</div>
						</template>
						<span class="small">Tanggal Event : <b>{{beautifyDate2(item.tgl_event_mulai) + (item.tgl_event_akhir != '0000-00-00 00:00:00' ? " s/d "+ beautifyDate2(item.tgl_event_akhir) : '')}}</b></span>
					</div>

					<div v-html="cleanTextP(item.ket_kalender_event)" class="small"></div>
					<p class="blog-post-meta badge info-post small">
						<i class="bi bi-box"></i> Unit Kerja : {{ item.nunker }}  |  
						<i class="bi bi-pen-fill"></i> Oleh <router-link :to="{path: '/list/'+item.post_user, query: {type : 'post_user', page: page} }">{{item.post_user}}</router-link>
					</p>
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
		<template v-if="isReady">
			<div class="col-md-4">
				<div class="position-sticky" style="top: 4rem;">
					<template v-if="searchEventAktif.length > 0">
						<div class="list-template-opd surface">
							<div class="list-header">
								<h5 class="list-title">
									<span>{{page}} Berlangsung</span>	
								</h5>
							</div>
							<div class="list-body">
								<template v-for="(item) in searchEventAktif" :key="item.id_kalender_event">
									<router-link 
										:to="{path : '/kalendareven/'+makeJudul(item.judul_kalender_event), query : {id: item.id_kalender_event} }" 
										class="truncate-text l-2 fw-bold"
										:class="{isActive : currPage == item.id_kalender_event}"
									>
										<span>{{item.judul_kalender_event}}</span>
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
								<template v-for="(item) in data.slice(0,4)" :key="item.id_kalender_event">
									<router-link 
										:to="{path : '/kalendareven/'+makeJudul(item.judul_kalender_event), query : {id: item.id_kalender_event} }" 
										class="truncate-text l-2 fw-bold"
										:class="{isActive : currPage == item.id_kalender_event}"
									>
										<span>{{item.judul_kalender_event}}</span>
									</router-link>
								</template>
							</div>
						</div>
					</template>
					<div class="list-template-opd surface">
						<div class="list-footer">
							<router-link :to="{path:'/list/kalendareven'}" class="truncate-text">Lihat Daftar Kalendar Event</router-link>
						</div>
					</div>
				</div>
			</div>
		</template>
	</div>
</template>