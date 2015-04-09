(function () {
    "use strict";

    var Todo = function () {
        var object = {
            editing: true,
            completed: false,
            title: '',
            previousTitle: ''
        };

        return object;
    };

    enki.addCustomBinding('onEnter', {
        init: function (bindingContext) {
            var onkeyup = function (event) {
                event.keyCode === 13 && bindingContext.propertyValue();
            };
            enki.addEvent(bindingContext.element, 'onkeyup', onkeyup);
        }
    });

    var ViewModel = function () {
        var self = {};
        self.current = '';
        self.valueUpdate = undefined;
        self.add = function () {
            var todo = new Todo();
            todo.title = self.current.trim();
            self.todos.push(todo);
            self.current = '';
        };
        self.todos = [];
        self.allCompleted = false;
        self.completedCount = 0;
        self.remainingCount = 0;
        self.mode = ''; //options for this are All, Active, Completed
        self.modeOptions = ['All',
            'Active',
            'Completed'];
        self.removeCompleted = function () {
            self.todos = self.todos.filter(function (item) {
                return item.mode === 'Completed'
            });
        };
        var decorateTodoObject = function (todo) {
            todo.editItem = function () {
                todo.editing = true;
                todo.previousTitle = todo.title;
            };
            todo.remove = function (event, model) {
                self.todos = self.todos.select(function (item) {
                    return item === model;
                });
            };
            todo.saveEditing = function (event, model) {
                model.editing = false;
                model.title = model.title.trim();
            };
            todo.stopEditing = function (event, model) {
                model.editing = false;
                model.title = model.previousTitle;
            };
            return todo;
        };
        return self;
    };
    var viewModel = new ViewModel();
    enki.extend(viewModel, 'remainingCountLabel', function (model) {
        return model.remainingCount === 1 ? 'item' : 'items';
    });
    enki.extend(viewModel, 'showModeAll', function (model) {
        return model.mode === 'All';
    });
    enki.extend(viewModel, 'showModeActive', function (model) {
        return model.mode === 'Active';
    });
    enki.extend(viewModel, 'showModeCompleted', function (model) {
        return model.mode === 'Completed'
    });
    enki.extend(viewModel, 'filteredTodos', function (model) {
        switch (model.mode) {
            case 'Active':
                return model.todos.filter(function (item) {
                    return !item.completed;
                });
                break;
            case 'Completed':
                return model.todos.filter(function (item) {
                    return item.completed;
                });
                break;
            default:
                return model.todos;
                break;
        }
    });
    enki.extend(viewModel, 'showTodos', function (model) {
        return model.todos.length;
    });
    enki.extend(viewModel, 'showFooter', function (model) {
        return model.completedCount || model.remainingCount;
    });
    enki.exceptions.shouldHideErrors = false;
    enki.bindDocument(viewModel);
})();