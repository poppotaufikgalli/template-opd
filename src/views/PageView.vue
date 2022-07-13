<script setup>
	import { ref, watch, onBeforeMount, computed } from 'vue'
	import LinkTags from '@/components/partials/LinkTags';
	import { useRoute } from 'vue-router';
	import { getData } from '@/composables/Api';
	import { beautifyDate1, getEnv, cleanTextP } from '@/composables/myfunc';

	const _ = require("lodash");
	const data = ref({});
	const isReady = ref(false);
	const router = useRoute();
	const page = ref('');
	const env = getEnv();
	const currPage = ref(0);
	const maxPage = ref(1);
	const berita_hari_ini = ref({})

	onBeforeMount(async() => {
		console.log('PageView')
	});

	async function fetchData() {
		isReady.value = false;
		var routename = router.params.routes;
		page.value = routename
		if(routename == 'kalendareven'){
			routename = 'event';
			page.value = "Kalendar Event"
		}
		try{
			let response = await getData(routename);  
			data.value = response.data[routename]
			//getRekapBerita();
			todayNews()
			let a = _.groupBy(data.value, 'thn_terbit')
			
			console.log(a)
		} catch(err){
			console.log(err)
		}
		
		isReady.value = true;
	}

	const searchPopulerNews = computed(()=> {
		return _.orderBy(data.value, o => +o.jml_klik, ['desc']);
	})

	function todayNews(){
		var today = [];
		var currentDate = new Date();
		for (var i = data.value.length - 1; i >= 0; i--) {
			if(data[i].value.tgl_terbit == currentDate){
				today.push(data[i].value)
			}
		}
		berita_hari_ini.value = today; 
	}

	// fetch immediately
	fetchData()
	// ...then watch for url change
	watch(router, fetchData)

	function setCurrPage(id_post){
		currPage.value = _.findKey(data.value, ['id_post', id_post]);
		maxPage.value = parseInt(currPage.value) +1
		console.log(currPage.value)
		console.log(maxPage.value)
	}
</script>
<template>
	<div class="row g-5">
		<div class="col-md-8">
			<div class="d-flex surface py-3 mb-4 rounded justify-content-between align-items-center">
				<h4 class="fst-italic text-capitalize mb-0">{{page}}</h4>
				<router-link :to="{path:'/list/berita'}" class="small">Lihat Daftar Berita</router-link>
			</div>

			<!--<div v-if="error" class="error">Error : {{ error }}</div>-->
			<template v-if="isReady">
				<article v-for="item in data.slice(currPage, maxPage)" :key="item.id" class="blog-post blog-post-list rounded overflow-hidden p-1 mb-1">
					<h3 class="blog-post-title text-capitalize">{{ item.post_judul }}</h3>
					<p class="blog-post-meta small">
						<i class="bi bi-calendar-fill"></i> {{ beautifyDate1(item.tgl_terbit) }}  |  
						<i class="bi bi-pen-fill"></i> Oleh <router-link :to="{path: '/list/'+item.post_user, query: {type : 'post_user', page: page} }">{{item.post_user}}</router-link>  |  
						<i class="bi bi-eye-fill"></i> Dilihat : {{item.jml_klik}}
					</p>
					<template v-if="item.post_gambar">
						<img 
							:src="env.imgUrl+'posting/'+(item.tipe_post == 'halaman' ? 'halaman' : 'berita')+'/'+env.kunker+'/'+ item.post_gambar" 
							class="col-md-6" 
							:alt="item.post_judul"
							style="max-height: 250px; object-fit: cover;" 
						>	
					</template>
					<span v-html="cleanTextP(item.post_isi)" class="small"></span>
					<p class="blog-post-meta small">
						<i class="bi bi-stack"></i> Kategori : <router-link :to="{path : '/list/'+item.kategori_post, query: {type : 'kategori', page: page}}">{{item.kategori_post}}</router-link>  |  
						<i class="bi bi-tags-fill"></i> Tags : <LinkTags :tags="item.tags" :page="page" />
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

		<div class="col-md-4">
			<div class="position-sticky" style="top: 4rem;">
				<template v-if="berita_hari_ini.length > 0">
					<div class="p-4">
						<h5 class="fst-italic text-capitalize">{{page}} Hari Ini</h5>
						<ol v-for="(item) in berita_hari_ini" :key="item.id_post" class="list-unstyled mb-0">
							<li><a class="truncate-text l-1 fw-bold" href="#" @click="setCurrPage(item.id_post)">{{item.post_judul}}</a></li>
						</ol>
					</div>
				</template>
				<div class="p-4">
					<h5 class="fst-italic text-capitalize">{{page}} Terpopuler</h5>
					<template v-if="searchPopulerNews.length > 0">
						<ol v-for="(item) in searchPopulerNews.slice(0,3)" :key="item.id_post" class="list-unstyled mb-0">
							<li class="d-flex justify-content-between gap-2 small">
								<a class="truncate-text l-1 fw-bold" href="#" @click="setCurrPage(item.id_post)">{{item.post_judul}}</a>
								<span class="d-flex small"><i class="bi bi-eye-fill"></i> {{item.jml_klik}}</span>
							</li>
						</ol>
					</template>
					<div v-else>
						<button type="button" class="list-group-item" aria-current="true">
							Tidak Ada Berita
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>