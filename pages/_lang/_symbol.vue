<template>
	<div class="chart" v-bind:class="up" ref="graphWrap">

		<button v-on:click="onClose()" class="ff_close">
			<svg  viewBox="0 0 48 48">
				<circle cx="24" cy="24" r="18" fill="#FFFFFF" fill-rule="evenodd"></circle>
				<polygon class="stroked" points="19 19.8 23.2 24.0000063 19 28.2 19.8 29 24 24.8 28.2 29 29 28.2 24.8 24.0000063 29 19.8 28.2 19 24 23.2 19.8 19" />

			</svg>
		</button>

		<div class="coin_details">
			<div class="coin_detail">
				<label>{{ coin.coin_name }}</label>
				<div class="top_detail symbol">{{ coin.symbol }}</div>
				<div v-if="coin.part" class="bottom_detail">{{ formatPercent(coin.part ) }}%</div>
			</div>
			<div class="coin_detail">
				<label>{{ $t('coin.price') }}</label>
				<div class="top_detail">${{ formatPrice(coin.coin_price) }}</div>
				<div class="bottom_detail">{{ formatPercent(coin.price_percent_change ) }}%</div>
			</div>
			<div class="coin_detail">
				<label @mousemove="mouseover('volume')"  @mouseleave="clearInfo">
					<span>{{ $t('coin.volume') }}</span>
					<svg width="14px" height="14px" viewBox="0 0 14 14">
						<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
							<g transform="translate(-1119.000000, -60.000000)" fill="#000000">
								<g transform="translate(0.000000, 48.000000)">
									<path d="M1126,26 C1122.13401,26 1119,22.8659932 1119,19 C1119,15.1340068 1122.13401,12 1126,12 C1129.86599,12 1133,15.1340068 1133,19 C1133,22.8659932 1129.86599,26 1126,26 Z M1125.0111,20.9153226 L1126.71587,20.9153226 L1126.74251,20.5053763 C1126.79134,20.066306 1126.98446,19.6832454 1127.32186,19.3561828 L1127.86127,18.8387097 C1128.28302,18.4265212 1128.57825,18.051301 1128.74695,17.7130376 C1128.91565,17.3747743 1129,17.0152349 1129,16.6344086 C1129,15.7965908 1128.74029,15.1480758 1128.22087,14.6888441 C1127.70144,14.2296124 1126.97115,14 1126.02997,14 C1125.09766,14 1124.36182,14.2419331 1123.82242,14.7258065 C1123.28302,15.2096798 1123.00888,15.879476 1123,16.7352151 L1124.93119,16.7352151 C1124.94007,16.3767903 1125.04328,16.0956551 1125.24084,15.8918011 C1125.4384,15.687947 1125.70144,15.5860215 1126.02997,15.5860215 C1126.72253,15.5860215 1127.06881,15.9646019 1127.06881,16.7217742 C1127.06881,16.9726715 1127.00222,17.2112444 1126.86903,17.4375 C1126.73585,17.6637556 1126.46837,17.9572115 1126.06659,18.3178763 C1125.66481,18.6785412 1125.38846,19.044801 1125.23751,19.4166667 C1125.08657,19.7885323 1125.0111,20.2880793 1125.0111,20.9153226 Z M1124.81798,22.9784946 C1124.81798,23.274195 1124.91676,23.5183682 1125.11432,23.7110215 C1125.31188,23.9036748 1125.5727,24 1125.89678,24 C1126.22087,24 1126.48169,23.9036748 1126.67925,23.7110215 C1126.8768,23.5183682 1126.97558,23.274195 1126.97558,22.9784946 C1126.97558,22.6783139 1126.87458,22.4307805 1126.67259,22.2358871 C1126.47059,22.0409936 1126.21199,21.9435484 1125.89678,21.9435484 C1125.58157,21.9435484 1125.32298,22.0409936 1125.12098,22.2358871 C1124.91898,22.4307805 1124.81798,22.6783139 1124.81798,22.9784946 Z" />
								</g>
							</g>
						</g>
					</svg>
					<div class="info_text" v-bind:class="{ 'info_active': showInfo.volume }">
						{{ $t('coin_info.volume') }}
					</div>
				</label>
				<div v-if="coin.amount_total" class="top_detail">{{ collapseSum(coin.amount_total) }} {{ coin.symbol }}</div>
				<div v-if="coin.amount_total_usdt" class="bottom_detail">${{ collapseSum(coin.amount_total_usdt) }}</div>
			</div>
			<div class="coin_detail">
				<label @mousemove="mouseover('part')"  @mouseleave="clearInfo">
					<span>{{ $t('coin.part') }}</span>
					<svg width="14px" height="14px" viewBox="0 0 14 14">
						<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
							<g transform="translate(-1119.000000, -60.000000)" fill="#000000">
								<g transform="translate(0.000000, 48.000000)">
									<path d="M1126,26 C1122.13401,26 1119,22.8659932 1119,19 C1119,15.1340068 1122.13401,12 1126,12 C1129.86599,12 1133,15.1340068 1133,19 C1133,22.8659932 1129.86599,26 1126,26 Z M1125.0111,20.9153226 L1126.71587,20.9153226 L1126.74251,20.5053763 C1126.79134,20.066306 1126.98446,19.6832454 1127.32186,19.3561828 L1127.86127,18.8387097 C1128.28302,18.4265212 1128.57825,18.051301 1128.74695,17.7130376 C1128.91565,17.3747743 1129,17.0152349 1129,16.6344086 C1129,15.7965908 1128.74029,15.1480758 1128.22087,14.6888441 C1127.70144,14.2296124 1126.97115,14 1126.02997,14 C1125.09766,14 1124.36182,14.2419331 1123.82242,14.7258065 C1123.28302,15.2096798 1123.00888,15.879476 1123,16.7352151 L1124.93119,16.7352151 C1124.94007,16.3767903 1125.04328,16.0956551 1125.24084,15.8918011 C1125.4384,15.687947 1125.70144,15.5860215 1126.02997,15.5860215 C1126.72253,15.5860215 1127.06881,15.9646019 1127.06881,16.7217742 C1127.06881,16.9726715 1127.00222,17.2112444 1126.86903,17.4375 C1126.73585,17.6637556 1126.46837,17.9572115 1126.06659,18.3178763 C1125.66481,18.6785412 1125.38846,19.044801 1125.23751,19.4166667 C1125.08657,19.7885323 1125.0111,20.2880793 1125.0111,20.9153226 Z M1124.81798,22.9784946 C1124.81798,23.274195 1124.91676,23.5183682 1125.11432,23.7110215 C1125.31188,23.9036748 1125.5727,24 1125.89678,24 C1126.22087,24 1126.48169,23.9036748 1126.67925,23.7110215 C1126.8768,23.5183682 1126.97558,23.274195 1126.97558,22.9784946 C1126.97558,22.6783139 1126.87458,22.4307805 1126.67259,22.2358871 C1126.47059,22.0409936 1126.21199,21.9435484 1125.89678,21.9435484 C1125.58157,21.9435484 1125.32298,22.0409936 1125.12098,22.2358871 C1124.91898,22.4307805 1124.81798,22.6783139 1124.81798,22.9784946 Z" />
								</g>
							</g>
						</g>
					</svg>
					<div class="info_text" v-bind:class="{ 'info_active': showInfo.part }">
						{{ $t('coin_info.part') }}
					</div>
				</label>
				<div v-if="coin.part" class="top_detail">{{ formatPercent(coin.part ) }}%</div>
				<div v-if="coin.part_change" class="bottom_detail">{{ formatPercent(coin.part_change ) }}%</div>
			</div>
			<div class="coin_detail">
				<label @mousemove="mouseover('actuality')" @mouseleave="clearInfo">
					<span>{{ $t('coin.actuality') }}</span>
					<svg width="14px" height="14px" viewBox="0 0 14 14">
						<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
							<g transform="translate(-1119.000000, -60.000000)" fill="#000000">
								<g transform="translate(0.000000, 48.000000)">
									<path d="M1126,26 C1122.13401,26 1119,22.8659932 1119,19 C1119,15.1340068 1122.13401,12 1126,12 C1129.86599,12 1133,15.1340068 1133,19 C1133,22.8659932 1129.86599,26 1126,26 Z M1125.0111,20.9153226 L1126.71587,20.9153226 L1126.74251,20.5053763 C1126.79134,20.066306 1126.98446,19.6832454 1127.32186,19.3561828 L1127.86127,18.8387097 C1128.28302,18.4265212 1128.57825,18.051301 1128.74695,17.7130376 C1128.91565,17.3747743 1129,17.0152349 1129,16.6344086 C1129,15.7965908 1128.74029,15.1480758 1128.22087,14.6888441 C1127.70144,14.2296124 1126.97115,14 1126.02997,14 C1125.09766,14 1124.36182,14.2419331 1123.82242,14.7258065 C1123.28302,15.2096798 1123.00888,15.879476 1123,16.7352151 L1124.93119,16.7352151 C1124.94007,16.3767903 1125.04328,16.0956551 1125.24084,15.8918011 C1125.4384,15.687947 1125.70144,15.5860215 1126.02997,15.5860215 C1126.72253,15.5860215 1127.06881,15.9646019 1127.06881,16.7217742 C1127.06881,16.9726715 1127.00222,17.2112444 1126.86903,17.4375 C1126.73585,17.6637556 1126.46837,17.9572115 1126.06659,18.3178763 C1125.66481,18.6785412 1125.38846,19.044801 1125.23751,19.4166667 C1125.08657,19.7885323 1125.0111,20.2880793 1125.0111,20.9153226 Z M1124.81798,22.9784946 C1124.81798,23.274195 1124.91676,23.5183682 1125.11432,23.7110215 C1125.31188,23.9036748 1125.5727,24 1125.89678,24 C1126.22087,24 1126.48169,23.9036748 1126.67925,23.7110215 C1126.8768,23.5183682 1126.97558,23.274195 1126.97558,22.9784946 C1126.97558,22.6783139 1126.87458,22.4307805 1126.67259,22.2358871 C1126.47059,22.0409936 1126.21199,21.9435484 1125.89678,21.9435484 C1125.58157,21.9435484 1125.32298,22.0409936 1125.12098,22.2358871 C1124.91898,22.4307805 1124.81798,22.6783139 1124.81798,22.9784946 Z" />
								</g>
							</g>
						</g>
					</svg>
					<div class="info_text" v-bind:class="{ 'info_active': showInfo.actuality }">
						{{ $t('coin_info.actuality') }}
						<p v-if="$auth.loggedIn !== true" >* {{ $t('coin_info.actuality_reg') }}</p>
					</div>
				</label>
				<div v-if="coin.updated_at" class="top_detail">{{ formatDate(coin.updated_at) }}</div>
				<div v-if="coin.updated_at" class="bottom_detail">
					<timeago :since="coin.updated_at" class="time-ago"></timeago> назад
				</div>
			</div>
		</div>

		<svg class="graph" ref="graphBox">
			<defs>
				<linearGradient id="GradientPrice" x1="0" x2="0" y1="0" y2="5">
					<stop offset="0%" stop-color="#000"/>
					<stop offset="15%" stop-color="#000" stop-opacity="0"/>
				</linearGradient>
				<linearGradient id="GradientPart" x1="0" x2="0" y1="0" y2="5">
					<stop offset="0%" stop-color="#fff"/>
					<stop offset="15%" stop-color="#fff" stop-opacity="0"/>
				</linearGradient>
			</defs>

			<Graph :symbol="upSymbol" :interactive="true" v-on:testtest="onSelect" v-on:hide-tooltip="onHideTooltip" />

			<svg viewBox="0 0 200 100" v-bind="tooltip()">
				<rect class="tooltip" width="203" y="-3" x=-2 height="105" fill="#f2f2f2" />
				<rect class="tooltip" x="0" y="40" width="99" height="60" fill="#fff" />
				<rect class="tooltip" x="103" y="40" width="96" height="60" fill="#fff" />

				<text class="tooltip_date" x="12" y="26" fill="#000">
					{{ formatDateTime( tooltipPoint.date) }}
				</text>
				<text class="tooltip_label" x="12" y="60" fill="#000">
					{{ $t('coin.part_short') }}
				</text>
				<text class="tooltip_value" x="12" y="85" fill="#000">
					{{ formatPercent( tooltipPoint.part ) }}%
				</text>
				<text class="tooltip_label" x="113" y="60" fill="#000">
					{{ $t('coin.price') }}
				</text>
				<text class="tooltip_value" x="113" y="85" fill="#000">
					${{ formatPrice( tooltipPoint.price) }}
				</text>
			</svg>
		</svg>

	</div>
</template>

<script>
	import Jsona from 'jsona'
	import VueTimeago from 'vue-timeago'
	import Vue from 'vue'
	import Graph from '~/components/Graph.vue'
	import { Common } from '~/mixins/common.js'

	import _ from 'lodash'

	const REQUEST_COIN = `/api/portfolios/free-coin/`
	const REQUEST_GRAPH = `/api/portfolios/coin-graph/` //BTC?interval=1D`

	const dataFormatter = new Jsona()

	export default {
		data() {
			return {
				tooltipPoint: {},
				showTooltip: false,
				showInfo: {
						volume: false, 
						part: false, 
						actuality: false
				},
				tooltipWidth: 200,
				tooltipHeight: 100,
			}
		},
		
		components: {
			Graph,
		},

		mixins: [ Common ],

		mounted() {
			if( this.$store.state.graphs[this.symbol] == undefined ) {
				this.retrieveGraph()
			}

			this.debounceTimer = _.debounce( function ( app, option ) {
					app.clearInfo()
					app.showInfo[option] = true
			}, 200 )

		},

		async asyncData ({ app, params, store }) {
			let coin = null
			let upSymbol = symbolToUppercase(params.symbol)

			try {
				let data = await app.$axios.get( requestCoin(upSymbol, store.state.filters) )
				coin = dataFormatter.deserialize( data.data )

				if( coin == undefined ) {
					coin = {
								coin_name: '',
								symbol: upSymbol, 
								coin_price: null,
								price_percent_change: null,
								part: null, 
								amount_total: null, 
								amount_total_usdt: null, 
								part_change: null,
							}
				}

			} catch (e) {
				console.log(e)
			}

			return {
				coin: coin,
				upSymbol: upSymbol,
			}
		},

		computed: {
			tooltipViewBox() {
				return `0 0 ${this.tooltipWidth} ${this.tooltipHeight}`
			},
		},

		methods: {

			onClose () {
				this.$router.push({ name: 'index' })
			},

			async retrieveCoin () {
				try {
					const data = await this.$axios.get(requestCoin( this.upSymbol, this.$store.state.filters ))
					let coinName = this.coin.coin_name
					let coinPrice = this.coin.coin_price
					let coinPriceChange = this.coin.price_percent_change
					this.coin = dataFormatter.deserialize( data.data )
					if( this.coin == undefined ) {
						this.coin = {
									coin_name: coinName,
									symbol: this.upSymbol, 
									coin_price: coinPrice,
									price_percent_change: coinPriceChange,
									part: null, 
									amount_total: null, 
									amount_total_usdt: null, 
									part_change: null,
								}
					}
				} catch( e ) {
					if( e.response && e.response.status == 403 ) {
						this.$toast.show(this.$t('account.permission_denied'), {
							duration: null,
							action : {
								text : 'Ok',
								onClick : (e, toastObject) => {
									toastObject.goAway(0)
								}
							},
						})
					}
					console.error(e)
				}
			},

			async retrieveGraph () {

				var nodes = []

				try {
					const data = await this.$axios.get(requestGraph( this.upSymbol, this.$store.state.filters ))
					this.$store.commit( 'SET_GRAPH', {symbol: this.upSymbol, data: data.data[this.upSymbol]} )
				} catch(error) {
					console.error(error)
				}
			},

			onSelect( position ) {
				this.showTooltip = true
				this.tooltipPoint = position
			},

			onHideTooltip( hide ) {
				this.showTooltip = false
			},

			tooltip() {
				return { 
					'x': this.tooltipPoint.offsetX ? this.tooltipPoint.offsetX + this.tooltipPosition().x : 0,
					'y': this.tooltipPoint.offsetY ? this.tooltipPoint.offsetY + this.tooltipPosition().y : 0,
					'width': 201,
					'height': 104,
					'fill': '#f2f2f2',
					'visibility': this.showTooltip ? 'visibile' : 'hidden',
				}
			},

			tooltipPosition() {
				let height = this.$refs.graphBox.getBoundingClientRect().height
				let offsetY = height - this.tooltipPoint.offsetY - this.tooltipHeight + 40

				return {
					x: this.tooltipPoint.offsetX - this.tooltipWidth > 0 ?  -this.tooltipWidth - 20 : 20,
					y: offsetY > 0 ?  -60 : -60 + offsetY,
				}
			},

			mouseover( option ) {
				if( this.showInfo[option] ) {
					return
				}
				this.debounceTimer(this, option)
			},

			clearInfo() {
				this.debounceTimer.cancel()
				this.showInfo.volume = false
				this.showInfo.part = false
				this.showInfo.actuality = false
			},
		},

		computed: {
			up() {
				// let fill = coin.data.delta > 0 ? '#7DB312' : '#D95757'
				// let delta = coin.data.delta > 0 ? coin.data.delta : -coin.data.delta
				// let fillOpacity = 1

			 	// 	if( delta < 1 ) {
			 	// 		fillOpacity = 0.75 + delta / 4
			 	// 	}

				return { 'up' : (this.coin && this.coin.part_change) >= 0 }
			},
		},

		watch: {
			'$store.state.filters': {
				handler: _.debounce( async function ( newValue ) {
					await Promise.all([this.retrieveCoin(), this.retrieveGraph()])
					this.$store.commit( 'TERMINATE_FILTER_LOADING' )
				}, 100 ),
				deep: true
			},
			// '$store.state.filters.period': {
			// 	handler: _.debounce( function ( newValue ) {
			// 		this.retrieveGraph()
			// 	}, 100 ),
			// 	deep: true
			// }
		},

	}

	function symbolToUppercase( value ) {
		if( value ) {
			return value.toUpperCase()
		} else {
			return null
		}
	}

	function requestCoin( symbol, filters ) {
		let filterQuery = 
					( filters.cap ? '?cap=' + filters.cap : '' ) + 
					( filters.period ? '&period=' + filters.period : '' ) +
					( filters.profit ? '&profit=' + filters.profit : '' ) 
		return REQUEST_COIN + symbol +  filterQuery
	}

	function requestGraph( symbol, filters ) {
		let filterQuery = 
					( filters.cap ? '?cap=' + filters.cap : '' ) + 
					( filters.period ? '&period=' + filters.period : '' ) +
					( filters.profit ? '&profit=' + filters.profit : '' )
		return REQUEST_GRAPH + symbol +  filterQuery
	}

	Vue.use(VueTimeago, {
		name: 'timeago',
		locale: 'ru-RU',
		locales: {
			// you will need json-loader in webpack 1
			'ru-RU': require('assets/locales/ru-RU.json')
		}
	})



</script>