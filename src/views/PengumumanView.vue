<script setup>
	import { ref, watch, computed } from 'vue'
	import { useRoute } from 'vue-router';
	import { getData } from '@/composables/Api';
	import { beautifyDate1, getEnv, cleanTextP, makeJudul } from '@/composables/myfunc';

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
		console.log("PengumumanView")
		isReady.value = false;
		var routename = router.params.page ? router.params.page : 'pengumuman';
		page.value = routename
		try{
			let response = await getData('pengumuman');  
			data.value = response.data.pengumuman;
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

	const searchPengumumanKhusus = computed(()=> {
		return _.filter(data.value, { tayang_khusus: 'Y' });
	})

	const searchPengumumanPemko = computed(()=> {
		return _.filter(data.value, { tayang_pemko: 'Y' });
	})

	const searchPengumumanOPD = computed(()=> {
		return _.filter(data.value, { tayang_opd: 'Y' });
	})

	function tayangPengumuman(item) {
		var tayang = '';
		if(item.tayang_khusus == 'Y'){
			tayang = tayang + "Khusus, ";
		}
		if(item.tayang_opd == 'Y'){
			tayang = tayang + "OPD, ";
		}
		if(item.tayang_pemko == 'Y'){
			tayang = tayang + "PEMKO";
		}
		return tayang;
	}

	const searchToday = computed(()=> {
		var currentDate =  moment(new Date()).format('YYYY-MM-DD');
		return _.filter(data.value, (o) => {
			return moment(o.tgl_mulai_terbit).isSame(currentDate, 'day');
		});
	})

	function setCurrPage(id_pengumuman){
		currPage.value = _.findKey(data.value, ['id_pengumuman', id_pengumuman]);
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
				<article v-for="item in data.slice(currPage, maxPage)" :key="item.id_pengumuman" class="blog-post blog-post-list rounded overflow-hidden p-1 mb-1">
					<h3 class="blog-post-title text-capitalize text-center">{{ item.judul_pengumuman }}</h3>
					<div class="d-flex flex-column justify-content-center align-items-center mb-2">
						<template v-if="item.gambar">
							<div class="overflow-hidden mb-4" style="max-height: 500px;">
								<img 
									:src="env.imgUrl+'posting/pengumuman/'+env.kunker+'/'+ item.gambar" 
									class="img-fluid mb-4" 
									:alt="item.judul_pengumuman"
								>	
							</div>
						</template>
						<h5 class="text-decoration-underline small">Nomor : {{item.no_pengumuman}}</h5>
						<span class="small">Terbit : {{beautifyDate1(item.tgl_mulai_terbit) + (item.tgl_akhir_terbit != '0000-00-00 00:00:00' ? " s/d "+ beautifyDate1(item.tgl_akhir_terbit) : '')}}</span>
					</div>

					<div v-html="cleanTextP(item.isi)" class="small"></div>
					<p class="blog-post-meta badge info-post small">
						<i class="bi bi-box"></i> Unit Kerja : {{ item.nunker }}  |  
						<i class="bi bi-check2-square"></i> Tayang {{tayangPengumuman(item)}}  |
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
					<template v-if="searchToday.length > 0">
						<div class="list-template-opd surface">
							<div class="list-header">
								<h5 class="list-title">
									<span>{{page}} Hari Ini</span>	
								</h5>
							</div>
							<div class="list-body">
								<template v-for="(item) in searchToday" :key="item.id_pengumuman">
									<router-link 
										:to="{path : '/pengumuman/'+makeJudul(item.judul_pengumuman), query : {id: item.id_pengumuman} }" 
										class="truncate-text l-2 fw-bold"
										:class="{isActive : currPage == item.id_pengumuman}"
									>
										<span>{{item.judul_pengumuman}}</span>
									</router-link>
								</template>
							</div>
						</div>
					</template>

					<template v-if="data.length > 0">
						<div class="list-template-opd surface">
							<div class="list-header">
								<h5 class="list-title">
									<span>{{page}} Khusus</span>	
								</h5>
							</div>
							<div class="list-body">
								<template v-for="(item) in searchPengumumanKhusus" :key="item.id_pengumuman">
									<router-link 
										:to="{path : '/pengumuman/'+makeJudul(item.judul_pengumuman), query : {id: item.id_pengumuman} }" 
										class="truncate-text l-2 fw-bold"
										:class="{isActive : currPage == item.id_pengumuman}"
									>
										<span>{{item.judul_pengumuman}}</span>
									</router-link>
								</template>
							</div>
						</div>
					</template>

					<template v-if="data.length > 0">
						<div class="list-template-opd surface">
							<div class="list-header">
								<h5 class="list-title">
									<span>{{page}} PEMKO</span>	
								</h5>
							</div>
							<div class="list-body">
								<template v-for="(item) in searchPengumumanPemko" :key="item.id_pengumuman">
									<router-link 
										:to="{path : '/pengumuman/'+makeJudul(item.judul_pengumuman), query : {id: item.id_pengumuman} }" 
										class="truncate-text l-2 fw-bold"
										:class="{isActive : currPage == item.id_pengumuman}"
									>
										<span>{{item.judul_pengumuman}}</span>
									</router-link>
								</template>
							</div>
						</div>
					</template>

					<template v-if="data.length > 0">
						<div class="list-template-opd surface">
							<div class="list-header">
								<h5 class="list-title">
									<span>{{page}} OPD</span>	
								</h5>
							</div>
							<div class="list-body">
								<template v-for="(item) in searchPengumumanOPD" :key="item.id_pengumuman">
									<router-link 
										:to="{path : '/pengumuman/'+makeJudul(item.judul_pengumuman), query : {id: item.id_pengumuman} }" 
										class="truncate-text l-2 fw-bold"
										:class="{isActive : currPage == item.id_pengumuman}"
									>
										<span>{{item.judul_pengumuman}}</span>
									</router-link>
								</template>
							</div>
						</div>
					</template>

					<div class="list-template-opd surface">
						<div class="list-footer">
							<router-link :to="{path:'/list/pengumuman'}" class="truncate-text">Lihat Daftar Pengumuman</router-link>
						</div>
					</div>
				</div>
			</div>
		</template>
	</div>
</template>