export const state = () => ({
	locales: ['en', 'ru'],
	locale: 'ru',
	filters: {cap: 'all', period: '1d', profit: 'all'},
	graphs: {},
	graphsUniq: {},
	filterLoading: false,
	profile: {},
})

export const mutations = {
	SET_LANG(state, locale) {
		if (state.locales.indexOf(locale) !== -1) {
			state.locale = locale
		}
	},

	SET_FILTER: function (state, filter) {
		if( filter.value != state.filters[filter.type] ) {
			state.filterLoading = true
		}
		state.filters[filter.type] = filter.value
	},

	SET_GRAPHS: function (state, graphs) {
		state.graphs = graphs
	},	

	SET_GRAPHS_UNIQ: function (state, graphs) {
		state.graphsUniq = graphs
	},

	SET_GRAPH_DINAMIC: function (state, graph) {
		state.graphDinamic = graph
	},

	SET_GRAPH: function (state, graph) {
		state.graphs = {}
		state.graphs[graph.symbol] = graph.data
	},

	SET_PROFILE: function (state, profile) {
		state.profile.tradersCount  = profile.traders_count
		state.profile.capital       = profile.capital
		state.profile.updatedAt 	= profile.updated_at
	},

	TERMINATE_FILTER_LOADING: function (state ) {
		state.filterLoading = false
	},

}