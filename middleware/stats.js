export default async function ({ app, store, redirect, isDev }) {
	if( store.state.profile.updatedAt ) {
		return
	}

	let profile

	try {
		profile = await app.$axios.get(`/api/portfolios/profile`)
		store.commit('SET_PROFILE', profile.data)
	} catch (e) {
		if( isDev ) {
			console.error(e)
		}
	}
}