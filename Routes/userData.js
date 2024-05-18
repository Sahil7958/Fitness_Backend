const express = require('express');
const router = express.Router();
const errorHandler = require('../Middlewares/errorMiddleware');
const adminTokenHandler = require('../Middlewares/checkAdminToken');
const User = require('../Models/UserSchema');

function createResponse(ok, message, data) {
    return {
        ok,
        message,
        data,
    };
}
router.get('/users', adminTokenHandler, async (req, res) => {
    try {
        const users = await User.find({});
        res.json(createResponse(true, 'User data fetched successfully', users));
    } catch (err) {
        res.json(createResponse(false, err.message));
    }
});

router.use(errorHandler);

module.exports = router;