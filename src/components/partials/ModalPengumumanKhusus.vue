<script>
	import Modal from 'bootstrap/js/dist/modal';
	import { getEnv, makeJudul } from '@/composables/myfunc';
	import { useCounterStore } from '@/stores/counter'
	
	export default {
		props: {
			data : {
				type: Object,
				default: () => {},
			},
		},
		data: () => ({
			modal: null,
			modalContainer: null,
			env: getEnv(),
			showModal: false,
		}),
		methods : {
			goto(id, str){
				this.modal.hide();
				this.$router.push({
					path: '/pengumuman/'+makeJudul(str), 
					query: {
						id: id, 
					}
				});
			},
			closeModal(){
				//console.log(this.modal)
				this.store.setModal()
			},
			resetModal(){
				setTimeout(() => {
					this.store.setModalA()
				}, 50000);
			}
		},
		mounted(){
			//this.store.$reset()
			this.modalContainer = document.getElementById('modalPengumumanKhusus')
			this.modal = new Modal(this.modalContainer)
			//console.log(this.store)
			
			this.modalContainer.addEventListener('hidden.bs.modal', this.closeModal)

			setTimeout(() => {
				if(this.store.getModal == true){
					this.modal.show()	
				}else{
					this.resetModal()	
				}
			}, 10000);
		},
		setup(){
			const store = useCounterStore()
			return{
				store,
			}
		},
	}
</script>
<template>
	<!-- Modal -->
	<div>
		<div class="modal fade" id="modalPengumumanKhusus" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
			<div class="modal-dialog modal-lg modal-dialog-centered">
				<div class="modal-content">
					<div class="modal-body list-template-opd surface">
						<div class="list-header my-2">
							<h3 class="list-title">
								<span>Pengumuman Khusus</span>
								<button type="button" class="btn-close float-end" data-bs-dismiss="modal" aria-label="Close"></button>
							</h3>
						</div>
						<div id="carouselPengumumanKhusus" class="carousel slide" data-bs-ride="carousel">
							<div class="carousel-indicators">
								<template v-if="data">
									<button v-for="(item, key) in data" :key="key" type="button" data-bs-target="#carouselPengumumanKhusus" :data-bs-slide-to="key" class="active" aria-current="true" :aria-label="item"></button>
								</template>
							</div>
							<div class="carousel-inner rounded">
								<template v-if="data">
									<div v-for="(item, key) in data" :key="key" class="carousel-item" :class="{active : key == 0}">
										<img :src="env.imgUrl+'posting/pengumuman/'+env.kunker+'/'+ item.gambar_khusus" class="d-block w-100" :alt="item.judul_pengumuman" >
										<div class="carousel-caption d-none d-md-block bg-dark bg-opacity-50">
											<div class="d-flex align-items-start flex-column px-3">
												<div class="d-flex justify-content-between">
													<h5>{{item.judul_pengumuman}}</h5>
													<a @click="goto(item.id, item.judul_pengumuman)" class="stretched-link "><i class="bi bi-back"></i></a>
												</div>
												<span class="small">{{item.nunker}}</span>
												<span class="small">{{item.tanggal_terbit}}</span>
											</div>
										</div>
									</div>  
								</template>
							</div>
							<button class="carousel-control-prev" type="button" data-bs-target="#carouselPengumumanKhusus" data-bs-slide="prev">
								<span class="carousel-control-prev-icon" aria-hidden="true"></span>
								<span class="visually-hidden">Previous</span>
							</button>
							<button class="carousel-control-next" type="button" data-bs-target="#carouselPengumumanKhusus" data-bs-slide="next">
								<span class="carousel-control-next-icon" aria-hidden="true"></span>
								<span class="visually-hidden">Next</span>
							</button>
						</div>	
					</div>
				</div>
			</div>
		</div>
	</div>
</template>