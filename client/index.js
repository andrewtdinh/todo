/* global Firebase: true */

'use strict';

$(document).ready(init);

var root, user, tasks;

function init(){
  $('#set-name').click(setName);
  root = new Firebase('https://odot.firebaseio.com/');
  user = root.child('user');
  tasks = root.child('tasks');
  user.on('value', userChanged); //when value changes for the user, run some function
  tasks.on('child_added', taskAdded);
  tasks.on('child_removed', taskRemoved);
  tasks.on('child_changed', taskChanged);
  $('#create-task').click(createTask);
  $('#todos').on('click', '.delete', deleteTask);
  $('#todos').on('change', 'input[type="checkbox"]', toggleComplete);
}

function taskChanged(snapshot){
  var key = snapshot.key();
  var task = snapshot.val();
  var $tr = $('tr[data-key="'+key+'"]');
  var checked = task.isComplete ? 'checked' : '';
  $tr.removeClass().addClass(checked);
  $tr.find('input[type=checkbox]').attr('checked', !!checked);
}

function toggleComplete(){
  var key = $(this).closest('tr').data('key');
  var checked = !!$(this).attr('checked');
  tasks.child(key).update({isComplete:!checked});
}
function taskRemoved(snapshot){
  var key = snapshot.key();
  $('tr[data-key = "' + key +'"]').remove();
}


function deleteTask() {
  var key = $(this).closest('tr').data('key');
  var task = tasks.child(key);
  task.remove();
}

function taskAdded(snapshot){
  var task = snapshot.val();
  var key = snapshot.key();
  var isChecked = task.isComplete ? 'checked' : '';
  var tr = '<tr class="' + isChecked+ '" data-key="'+key+'"><td><button class="delete">&times;</button></td><td><input type="checkbox" '+isChecked+ '></td><td>' + task.title+ '</td><td>' + moment(task.dueDate).format('YYYY-MM-DD')+ '</td><td>' + task.priority + '</td><td>' +moment(task.createdAt).format('YYYY-MM-DD')+ '</td>';
  $('#todos > tbody').append(tr);
}

function createTask(){
  var title = $('#title').val();
  var dueDate = $('#due-date').val();
  dueDate = new Date(dueDate);
  dueDate = dueDate.getTime();
  var priority = $('#priority').val();
  var isComplete = false;
  var createdAt = Firebase.ServerValue.TIMESTAMP;

  var task = {
    title: title,
    dueDate: dueDate,
    priority: priority,
    isComplete: isComplete,
    createdAt: createdAt
  };
  tasks.push(task);
}

function userChanged(snapshot){
  var name = snapshot.val();
  console.log(snapshot.val());
  $('#header').text('Todo: ' + name);
  $('#name').val('');
}

function setName(){
  var name = $('#name').val();
  user.set(name);
}
