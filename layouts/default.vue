<template>
	<div class="layout">

		<div ref="tt_sidenav" class="sidenav">
			<div class="sidenav_overflow">
				<a href="javascript:void(0)" class="closebtn" v-on:click="closeNav()">&times;</a>

				<nuxt-link :to="{ path: '/' }">{{ $t('nav.traders') }}</nuxt-link>

				<nuxt-link v-if="$auth.loggedIn" :to="{ path: '/exchanges' }">{{ $t('nav.account') }}</nuxt-link>
				<nuxt-link v-else :to="{ path: '/account/signup' }" >{{ $t('account.signup') }}</nuxt-link>

				<nuxt-link :to="{ path: '/about' }">{{ $t('nav.about') }}</nuxt-link>

				<a v-if="$auth.loggedIn" href="javascript:void(0)" v-on:click="$auth.logout()">{{ $t('nav.logout') }}</a>
				<nuxt-link v-else :to="{ path: '/account/signin' }" >{{ $t('account.signin') }}</nuxt-link>
			</div>
		</div>


		<div class="toolbar">
			<nuxt-link 
				:to="{name: 'index'}" 
				class="logo_link"
				>
				<img src="~assets/images/logo.svg" alt="tt"/>
			</nuxt-link>

			<div class="filters">
				<filters :label="$t('home.label_capitalization')" :options="capitalizationOptions" :selectedProp="$store.state.filters.cap"  v-on:updateOption="filter($event, 'cap')" />
				<filters :label="$t('home.label_profit')" :options="profitOptions" :selectedProp="$store.state.filters.profit" v-on:updateOption="filter($event, 'profit')" />
				<filters :label="$t('home.label_interval')" :options="intervalOptions" :selectedProp="$store.state.filters.period"  v-on:updateOption="filter($event, 'period')" />
			</div>

			<nuxt-link 
				v-if="!$auth.loggedIn"
				:to="{ path: '/account/signup' }" 
				class="ff_account_menu">
				{{ $t('account.signup') }}
			</nuxt-link>

			<span class="burger" v-on:click="openNav()">
				<svg width="24px" height="18px" viewBox="0 0 24 18">
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

		<div class="content" id="content">
			<nuxt/>
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
				this.$refs["tt_sidenav"].style.width = "250px"
			},

			closeNav() {
				this.$refs["tt_sidenav"].style.width = "0"
			},

			filter ( filter, type ) {
				this.$store.commit( 'SET_FILTER', { type: type, value: filter.value } )
			},
		},


	}
</script>