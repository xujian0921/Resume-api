const Router = require('koa-router')
const router = new Router({ prefix: '/resume' })
const jwt = require('koa-jwt')
const { secret } = require('../config')

const { create, findSelf, find, findById, findByAccount, checkResumeExist, checkResumeOwner, updated, delete: del } = require('../controllers/resume')

const auth = jwt({ secret })

router.post('/create', auth, create)

router.get('/findSelf', auth, findSelf)

router.get('/findById', findById)

router.get('/findByAccount', findByAccount)

router.get('/find', find)

router.patch('/:id', auth, checkResumeExist, checkResumeOwner, updated)

router.delete('/:id', auth, checkResumeExist, checkResumeOwner, del)



module.exports = router