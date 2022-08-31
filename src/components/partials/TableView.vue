<script>
	export default {
		props: {
			data : {
				type: Object,
				default: () => {},
			},
		},
		methods: {
			selectedPagging(page){
				this.selectPagging = page
				//this.selectPagging = this.selectPagging *page
				//this.from = parseInt(this.from) + parseInt(this.selectTampil)
				this.from = (parseInt(this.selectTampil) * (page-1))
				console.log(this.from)
			},
			nextPagging() {
				let max = this.data.length / this.selectTampil;
				if(this.selectPagging >= max){
					this.selectPagging;
				}else{
					this.selectPagging = this.selectPagging +1
					this.from = parseInt(this.from) + parseInt(this.selectTampil)
				}
			},
			prevPagging() {
				if(this.selectPagging == 1){
					this.selectPagging;
				}else{
					this.selectPagging = this.selectPagging -1
					this.from = parseInt(this.from) - parseInt(this.selectTampil)
				}
			},
			trimRoute(namedRoute) {
				return namedRoute.replace(/\s+/g,'_').toLowerCase()
			},
			downloadFile(filename) {
				window.open(this.base_url+'api/getDownloadArea/'+this.kunker+'/'+filename)
			},
		},
		computed: {
			searchData(){
				return this.data.slice(this.from, (this.from + this.selectTampil))
					.filter(
						(entry) => this.data.length
							? Object.keys(this.data[0])
								.some(
									key => 
										('' + entry[key]).toLowerCase().includes(this.textCari.toLowerCase())
								)
							: true
					);
			},
			maxTampil(){
				if(this.selectTampil >= this.data.length){
					return this.data.length
				}
				return this.selectTampil;
			},
			lsPagging(){
				return this.data.length / this.selectTampil
			},
		},
		setup(){
			const base_url = process.env.VUE_APP_API_URL;
			const kunker = process.env.VUE_APP_OPD_ID;
			return{
				base_url,
				kunker,
			}
		},
		data() {
			return {
				selectTampil: 5,
				selectPagging: 1,
				textCari: '',
				jmlData : this.data.length,
				from : 0,
				to : this.selectTampil,
			}
		},
	}
</script>
<template>
	<div class="d-flex justify-content-between align-items-center mb-2">
		<div class="row g-3 align-items-center">
			<div class="col-auto">
				<label for="selectTampil" class="col-form-label col-form-label-sm">Tampil</label>
			</div>
			<div class="col-auto">
				<select id="selectTampil" v-model="selectTampil" class="form-select form-select-sm">
					<option value="5">5</option>
					<option value="10">10</option>
					<option value="50">50</option>
					<option value="100">100</option>
				</select>
			</div>
			<div class="col-auto">
				<label for="paggingSelect" class="col-form-label col-form-label-sm">Data</label>
			</div>
		</div>
		<div class="row g-3 align-items-center">
			<div class="col-auto">
				<label for="textCari" class="col-form-label col-form-label-sm">Cari</label>
			</div>
			<div class="col-auto">
				<input type="search" id="textCari" v-model="textCari" class="form-control form-control-sm" aria-describedby="textCari">
			</div>
		</div>
	</div>
	<table class="table table-striped table-sm small">
		<thead class="table-dark">
			<tr>
				<th class="text-center">#</th>
				<th class="text-center" width="35%">Nama File</th>
				<th class="text-center">Deskripsi</th>
				<th class="text-center">Download</th>
			</tr>
		</thead>
		<tbody>
			<template v-if="data.length > 0">
				<tr v-for="(item, key) in searchData" :key="item.id">
					<td class="text-center">{{key + from +1}}</td>
					<td>{{item.nama_file}}<br><span class="blog-post-meta badge info-post small m-1 px-0">[{{item.kat_dip}}] {{item.kategori_dip}}</span></td>
					<td>{{item.deskripsi_file}}</td>
					<td>
						<div class="d-flex justify-content-center align-items-center gap-2">
							<router-link class="btn btn-sm btn-success" :to="{ path: '/download/'+trimRoute(item.nama_file), query: { id: item.id, nama_file: trimRoute(item.nama_file) }}"><i class="bi bi-eye"></i></router-link>    
							<a @click="downloadFile(item.guid)" class="btn btn-sm btn-primary" target="_blank" download><i class="bi bi-cloud-download"></i></a>
						</div>
					</td>
				</tr>	
			</template>
			<template v-else>
				<tr>
					<td colspan="4" class="text-center">...Data belum tersedia...</td>
				</tr>
			</template>
			
		</tbody>
	</table>
	<nav v-if="data.length > 0" class="d-flex justify-content-center align-items-center" aria-label="Pagination">
		<button @click="prevPagging" class="btn btn-sm btn-outline" :disabled="isDisabledNext">Sebelumnya</button>
		<div class="btn-group">
			<template  v-for="item in lsPagging" :key="item">
				<button @click="selectedPagging(item)" :class="selectPagging === item ? 'btn btn-sm btn-secondary':'btn btn-sm btn-outline-secondary'">{{item}}</button>
			</template>
		</div>
		<button @click="nextPagging" class="btn btn-sm btn-outline" :disabled="isDisabledPrev">Selanjutnya</button>
	</nav>
</template>