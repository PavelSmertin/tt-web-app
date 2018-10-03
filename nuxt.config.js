

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

	router: {
		middleware: 'i18n'
	},

	plugins: ['~/plugins/i18n.js'],

	modules: [
		'@nuxtjs/axios',
		'@nuxtjs/auth',
		['@nuxtjs/proxy', { pathRewrite: { '^/api' : '/v1', '^/images' : '/' } }],

	],

	axios: {
		baseUrl: urls.host,
		browserBaseURL: urls.host,
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