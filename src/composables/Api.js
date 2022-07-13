import axios from 'axios';

async function getOPDInfo() {
	const x = { "kunker" : process.env.VUE_APP_OPD_ID };
    const response = await axios.post(process.env.VUE_APP_API_URL+`api/getOPDInfo`, x);
    return response;
}

async function getMainPageInfo() {
	const x = { "kunker" : process.env.VUE_APP_OPD_ID };
    const response = await axios.post(process.env.VUE_APP_API_URL+`api/getMainPageInfo`, x);

    return response;
}

async function getBerita() {
    const response = await axios.get(process.env.VUE_APP_API_URL+`api/getBerita/`+ process.env.VUE_APP_OPD_ID);
    return response;
}

async function getBerandaInfo() {
	const requestOne = await getMainPageInfo();
    const requestTwo = await getBerita();

    return [requestOne, requestTwo];
}

async function getData(req, svar, sval) {
	const x = { 'req' : req, 'svar' : svar, 'sval':  sval};
    const response = await axios.post(process.env.VUE_APP_API_URL+`api/getData/`+ process.env.VUE_APP_OPD_ID, x);
    return response;
}

async function getDataLimit(req, svar, sval, limit, offset) {
    const x = { 'req' : req, 'svar' : svar, 'sval':  sval, 'limit': limit, 'offset': offset};
    const response = await axios.post(process.env.VUE_APP_API_URL+`api/getData/`+ process.env.VUE_APP_OPD_ID, x);
    return response;
}

async function getGallery(id_gallery_album) {
    const x = { 'req' : 'gallery', 'id_gallery_album' : id_gallery_album};
    const response = await axios.post(process.env.VUE_APP_API_URL+`api/getData/`+ process.env.VUE_APP_OPD_ID, x);
    return response;
}

async function getGalleryAlbum(id_gallery_album) {
    const x = { 'req' : 'gallery_album', 'id_gallery_album' : id_gallery_album};
    const response = await axios.post(process.env.VUE_APP_API_URL+`api/getData/`+ process.env.VUE_APP_OPD_ID, x);
    return response;
}

async function getDataPemko(req) {
    const response = await axios.get(process.env.VUE_APP_API_URL+`api/getDataPemko/`+ req);
    return response;
}

async function getDataTags(req, svar, sval) {
    const x = { 'req' : "tags", 'page': req, 'svar' : svar, 'sval':  sval};
    const response = await axios.post(process.env.VUE_APP_API_URL+`api/getData/`+ process.env.VUE_APP_OPD_ID, x);

    return response;
}

async function getHalamanInfo(req1, req2, svar, sval) {
	const requestOne = await getData(req1, svar, sval);
    const requestTwo = await getData(req2, svar, sval);

    return [requestOne, requestTwo];
}

async function getListInfo(req, svar, sval) {
    const responses = [];
    for (var i = req.length - 1; i >= 0; i--) {
        responses[i] = await getData(req[i], svar, sval)
    }

    return responses;
}

async function getKomentar(req, svar, sval) {
    const x = { 'req' : "komentar", 'page': req, 'svar' : svar, 'sval':  sval};
    const response = await axios.post(process.env.VUE_APP_API_URL+`api/getData/`+ process.env.VUE_APP_OPD_ID, x);

    return response;
}

async function sendData(req, data) {
	const x = {
		"req" : req,
		"data" : data,
	}
    const response = await axios.post(process.env.VUE_APP_API_URL+`api/setData/`+process.env.VUE_APP_OPD_ID, x)
    return response;
}

async function checkFileExist(type, file) {
    try{
        const response = await axios.head(process.env.VUE_APP_API_URL+type+process.env.VUE_APP_OPD_ID+`/`+file+".")
        return response;
    }catch(e){
        console.log(e)
    }
    
    return null
}

export {
    getOPDInfo, 
    getMainPageInfo, 
    getBerita, 
    getBerandaInfo, 
    getData, 
    getDataLimit,
    getGalleryAlbum,
    getGallery,
    getDataPemko, 
    getHalamanInfo, 
    getKomentar, 
    sendData, 
    getDataTags, 
    getListInfo,
    checkFileExist,
};