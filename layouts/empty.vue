<template>
	<div class="layout">

		<div ref="tt_sidenav" class="sidenav">
			<div class="sidenav_overflow">

				<nuxt-link :to="{ path: '/' }" v-on:click.native="closeNav()">{{ $t('nav.traders') }}</nuxt-link>

				<nuxt-link v-if="$auth.loggedIn" :to="{ path: '/exchanges' }" v-on:click.native="closeNav()">{{ $t('nav.account') }}</nuxt-link>
				<nuxt-link v-else :to="{ path: '/account/signup' }" v-on:click.native="closeNav()" >{{ $t('account.signup') }}</nuxt-link>

				<nuxt-link :to="{ path: '/about' }" v-on:click.native="closeNav()">{{ $t('nav.about') }}</nuxt-link>

				<a v-if="$auth.loggedIn" href="javascript:void(0)" v-on:click="$auth.logout()">{{ $t('nav.logout') }}</a>
				<nuxt-link v-else :to="{ path: '/account/signin' }" v-on:click.native="closeNav()" >{{ $t('account.signin') }}</nuxt-link>
				
			</div>
		</div>


		<div class="toolbar">
			<nuxt-link 
				:to="{name: 'index'}" 
				class="logo_link"
				>
				<svg width="32px" height="16px" >
					<g transform="translate(-16.000000, -16.000000)">
						<path id="logo_path" fill="#fff" d="M41,24 L41,32 L33,32 L33,24 L33,16 L48,16 L48,24 L41,24 Z M31,24 L31,32 L23,32 L23,24 L16,24 L16,16 L31,16 L31,24 Z"></path>
					</g>
				</svg>
			</nuxt-link>


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

		<div class="content" id="content">
			<nuxt/>
		</div>

	</div>
</template>

<script>

	export default {
		
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
			    this.$refs["tt_sidenav"].style.width = "0"
				this.sidenavActive = false
			},
		}
	}
</script>