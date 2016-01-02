var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [{ 
  id: 1,
  description: "Meet mom for lunch",
  completed: false
},
{ 
   id: 2,
   description: "Go to market",
   completed: false
},
{
  id: 3,
  description: "Drink coffee",
  completed: true
}
];

app.get('/', function (req, res) {
  res.send("ToDo API Root");
});

app.listen(PORT, function(){
  console.log("Express is listening on port " + PORT + "!");
});

// GET /todos
app.get('/todos', function(req, res) {
  res.json(todos);
});

// GET /todos/:id
app.get('/todos/:id', function(req, res) {
  var todoId = parseInt(req.params.id);
  var matchedTodo;
  //res.send('Asking for todo with ID of ' + req.params.id);
  // Iterate over todos array and find match
  // Send 
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
