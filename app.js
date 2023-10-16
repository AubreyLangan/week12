$(document).ready(function() {
    const apiUrl = 'http://localhost:3000';

    function fetchTasks() {
        $.get(`${apiUrl}/tasks`, function(tasks) {
            renderTasks(tasks);
        });
    }

    function renderTasks(tasks) {
        const taskList = $('#taskList');
        taskList.empty();
        tasks.forEach(function(task, index){
            taskList.append(`
            <li class="list-group-item">
                <input type="checkbox" class="complete-task">
                <span class="task-title">${task.title}</span>
                <button class="btn btn-primary btn-sm float-right edit" data-id="${task.id}">Edit</button>
                <button class="btn btn-danger btn-sm float-right delete" data-id="${task.id}">Delete</button>
            </li>
            `);
        });
    }

    const tasks = [
        { id: 1, title: "Task 1" },
        { id: 2, title: "Task 2" }
    ];

    function updateTask(taskId, newTitle) {
        $.ajax({
            url: `${apiUrl}/tasks/${taskId}`,
            type: 'PUT',
            data: { title: newTitle },
            success: function() {
                fetchTasks();
            }
        });
    }

    $('#addTask').click(function() {
        const taskInput = $('#taskInput');
        const taskText = taskInput.val().trim();
        if (taskText) {
            $.post(`${apiUrl}/tasks`, { title: taskText }, function(newTask) {
            taskInput.val('');
            fetchTasks();   
            });
        }
    });

    $('#taskList').on('click', 'button.delete', function() {
        const taskId = $(this).data('id');
        $.ajax({
            url: `${apiUrl}/tasks/${taskId}`,
            type: 'DELETE',
            success: function() {
                fetchTasks();
            }
        });
    });

    $('#taskList').on('click', 'button.edit', function(){
        const taskItem = $(this).closest('li');
        const taskId = $(this).data('id');
        const taskTitle = taskItem.find('.task-title').text();
        const newTitle = prompt('Edit task:', taskTitle);

        if (newTitle !== null) {
            updateTask(taskId, newTitle);
        }

        if (taskItem.find('.complete-task').prop('checked')) {
            taskItem.addClass('Completed');
        } else {
            taskItem.removeClass('Completed');
        }
    });

    fetchTasks();
});