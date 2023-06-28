import axios from 'axios';

export default async function login(req, res) {
    try {
        const response = await axios.post(`${process.env.LOGIN_URL}`, req.body);

        
        // Set the session cookie received from the Laravel Sanctum API
        if(response.headers['set-cookie']) {
            res.setHeaders('Set-Cookie', response.headers['set-cookie']);
        }

        res.status(response.status).json(response.data);
    } catch(err) {
        const status = err.response.status || 500;
        res.status(status).json({message: err.message});
    }   
}