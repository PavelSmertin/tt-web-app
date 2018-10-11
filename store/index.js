export const state = () => ({
	locales: ['en', 'ru'],
	locale: 'ru',
	filters: {cap: 'all', period: '1m', profit: 'all'},
})

export const mutations = {
	SET_LANG(state, locale) {
		if (state.locales.indexOf(locale) !== -1) {
			state.locale = locale
		}
	},


	SET_FILTER: function (state, filter) {
		state.filters[filter.type] = filter.value
	},




}