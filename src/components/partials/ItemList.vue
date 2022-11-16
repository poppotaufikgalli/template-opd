<script>
	import { cleanTextP, beautifyDate1, getEnv, makeJudul } from '@/composables/myfunc';
	
	export default {
		props: {
			data: [],
		},
		methods: {
			cleanTextP(strInputCode){
				return cleanTextP(strInputCode);
			},
			beautifyDate(strDate){
				return beautifyDate1(strDate)
			},
			makeJudul(judul){
				return makeJudul(judul)
			},
		},
		data(){
			return {
				env: getEnv(),
			}
		}
	}
	
</script>
<template>
	<template v-for="item in data" :key="item.id_post">
		<article class="blog-post blog-post-list border-bottom py-4 overflow-hidden">
			<h4 class="blog-post-title">{{ (item.post_judul).toUpperCase() }}</h4>
			<p class="blog-post-meta small">
				<i class="bi bi-calendar-fill"></i> {{ beautifyDate(item.tgl_terbit) }}  |  
				<i class="bi bi-pen-fill"></i> Oleh <a href="{{ route('post', ['post_id' => item.post_id])}}">{{item.post_user}}</a>  |  
				<i class="bi bi-eye-fill"></i> Dilihat : {{item.jum_klik}}
			</p>
			<template v-if="item.post_gambar">
				<img 
					:src="env.imgUrl+'posting/berita/'+env.kunker+'/original/'+ item.post_gambar" 
					class="col-md-6" 
					:alt="item.post_judul"
					style="max-height: 250px; object-fit: cover;" 
				>	
			</template>
			<span v-html="cleanTextP(item.post_isi)" class="small truncate-text l-10"></span>
			<router-link :to="{path : '/berita/'+makeJudul(item.post_judul), query : {id: item.id_post} }" class="small">Lanjutkan Membaca</router-link>   
		</article>
	</template>
</template>