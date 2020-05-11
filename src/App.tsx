import React, {useState} from 'react';
import './App.css';
import {TaskType, TodoList} from "./TodoList";
import {v1} from 'uuid'

export type FilterValueType = "all" | "active" | "completed";

function App() {

    let [tasks, setTasks] = useState<Array<TaskType>>([
        {id: v1(), title: "CSS", isDone: true},
        {id: v1(), title: "JS", isDone: true},
        {id: v1(), title: "REACT", isDone: false}
    ]);

    let [filter, setFilter] = useState<FilterValueType>('all');

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

    const removeTask = (id: string) => {
        let filteredTasks = tasks.filter((task) => task.id !== id);
        setTasks(filteredTasks)
    }

    return (
        <div className="App">
            <TodoList title={"What to learn"}
                      tasks={taskForTodoList}
                      removeTask={removeTask}
                      changeFilter={changeFilter}/>
        </div>
    );
}

export default App;
