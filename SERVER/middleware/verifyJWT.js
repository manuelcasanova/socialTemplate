const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
    // console.log("req.headers", req.headers)
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
    const token = authHeader.split(' ')[1];
    // console.log("Authorization Header:", authHeader);
    // console.log("token", token)
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) {
                console.log('JWT error:', err.name, err.message);
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).json({ error: 'Token expired' });
                } else if (err.name === 'JsonWebTokenError') {
                    return res.status(401).json({ error: 'Invalid token' });
                } else {
                    return res.sendStatus(403); 
                }

            }
            // console.log("decoded", decoded)
            req.email = decoded.UserInfo.email;
            req.roles = decoded.UserInfo.roles;
            next();
            // console.log("req.email", req.email)
        }
    );
}

module.exports = verifyJWT