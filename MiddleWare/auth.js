const jwt = require('jsonwebtoken');
require("dotenv").config();

function checkJWT(req,res,next){
try {
    const auth_header = req.headers.authorization;
    if(!auth_header)  res.send(401, 'Unauthorized request')
    
    const accessToken = auth_header.split(' ')[1]
    console.log(accessToken);
    jwt.verify(accessToken,process.env.Secret_KEY , (err, decoded) => {
        
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

function AdmincheckJWT(req,res,next){
  try {
  
    
      const auth_header = req.headers.authorization;
      if(!auth_header)  res.send(401, 'Unauthorized request')
  
      const accessToken = auth_header.split(' ')[1]
      console.log(accessToken);
      const UserInfo=jwt.decode(accessToken);
      console.log(UserInfo);
      if(UserInfo.admin==true){
       
        jwt.verify(accessToken,process.env.Secret_KEY , (err, decoded) => {
          if (err) {
              console.error('JWT verification failed:', err.message);
              res.send(401, 'Unauthorized request')
            } else {
              console.log('JWT decoded:', decoded);
            }
      })
    
      next();

      }else
      {
        res.send(401, 'YOU ARE NOT ADMIN');
      }
      
  } catch (error) {
      res.send(401, 'Unauthorized request')
  }
  }


module.exports={checkJWT,AdmincheckJWT};