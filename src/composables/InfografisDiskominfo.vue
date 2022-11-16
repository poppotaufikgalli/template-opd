<script>
	import { getData } from '@/composables/Api';
	import { getEnv, makeJudul } from '@/composables/myfunc';
	export default {
		data() {
			return {
				isReady: false,
				infografis_album:[],
				error: null,
				env: getEnv(),
			}
		},
		created(){
			this.fetchData()
		},
		mounted(){
			//get infografis OPD - album
			//this.fetchData();


			const infografisSrcript = document.getElementById('infografis-script');
			if(infografisSrcript){
				document.head.removeChild( infografisSrcript );
			}

			let infografis = document.createElement('script')
			infografis.setAttribute('id', 'infografis-script');
			infografis.setAttribute('src', 'https://widget.kominfo.tanjungpinangkota.go.id/infografis-3.js')

			//infografis.setAttribute('src', 'http://widget.gallikreatif.com/infografis-3.js')
			document.head.appendChild(infografis)	
		},
		methods:{
			async fetchData() {
				this.isReady = false;
				let lsData = [];
				//var id = router.query.id
				try{
					let response = await getData("infografis_album");  
					lsData = response.data.infografis_album;

					for (var i = lsData.length - 1; i >= 0; i--) {
						if(lsData[i].guid_gambar != null){
							this.infografis_album[i] = lsData[i]
						}
					}
					//this.infografis_album = response.data.infografis_album
					console.log(this.infografis_album)
				} catch(err){
					this.error = err.toString()
				}
				
				this.isReady = true;
			},
			trimRoute(namedRoute) {
				return namedRoute.replace(/\s+/g,'_').toLowerCase()
			},
			makeJudul(judul){
				return makeJudul(judul)
			},
		}
	}
</script>
<template>
	<div class="mb-4 d-none d-sm-block">
		<div class="list-template-opd surface">
			<div class="list-header my-2">
				<h3 class="list-title">
					<span>Infografis</span>
				</h3>
			</div>
			<div class="mb-4" v-if="isReady">
				<template v-if="infografis_album.length > 0">
					<div id="carouselInfografis" class="carousel carousel-dark slide" data-bs-ride="carousel">
						<div class="carousel-indicators">
							<template v-if="infografis_album.length >0">
								<button v-for="(item, key) in infografis_album" :key="key" type="button" data-bs-target="#carouselInfografis" :data-bs-slide-to="key" class="active" aria-current="true" style="width: 10px; height: 10px;"></button>
							</template>
						</div>
						<div class="carousel-inner">
							<template v-if="infografis_album.length >0">
								<router-link v-for="(item, key) in infografis_album" :key="key" class="carousel-item" :class="{active : key == 0}" :to="{path : '/infografis/'}" >
									<template v-if="item.guid_gambar">
										<img :src="env.imgUrl+'posting/infografis/'+env.kunker+'/small/small_'+ item.guid_gambar" :alt="item.guid_gambar" class="d-block w-100">
									</template>
								</router-link>  	
							</template>
						</div>
						<button class="carousel-control-prev" type="button" data-bs-target="#carouselInfografis" data-bs-slide="prev">
							<span class="carousel-control-prev-icon" aria-hidden="true"></span>
							<span class="visually-hidden">Previous</span>
						</button>
						<button class="carousel-control-next" type="button" data-bs-target="#carouselInfografis" data-bs-slide="next">
							<span class="carousel-control-next-icon" aria-hidden="true"></span>
							<span class="visually-hidden">Next</span>
						</button>
					</div>
				</template>
			</div>
			<div id="imgListContainer"></div>  
		</div>
	</div>
</template>
