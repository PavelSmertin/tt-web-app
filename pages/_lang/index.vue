<template>
	<treemap />
</template>

<script>
	import Treemap from '~/components/Treemap.vue'

	export default {
		
		components: {
			Treemap,
		},

		async fetch ({ app, store, params, route, isDev }) {
			let profile
			try {
				profile = await app.$axios.get(`/api/portfolios/profile`)
				store.commit('SET_PROFILE', profile.data)
			} catch( e ) {
				if( isDev ) {
					console.error(e)
				}
			}
		},
	}

</script>