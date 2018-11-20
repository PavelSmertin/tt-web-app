

let urls = require( './urls_default.js' ) 
try { 
  urls = require( './urls.js' ) 
}
catch( e ) { 
}


export default {

	css: [
		'normalize.css',
		'@/assets/css/bind.scss'
	],

	head: {
		title: 'Trader Trends - FF.ru',
		
		meta: [
			{ charset: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no' },
			{ 
				hid: 'description', 
				name: 'description', 
				content: 'Отслеживайте динамику портфелей крипто-сообщества в реальном времени. Анализируйте собственную эффективность торговли и повышайте профит.',
			},

			{ property: 'og:image:width', content: '968' },
			{ property: 'og:image:height', content: '504' },
			{ property: 'og:site_name', content: 'tt.FF.ru' },
			{ property: 'og:locale', content: 'ru_RU' },

			{ name: 'twitter:card', content: 'summary_large_image' },
			{ name: 'twitter:site', content: '@TraderTrends' },
			{ name: 'twitter:creator', content: '@TraderTrends' },
		],

		link: [
			{ rel: 'icon', type: 'image/png', href: '/favicon.png' },
			{ rel:'mask-icon', color: 'black', href: '/favicon.svg' },
			{ rel:'icon', type: 'image/svg+xml', href: '/favicon.svg' },
		],

		bodyAttrs: {
			class: 'tt'
		},

		htmlAttrs: {
			prefix: 'og: http://ogp.me/ns# article: http://ogp.me/ns/article# fb: http://ogp.me/ns/fb# website: http://ogp.me/ns/website#',
			lang: 'ru',
		},

	},


	router: {
		middleware: ['i18n', 'stats'],
		extendRoutes (routes, resolve) {
			let parent 		= routes.find((route) => {return route.path === '/:lang'})
			let langRoute 	= routes.find( r => r.path.includes(':lang') )
			langRoute.path 	= '/:lang(ru|en)'
		},
	},

	plugins: [    
		'~/plugins/i18n.js',
		{ src: '~/plugins/ga.js', ssr: false },
	],

	modules: [
		'@nuxtjs/axios',
		'@nuxtjs/auth',
		['@nuxtjs/proxy', { pathRewrite: { '^/api' : '/v1', '^/images' : '/' } }],
		'@nuxtjs/toast',

	],

	toast: {
		position: 'top-center',
		duration: 1000,
	},

	axios: {
		baseUrl: urls.host,
		browserBaseURL: urls.host,
		//debug: true,
	},

	auth: {

		redirect: {
			login: '/',
		},

		token: {
			prefix: 'token.'
		},

		defaultStrategy: 'api',

		strategies: {
			api: {
				_scheme: '~/schemes/api.js',
				endpoints: {
					login: {
						url: '/api/auth/login',
						method: 'post',
						propertyName: 'access_token'
					},
					logout: false
				}
			}
		}
	},

	proxy: {
		'/api': urls.api,
		'/images': urls.api,
	},
}