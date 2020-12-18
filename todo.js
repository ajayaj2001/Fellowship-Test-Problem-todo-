const operation = process.argv[2];
const values = process.argv[3];
const fs = require('fs');
const path = './todo.txt'
let [month, date, year] = new Date().toLocaleDateString("en-US").split("/")
let obj = {
    pending: [],
    done: []

};

switch (operation) {
    case "help":
        console.log("Usage :-");
        console.log(`$ todo add "todo item"  # Add a new todo`);
        console.log(`$ todo ls               # Show remaining todos`);
        console.log(`$ todo del NUMBER       # Delete a todo`);
        console.log(`$ todo done NUMBER      # Complete a todo`);
        console.log(`$ todo help             # Show usage`);
        console.log(`$ todo report           # Statistics`);
        break;
    case "add":
        if (fs.existsSync(path)) {
            //file exists
            fs.readFile('todo.txt', (err, data) => {
                if (err) {
                    console.log(err);
                } else {
                    obj = JSON.parse(data);
                    obj.pending.push({
                        value: values
                    });
                    let json = JSON.stringify(obj);
                    fs.writeFile('todo.txt', json, function (err, result) {
                        if (err) console.log('error', err);
                        else console.log(`Added todo: "${values}"`);
                    });
                }
            });
        }
        else {
            //file not exist
            obj.pending.push({
                value: process.argv[3]
            });

            let json = JSON.stringify(obj);
            fs.writeFile('todo.txt', json, () => {
                console.log(`Added todo: "${values}"`);
            });

        }
        break;
    case "ls":
        fs.readFile('todo.txt', (err, data) => {
            if (err) {
                console.log(err);
            } else {
                obj = JSON.parse(data);
                if (obj.pending.length == 0) {
                    console.log(" LIST empty");
                }
                else {
                    for (let i = obj.pending.length - 1; i >= 0; i--) {
                        console.log(`[${i + 1}]` + " " + obj.pending[i].value);

                    }
                }
            }
        });
        break;
    case "report":
        fs.readFile('todo.txt', (err, data) => {
            if (err) {
                console.log(err);
            } else {
                obj = JSON.parse(data);
                console.log(`${date + "/" + month + "/" + year}  Pending : ${obj.pending.length}  Completed : ${obj.done.length}`);
            }
        });
        break;

    case "del":
        fs.readFile('todo.txt', (err, data) => {
            if (err) {
                console.log(err);
            } else {
                obj = JSON.parse(data);
                if (process.argv[3] <= obj.pending.length) {
                    obj.pending.splice(values - 1, 1);
                    let json = JSON.stringify(obj);
                    fs.writeFile('todo.txt', json, function (err, result) {
                        if (err) console.log('error', err);
                        else console.log(`Deleted todo  #${values}`);
                    });
                }
                else {
                    console.log(`Error: todo #${values} does not exist. Nothing deleted.`);
                }

            }
        });
        break;
    case "done":
        fs.readFile('todo.txt', (err, data) => {
            if (err) {
                console.log(err);
            } else {
                obj = JSON.parse(data);
                if (process.argv[3] <= obj.pending.length) {
                    obj.done.push({
                        value: obj.pending[values - 1].value
                    });
                    obj.pending.splice(values - 1, 1);

                    let json = JSON.stringify(obj);
                    fs.writeFile('todo.txt', json, function (err, result) {
                        if (err) console.log('error', err);
                        else console.log(`Marked todo: #${values} as done.`);
                    });
                }
                else {
                    console.log(`Error: todo #${values} does not exist.`);
                }

            }
        });


        break;
    default:
        break;
}

