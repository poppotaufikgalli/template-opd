<script>
	export default {
		mounted(){
			let gpr = document.createElement('script')
			gpr.setAttribute('src', 'https://widget.kominfo.go.id/gpr-widget-kominfo.min.js')
			document.head.appendChild(gpr)
		},
	}
</script>
<template>
	<div class="mb-4">
		<div class="list-template-opd surface">
			<div class="list-header my-2">
				<h3 class="list-title">
					<span>GPR Kominfo</span>
				</h3>
			</div>
			<div id="gpr-kominfo-widget-header"></div>  
			<div id="gpr-kominfo-widget-body"></div>   
			<div id="gpr-kominfo-widget-footer"></div>
		</div>
	</div>
</template>
<style>
	#gpr-kominfo-widget-body li.gpr-kominfo-widget-list-item a{
		font-size: small!important;
	}
	#gpr-kominfo-widget-body li{
		line-height: 90%!important;
	}
</style>