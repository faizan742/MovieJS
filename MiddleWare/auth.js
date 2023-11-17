const jwt = require('jsonwebtoken');
require("dotenv").config();
function checkJWT(req,res,next){
try {
    const auth_header = req.headers.authorization;
    if(!auth_header)  res.send(401, 'Unauthorized request')
    
    const accessToken = auth_header.split(' ')[1]
    console.log(accessToken);
    jwt.verify(accessToken,process.env.Secret_KEY , (err, decoded) => {
        //if (err) res.send(401, 'Unauthorized request')
        //if (user.admin == true) res.send('Restricted API called')
        if (err) {
            console.error('JWT verification failed:', err.message);
            res.send(401, 'Unauthorized request')
          } else {
            console.log('JWT decoded:', decoded);
          }
    })
    next();
} catch (error) {
    res.send(401, 'Unauthorized request')
}
}
module.exports={checkJWT};