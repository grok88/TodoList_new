import React, {ChangeEvent, useState, KeyboardEvent} from "react";
import {FilterValueType} from "./App";

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
    removeTask: (id: string,todoListId: string) => void,
    changeFilter: (value: FilterValueType, todoListId: string) => void,
    addTask: (title: string, todoListId: string) => void,
    changeStatus: (id: string, isDone: boolean, todoListId: string) => void,
    removeTodoList:(todoListId: string)=> void
}

export const TodoList = (props: PropsType) => {

    const {filter, title, tasks, removeTask, changeFilter, addTask, changeStatus, id, removeTodoList} = props;

    let [valueTask, setValueTask] = useState<string>('');
    let [error, setError] = useState<string | null>(null);

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setError(null);
        setValueTask(e.currentTarget.value)
    }
    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.charCode === 13) {
            addTask(valueTask, id);
            setValueTask('');
        }
    }
    const addTaskHandler = () => {
        if (valueTask.trim()) {
            addTask(valueTask, id);
        } else {
            setError('Title is required');
        }
        setValueTask('');
    }
    const onAllClickHandler = () => changeFilter("all", id);
    const onActiveClickHandler = () => changeFilter("active", id);
    const onCompletedClickHandler = () => changeFilter("completed", id);
    const onDeleteTodoList = () => removeTodoList(id);

    return (
        <div>
            <h3>
                {title}
                <button onClick={onDeleteTodoList}>x</button>
            </h3>
            <div>
                <input value={valueTask}
                       onChange={onChangeHandler}
                       onKeyPress={onKeyPressHandler}
                       className={error ? 'error' : ''}
                />
                <button onClick={addTaskHandler}>+
                </button>
                {error && <div className={'error-message'}>{error}</div>}
            </div>
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