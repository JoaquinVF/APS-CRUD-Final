const express = require('express');
const xml2js = require('xml2js');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const fs = require('fs');
const PassportLocal = require('passport-local').Strategy;

const app = express();

app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use("/static", express.static('./dir/static/'));
app.use(cookieParser('mi secreto'));

app.use(session({
    secret: 'mi secreto',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new PassportLocal(function(username,password,done){
    
    if (username === 'test' && password === 'test2021'){
        return done(null,{id: 1, name: username})};

    done(null, false);
}));

passport.serializeUser(function(user,done){
    done(null,user.id);
})

passport.deserializeUser(function(id,done){
    done(null, { id: 1, name: "pepe"})
})


app.set('view engine', 'ejs');

app.get('/', (req,res,next)=>{
    if(req.isAuthenticated()) return next();
    res.redirect('/login');
},(req,res)=>{
    res.sendFile(__dirname + '/dir/static/abm.html');
});

app.get('/login', (req, res)=>{
    res.render('login');
});

app.post('/login', passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/login'
}));


app.get('/modelos', function (req, res) {
    res.sendFile( __dirname + '/dir/database/modelos.xml');
});

let models = [];
app.post("/post-xml", function(req, res) {
  fs.readFile(__dirname + '/dir/database/modelos.xml', function(err, data) {
    parser.parseString(data, function (err, result) {
      nodes = result['Thumbnails']['Nodes'];
      this.models.push(nodes);
      _this = this;
    });
  });
  res.json(models);
})

app.post("/send-xml", function(req, res) {
    const data = req.body;
    var builder = new xml2js.Builder();
    var xml = builder.buildObject(data);
    fs.writeFileSync(__dirname + '/dir/database/modelos-new.xml', xml);
});


app.listen(8080,()=> console.log("Server started"));
