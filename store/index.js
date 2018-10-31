export const state = () => ({
	locales: ['en', 'ru'],
	locale: 'ru',
	filters: {cap: 'all', period: '1d', profit: 'all'},
	graphs: {},
	filterLoading: false,
})

export const mutations = {
	SET_LANG(state, locale) {
		if (state.locales.indexOf(locale) !== -1) {
			state.locale = locale
		}
	},

	SET_FILTER: function (state, filter) {
		state.filters[filter.type] = filter.value
		state.filterLoading = true
	},

	SET_GRAPHS: function (state, graphs) {
		state.graphs = graphs
	},

	SET_GRAPH: function (state, graph) {
		state.graphs = {}
		state.graphs[graph.symbol] = graph.data
	},

	TERMINATE_FILTER_LOADING: function (state ) {
		state.filterLoading = false
	},

}