const Router = require('koa-router')
const router = new Router()
const { index, upload, saveImage, getImageUrl } = require('../controllers/home.js')
const jwt = require('koa-jwt')
const { secret } = require('../config')

const auth = jwt({ secret })
router.get('/', index)

router.post('/upload', upload)

router.post('/saveImage', auth, saveImage )

router.get('/getImageUrl', auth, getImageUrl)

module.exports = router