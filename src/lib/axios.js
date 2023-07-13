import Axios from 'axios';
import Cookies from 'js-cookie';

const token = Cookies.get('token');

// console.log(token)
const axios = Axios.create({
    baseURL: process.env.API_URL,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        Authorization: `Bearer ${token}`

    },
    withCredentials: true,
    // xsrfCookieName: 'XSRF-TOKEN'
})


export default axios;
