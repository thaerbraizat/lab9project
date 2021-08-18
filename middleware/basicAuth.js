'use strict';

const base64 = require('base-64')

module.exports = (UserSchema) => (req, res, next) => {
    if (!req.headers['authorization']) {
        next('No Authorization info');
        return;
    }

    let basicHeaderParts = req.headers.authorization.split(' '); // ['Basic', encoded(username:password)]
    let encoded = basicHeaderParts.pop();
    let decoded = base64.decode(encoded); // username:password
    let [username, password] = decoded.split(":"); // rawan test@1234
   
    // is this user ok?
    UserSchema.authenticateBasic(username, password).then(validUser=> {
        req.user = validUser;
        next();
    }).catch(err=> next('invalid users'));
}
