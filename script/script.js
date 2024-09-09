const form = document.getElementById('add-task')
const itemsArray = localStorage.getItem('Tarefa') ? JSON.parse(localStorage.getItem("Tarefa")) : []

if (itemsArray.length > 0) {
    loadTask()
}

function loadTask() {

    for (let i = 0; i < itemsArray.length; i++) {

        const list = document.createElement('ul')
        const toDoList = document.querySelector('.todo-list')
        list.classList.add("todo-list_ul")

        const content = `
        <li class="list-item" >${itemsArray[i]}

        <div class="div-btn_task">
            <button class="btn_task done-btn">
                <i class="fa-solid fa-check"></i>
            </button>
            <button class="btn_task edit-btn">
                <i class="fa-solid fa-pen"></i>
            </button>
            <button class="btn_task delete-btn">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>
        </li>
        `
        list.innerHTML = content
        toDoList.appendChild(list)

    }
}

function addTask(task) {
    itemsArray.push(task.value)
    localStorage.setItem('Tarefa', JSON.stringify(itemsArray))
    location.reload()
    loadTask()
}

function editTask(list, oldTask) {
    toggleForm()
    const taskValue = document.getElementById('edited-task')
    taskValue.value = oldTask

    const btnEdit = document.querySelector('.btn-edit_confirm')
    btnEdit.addEventListener('click', (event) => {
        event.preventDefault()
        list.forEach((item, i) => {
            const textNode = item.childNodes[0]
            if (textNode.nodeValue.trim() === oldTask) {
                textNode.nodeValue = taskValue.value.trim()
                itemsArray[i] = taskValue.value.trim()
                localStorage.setItem('Tarefa', JSON.stringify(itemsArray))
            }
        })
        toggleForm()
        location.reload()
    })

}

const deleteBtn = document.querySelectorAll('.delete-btn')
deleteBtn.forEach((db, i) => {
    db.addEventListener('click', () => {
        itemsArray.splice(i, 1)
        localStorage.setItem('Tarefa', JSON.stringify(itemsArray))
        const item = document.querySelector('.todo-list_ul')
        item.parentNode.removeChild(item)
        location.reload()
    })

})

const searchValue = document.getElementById('search')
searchValue.addEventListener('input', () => {
    const listItem = document.querySelectorAll('.list-item')
    const searchTerm = searchValue.value.trim().toLowerCase()
    listItem.forEach((item, i) => {
        item.classList.add('hide')
        if (itemsArray[i].toLowerCase().includes(searchTerm)) {
            item.classList.remove('hide')
        } else if (searchTerm.value === "") {
            item.classList.remove('hide')
        }
    })
})

function backDel() {
    const text = searchValue.value;
    let word = text.split('')
    word.pop()
    word = word.join('')   
    searchValue.value = word
}

function filterOp() {
    const filterSelect = document.getElementById('filter-select')
    const items = document.querySelectorAll('.todo-list_ul')
    items.forEach((item) => {
        const iClass = item.classList
        switch (filterSelect.value) {
            case "all":
                if(iClass.contains('hide')) {
                    iClass.toggle('hide')
                }
                break;
            case "done":
                if (!iClass.contains('done')) {
                    iClass.add('hide')
                } else if (iClass.contains('done') && iClass.contains('hide')) {
                    iClass.remove('hide')
                } else {
                    iClass.remove('hide')
                }
                break;
            case "todo":
                if (iClass.contains('done') && !iClass.contains('hide')) {
                    iClass.add('hide')
                } else if (!iClass.contains('done') && iClass.contains('hide')) {
                    iClass.remove('hide')
                }
                break;
        }

    })
}

function toggleForm() {
    const addTask = document.querySelector('#add-task')
    const editTask = document.querySelector('#edit-task')
    const toDoList = document.querySelector('.todo-list')
    addTask.classList.toggle('hide')
    editTask.classList.toggle('hide')
    toDoList.classList.toggle('hide')
}

form.addEventListener('submit', (event) => {
    event.preventDefault()
    const task = document.getElementById('task')
    addTask(task)
    task.value = ""
    task.focus()
})

const filter = document.getElementById('filter-select')
filter.addEventListener('change', filterOp)

document.addEventListener('click', (event) => {
    const evento = event.target
    const parentEl = evento.closest('ul')
    if (evento.classList.contains('done-btn')) {
        parentEl.classList.toggle('done')
    }
    else if (evento.classList.contains('edit-btn')) {
        const toDoTask = document.querySelectorAll('.list-item')
        const oldTask = evento.closest('.list-item').childNodes[0].nodeValue.trim()
        editTask(toDoTask, oldTask)
    }
    else if (evento.classList.contains('cancel-edit_btn')) {
        const taskValue = document.getElementById('edited-task')
        taskValue.value = ""
        toggleForm()
    }
    else if (evento.id == 'btn-backDel') {
        event.preventDefault()
        backDel()
    }
})
