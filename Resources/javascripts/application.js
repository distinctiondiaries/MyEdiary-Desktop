/* DO NOT MODIFY. This file was compiled Thu, 30 Jun 2011 07:37:20 GMT from
 * /Users/ritchiey/Projects/getpositive/myediary/app/coffeescripts/application.coffee
 */

(function() {
  var root;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  root = typeof window !== "undefined" && window !== null ? window : global;
  jQuery(function() {
    root.Todo = (function() {
      __extends(Todo, Backbone.Model);
      function Todo() {
        Todo.__super__.constructor.apply(this, arguments);
      }
      Todo.prototype.EMPTY = 'Empty todo';
      Todo.prototype.initialize = function() {
        if (!this.get('content')) {
          return this.set({
            content: this.EMPTY
          });
        }
      };
      Todo.prototype.toggle = function() {
        return this.save({
          done: this.get('done')
        });
      };
      Todo.prototype.clear = function() {
        this.destroy();
        return this.view.remove();
      };
      return Todo;
    })();
    root.TodoList = (function() {
      __extends(TodoList, Backbone.Collection);
      function TodoList() {
        TodoList.__super__.constructor.apply(this, arguments);
      }
      TodoList.prototype.model = Todo;
      TodoList.prototype.localStorage = new Store('todos');
      TodoList.prototype.done = function() {
        return this.filter(function(todo) {
          return todo.get('done');
        });
      };
      TodoList.prototype.remaining = function() {
        return this.without.apply(this, this.done());
      };
      TodoList.prototype.nextOrder = function() {
        if (!this.length) {
          return 1;
        }
        return this.last().get('order') + 1;
      };
      TodoList.prototype.comparator = function(todo) {
        return this.get('order');
      };
      return TodoList;
    })();
    root.todos = new root.TodoList;
    return root.TodoView = (function() {
      __extends(TodoView, Backbone.View);
      function TodoView() {
        TodoView.__super__.constructor.apply(this, arguments);
      }
      TodoView.prototype.tagName = 'li';
      TodoView.prototype.template = _.template($('#item-template').html());
      TodoView.prototype.events = {
        'click .check': 'toggleDone',
        'dblclick div.todo-content': 'edit',
        'click span.todo-destroy': 'clear',
        'keypress .todo-input': 'updateOnEnter'
      };
      return TodoView;
    })();
  });
}).call(this);
