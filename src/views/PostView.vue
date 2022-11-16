<script>
	import LoadingPostView from '@/views/LoadingPostView';
	import { getData } from '@/composables/Api';
	import LinkTags from '@/components/partials/LinkTags';
	import { cleanTextP, beautifyDate1, getEnv } from '@/composables/myfunc';

	export default {
		data() {
			return {
				page : '',
				loading: false,
				item: null,
				error: null,
				env: getEnv(),
			}
		},
		components:{
			LoadingPostView,
			LinkTags,
		},
		created() {
			this.page = this.$route.query.page,
			// watch the params of the route to fetch the data again
			this.$watch(
				() => this.$route.query.id,
				() => {
					this.fetchData()
				},
				// fetch the data when the view is created and the data is
				// already being observed
				{ immediate: true }
			)
		},
		methods: {
			cleanTextP(strInputCode){
				return cleanTextP(strInputCode);
			},
			beautifyDate(strDate){
				return beautifyDate1(strDate)
			},
			async fetchData() {
				this.error = this.item = null
				this.loading = true
				// replace `getPost` with your data fetching util / API wrapper
				//let response = [];
				try{
					let response = await getData('berita', 'id', this.$route.query.id);  
					//console.log(response.data)
					this.item = response.data.berita
				} catch(err){
					this.error = err.toString()
				}

				await this.$nextTick()
				this.loading = false;
			},
		},
	}
</script>
<template>
	<div class="row g-5">
		<div class="col-md-8">
			<div v-if="error" class="alert alert-danger d-flex align-items-center" role="alert">
				<i class="bi bi-exclamation-triangle-fill"></i><div>&nbsp;Error : {{ error }}</div>
			</div>

			<article v-if="item" class="blog-post blog-post-list surface overflow-hidden mb-4">
				<h3 class="blog-post-title">{{ (item.post_judul).toUpperCase() }}</h3>
				<p class="blog-post-meta badge info-post small">
					<i class="bi bi-calendar-fill"></i> {{ beautifyDate(item.tgl_terbit) }}  |  
					<i class="bi bi-pen-fill"></i> Oleh <a href="{{ route('post', ['post_id' => item.post_id])}}">{{item.post_user}}</a>  |  
					<i class="bi bi-eye-fill"></i> Dilihat : {{item.jum_klik}}
				</p>
				<template v-if="item.post_gambar">
					<img 
						:src="env.imgUrl+'posting/'+(item.tipe_post == 'halaman' ? 'halaman' : 'berita')+'/'+env.kunker+'/original/'+ item.post_gambar" 
						class="col-md-8" 
						:alt="item.post_judul"
						
						ref="renderedImg"
					>	
				</template>
				<span v-html="cleanTextP(item.post_isi)" class="small"></span>
				<p class="blog-post-meta badge info-post small">
					<i class="bi bi-stack"></i> Kategori : <router-link :to="{path : '/list/'+item.kategori_post, query: {type : 'kategori', page: 'halaman'}}">{{item.kategori_post}}</router-link>  |  
					<i class="bi bi-tags-fill"></i> Tags : <LinkTags :tags="item.tags" page="halaman" />
				</p>
			</article>
			<LoadingPostView v-else class="loading"></LoadingPostView>
		</div>
	</div>
</template>