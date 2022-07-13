<script setup>
	import { ref, watch, computed } from 'vue'
	import LinkTags from '@/components/partials/LinkTags';
	import ImgListGalleryAlbum from '@/components/partials/ImgListGalleryAlbum';
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
	//const berita_hari_ini = ref({});
	const error = ref();

	async function fetchData() {
		//console.log("BeritaView")
		isReady.value = false;
		var routename = router.params.page ? router.params.page : 'berita';
		page.value = routename
		try{
			let response = await getData('berita');  
			data.value = response.data.berita
		
			//let a = _.groupBy(data.value, 'thn_terbit')
			
			//console.log(a)
		} catch(err){
			error.value = err.toString()
		}

		if(router.query.id){
			var id = router.query.id;
			setCurrPage(id)
		}
		
		isReady.value = true;
	}

	const searchPopulerNews = computed(()=> {
		return _.orderBy(data.value, o => +o.jml_klik, ['desc']);
	})

	const searchToday = computed(()=> {
		var currentDate =  moment(new Date()).format('YYYY-MM-DD');
		return _.filter(data.value, (o) => {
			return moment(o.tgl_terbit).isSame(currentDate, 'day');
		});
	})

	function setCurrPage(id_post){
		currPage.value = _.findKey(data.value, ['id_post', id_post]);
		maxPage.value = parseInt(currPage.value) +1
	}

	// fetch immediately
	fetchData()
	// ...then watch for url change
	watch(router, fetchData)	
</script>
<template>
	<div class="row g-4">
		<div class="col-md-8 mb-4">
			<div v-if="error" class="alert alert-danger d-flex align-items-center" role="alert">
				<i class="bi bi-exclamation-triangle-fill"></i><div>&nbsp;Error : {{ error }}</div>
			</div>
			<template v-if="isReady">
				<article v-for="item in data.slice(currPage, maxPage)" :key="item.id" class="blog-post blog-post-list overflow-hidden surface">
					<h3 class="blog-post-title text-capitalize">{{ item.post_judul }}</h3>
					<p class="blog-post-meta badge info-post small">
						<i class="bi bi-calendar-fill"></i> {{ beautifyDate1(item.tgl_terbit) }}  |  
						<i class="bi bi-pen-fill"></i> Oleh <router-link :to="{path: '/list/'+item.post_user, query: {type : 'post_user', page: page} }">{{item.post_user}}</router-link>  |  
						<i class="bi bi-eye-fill"></i> Dilihat : {{item.jml_klik}}
					</p>
					<template v-if="item.post_gambar">
						<img 
							:src="env.imgUrl+'posting/'+(item.tipe_post == 'halaman' ? 'halaman' : 'berita')+'/'+env.kunker+'/'+ item.post_gambar" 
							class="col-md-8" 
							:alt="item.post_judul"
							style="max-height: 300px; object-fit: cover;" 
							@error="(() => item.post_gambar = null)"
						>	
					</template>
					<div v-html="cleanTextP(item.post_isi)" class="small" :style="item.post_gambar ? 'min-height: 330px' : ''"></div>
					<p class="blog-post-meta badge info-post small">
						<i class="bi bi-stack"></i> Kategori : <router-link :to="{path : '/list/'+item.kategori_post, query: {type : 'kategori', page: page}}">{{item.kategori_post}}</router-link>  |  
						<i class="bi bi-tags-fill"></i> Tags : <LinkTags :tags="item.tags" :page="page" />
					</p>
					<hr />
					<ImgListGalleryAlbum v-if="item.id_gallery_album > 0" :id_gallery_album="item.id_gallery_album" />	
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
								<template v-for="(item) in searchToday" :key="item.id_post">
									<router-link 
										:to="{path : '/berita/'+makeJudul(item.post_judul), query : {id: item.id_post} }" 
										class="truncate-text l-2 fw-bold"
										:class="{isActive : currPage == item.id_post}"
									>
										<span>{{item.post_judul}}</span>
									</router-link>
								</template>
							</div>
						</div>
					</template>
						
					<template v-if="searchPopulerNews.length > 0">
						<div class="list-template-opd surface">
							<div class="list-header">
								<h5 class="list-title">
									<span>{{page}} Terpopuler</span>	
								</h5>
							</div>
							<div class="list-body">
								<template v-for="(item) in searchPopulerNews.slice(0,4)" :key="item.id_post">
									<router-link 
										:to="{path : '/berita/'+makeJudul(item.post_judul), query : {id: item.id_post} }" 
										class="d-flex justify-content-between align-items-center"
										:class="{isActive : currPage == item.id_post}"
									>
										<span class="truncate-text l-1 fw-bold">{{item.post_judul}}</span>
										<span class="badge info-post bg-transparent"><i class="bi bi-eye-fill"></i>&nbsp;{{item.jml_klik}}</span>
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
								<template v-for="(item) in data.slice(0,4)" :key="item.id_post">
									<router-link 
										:to="{path : '/berita/'+makeJudul(item.post_judul), query : {id: item.id_post} }" 
										class="truncate-text l-1 fw-bold"
										:class="{isActive : currPage == item.id_post}"
									>
										<span>{{item.post_judul}}</span>
									</router-link>
								</template>
							</div>
						</div>
					</template>
					<div class="list-template-opd surface">
						<div class="list-footer">
							<router-link :to="{path:'/list/berita'}" class="truncate-text">Lihat Daftar Berita</router-link>
						</div>
					</div>
				</div>
			</div>
		</template>
	</div>
</template>