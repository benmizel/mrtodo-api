import jwt from 'jsonwebtoken';

const authenticateJWT = (req, res, next) => {

    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(403).send('Access denied');
      }

      try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        next();
        
      } catch (error) {
        console.error(error)
        res.status(400).send('Invalid or expired token')
        
      }

  };
  
  export { authenticateJWT };