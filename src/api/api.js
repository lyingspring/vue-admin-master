import axios from 'axios';
import qs from 'querystring';
let base = '';

export const requestLogin = params => { return axios.post(`${base}/insiis/pages/insuredmgmt/aloneinjury/AloneInjuryapi.jsp`,
  qs.stringify(params),{
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
}).then(res => res.data); };

export const getUserListPage = params => { return axios.get(`${base}/insiis/pages/insuredmgmt/aloneinjury/AloneInjuryapi.jsp`,
   { params: params }); };

export const querySearchperson = params => { return axios.get(`${base}/insiis/pages/insuredmgmt/aloneinjury/AloneInjuryapi.jsp`,
  { params: params }); };

export const queryAa10List = params => { return axios.get(`${base}/insiis/pages/insuredmgmt/aloneinjury/AloneInjuryapi.jsp`,
    { params: params }); };

export const addPerson = params => { return axios.get(`${base}/insiis/pages/insuredmgmt/aloneinjury/AloneInjuryapi.jsp`,
    { params: params }); };


// export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };
//
// export const getUserList = params => { return axios.get(`${base}/user/list`, { params: params }); };
//
// export const getUserListPage = params => { return axios.get(`${base}/user/listpage`, { params: params }); };
//
// export const removeUser = params => { return axios.get(`${base}/user/remove`, { params: params }); };
//
// export const batchRemoveUser = params => { return axios.get(`${base}/user/batchremove`, { params: params }); };
//
// export const editUser = params => { return axios.get(`${base}/user/edit`, { params: params }); };
//
// export const addUser = params => { return axios.get(`${base}/user/add`, { params: params }); };
