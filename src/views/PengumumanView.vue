<script setup>
	import { ref, watch, computed, onUpdated } from 'vue';
	//import { useMeta } from 'vue-meta';
	import { useActiveMeta } from 'vue-meta';
	import { useRoute } from 'vue-router';
	import { getData, setMeta } from '@/composables/Api';
	import { getEnv, cleanTextP, makeJudul } from '@/composables/myfunc';
	import OnProgresPage from '@/components/partials/OnProgresPage';
	import ogImage from "@/assets/img/logo-tpi.png"

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

	const activeMeta = useActiveMeta()

	onUpdated(() => {
		if(data.value){
			var curr = _.find(data.value, function(e, i) {
				return i == currPage.value;
			});
			
			if(curr && page.value == 'pengumuman'){
				//console.log("update Meta pengumuman")
				var metaGbr = window.location.origin+ogImage;
				if(curr.gambar){
					metaGbr = env.imgUrl+'posting/pengumuman/'+env.kunker+'/thumb/thumb_'+ curr.gambar;
				}

				setMeta(activeMeta, curr.judul_pengumuman, curr.isi, curr.penulis, metaGbr)
			}
		}
	})

	async function fetchData() {
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
		var tayang = ["OPD"];
		if(item.tayang_khusus == 'Y'){
			tayang.push("Khusus");
		}
		if(item.acc_tayang_portal == 'Y'){
			tayang.push("PEMKO");
		}
		return tayang.join(", ");
	}

	const searchToday = computed(()=> {
		var currentDate =  moment(new Date()).format('YYYY-MM-DD');
		return _.filter(data.value, (o) => {
			return moment(o.tgl_terbit).isSame(currentDate, 'day');
		});
	})

	function setCurrPage(id){
		currPage.value = _.findKey(data.value, ['id', id]);
		maxPage.value = parseInt(currPage.value) +1
	}

	function trimRoute(namedRoute) {
		return namedRoute.replace(/\s+/g,'_')
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
				<template v-if="data">
					<article v-for="item in data.slice(currPage, maxPage)" :key="item.id" class="blog-post blog-post-list rounded overflow-hidden mb-4 surface">
						<h3 class="blog-post-title text-capitalize">{{ item.judul_pengumuman }}</h3>
						<p class="blog-post-meta badge info-post small">
							<i class="bi bi-bookmark-star-fill"></i> {{item.no_pengumuman}} | 
							<i class="bi bi-calendar-fill"></i> {{item.tanggal_terbit + ((item.tgl_akhir != null && item.tgl_akhir != '0000-00-00 00:00:00') ? " s/d "+ item.tanggal_akhir : '')}} |
							<i class="bi bi-pen-fill"></i> Oleh <router-link :to="{path: '/list/'+item.penulis, query: {type : 'penulis', page: page} }">{{item.penulis}}</router-link>
						</p>
						<br/>
						<template v-if="item.gambar">
							<div class="overflow-hidden mb-4" style="max-height: 500px;">
								<img 
									:src="env.imgUrl+'posting/pengumuman/'+env.kunker+'/original/'+ item.gambar" 
									class="img-fluid mb-4" 
									:alt="item.judul_pengumuman"
								>   
							</div>
						</template>
						<div v-html="cleanTextP(item.isi)" class="small"></div>
						<hr>
						<template v-if="item.guid">
							<p>
								<span class="small">Lampiran : 
									<router-link :to="{path: '/Download_Area/'+trimRoute(item.nama_file), query: {type : 'id', page: page} }">{{item.nama_file}}</router-link>
								</span>
							</p>
						</template>
						<p class="blog-post-meta badge info-post small mb-1">
							<i class="bi bi-box"></i> Unit Kerja : {{ item.nunker }} | 
							<i class="bi bi-check2-square"></i> Tayang {{tayangPengumuman(item)}}
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
					<template v-if="data && searchToday.length > 0">
						<div class="list-template-opd surface">
							<div class="list-header">
								<h5 class="list-title">
									<span>{{page}} Hari Ini</span>  
								</h5>
							</div>
							<div class="list-body">
								<template v-if="searchToday">
									<router-link v-for="item in searchToday" :key="item.id"
										:to="{path : '/pengumuman/'+makeJudul(item.judul_pengumuman), query : {id: item.id} }" 
										class="truncate-text l-2 fw-bold"
										:class="{isActive : currPage == item.id}"
									>
										<span>{{item.judul_pengumuman}}</span>
									</router-link>
								</template>
							</div>
						</div>
					</template>

					<template v-if="data && searchPengumumanKhusus.length > 0">
						<div class="list-template-opd surface">
							<div class="list-header">
								<h5 class="list-title">
									<span>{{page}} Khusus</span>    
								</h5>
							</div>
							<div class="list-body">
								<template v-for="(item) in searchPengumumanKhusus" :key="item.id">
									<router-link 
										:to="{path : '/pengumuman/'+makeJudul(item.judul_pengumuman), query : {id: item.id} }" 
										class="truncate-text l-2 fw-bold"
										:class="{isActive : currPage == item.id}"
									>
										<span>{{item.judul_pengumuman}}</span>
									</router-link>
								</template>
							</div>
						</div>
					</template>

					<template v-if="data && searchPengumumanPemko.length > 0">
						<div class="list-template-opd surface">
							<div class="list-header">
								<h5 class="list-title">
									<span>{{page}} PEMKO</span> 
								</h5>
							</div>
							<div class="list-body">
								<template v-for="(item) in searchPengumumanPemko" :key="item.id">
									<router-link 
										:to="{path : '/pengumuman/'+makeJudul(item.judul_pengumuman), query : {id: item.id} }" 
										class="truncate-text l-2 fw-bold"
										:class="{isActive : currPage == item.id}"
									>
										<span>{{item.judul_pengumuman}}</span>
									</router-link>
								</template>
							</div>
						</div>
					</template>

					<template v-if="data && searchPengumumanOPD.length > 0">
						<div class="list-template-opd surface">
							<div class="list-header">
								<h5 class="list-title">
									<span>{{page}} OPD</span>   
								</h5>
							</div>
							<div class="list-body">
								<template v-for="(item) in searchPengumumanOPD" :key="item.id">
									<router-link 
										:to="{path : '/pengumuman/'+makeJudul(item.judul_pengumuman), query : {id: item.id} }" 
										class="truncate-text l-2 fw-bold"
										:class="{isActive : currPage == item.id}"
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