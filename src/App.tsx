import React, {useState} from 'react';
import './App.css';
import {TaskType, TodoList} from "./TodoList";
import {v1} from 'uuid'
import {AddItemForm} from "./AddItemForm";

export type FilterValueType = "all" | "active" | "completed";

type TodoList = {
    id: string;
    title: string;
    filter: FilterValueType;
}

type TaskStateType = {
    [key: string]: Array<TaskType>;
}

function App() {
    let todoListId1 = v1();
    let todoListId2 = v1();

    let [todoLists, setTodoLists] = useState<Array<TodoList>>([
        {id: todoListId1, title: 'What to learn', filter: 'all'},
        {id: todoListId2, title: 'What to buy', filter: 'active'},
    ]);

    let [tasks, setTasks] = useState<TaskStateType>({
        [todoListId1]: [
            {id: v1(), title: "CSS", isDone: true},
            {id: v1(), title: "JS", isDone: true},
            {id: v1(), title: "REACT", isDone: false},
            {id: v1(), title: "Rest Api", isDone: false},
        ],
        [todoListId2]: [
            {id: v1(), title: "Milk", isDone: true},
            {id: v1(), title: "apple", isDone: true},
            {id: v1(), title: "Beer", isDone: false},

        ],
    });


    // изменение чекбокса таски
    const changeStatus = (id: string, isDone: boolean, todoListId: string) => {
        let todoTasks = tasks[todoListId];
        let task = todoTasks.find(elem => elem.id === id);
        if (task) {
            task.isDone = isDone;
            setTasks({...tasks});
        }
    }
    // Изменение тайтла todoList
    const changeTitleTodoList = (todoListId: string, title: string) => {
        const todoList = todoLists.find(tl => tl.id === todoListId);
        if (todoList) {
            todoList.title = title;
        }
        setTodoLists([...todoLists]);
    }

    // Изменение тайтла таски
    const changeTitle = (id: string, todoListId: string, title: string) => {
        let todoTasks = tasks[todoListId];
        let task = todoTasks.find(elem => elem.id === id);
        if (task) {
            task.title = title;
            setTasks({
                ...tasks
            });
        }
    }

    const changeFilter = (value: FilterValueType, todoListId: string) => {
        let todoList = todoLists.find(elem => elem.id === todoListId);
        if (todoList) {
            todoList.filter = value;
        }
        setTodoLists([...todoLists]);
    }

    // Удаление тасок
    const removeTask = (id: string, todoListId: string) => {
        let todoList = tasks[todoListId];
        tasks[todoListId] = todoList.filter((task) => task.id !== id);
        setTasks({...tasks});
    }

    // Добавление таски
    const addTask = (title: string, todoListId: string) => {
        let task = {id: v1(), title, isDone: false};
        let todoList = tasks[todoListId];
        tasks[todoListId] = [task, ...todoList];
        setTasks({...tasks});
    }

    // Удаление таски-листа
    const removeTodoList = (todoListId: string) => {
        let deleteTodoList = todoLists.filter(elem => elem.id !== todoListId);
        setTodoLists(deleteTodoList);
        delete tasks[todoListId];
        setTasks({...tasks});
    }

    // Добавление таски
    const addTodoList = (title: string) => {
        let todoList: TodoList = {
            id: v1(),
            title,
            filter: 'all'
        }
        setTodoLists([todoList, ...todoLists]);
        setTasks({
            ...tasks,
            [todoList.id]: []
        });
    }

    return (
        <div className="App">

            <AddItemForm addItem={addTodoList}/>

            {
                todoLists.map((tl) => {

                    let taskForTodoList = tasks[tl.id];
                    if (tl.filter === 'active') {
                        taskForTodoList = taskForTodoList.filter((task) => task.isDone === false);
                    }
                    if (tl.filter === 'completed') {
                        taskForTodoList = taskForTodoList.filter((task) => task.isDone === true);
                    }

                    return <TodoList
                        key={tl.id}
                        title={tl.title}
                        id={tl.id}
                        filter={tl.filter}
                        tasks={taskForTodoList}
                        removeTask={removeTask}
                        changeFilter={changeFilter}
                        addTask={addTask}
                        changeStatus={changeStatus}
                        removeTodoList={removeTodoList}
                        changeTitle={changeTitle}
                        changeTitleTodoList={changeTitleTodoList}
                    />
                })
            }
        </div>
    );
}

export default App;

