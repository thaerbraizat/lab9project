'use strict';

const base64 = require('base-64')
const userModal = require('../models/userSchema')

module.exports = (UserSchema) => (req, res, next) => {
    if (!req.headers['authorization']) {
        next('No Authorization info');
        return;
    }
    // authorization header
    // Bearer ss323=dfrSefdaasaAWEF=w23
    let basicHeaderParts = req.headers.authorization.split(' '); // ['Bearer', sWEdQsas332=wWDASD]
    let token = basicHeaderParts.pop();
    // Verify the token that we recieved from the request
    // jwt.verify : token + secret key
    // get back the user object
    UserSchema.authenticateToken(token).then(userObject=> {
        console.log("token is good ..");
        req.user = userObject;
        next();
    }).catch(err=> next('Invalid Token'))
    
}
