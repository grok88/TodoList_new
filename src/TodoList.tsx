import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import {FilterValueType} from "./App";
import {AddItemForm} from "./AddItemForm";

export type TaskType = {
    id: string,
    title: string,
    isDone: boolean
}
type PropsType = {
    id: string,
    filter: FilterValueType,
    title: string,
    tasks: Array<TaskType>,
    removeTask: (id: string, todoListId: string) => void,
    changeFilter: (value: FilterValueType, todoListId: string) => void,
    addTask: (title: string, id:string) => void,
    changeStatus: (id: string, isDone: boolean, todoListId: string) => void,
    removeTodoList: (todoListId: string) => void
}

export const TodoList = (props: PropsType) => {

    const {filter, title, tasks, removeTask, changeFilter, addTask, changeStatus, id, removeTodoList} = props;

    const onAllClickHandler = () => changeFilter("all", id);
    const onActiveClickHandler = () => changeFilter("active", id);
    const onCompletedClickHandler = () => changeFilter("completed", id);
    const onDeleteTodoList = () => removeTodoList(id);

    const addTaskwrap  = (title:string) => {
        addTask(title, id);
    }

    return (
        <div>
            <h3>
                {title}
                <button onClick={onDeleteTodoList}>x</button>
            </h3>
            <AddItemForm  addItem={addTaskwrap}/>
            <ul>
                {
                    tasks.map(({id, title, isDone}) => {
                        const onRemoveHandler = () => removeTask(id, props.id);
                        const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
                            changeStatus(id, e.currentTarget.checked, props.id);
                        }
                        return (
                            <li key={id} className={isDone ? 'is-done' : ''}>
                                <input type="checkbox"
                                       checked={isDone}
                                       onChange={onChangeHandler}/> <span>{title}</span>
                                <button onClick={onRemoveHandler}>x</button>
                            </li>
                        )
                    })
                }
            </ul>
            <div>
                <button
                    className={filter === 'all' ? 'active-filter' : ''}
                    onClick={onAllClickHandler}>All
                </button>
                <button
                    className={filter === 'active' ? 'active-filter' : ''}
                    onClick={onActiveClickHandler}>Active
                </button>
                <button
                    className={filter === 'completed' ? 'active-filter' : ''}
                    onClick={onCompletedClickHandler}>Completed
                </button>
            </div>
        </div>
    );
}

