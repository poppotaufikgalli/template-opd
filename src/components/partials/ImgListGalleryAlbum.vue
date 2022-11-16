<script>
	import { getGallery } from '@/composables/Api';
	import { getEnv, makeJudul } from '@/composables/myfunc';

	export default {
		props: {
			'id_gallery_album' : String,
		},
		async mounted() {
			console.log("A")
			if(this.id_gallery_album > 0){
				let response = await getGallery(this.id_gallery_album);
				//console.log(response.data)  
				this.lsGallery = response.data.gallery;
				this.isReady = true
			}
		},
		methods:{
			makeJudul(str){
				return makeJudul(str)
			}
		},
		data(){
			return {
				isReady : false,
				lsGallery : [],
				env : getEnv(),
			}
		}
	}
</script>
<template>
	<template v-if="isReady">
		<template v-if="lsGallery.length > 0" >
			<h5 class="fst-italic text-capitalize">Daftar Galeri</h5>
			<div class="row row-cols-1 row-cols-md-3 g-4">
				<div class="col" v-for="(item, key) in lsGallery" :key="key">
					<div class="position-relative text-bg-dark">
						<img v-if="item.vid_pic == 'P'"
							:src="env.imgUrl+'posting/galeri/'+env.kunker+'/thumb/thumb_'+ item.gambar" 
							class="card-img" style="height: 150px; object-fit: contain;" 
							@error="(() => item.gambar = null)"
						>	
						<router-link 
							:to="{path : '/gallery_item/'+makeJudul(item.judul_gallery), query: {id : item.id}}"
							class="stretched-link text-decoration-none link-light small"
						>
							<div class="position-absolute bottom-0 start-0 w-100">
								<div class="bg-primary bg-opacity-75 p-2 small">
									{{item.judul_gallery}}
									
								</div>
							</div>
						</router-link>
					</div>
				</div>
			</div>
		</template>
	</template>
	<div v-else class="loading">
		<div class="row g-2">
			<svg v-for="(item, key) in [0,1,2]" :key="key" height="220" class="col-4">
				<rect width="100%" height="100%" fill="#868e96"></rect>
			</svg>
		</div>
	</div>
</template>