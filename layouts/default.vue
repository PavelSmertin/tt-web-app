<template>
	<div class="layout">

		<div ref="tt_sidenav" class="sidenav" >
			<div class="sidenav_overflow">

				<div class="sidenav_body">
					<div class="filters">
						<filters :label="$t('home.label_capitalization')" :options="capitalizationOptions" :selectedProp="$store.state.filters.cap"  v-on:updateOption="filter($event, 'cap')" />
						<filters :label="$t('home.label_profit')" :options="profitOptions" :selectedProp="$store.state.filters.profit" v-on:updateOption="filter($event, 'profit')" />
						<filters :label="$t('home.label_interval')" :options="intervalOptions" :selectedProp="$store.state.filters.period"  v-on:updateOption="filter($event, 'period')" />
						<div v-if="$store.state.filterLoading" class="loading"></div>
					</div>

					<nuxt-link :to="{ path: '/' }" v-on:click.native="closeNav()">{{ $t('nav.traders') }}</nuxt-link>

					<nuxt-link v-if="$auth.loggedIn" :to="{ path: '/exchanges' }" v-on:click.native="closeNav()">{{ $t('nav.account') }}</nuxt-link>
					<nuxt-link v-else :to="{ path: '/account/signup' }" v-on:click.native="closeNav()" >{{ $t('account.signup') }}</nuxt-link>

					<nuxt-link :to="{ path: '/about' }" v-on:click.native="closeNav">{{ $t('nav.about') }}</nuxt-link>

					<a v-if="$auth.loggedIn" href="javascript:void(0)" v-on:click="$auth.logout()">{{ $t('nav.logout') }}</a>
					<nuxt-link v-else :to="{ path: '/account/signin' }" v-on:click.native="closeNav()">{{ $t('account.signin') }}</nuxt-link>
				</div>

				<div class="sidenav_footer">
					<div class="sidenav_item">
						{{ $t('home.description') }}
					</div>
					<ul class="sidenav_item">
						<li>{{$store.state.profile.tradersCount}} {{ $t('profile.traders') }}</li>
						<li>${{ nFormatter($store.state.profile.capital, 0)}} {{ $t('profile.capital') }}</li>
						<li>{{ $t('profile.updated_at') }} {{formatDateTime($store.state.profile.updatedAt)}}</li>
					</ul>
				</div>
			</div>
		</div>


		<div class="toolbar">
			<div class=logo_wrap>
				<nuxt-link 
					:to="{name: 'index'}" 
					class="logo_link"
					>
					<img src="~assets/images/logo.svg" alt="tt"/>
				</nuxt-link>

				<div class="divider">
				</div>

				<div class="profile_capital"> ${{ nFormatter($store.state.profile.capital , 0) }} {{ $t('account.total_capital') }}</div>
			</div>


			<div class="filters">
				<filters :label="$t('home.label_capitalization')" :options="capitalizationOptions" :selectedProp="$store.state.filters.cap"  v-on:updateOption="filter($event, 'cap')" />
				<filters :label="$t('home.label_profit')" :options="profitOptions" :selectedProp="$store.state.filters.profit" v-on:updateOption="filter($event, 'profit')" />
				<filters :label="$t('home.label_interval')" :options="intervalOptions" :selectedProp="$store.state.filters.period"  v-on:updateOption="filter($event, 'period')" />
				<div v-if="$store.state.filterLoading" class="loading"></div>
			</div>

			<div class="tool_wrap">
				<nuxt-link 
					v-if="!$auth.loggedIn"
					:to="{ path: '/account/signup' }" 
					class="ff_account_menu">
					{{ $t('account.signup') }}
				</nuxt-link>

				<a v-if="sidenavActive" href="javascript:void(0)" class="closebtn" v-on:click="closeNav()">&times;</a>
				<span v-else class="burger" v-on:click="openNav()">
					<svg width="24px" height="30px" viewBox="0 0 24 18">
						<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
							<g transform="translate(-1400.000000, -15.000000)" fill="#000000">
								<g id="Header">
									<path d="M1400,15 L1424,15 L1424,17 L1400,17 L1400,15 Z M1400,23 L1424,23 L1424,25 L1400,25 L1400,23 Z M1412,31 L1424,31 L1424,33 L1412,33 L1412,31 Z" id="Combined-Shape"></path>
								</g>
							</g>
						</g>
					</svg>
				</span>
			</div>

		</div>

		<div class="content" id="content" >
			<nuxt v-on:navigate="closeNav()"/>
		</div>

	</div>
</template>

<script>
	import Filters from '~/components/Filters.vue'

	const FILTER_TYPE_CAP = 'cap'
	const FILTER_TYPE_PROFIT = 'profit'
	const FILTER_TYPE_PERIOD = 'period'

	export default {

		data() {
			return {
				sidenavActive: false,
				capitalizationOptions: [
					{ name: this.$t('filters.all'), value: 'all' },
					{ name: this.$t('filters.10k'), value: '10k' },
					{ name: this.$t('filters.100k'), value: '100k' },
					{ name: this.$t('filters.1m'), value: '1m' },
				],
				profitOptions: [
					{ name: this.$t('filters.all'), value: 'all' },
					{ name: this.$t('filters.10p'), value: '10' },
					{ name: this.$t('filters.100p'), value: '100' },
					{ name: this.$t('filters.1000p'), value: '1000' },
				],
				intervalOptions: [
					{ name: this.$t('filters.interval.1d'), value: '1d' },
					{ name: this.$t('filters.interval.1w'), value: '1w' },
					{ name: this.$t('filters.interval.1m'), value: '1m' },
				],
			}
		},

		components: {
			Filters,
		},

		methods: {
			openNav() {
				this.$refs["tt_sidenav"].style.width = "340px"
				this.sidenavActive = true
			},

			closeNav() {
				if( this.$refs["tt_sidenav"] ) {
					this.$refs["tt_sidenav"].style.width = "0"
				}
				this.sidenavActive = false

			},

			filter ( filter, type ) {
				this.closeNav();
				this.$store.commit( 'SET_FILTER', { type: type, value: filter.value } )
			},

		 	nFormatter(num, digits) {
				var si = [
					{ value: 1, symbol: "" },
					{ value: 1E3, symbol: "K" },
					{ value: 1E6, symbol: "M" },
					{ value: 1E9, symbol: "G" },
					{ value: 1E12, symbol: "T" },
					{ value: 1E15, symbol: "P" },
					{ value: 1E18, symbol: "E" }
				]
				var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
				var i;
				for (i = si.length - 1; i > 0; i--) {
					if (num >= si[i].value) {
						break
					}
				}
				return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol
			},

			formatDateTime( dateString ) {
				let date 	= new Date(dateString)
				let day 	= date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
				let month 	= date.getMonth() <= 8 ? `0${date.getMonth()+1}` : date.getMonth()+1
				let hour 	= date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
				let min 	= date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
				let sec 	= date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()
				return `${day}.${month} ${hour}:${min}:${sec} GMT`
			},
		},
	}
</script>