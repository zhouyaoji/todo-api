var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send("ToDo API Root");
});

app.get('/todos', function(req, res) {
  res.json(todos);
});

app.get('/todos/:id', function(req, res) {
  var todoId = parseInt(req.params.id);
  var matchedTodo;
  todos.forEach(function(todo) {
    if (todoId === todo.id) {
      matchedTodo = todo;
    }
  });
  if(matchedTodo) {
    res.json(matchedTodo);
  } else {
    res.status(404).send("No match found!");
  }
});

app.post('/todos', function (req, res) {
   var body = req.body;
   if(body.description) {
     body.id = todoNextId++;
     todos.push(body);
     res.json(body); 
   } else {
     res.status(404).send("No request body provided.");
  }
});

app.listen(PORT, function(){
  console.log("Express is listening on port " + PORT + "!");
});
