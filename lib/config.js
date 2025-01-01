const Function = new(require('./functions'))
global.creator = `Masha – Forx Code`
global.limit = 100
global.Func = Function
global.status = {
	noapikey:{
        creator: global.creator,
		    status: false,
        msg: 'Masukan parameter apikey !',
    },
    error: {
        creator: global.creator,
        status: false,
        msg: 'Service Unavaible, Sedang dalam perbaikan',
    },
    invalidKey: {
      creator: global.creator,
      status: false,
      msg: 'Gapunya apikey? register untuk mendapatkan apikey.'
   },
    noturl: {
      creator: global.creator,
    	status: false,
    	msg: 'Forbiden, Invlid url, masukkan parameter url',
    },
   limit: {
      creator: global.creator,
      status: false,
      msg: 'Sorry, apikey has reached the limit. © https://masha-api.vercel.app'
   },
}