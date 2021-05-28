const Router = require('koa-router')
const router = new Router({ prefix: '/users' })
// 验证权限 token
const jwt = require('koa-jwt')
const { secret } = require('../config')
const { 
  register,
  login,
  getUser,
  getPersonUser,
  updated, 
  checkOwner,
  delete: del
 } =require('../controllers/users')

 const auth = jwt({ secret })

 router.post('/register', register)

 router.post('/login', login)

 router.get('/getUser', getUser)

 router.get('/getPersonUser',auth, getPersonUser)

 router.put('/updated/:id',auth, checkOwner, updated)
 
 router.delete('/delete/:id', del)

module.exports = router