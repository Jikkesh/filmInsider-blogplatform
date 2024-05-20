import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decodedData?.id;

        next();
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};

export default auth;