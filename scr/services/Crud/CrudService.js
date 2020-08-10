import axios from 'axios';

export default class CrudService {
    async get(url, token = "") {
        try{
            let res = await axios.get(`http://sistemasig.duckdns.org:4999/sig/api/${url}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res;
        }
        catch(error){
            return error.response;
        }
    }

    async post(url, obj, token = "") {
        try{
            let res = await axios.post(`http://sistemasig.duckdns.org:4999/sig/api/${url}`, 
                                    JSON.stringify(obj), {
                                    headers: {
                                        'Content-Type': 'application/json',
                                        Authorization: `Bearer ${token}`
                                    }
                                });
            return res;
        }
        catch(error){
            return error.response;
        }
    }

    async patch(url, obj, token = "") {
        try{
            let res = await axios.patch(`http://sistemasig.duckdns.org:4999/sig/api/${url}`, 
                                    JSON.stringify(obj), {
                                    headers: {
                                        'Content-Type': 'application/json',
                                        Authorization: `Bearer ${token}`
                                    }
                                });
            return res;
        }
        catch(error){
            return error.response;
        }
    }

    async postWithFile(url, obj, token = "") {
        try{
            let res = await axios.post(`http://sistemasig.duckdns.org:4999/sig/api/${url}`, 
                                    obj, {
                                    headers: {
                                        'Content-Type': 'multipart/form-data',
                                        Authorization: `Bearer ${token}`
                                    }
                                });
            return res;
        }
        catch(error){
            return error.response;
        }
    }
}