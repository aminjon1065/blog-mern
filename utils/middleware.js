import jwt from 'jsonwebtoken'

export default (req, res, next) => {
    const token = (req.headers.authorization || '').replace('Bearer ', '')
    if (token) {
        try {
            const decoded = jwt.verify(token, 'secret123');
            req.userId = decoded._id;
            next();
        } catch (e) {
            res.status(401).json({
                message: 'Unauthorized',
            })
        }
    } else {
        return res.status(403).json({
            message: 'Нет доступа',
        })
    }
}