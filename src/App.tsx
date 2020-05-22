import React, {useState} from 'react';
import './App.css';
import {TaskType, TodoList} from "./TodoList";
import {v1} from 'uuid'

export type FilterValueType = "all" | "active" | "completed";

function App() {

    let [tasks, setTasks] = useState<Array<TaskType>>([
        {id: v1(), title: "CSS", isDone: true},
        {id: v1(), title: "JS", isDone: true},
        {id: v1(), title: "REACT", isDone: false},
        {id: v1(), title: "Rest Api", isDone: false},
    ]);
    // Фильтрация тасок
    let [filter, setFilter] = useState<FilterValueType>('all');

    const changeStatus = (id: string, isDone: boolean) => {
        let task = tasks.find(elem => elem.id === id);
        if (task) {
            task.isDone = isDone;
            setTasks([...tasks]);
        }
    }

    let taskForTodoList = tasks;

    if (filter === 'active') {
        taskForTodoList = tasks.filter((task) => task.isDone === false);
    }

    if (filter === 'completed') {
        taskForTodoList = tasks.filter((task) => task.isDone === true);
    }

    const changeFilter = (value: FilterValueType) => {
        setFilter(value);
    }

    // Удаление тасок
    const removeTask = (id: string) => {
        let filteredTasks = tasks.filter((task) => task.id !== id);
        setTasks(filteredTasks)
    }

    // Добавление таски
    const addTask = (title: string) => {
        let task = {id: v1(), title, isDone: false};
        let newArr = [task, ...tasks];
        setTasks(newArr)
    }

    return (
        <div className="App">
            <TodoList title={"What to learn"}
                      filter={filter}
                      tasks={taskForTodoList}
                      removeTask={removeTask}
                      changeFilter={changeFilter}
                      addTask={addTask}
                      changeStatus={changeStatus}
            />
        </div>
    );
}

export default App;
