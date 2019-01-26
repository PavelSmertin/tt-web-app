<template>
	<div class="layout">

		<div ref="tt_sidenav" class="sidenav">
			<div class="sidenav_overflow">

				<div class="sidenav_body">
					<nuxt-link :to="{ path: '/' }" v-on:click.native="closeNav()">{{ $t('nav.traders') }}</nuxt-link>

					<nuxt-link v-if="$auth.loggedIn" :to="{ path: '/exchanges' }" v-on:click.native="closeNav()">{{ $t('nav.account') }}</nuxt-link>
					<nuxt-link v-else :to="{ path: '/account/signup' }" v-on:click.native="closeNav()" >{{ $t('account.signup') }}</nuxt-link>

					<div v-if="$auth.loggedIn">
						<nuxt-link :to="{ path: '/user' }" v-on:click.native="closeNav()">{{ $t('nav.portfolio') }}</nuxt-link>
					</div>
					<div v-else></div><!--it is hack!-->

					<nuxt-link :to="{ path: '/about' }" v-on:click.native="closeNav()">{{ $t('nav.about') }}</nuxt-link>

					<a v-if="$auth.loggedIn" href="javascript:void(0)" v-on:click="$auth.logout()">{{ $t('nav.logout') }}</a>
					<nuxt-link v-else :to="{ path: '/account/signin' }" v-on:click.native="closeNav()" >{{ $t('account.signin') }}</nuxt-link>
					
				</div>
				
				<div class="sidenav_footer">
					<div class="sidenav_item">
						{{ $t('home.description') }}
					</div>
					<ul class="sidenav_item">
						<li>{{$store.state.profile.tradersCount}} {{ $t('profile.traders') }}</li>
						<li>${{ collapseSum($store.state.profile.capital, 0)}} {{ $t('profile.capital') }}</li>
						<li>{{ $t('profile.updated_at') }} {{formatDateTime($store.state.profile.updatedAt)}}</li>
					</ul>
				</div>

			</div>


		</div>


		<div class="toolbar bordered">
			<div class=logo_wrap>
				<nuxt-link 
					:to="{name: 'index'}" 
					class="logo_link"
					>
					<img src="~assets/images/logo.svg" alt="tt"/>
				</nuxt-link>

				<div v-if="$store.state.profile.capital" class="divider">
				</div>

				<div v-if="$store.state.profile.capital" class="profile_capital">
					${{ collapseSum($store.state.profile.capital , 0) }} {{ $t('account.total_capital') }}
				</div>

			</div>

			<div class="tool_wrap">
				<a v-if="sidenavActive" href="javascript:void(0)" class="closebtn" v-on:click="closeNav()">&times;</a>
				<span v-else class="burger" v-on:click="openNav()">
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

		</div>

		<div class="content_scrollable" id="content">
			<nuxt/>
		</div>

	</div>
</template>

<script>

	import { Common } from '~/mixins/common.js'

	export default {
		
		mixins: [ Common ],

		data() {
			return {
				sidenavActive: false,
			}
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
		}
	}
</script>