var tasks = {};

var createTask = function(taskText, taskDate, taskList) {
  // create elements that make up a task item
  var taskLi = $("<li>").addClass("list-group-item");
  var taskSpan = $("<span>")
    .addClass("badge badge-primary badge-pill")
    .text(taskDate);
  var taskP = $("<p>")
    .addClass("m-1")
    .text(taskText);

  // append span and p element to parent li
  taskLi.append(taskSpan, taskP);


  // append to ul list on the page
  $("#list-" + taskList).append(taskLi);
};

var loadTasks = function() {
  tasks = JSON.parse(localStorage.getItem("tasks"));

  // if nothing in localStorage, create a new object to track all task status arrays
  if (!tasks) {
    tasks = {
      toDo: [],
      inProgress: [],
      inReview: [],
      done: []
    };
  }

  // loop over object properties
  $.each(tasks, function(list, arr) {
    console.log(list, arr);
    // then loop over sub-array
    arr.forEach(function(task) {
      createTask(task.text, task.date, list);
    });
  });
};

var saveTasks = function() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

$(".list-group").on('click', 'p', function() {
  let text = $(this)
    .text()
    .trim();

  let textInput = $("<textarea>")
    .addClass("form-control")
    .val(text);

  $(this).replaceWith(textInput);

  textInput.trigger("focus");
});

$(".list-group").on('blur', 'textarea', function() {
  let text = $(this)
    .val()
    .trim();

  let status = $(this)
    .closest(".list-group")
    .attr("id")
    .replace("list-", "");

  let index = $(this)
    .closest(".list-group-item")
    .index();

  tasks[status][index].text = text;

  saveTasks();

  let taskP = $('<p>')
    .addClass('m-1')
    .text(text);

  $(this).replaceWith(taskP);
});

$('.list-group').on('click', 'span', function() {
  let date = $(this)
    .text()
    .trim();

  let dateInput = $('<input>')
    .attr('type', 'text')
    .addClass('form-control')
    .val(date);

  $(this).replaceWith(dateInput);

  dateInput.trigger('focus');
});

$('.list-group').on('blur', 'input[type="text"]', function() {
  let date = $(this)
    .val()
    .trim();

  let status = $(this)
    .closest('.list-group')
    .attr('id')
    .replace('list-', '');

  let index = $(this)
    .closest('.list-group-item')
    .index();

  tasks[status][index].date = date;
  saveTasks();

  let taskSpan = $('<span>')
    .addClass('badge badge-primary badge-pill')
    .text(date);

  $(this).replaceWith(taskSpan);
});

$('.card .list-group').sortable({
  connectWith: $('.card .list-group'),
  scroll: false,
  tolerance: 'pointer',
  helper: 'clone',
  activate: function(event) {
  },
  deactivate: function(event) {
  },
  over: function(event) {
  },
  out: function(event) {
  },
  update: function(event) {
    let tempArr = [];

    $(this).children().each(function() {
      let text = $(this)
        .find('p')
        .text()
        .trim();

      let date = $(this)
        .find('span')
        .text()
        .trim();

      tempArr.push({
        text: text,
        date: date
      });
    });
    
    let arrName = $(this)
      .attr('id')
      .replace('list-', '');

    tasks[arrName] = tempArr;
    saveTasks();
  }
})

$('#trash').droppable({
  accept: '.card .list-group-item',
  tolerance: 'touch',
  drop: function(event, ui) {
    ui.draggable.remove();
  },
  over: function(event, ui) {
    console.log('over');
  },
  out: function(event, ui) {
    console.log('out');
  }
});

// modal was triggered
$("#task-form-modal").on("show.bs.modal", function() {
  // clear values
  $("#modalTaskDescription, #modalDueDate").val("");
});

// modal is fully visible
$("#task-form-modal").on("shown.bs.modal", function() {
  // highlight textarea
  $("#modalTaskDescription").trigger("focus");
});

// save button in modal was clicked
$("#task-form-modal .btn-primary").click(function() {
  // get form values
  var taskText = $("#modalTaskDescription").val();
  var taskDate = $("#modalDueDate").val();

  if (taskText && taskDate) {
    createTask(taskText, taskDate, "toDo");

    // close modal
    $("#task-form-modal").modal("hide");

    // save in tasks array
    tasks.toDo.push({
      text: taskText,
      date: taskDate
    });

    saveTasks();
  }
});

// remove all tasks
$("#remove-tasks").on("click", function() {
  for (var key in tasks) {
    tasks[key].length = 0;
    $("#list-" + key).empty();
  }
  saveTasks();
});

// load tasks for the first time
loadTasks();


