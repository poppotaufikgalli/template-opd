<script>
	import { getGallery } from '@/composables/Api';
	import { getEnv } from '@/composables/myfunc';

	export default {
		props: {
			'id_gallery_album' : Number,
		},
		async mounted() {
			//console.log(this.id_gallery_album)
			if(this.id_gallery_album > 0){
				let response = await getGallery(this.id_gallery_album);
				//console.log(response)  
				this.lsGallery = response.data.gallery;
				this.isReady = true
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
			<h5 class="fst-italic text-capitalize">Galeri</h5>
			<div class="row row-cols-1 row-cols-md-3 g-3">
				<template v-for="(item, key) in lsGallery" :key="key">
					<div class="col">
						<div class="overflow-hidden text-white position-relative">
							<img v-if="item.vid_pic == 'P'"
								class="img-fluid"
								:src="env.imgUrl+'posting/galeri/'+env.kunker+'/'+ item.guid" 
								:alt="item.post_judul"
								style="max-height: 250px; object-fit: cover;" 
								@error="(() => item.guid = null)"
							>		
							<video v-if="item.vid_pic == 'V'" class="card-img-top">
								<source :src="env.imgUrl+'posting/galeri/'+env.kunker+'/'+ item.guid">
								Your browser does not support the video tag.
							</video>
							<div class="position-absolute bottom-0 start-0 px-2 py-1 bg-dark">
								<span class="small">{{item.judul_gallery}}</span>
							</div>
						</div>
					</div>	
				</template>
				
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