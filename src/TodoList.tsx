import React, {ChangeEvent, useState, KeyboardEvent} from "react";
import {FilterValueType} from "./App";

export type TaskType = {
    id: string,
    title: string,
    isDone: boolean
}
type PropsType = {
    title: string,
    tasks: Array<TaskType>,
    removeTask: (id: string) => void,
    changeFilter: (value: FilterValueType) => void,
    addTask: (title: string) => void
}

export const TodoList = (props: PropsType) => {
    const {title, tasks, removeTask, changeFilter, addTask} = props;

    let [valueTask, setValueTask] = useState<string>('');

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setValueTask(e.currentTarget.value)
    }
    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.ctrlKey && e.charCode === 13) {
            addTask(valueTask);
            setValueTask('');
        }
    }
    const addTaskHandler = () => {
        addTask(valueTask);
        setValueTask('');
    }
    const onAllClickHandler = () => changeFilter("all");
    const onActiveClickHandler = () => changeFilter("active");
    const onCompletedClickHandler = () => changeFilter("completed");

    return (
        <div>
            <h3>{title}</h3>
            <div>
                <input value={valueTask}
                       onChange={onChangeHandler}
                       onKeyPress={onKeyPressHandler}/>
                <button onClick={addTaskHandler}>+
                </button>
            </div>
            <ul>
                {
                    tasks.map(({id, title, isDone}) => {
                        const onRemoveHandler = () => removeTask(id);
                        return (
                            <li key={id}>
                                <input type="checkbox" checked={isDone}/> <span>{title}</span>
                                <button onClick={onRemoveHandler}>x</button>
                            </li>
                        )
                    })
                }
            </ul>
            <div>
                <button onClick={onAllClickHandler}>All</button>
                <button onClick={onActiveClickHandler}>Active</button>
                <button onClick={onCompletedClickHandler}>Completed</button>
            </div>
        </div>
    );
}