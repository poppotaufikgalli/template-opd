const lsbulan = ["", "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
const lsbulanA = ["", "Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];

function getEnv(){
	return { "kunker" : process.env.VUE_APP_OPD_ID, "apiUrl" : process.env.VUE_APP_API_URL, "imgUrl" : process.env.VUE_APP_API_URL+"image/"  }
}

function cleanTextP(strInputCode) {
    return strInputCode.replace(/<p\/?[^>]+(>|$)/g, "<p>");
}

function beautifyDate1(argument) {
	var datetime = argument.split(" ");
	var date = (datetime[0]).split("-");
	var idx_bln = parseInt(date[1]);
	var ndate = date[2]+" "+(lsbulan[idx_bln])+" "+date[0];
	return ndate + (datetime[1] !== '00:00:00' ? " "+ datetime[1] : '')	
}

function beautifyDate2(argument) {
	//var datetime = argument.split(" ");
	var date = (argument).split("-");
	var idx_bln = parseInt(date[1]);
	var ndate = date[2]+" "+(lsbulanA[idx_bln])+" "+date[0];
	return ndate
}

function makeJudul(argument) {
	return argument.replace(/[^a-zA-Z\d\s]/g, '').split(' ').join('-').toLowerCase()
}

export {getEnv, cleanTextP, beautifyDate1, beautifyDate2, makeJudul};