<template>

	<div class="portfolio_page" >

		<div class="portfolio_graph_wrap" ref="graphWrap">

			<div class="coin_details">
				<div class="coin_detail">
					<label>{{ $t('profile.capital') }}</label>
					<div class="top_detail symbol">${{ account.cap_usdt }}</div>
				</div>
				<div class="coin_detail">
					<label>{{ $t('profile.change_capital') }}</label>
					<div class="top_detail">{{ formatPrice(account.cap_change * 100) }}%</div>
				</div>
				<div class="coin_detail">
					<label>{{ $t('profile.lowest_capital') }}</label>
					<div class="top_detail">{{ formatPrice(account.max_down * 100) }}%</div>
				</div>
				<div class="coin_detail">
					<label>{{ $t('profile.change_price') }}</label>
					<div class="top_detail">{{ formatPrice(account.total_cap_change * 100) }}%</div>
				</div>
				<div class="coin_detail">
					<label @mousemove="mouseover('efficiency')" @mouseleave="clearInfo">
						<span>{{ $t('profile.efficiency') }}</span>
						<svg width="14px" height="14px" viewBox="0 0 14 14">
							<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
								<g transform="translate(-1119.000000, -60.000000)" fill="#000000">
									<g transform="translate(0.000000, 48.000000)">
										<path d="M1126,26 C1122.13401,26 1119,22.8659932 1119,19 C1119,15.1340068 1122.13401,12 1126,12 C1129.86599,12 1133,15.1340068 1133,19 C1133,22.8659932 1129.86599,26 1126,26 Z M1125.0111,20.9153226 L1126.71587,20.9153226 L1126.74251,20.5053763 C1126.79134,20.066306 1126.98446,19.6832454 1127.32186,19.3561828 L1127.86127,18.8387097 C1128.28302,18.4265212 1128.57825,18.051301 1128.74695,17.7130376 C1128.91565,17.3747743 1129,17.0152349 1129,16.6344086 C1129,15.7965908 1128.74029,15.1480758 1128.22087,14.6888441 C1127.70144,14.2296124 1126.97115,14 1126.02997,14 C1125.09766,14 1124.36182,14.2419331 1123.82242,14.7258065 C1123.28302,15.2096798 1123.00888,15.879476 1123,16.7352151 L1124.93119,16.7352151 C1124.94007,16.3767903 1125.04328,16.0956551 1125.24084,15.8918011 C1125.4384,15.687947 1125.70144,15.5860215 1126.02997,15.5860215 C1126.72253,15.5860215 1127.06881,15.9646019 1127.06881,16.7217742 C1127.06881,16.9726715 1127.00222,17.2112444 1126.86903,17.4375 C1126.73585,17.6637556 1126.46837,17.9572115 1126.06659,18.3178763 C1125.66481,18.6785412 1125.38846,19.044801 1125.23751,19.4166667 C1125.08657,19.7885323 1125.0111,20.2880793 1125.0111,20.9153226 Z M1124.81798,22.9784946 C1124.81798,23.274195 1124.91676,23.5183682 1125.11432,23.7110215 C1125.31188,23.9036748 1125.5727,24 1125.89678,24 C1126.22087,24 1126.48169,23.9036748 1126.67925,23.7110215 C1126.8768,23.5183682 1126.97558,23.274195 1126.97558,22.9784946 C1126.97558,22.6783139 1126.87458,22.4307805 1126.67259,22.2358871 C1126.47059,22.0409936 1126.21199,21.9435484 1125.89678,21.9435484 C1125.58157,21.9435484 1125.32298,22.0409936 1125.12098,22.2358871 C1124.91898,22.4307805 1124.81798,22.6783139 1124.81798,22.9784946 Z" />
									</g>
								</g>
							</g>
						</svg>
						<div class="info_text" v-bind:class="{ 'info_active': showInfo.efficiency }">
							{{ $t('profile.efficiency_info') }}
						</div>
					</label>
					<div class="top_detail">{{ formatPrice(account.efficiency * 100) }}%</div>
				</div>

				<div class="coin_detail">
					<label>{{ $t('profile.rating') }}</label>
					<div class="top_detail">#{{ account.rating }}</div>
				</div>
			</div>

			<svg class="portfolio_graph" ref="graphBox">
				<defs>
					<linearGradient id="GradientFirst" x1="0" x2="0" y1="0" y2="5">
						<stop offset="0%" stop-color="#FF9900"/>
						<stop offset="15%" stop-color="#FF9900" stop-opacity="0"/>
					</linearGradient>
					<linearGradient id="GradientSecond" x1="0" x2="0" y1="0" y2="5">
						<stop offset="0%" stop-color="#007ACC"/>
						<stop offset="15%" stop-color="#007ACC" stop-opacity="0"/>
					</linearGradient>
				</defs>

				<Graph  :interactive="true"
						:type="'dinamic_portfolio'"
						:first="{color: '#FF9900', gradient: 'GradientFirst', opacity: 0.2, label: $t('profile.change_capital') }" 
						:second="{color: '#007ACC', gradient: 'GradientSecond', opacity: 0.2, label: $t('profile.change_price') }" 
						:primaryColor="'#ccc'"
						v-on:testtest="onSelect" 
						v-on:hide-tooltip="onHideTooltip" 
						/>

				<svg viewBox="0 0 200 100" v-bind="tooltip()">
					<rect class="tooltip" width="201" height="100" fill="#f2f2f2" />
					<rect class="tooltip" x="0" y="40" width="100" height="60" fill="#fff" />
					<rect class="tooltip" x="101" y="40" width="100" height="60" fill="#fff" />

					<text class="tooltip_date" x="12" y="26" fill="#000">
						{{ formatDateTime( tooltipPoint.date) }}
					</text>
					<text class="tooltip_label" x="12" y="60" fill="#000">
						{{ $t('profile.change_capital_short') }}
					</text>
					<text class="tooltip_value" x="12" y="85" fill="#000">
						{{ formatPrice( tooltipPoint.price) }}%
					</text>
					<text class="tooltip_label" x="113" y="60" fill="#000">
						{{ $t('profile.change_price_short') }}
					</text>
					<text class="tooltip_value" x="113" y="85" fill="#000">
						{{ formatPrice( tooltipPoint.part * 100) }}%
					</text>
				</svg>
			</svg>
		</div>

		<treemap :type="'uniq_portfolio'" :requestPortfolio="requestPortfolio" :requestGraphs="requestGraphs" class="portfolio_treemap" />

	</div>
</template>



<script>
	import Treemap from '~/components/Treemap.vue'
	import Graph from '~/components/Graph.vue'
	import Jsona from 'jsona'

	import _ from 'lodash'

	const dataFormatter = new Jsona()

	const REQUEST_PORTFOLIO 	= `/api/portfolios/trader-dashboard`

	const REQUEST_COINS 	= `/api/portfolios/trader-coins`
	const REQUEST_GRAPHS 	= `/api/portfolios/trader-coins-graph`

	export default {
		components: {
			Treemap,
			Graph,
		},

		data() {
			return {
				tooltipPoint: {},
				showTooltip: false,
				showInfo: {
					efficiency: false,
				},
				tooltipWidth: 200,
				tooltipHeight: 100,
				account: {},
				portfolioGraph: {},
			}
		},

		async asyncData ({ app, params, store }) {
			let account = null

			try {
				let data = await app.$axios.get( requestPortfolio( store.state.filters) )

				account = data.data.data

				store.commit( 'SET_GRAPH_DINAMIC', data.data.graph )
				console.log( data.data.graph )
				if( account == undefined || account == null ) {
					account = {
								cap_usdt: null,
								cap_change: null,
								max_down: null, 
								total_cap_change: null, 
								efficiency: null, 
								rating: null,
							}
				}

			} catch (e) {
				console.log(e)
			}

			return {
				account: account,
			}
		},

		mounted() {
			this.debounceTimer = _.debounce( function ( app, option ) {
					app.clearInfo()
					app.showInfo[option] = true
			}, 200 )

		},

		computed: {
			tooltipViewBox() {
				return `0 0 ${this.tooltipWidth} ${this.tooltipHeight}`
			},
			requestPortfolio() {
				return REQUEST_COINS
			},
			requestGraphs() {
				return REQUEST_GRAPHS
			},
		},

		methods: {

			formatPrice( value ) {
				let val = (value/1).toFixed(2)
				return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
			},

			formatDate( dateString ) {
				let date 	= new Date(dateString)
				let day 	= date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
				let month 	= date.getMonth() <= 8 ? `0${date.getMonth()+1}` : date.getMonth()+1
				return `${day}.${month}`
			},

			formatDateTime( dateString ) {
				let date 	= new Date(dateString)
				let day 	= date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
				let month 	= date.getMonth() <= 8 ? `0${date.getMonth()+1}` : date.getMonth()+1
				let hour 	= date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
				let min 	= date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
				return `${day}.${month} ${hour}:${min}`
			},

			onClose () {
				this.$router.push({ name: 'index' })
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
				this.showInfo.efficiency = false
			},
		},
	}

	function requestPortfolio( filters ) {
		let filterQuery = filters && filters.period ? '?period=' + filters.period : ''
		return REQUEST_PORTFOLIO +  filterQuery
	}

</script>