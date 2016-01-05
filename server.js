var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
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
  var matchedTodo = _.findWhere(todos, { id: todoId});
  if(matchedTodo) {
    res.json(matchedTodo);
  } else {
    res.status(404).send("No match found!");
  }
});

app.post('/todos', function (req, res) {
   var body = _.pick(req.body, 'description', 'completed');
   if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
      return res.status(400).send("Data was badly formed.");
   }
   body.id = todoNextId++;
   body.description = body.description.trim();
   todos.push(body);
   res.json(body); 
});

app.delete('/todos/:id', function (req, res) {
    var todoId = parseInt(req.params.id);
     var matchedTodo = _.findWhere(todos, { id: todoId})
     if (matchedTodo) {
       todos = _.without(todos, matchedTodo); 
       res.status(200).send("The todo with the ID " + todoId.toString() + " has been deleted. Here it is again:\n" + JSON.stringify(matchedTodo));
     } else {
       res.status(400).json({ "error": "No todo found with the ID " + todoId } );
     }
});
app.listen(PORT, function(){
  console.log("Express is listening on port " + PORT + "!");
});
