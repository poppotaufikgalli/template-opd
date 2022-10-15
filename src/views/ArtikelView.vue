<script setup>
	import { ref, watch, computed, onUpdated } from 'vue'
	//import { useMeta } from 'vue-meta'
	import { useActiveMeta } from 'vue-meta'
	import LinkTags from '@/components/partials/LinkTags';
	import ImgListGalleryAlbum from '@/components/partials/ImgListGalleryAlbum';
	import OnProgresPage from '@/components/partials/OnProgresPage';
	import { useRoute } from 'vue-router';
	import { getData, setMeta } from '@/composables/Api';
	import { getEnv, makeJudul } from '@/composables/myfunc';
	import { useCounterStore } from '@/stores/counter'
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
	const error = ref();

	const store = useCounterStore()

	const activeMeta = useActiveMeta()

	onUpdated(() => {
		if(data.value){
			var curr = _.find(data.value, function(e, i) {
				return i === currPage.value;
			});
			
			if(curr && page.value == 'artikel'){
				//console.log("update Meta Berita")
				var metaGbr = window.location.origin+ogImage;
				if(curr.post_gambar){
					metaGbr = env.imgUrl+'posting/artikel/'+env.kunker+'/'+ curr.post_gambar;
				}

				setMeta(activeMeta, curr.judul_post, curr.isi_post, curr.penulis, metaGbr)
			}
		}
	})

	async function fetchData() {
		isReady.value = false;
		var routename = router.params.page ? router.params.page : 'artikel';
		page.value = routename
		try{
			let response = await getData('artikel');  
			data.value = response.data.artikel
			
			console.log(response)
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

	function setCurrPage(id){
		currPage.value = _.findKey(data.value, ['id', id]);
		maxPage.value = parseInt(currPage.value) +1
		store.setVisitList(id);
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
				<template v-if="data">
					<article v-for="item in data.slice(currPage, maxPage)" :key="item.id" class="blog-post blog-post-list overflow-hidden surface">
						<h3 class="blog-post-title text-capitalize">{{ item.judul_post }}</h3>
						<p class="blog-post-meta badge info-post small">
							<i class="bi bi-calendar-fill"></i> {{ item.tanggal_terbit }}  |  
							<i class="bi bi-pen-fill"></i> Oleh <router-link :to="{path: '/list/'+item.penulis, query: {type : 'penulis', page: page} }">{{item.alias == '' ? item.penulis : item.alias }}</router-link>  |  
							<i class="bi bi-eye-fill"></i> Dilihat : {{item.jum_klik ? item.jum_klik : 0}}
						</p>
						<br/>
						<template v-if="item.post_gambar">
							<img 
								:src="env.imgUrl+'posting/artikel'+env.kunker+'/'+ item.post_gambar" 
								class="img-fluid mb-4" 
								:alt="item.judul_post"
								style="object-fit: cover;" 
								@error="(() => item.post_gambar = null)"
							>	
						</template>
						<div v-html="item.isi_post" class="small"></div>
						<p class="blog-post-meta badge info-post small">
							<i class="bi bi-stack"></i> Kategori : <router-link :to="{path : '/list/'+item.kategori_post, query: {type : 'kategori', page: page}}">{{item.kategori_post}}</router-link>
							<template v-if="item.tag">
								|  <i class="bi bi-tags-fill"></i> Tags : <LinkTags :tag="item.tag" :page="page" />
							</template>  
						</p>
						<hr />
						<ImgListGalleryAlbum v-if="item.id_gallery_album > 0" :id_gallery_album="item.id_gallery_album" />	
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
					<template v-if="searchToday.length > 0 && data">
						<div class="list-template-opd surface">
							<div class="list-header">
								<h5 class="list-title">
									<span>{{page}} Hari Ini</span>	
								</h5>
							</div>
							<div class="list-body">
								<template v-for="(item) in searchToday" :key="item.id">
									<router-link 
										:to="{path : '/artikel/'+makeJudul(item.judul_post), query : {id: item.id} }" 
										class="truncate-text l-2 fw-bold"
										:class="{isActive : currPage == item.id}"
									>
										<span>{{item.judul_post}}</span>
									</router-link>
								</template>
							</div>
						</div>
					</template>
						
					<template v-if="searchPopulerNews.length > 0 && data">
						<div class="list-template-opd surface">
							<div class="list-header">
								<h5 class="list-title">
									<span>{{page}} Terpopuler</span>	
								</h5>
							</div>
							<div class="list-body">
								<template v-for="(item) in searchPopulerNews.slice(0,4)" :key="item.id">
									<router-link 
										:to="{path : '/artikel/'+makeJudul(item.judul_post), query : {id: item.id} }" 
										class="d-flex justify-content-between align-items-center"
										:class="{isActive : currPage == item.id}"
									>
										<span class="truncate-text l-1 fw-bold">{{item.judul_post}}</span>
										<span class="badge info-post bg-transparent"><i class="bi bi-eye-fill"></i>&nbsp;{{item.jum_klik}}</span>
									</router-link>
								</template>
							</div>
						</div>
					</template>

					<template v-if="data && data.length > 0">
						<div class="list-template-opd surface">
							<div class="list-header">
								<h5 class="list-title">
									<span>{{page}} Lainnya</span>	
								</h5>
							</div>
							<div class="list-body">
								<template v-for="(item, key) in data.slice(0,4)" :key="item.id">
									<router-link v-if="currPage != key"
										:to="{path : '/artikel/'+makeJudul(item.judul_post), query : {id: item.id} }" 
										class="truncate-text l-1 fw-bold"
									>
										<span>{{item.judul_post}}</span>
									</router-link>
								</template>
							</div>
						</div>
					</template>
					<div class="list-template-opd surface">
						<div class="list-footer">
							<router-link :to="{path:'/list/artikel'}" class="truncate-text">Lihat Daftar Artikel</router-link>
						</div>
					</div>
				</div>
			</div>
		</template>
	</div>
</template>