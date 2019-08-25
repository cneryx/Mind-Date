const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const mustacheExpress = require('mustache-express');
const app = express();

const port = 5000;

app.engine('html', mustacheExpress());
app.use('/css', express.static('css'));
app.use('/images', express.static('images'));
app.use('/js', express.static('js'));
app.use('/fonts', express.static('fonts'));
app.use('/img', express.static('img'));
app.set('view engine', 'html');
app.set('views', '');

app.use(cookieParser());
app.use(session({secret: "hackthe8minus2ix"}));
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

//app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

app.get('/', (req, res) => res.render('index', { title: 'Kill me', message: 'ENd me' }));

app.get('/sessionTest', function(req, res) {
    var out = "";
   if (req.session.page_views) {
       req.session.page_views++;
       out += "Visited " + req.session.page_views + " times";
   } else {
       req.session.page_views = 1;
       out += "Welcome to this page for the first time!";
   }

   if (req.session.user) {
       out += "<br> Welcome " + req.session.user + "!";
   } else {
       out += "<br>You are currently unregistered";
   }

   res.send(out);
});

app.post('/login', function(req, res) {
    //if (req.query.success) {
        req.session.user = req.body.email;
        res.send("Now logged in as " + req.session.user);
    //} else {
        //res.send("Unsuccessful Login.");
    //}
});

app.get('/login', function(req, res) {
    res.send(
        "<form method='post'>" +
        "<input type='text' name='user'>" +
        "<input type='submit' value='Enter!'>" +
        "</form>"
    )
});

app.get('/:wildcard', function(req, res) {
    res.render(req.params.wildcard)
});

