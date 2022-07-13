import Vue from 'vue'; // <-- important for template components to work

Vue.component('html-fragment', {
	functional: true,
	props: ['html'],
	render(h, ctx) {
		const nodes = new Vue({
			beforeCreate() { this.$createElement = h }, // not necessary, but cleaner imho
			template: `<div>${ctx.props.html}</div>`
		}).$mount()._vnode.children
		return nodes
	}
})