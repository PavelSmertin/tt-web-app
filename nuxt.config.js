

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
		['@nuxtjs/proxy', { pathRewrite: { '^/api' : '/v1', '^/images' : '/' } }],

	],

	axios: {
		baseUrl: urls.host,
		browserBaseURL: urls.host,
	},

	proxy: {
		'/api': urls.api,
		'/images': urls.api,
	},
}