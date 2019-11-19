const express=require('express')
const router=express.Router()
const sqlite3 = require('sqlite3')

var dbFile = './project.sqlite'
var adminDB ='./admin.sqlite'
//Connect to Databases
let db = new sqlite3.Database(dbFile, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the '+dbFile+' database.');
  });

let admincon=new sqlite3.Database(adminDB, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the '+adminDB+' database.');
});
//GET Request Handlers
router.get('/',(req,res,next)=>{
    res.render('home',null)
})
router.get('/api',(req,res,next)=>{
  res.render('api',null)
})
router.get('/search',(req,res,next)=>{
  res.render('search',null)
})
router.get('/dataviz',(req,res,next)=>{
  res.render('dataviz',null)
})
router.get('/adminlogin',(req,res,next)=>{
  res.render('adminlogin',null)
})
router.get('/about',(req,res,next)=>{
  res.render('about',null)
})
router.get('/logout', function(req, res, next) {
  if (req.session) {
    req.session.destroy(function(err) {
      if(err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    })
  }
})
router.get('/api/:table/:column/:name',(req,res)=>{
    const table=req.params.table
    const column=req.params.column
    const name=req.params.name
    db.serialize(() => {
        db.each(`SELECT *
                 FROM `+table+` WHERE `+column+`='`+name+`'`, (err, row) => {
          if (err) {
            console.error(err.message);
          }
          res.send(row)
        });
      });
})
//POST Request Handlers
router.post('/admin',(req,res,next)=>{
  const email=req.body.email
  const password=req.body.password
  admincon.serialize(() => {
    admincon.each(`SELECT count(*)
             FROM admin WHERE email='`+email+`' AND password='`+password+`'`, (err, row) => {
      if (err) {
        console.error(err.message);
      }
      console.log(row)
      if(row['count(*)']===1)
        res.render('admin',{status:'Nothing to Report'})
      else
        res.redirect('/')
    });
  });
})

router.post('/insertadmin',(req,res,next)=>{
  const email=req.body.email
  const password=req.body.password
  admincon.run(`INSERT INTO admin VALUES(?,?)`, [email,password], function(err) {
    if (err) {
      return console.log(err.message);
    }
    console.log(`Inserted`);
  })
  res.render('admin',{status:'Inserted'})
    })

router.post('/deleteadmin',(req,res,next)=>{
  const email=req.body.email
  admincon.run(`DELETE FROM admin WHERE email='`+email+`'`,function(err) {
    if (err) {
      return console.log(err.message);
    }
    console.log("Deleted");
  })
  res.render('admin',{status:'Deleted'})
    })

router.post('/updateadmin',(req,res,next)=>{
  const email=req.body.email
  const newemail=req.body.newemail
  const password=req.body.password
  admincon.run(`UPDATE admin SET email='`+newemail+`',password='`+password+`' WHERE email='`+email+`'`, function(err) {
    if (err) {
      return console.log(err.message);
    }
    console.log('Updated');
  })
  res.render('admin',{status:'Updated'})
    })

router.post('/insertcontent',(req,res,next)=>{
  const table=req.body.table
  const values=req.body.values
  db.run(`INSERT INTO `+table+` VALUES(`+values+`)`, function(err) {
    if (err) {
      return console.log(err.message);
    }
    console.log(`A row has been inserted with rowid ${this.lastID}`);
  })
  res.render('admin',{status:'Inserted'})
    })

router.post('/search', (req, res) => {
  const table=req.body.table
  const column=req.body.column
  const name=req.body.name
  db.serialize(() => {
      db.each(`SELECT *
                FROM `+table+` WHERE `+column+`='`+name+`'`, (err, row) => {
        if (err) {
          console.error(err.message);
        }
        var arr=[]
        for(key in row){
          arr.push({"key":key,"value":row[key]})
        }
        data={"data":arr}
        res.render('search',data)
      });
    });
})
module.exports=router