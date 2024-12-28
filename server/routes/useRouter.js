const UserCtrl = require('../controllers/UserCtrl');
const auth = require('../middleware/auth');

const router = require('express').Router()


router.post('/register', UserCtrl.register)
router.post('/login', UserCtrl.login)
router.get('/logout', UserCtrl.logout)
router.post('/refresh_token', UserCtrl.refreshToken)
router.get('/information', auth, UserCtrl.getUser)

module.exports = router;