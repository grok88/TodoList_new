import React from 'react';
import './App.css';
import {TaskType, TodoList} from "./TodoList";

function App() {
    const tasks1:Array<TaskType> = [
        {id: 1, title: "CSS", isDone: true},
        {id: 2, title: "JS", isDone: true},
        {id: 3, title: "REACT", isDone: false}
    ];
    const tasks2:Array<TaskType> = [
        {id: 1, title: "Milk", isDone: true},
        {id: 2, title: "Bread", isDone: true},
        {id: 3, title: "The Earth", isDone: false}
    ];

    return (
        <div className="App">
            <TodoList title={"What to learn"} tasks={tasks1}/>
            <TodoList title={"What to buy"} tasks={tasks2} />
            {/*<TodoList title={"What to sell"}/>*/}
        </div>
    );
}

export default App;
