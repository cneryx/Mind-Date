const express = require('express');
const app = express();
const port = 5000;

app.use(express.static('css'));
app.set('view engine', 'pug');
app.set('views', './');


//app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

app.get('/', (req, res) => res.render('index', { title: 'Kill me', message: 'ENd me' }));
