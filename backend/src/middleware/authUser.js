const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: "Không có token, ủy quyền bị từ chối" });
    }

    try {
        const decoded = jwt.verify(token, 'giathuan');
        req.user = { userId: decoded.userId };
        next();
    } catch (err) {
        res.status(401).json({ message: "Token không hợp lệ" });
    }
};

module.exports = auth;
