'use strict';


module.exports = (capibility) => {
    return (req, res, next) => {
        // ['read', 'create', 'update', 'delete']

        try {
            if(req.user.capabilities.includes(capibility)) {
                next(); 
            } else {
                next('Access Denied');
            }  
        } catch(e) {
            next('invalid Login!!')
        }
    }
}