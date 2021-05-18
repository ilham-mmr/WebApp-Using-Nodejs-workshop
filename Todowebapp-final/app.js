const express = require('express');
const app = express();
const Todo = require('./model/todos');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/todoapp',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('database connected');
});

const methodOverride = require('method-override');
// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));

app.use(express.urlencoded({ extended: true }));


app.set('view engine', 'ejs');

// home route
app.get('/', function (req, res) {
    res.render('home');
});

// show all todos items
app.get('/todos', function (req, res) {
    Todo.find({})
        .then(function (todos) {
            res.render('index', { todos });
        }).catch(function (e) {
            console.log(e);
            res.end();
        });
});

// add todo item
app.post('/todos', function (req, res) {
    const { name } = req.body;
    const todo = new Todo({ name });
    todo.save()
        .then(function () {
            console.log('todo item added');
            res.redirect('/todos');
        }).catch(function (e) {
            res.end();
        })
});

// delete product
app.delete('/todos/:id', function (req, res) {
    const { id } = req.params;
    Todo.findByIdAndDelete(id)
        .then(function () {
            console.log('item deleted')
            res.redirect('/todos');
        }).catch(function (e) {
            console.log(e);
            res.end();
        });;
})

// get an edit form
app.get('/todos/:id/edit', function (req, res) {
    const { id } = req.params;
    Todo.findById(id)
        .then(function (todo) {
            res.render('edit', { todo });
        }).catch(function (e) {
            res.end("<h1>oops there's an error</h1>");
        });
})

//update product
app.put('/todos/:id', function (req, res) {
    const { id } = req.params;
    const { name } = req.body;
    Todo.findByIdAndUpdate(id, { name })
        .then(function () {
            res.redirect('/todos');
        }).catch(function (e) {
            console.log(e);
            res.end("<h1>oops there's an error</h1>");
        });
});



app.listen(3000, function () {
    console.log('server created!');
})

