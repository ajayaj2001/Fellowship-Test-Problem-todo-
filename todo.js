const fs = require('fs');

const operation = process.argv[2];
const value = process.argv[3];
const path = './todo.txt'
const [month, date, year] = new Date().toLocaleDateString("en-US").split("/")
let todoList = {
    pending: [],
    done: []
};

initializeTodoListFromFile();
performTodoOperation();
storeTodoListToFile();


function initializeTodoListFromFile() {
    if (fs.existsSync(path)) {
        const data = fs.readFileSync(path);
        todoList = JSON.parse(data);
    }
}

function performTodoOperation() {
    switch (operation) {
        case "help":
            printHelp();
            break;
        case "add":
            addTodo();
            break;
        case "ls":
            listTodo();
            break;
        case "del":
            deleteTodo();
            break;
        case "done":
            markTodoAsDone();
            break;
        case "report":
            reportTodo();
            break;
        default:
            printHelp();
            break;
    }
}

function printHelp() {
    console.log(`Usage :-
$ ./todo add "todo item"  # Add a new todo
$ ./todo ls               # Show remaining todos
$ ./todo del NUMBER       # Delete a todo
$ ./todo done NUMBER      # Complete a todo
$ ./todo help             # Show usage
$ ./todo report           # Statistics`);
}

function addTodo() {
    if (value) {
        todoList.pending.push(value);
        console.log(`Added todo: "${value}"`);
    } else {
        console.log("Error: Missing todo string. Nothing added!");
    }
}

function listTodo() {
    if (todoList.pending.length === 0) {
        console.log("There are no pending todos!");
    } else {
        for (let i = todoList.pending.length - 1; i >= 0; i--) {
            console.log(`[${i + 1}]` + " " + todoList.pending[i]);

        }
    }
}

function deleteTodo() {
    if (value) {
        const delValue = Number(value);
        if (delValue && delValue <= todoList.pending.length) {
            todoList.pending.splice(delValue - 1, 1);
            console.log(`Deleted todo #${value}`);
        } else {
            console.log(`Error: todo #${value} does not exist. Nothing deleted.`);
        }
    } else {
        console.log("Error: Missing NUMBER for deleting todo.");
    }
}

function markTodoAsDone() {
    if (value) {
        const doneValue = Number(value);
        if (doneValue && doneValue <= todoList.pending.length) {
            todoList.done.push(todoList.pending[doneValue - 1]);
            todoList.pending.splice(doneValue - 1, 1);

            console.log(`Marked todo #${value} as done.`);
        } else {
            console.log(`Error: todo #${value} does not exist.`);
        }
    } else {
        console.log("Error: Missing NUMBER for marking todo as done.");
    }
}

function reportTodo() {
    console.log(`${year + "-" + month + "-" + date} Pending : ${todoList.pending.length} Completed : ${todoList.done.length}`);
}

function storeTodoListToFile() {
    fs.writeFileSync(path, JSON.stringify(todoList));
}
