import axios from 'axios';

export default async function csrf() {
    const res = await axios.get(`${process.env.CSRF}`);
    return res.data.token;
}