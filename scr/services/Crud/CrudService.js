import axios from 'axios';

export default class CrudService {
    async get(url) {
        try{
            let res = await axios.get(`http://sistemasig.duckdns.org:4999/sig/api/${url}`);
            return res;
        }
        catch(error){
            return error.response;
        }
    }

    async post(url, obj) {
        try{
            let res = await axios.post(`http://sistemasig.duckdns.org:4999/sig/api/${url}`, 
                                    JSON.stringify(obj), {
                                    headers: {
                                        'Content-Type': 'application/json',
                                    }
                                });
            return res;
        }
        catch(error){
            return error.response;
        }
    }
}