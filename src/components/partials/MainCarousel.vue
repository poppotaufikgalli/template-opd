<script>
	import { getEnv, beautifyDate1, beautifyDate2, makeJudul } from '@/composables/myfunc';

	export default {
		props : {
			banner: {
				type: Array,
				default: () => {},
			},
			pengumuman: {
				type: Object,
				default: () => {},
			},

			event: {
				type: Object,
				default: () => {},
			},
		},
		data() {
			return {
				env: getEnv(),
			}
		},
		methods: {
			beautifyDate1(strDate){
				return beautifyDate1(strDate)
			},
			beautifyDate2(strDate){
				return beautifyDate2(strDate)
			},
			makeJudul(judul){
				return makeJudul(judul)
			},
		}
	}
</script>
<template>
	<div id="carouselMainCarousel" class="carousel slide mb-4" data-bs-ride="carousel">
		<div class="carousel-indicators">
			<template v-if="banner">
				<button v-for="(item, key) in banner" :key="key" type="button" data-bs-target="#carouselMainCarousel" :data-bs-slide-to="key" class="active" aria-current="true" :aria-label="item"></button>
			</template>
		</div>
		<div class="carousel-inner rounded">
			<template v-if="banner">
				<div v-for="(item, key) in banner" :key="key" class="carousel-item" :class="{active : key == 1}" data-bs-interval="10000">
					<img :src="env.imgUrl+'banner/'+env.kunker+'/'+ item" class="d-block w-100" :alt="item">
				</div>  
			</template>
		</div>
		<button class="carousel-control-prev" type="button" data-bs-target="#carouselMainCarousel" data-bs-slide="prev">
			<span class="carousel-control-prev-icon" aria-hidden="true"></span>
			<span class="visually-hidden">Previous</span>
		</button>
		<button class="carousel-control-next" type="button" data-bs-target="#carouselMainCarousel" data-bs-slide="next">
			<span class="carousel-control-next-icon" aria-hidden="true"></span>
			<span class="visually-hidden">Next</span>
		</button>
	</div>
	<div class="row mb-2">
		<template v-if="pengumuman">
			<div class="col-md-6">
				<div class="row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
					<div class="col p-4 d-flex flex-column position-static">
						<strong class="d-inline-block mb-2 text-primary">Pengumuman Terbaru</strong>
						<h3 class="mb-0 truncate-text l-1">{{pengumuman.judul}}</h3>
						<div class="mb-1 text-muted">
							<span class="badge info-post"><i class="bi bi-calendar-fill"></i> {{ beautifyDate1(pengumuman.tgl_terbit)}}</span>
						</div>
						<p class="mb-auto">This is a wider card with supporting text below as a natural lead-in to additional content.</p>
						<router-link 
							:to="{path : '/pengumuman/'+makeJudul(pengumuman.judul), query: {id : pengumuman.id}}"
							class="stretched-link"
						>Lanjutkan Membaca</router-link>
					</div>
					<div class="col-auto d-none d-lg-block">
						<img 
							:src="env.imgUrl+'posting/pengumuman/'+env.kunker+'/'+ pengumuman.gambar" 
							class="img-fluid" style="max-height: 250px; object-fit: contain;" 
							:alt="pengumuman.judul"
						>	
					</div>
				</div>
			</div>
		</template>
		
		<div class="col-md-6">
			<template v-if="event">
				<div class="row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
					<div class="col p-4 d-flex flex-column position-static">
						<strong class="d-inline-block mb-2 text-success">Event Terbaru</strong>
						<h3 class="mb-0 truncate-text l-1">{{event.judul}}</h3>
						<div class="mb-1 text-muted">
							<span class="badge info-post"><i class="bi bi-calendar-fill"></i> {{ beautifyDate2(event.tgl_terbit) + (event.tgl_akhir != '0000-00-00' ? ' s/d ' + beautifyDate2(event.tgl_akhir) : '') }}</span>
						</div>
						<p class="mb-auto">This is a wider card with supporting text below as a natural lead-in to additional content.</p>
						<router-link 
							:to="{path : '/kalendareven/'+makeJudul(event.judul), query: {id : event.id}}"
							class="stretched-link"
						>Lanjutkan Membaca</router-link>
					</div>
					<div class="col-auto d-none d-lg-block">
						<img 
							:src="env.imgUrl+'posting/event/'+env.kunker+'/'+ event.gambar" 
							class="img-fluid" style="max-height: 250px; object-fit: contain;" 
							:alt="event.judul"
						>	
					</div>
				</div>
			</template>
		</div>
	</div>
</template>