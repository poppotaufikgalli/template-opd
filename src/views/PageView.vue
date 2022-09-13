<script setup>
	import { ref, watch, onUpdated } from 'vue'
	import { useRoute } from 'vue-router';
	import { useActiveMeta } from 'vue-meta'
	import { getData, setMeta } from '@/composables/Api';
	import { getEnv } from '@/composables/myfunc';
	import ogImage from "@/assets/img/logo-tpi.png"

	//const _ = require("lodash");
	const data = ref({});
	const isReady = ref(false);
	const router = useRoute();
	const page = ref('');
	const env = getEnv();
	//const berita_hari_ini = ref({})

	const activeMeta = useActiveMeta()

	onUpdated(() => {
		if(data.value){
			//console.log("update Meta galleri")
			var curr = data.value;
			var metaGbr = window.location.origin+ogImage;
			if(curr.post_gambar){
				metaGbr = env.imgUrl+'posting/halaman/'+env.kunker+'/'+ curr.post_gambar;
			}

			setMeta(activeMeta, curr.judul_post, curr.isi_post , curr.penulis, metaGbr)
		}
	})

	async function fetchData() {
		//console.log('page')
		isReady.value = false;
		
		try{
			let response = await getData('halaman', 'id', router.query.id_post);  
			data.value = response.data.halaman
			//console.log(data.value)
			
		} catch(err){
			console.log(err)
		}
		
		isReady.value = true;
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
				<article class="blog-post blog-post-list overflow-hidden surface">
					<h3 class="blog-post-title text-capitalize">{{ data.judul_post }}</h3>
					<template v-if="data.post_gambar">
						<img 
							:src="env.imgUrl+'posting/halaman/'+env.kunker+'/'+ data.post_gambar" 
							class="col-md-8" 
							style="object-fit: cover;" 
							:alt="data.judul_post"
							@error="(() => data.post_gambar = null)"
						>   
					</template>
					<div v-html="data.isi_post" class="small" :style="data.post_gambar ? 'min-height: 330px' : 'width:100%'"></div>
					<p class="blog-post-meta badge info-post small">
						<i class="bi bi-calendar-fill"></i> {{ data.tanggal_tulis }}  |  
						<i class="bi bi-pen-fill"></i> Oleh <router-link :to="{path: '/list/'+data.penulis, query: {type : 'penulis', page: page} }">{{data.penulis}}</router-link>  |  
						<i class="bi bi-stack"></i> Kategori : <router-link :to="{path : '/list/'+data.kategori_post, query: {type : 'kategori', page: page}}">{{data.kategori_post}}</router-link>
					</p>
					<hr />
					<ImgListGalleryAlbum v-if="data.id_gallery_album > 0" :id_gallery_album="data.id_gallery_album" />  
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