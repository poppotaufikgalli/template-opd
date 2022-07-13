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
			}
		},
		mounted(){
			console.log(this.data)
		},
		data(){
			return {
				env: getEnv()
			}
		}
	}
	
</script>
<template>
	<template v-for="item in data" :key="item.id_post">
		<article class="blog-post blog-post-list border-bottom rounded overflow-hidden p-1 mb-2">
			<router-link :to="{path : '/post/'+makeJudul(item.post_judul), query : {id: item.id} }" class="stretched-link small">{{ (item.post_judul).toUpperCase() }}</router-link>  
			<p class="blog-post-meta small">
				{{ beautifyDate(item.tgl_terbit) }} | 
				<i class="bi bi-stack"></i> Kategori : {{item.kategori_post}}  |  <i class="bi bi-tags-fill"></i> Tags : {{item.tags}}
			</p>
		</article>
	</template>
</template>