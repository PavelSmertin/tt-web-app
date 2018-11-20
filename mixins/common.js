export const Common = {
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

		collapseSum(num, digits) {
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

	}
}