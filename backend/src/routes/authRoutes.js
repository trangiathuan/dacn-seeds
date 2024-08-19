const express = require('express');
const { check } = require('express-validator');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/register', [
    check('userName', 'Tên tài khoản là bắt buộc').not().isEmpty(),
    check('passWord', 'Mật khẩu phải có ít nhất 6 ký tự').isLength({ min: 6 }),
    check('fullName', 'Họ và tên là bắt buộc').not().isEmpty(),
    check('birthDay', 'Ngày sinh là bắt buộc').not().isEmpty(),
    check('address', 'Địa chỉ là bắt buộc').not().isEmpty(),
    check('phoneNumber', 'Số điện thoại là bắt buộc').not().isEmpty(),
    check('email', 'Email không hợp lệ').isEmail()
], authController.register);

router.post('/login', [
    check('userName', 'Tên tài khoản là bắt buộc').not().isEmpty(),
    check('passWord', 'Mật khẩu là bắt buộc').exists()
], authController.login);

router.get('/users/:id', authController.getUser);
module.exports = router;
