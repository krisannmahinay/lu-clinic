import axios from 'axios';

export default async function auth(req, res, next) {
    try {
        const response = await axios.get(`${process.env.USER_URL}`,
        {
            headers: {
                Cookie: req.headers.cookie || ''
            },
        })
        console.log(response)
        if(response.data.authenticated) {
            return next();
        }

        // if the user is not authenticated
        return res.redirect('/auth/signin');
    } catch(err) {
        console.log(err)
    }
}