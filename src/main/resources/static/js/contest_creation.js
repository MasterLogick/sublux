var taskTable = document.getElementById("tasksTable");
addListeners();
taskTableCheckAndFill();

function addListeners() {
    taskTable.querySelectorAll("tr").forEach(tr => {
        if (!tr.classList.contains("listened"))
            addListener(tr);
    });
}

function addListener(tr) {
    newActionListenerAdd(tr, tr.children.item(1).firstElementChild);
    newActionListenerRemove(tr, tr.children.item(2).firstElementChild);
    tr.classList.add("listened")
}

function newActionListenerAdd(tr, icon) {
    icon.addEventListener("mousedown", () => {
        tr.parentNode.insertBefore(newTaskFieldRow(), tr.nextSibling);
    })
}

function newActionListenerRemove(tr, icon) {
    icon.addEventListener("mousedown", () => {
        tr.parentNode.removeChild(tr);
        taskTableCheckAndFill();
    });
}

function newTaskFieldRow() {
    var tr = document.createElement("tr");
    var input = document.createElement("input");
    input.setAttribute("name", "taskIds");
    var td = document.createElement("td");
    td.appendChild(input);
    tr.appendChild(td);
    var addIcon = document.createElement("img");
    addIcon.src = "/img/plus.svg";
    td = document.createElement("td");
    td.appendChild(addIcon);
    tr.appendChild(td);
    var removeIcon = document.createElement("img");
    removeIcon.src = "/img/minus.svg";
    td = document.createElement("td");
    td.appendChild(removeIcon);
    tr.appendChild(td);
    addListener(tr);
    return tr;
}

function taskTableCheckAndFill() {
    if (taskTable.childElementCount === 0) {
        taskTable.appendChild(newTaskFieldRow());
    }
}