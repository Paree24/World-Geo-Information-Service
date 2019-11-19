const express=require('express')
const path=require('path')
const app=express()
const indexRouter=require('./routes/index')
const bodyParser=require('body-parser')
const session=require('express-session')
const cookieParser = require('cookie-parser')

app.set('views',path.join(__dirname,'views'))
app.set('view engine','mustache')
app.engine('mustache',require('hogan-middleware').__express)
app.use(cookieParser())
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}))
app.use(function(req, res, next) {
	res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0')
	next()
  })  
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname,'public')))
app.use('/',indexRouter)
app.listen(3000)

console.log("Serving at http://localhost:3000/")