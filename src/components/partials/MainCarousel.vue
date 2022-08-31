<script>
	import { getEnv, beautifyDate1, beautifyDate2, makeJudul } from '@/composables/myfunc';

	export default {
		props : {
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
	<div class="row mb-2">
		<div v-if="pengumuman" :class="event ? 'col-md-6' : 'col-md-12'">
			<div class="card text-bg-dark">
				<img 
					:src="env.imgUrl+'posting/pengumuman/'+env.kunker+'/'+ pengumuman.gambar" 
					class="card-img" style="max-height: 250px; object-fit: cover;" 
					:alt="pengumuman.judul"
				>	
				<div class="card-img-overlay p-0">
					<div class="d-flex flex-column justify-content-between h-100">
						<strong class="d-inline-block text-primary p-1">Pengumuman Terbaru</strong>
						<div class="bg-primary bg-opacity-50 p-2 small">
							<h5>{{pengumuman.judul_pengumuman}}</h5>
							<p class="card-text small">{{pengumuman.tanggal_terbit}}</p>
							<router-link 
								:to="{path : '/pengumuman/'+makeJudul(pengumuman.judul), query: {id : pengumuman.id}}"
								class="stretched-link link-light small"
							>Lanjutkan Membaca</router-link>
						</div>
					</div>
				</div>
			</div>
		</div>
		
		<div v-if="event" :class="pengumuman ? 'col-md-6' : 'col-md-12'">
			<div class="card text-bg-dark">
				<img 
					:src="env.imgUrl+'posting/event/'+env.kunker+'/'+ event.gambar" 
					class="card-img" style="max-height: 250px; object-fit: cover;" 
					:alt="event.judul_kalender_event"
				>	
				<div class="card-img-overlay p-0">
					<div class="d-flex flex-column justify-content-between h-100">
						<strong class="d-inline-block text-success p-1">Event Terbaru</strong>
						<div class="bg-success bg-opacity-50 p-2 small">
							<h5>{{event.judul_kalender_event}}</h5>
							<p class="card-text small">{{event.tanggal_event_mulai}} {{ event.tanggal_event_akhir != null ? ' s/d ' + event.tanggal_event_akhir : '' }}</p>
							<router-link 
								:to="{path : '/event/'+makeJudul(event.judul_kalender_event), query: {id : event.id}}"
								class="stretched-link link-light small"
							>Lanjutkan Membaca</router-link>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>