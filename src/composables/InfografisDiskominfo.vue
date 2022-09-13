<script>
	export default {
		mounted(){
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
			<div id="imgListContainer"></div>  
		</div>
	</div>
</template>
