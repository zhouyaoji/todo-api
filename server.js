var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.send("ToDo API Root");
});

// GET /todocs?completed=true&q=house
app.get('/todos', function(req, res) {
  var query = req.query;
  var where = {};
  if (query.hasOwnProperty('completed') && query.completed === 'true') {
     where.completed = true;   
  } else if  (query.hasOwnProperty('completed') && query.completed === 'false') {
     where.completed = false;
  }
  if (query.hasOwnProperty('q') && query.q.length > 0) {
     where.description = { $like: '%' + query.q + '%' };
  }
  db.todo.findAll({
      where: where
  }).then(function (todos) {
       if(todos) {
          res.status(200).json(todos);
       } else {
          res.status(404).send();
       }
  }).catch(function (e) {
       res.status(500).json(e);
   });
});
   
  /*
  var filteredTodos = todos;
  if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
    filteredTodos = _.where(filteredTodos, {
      completed: true
    });
  } else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
    filteredTodos = _.where(filteredTodos, {
      completed: false
    });
  }
  if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
    filteredTodos = _.filter(filteredTodos, function(todo) {
      return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
    });
  }
  res.json(filteredTodos);
});

*/
app.get('/todos/:id', function(req, res) {
  var todoId = parseInt(req.params.id);
  db.todo.findById(todoId).then(function (todo) {
     if(todo) {
       res.json(todo.toJSON());
     } else {
       res.status(404).json({ "error": "There is no todo with the ID " + todoId });
     }
  }, function (e) {
      res.status(500).json(e);
  });
});

app.post('/todos', function(req, res) {
  var body = _.pick(req.body, 'description', 'completed');
  db.todo.create(body).then(function (todo) {
     res.json(todo.toJSON());
    }, function (e) {
      res.status(400).json(e);
  });
});

app.delete('/todos/:id', function(req, res) {
  var todoId = parseInt(req.params.id);
  var matchedTodo = _.findWhere(todos, {
    id: todoId
  })
  if (matchedTodo) {
    todos = _.without(todos, matchedTodo);
    res.status(200).send("The todo with the ID " + todoId.toString() + " has been deleted. Here it is again:\n" + JSON.stringify(matchedTodo));
  } else {
    res.status(400).json({
      "error": "No todo found with the ID " + todoId
    });
  }
});

app.put('/todos/:id', function(req, res) {
  // Find the todo with the given ID.
  var todoId = parseInt(req.params.id);
  var matchedTodo = _.findWhere(todos, {
    id: todoId
  })
  if (!matchedTodo) {
    return res.status(404).json({
      "error": "No todo found with the ID " + todoId
    });
  }
  // Validate request body
  var body = _.pick(req.body, 'description', 'completed');
  var validAttributes = {};
  if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
    validAttributes.completed = body.completed;
  } else if (body.hasOwnProperty('completed')) {
    return res.status(400).json({
      "error": "The propery 'completed' must be a boolean."
    });

  }
  if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
    validAttributes.description = body.description;
  } else if (body.hasOwnProperty('description')) {
    return res.status(400).json({
      "error": "The propery 'description' must be a string."
    });
  }
  _.extend(matchedTodo, validAttributes);
  res.status(200).json(matchedTodo);
});
db.sequelize.sync().then(function() {
   app.listen(PORT, function() {
      console.log("Express is listening on port " + PORT + "!");
   });
});
