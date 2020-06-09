
import React, {ChangeEvent} from "react";
import {FilterValueType} from "./App";
import {AddItemForm} from "./AddItemForm";
import EditableSpan from "./EditableSpan";
import {Button, IconButton, } from "@material-ui/core";
import {Delete} from "@material-ui/icons";
import Checkbox, { CheckboxProps } from '@material-ui/core/Checkbox';


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
    removeTodoList: (todoListId: string) => void,
    changeTitle: (id: string, todoListId: string, title: string) => void,
    changeTitleTodoList: (todoListId: string, title: string) => void
}

export const TodoList = (props: PropsType) => {
    const {filter, title, tasks, removeTask, changeFilter, addTask, changeStatus, id, removeTodoList, changeTitle, changeTitleTodoList} = props;

    const onAllClickHandler = () => changeFilter("all", id);
    const onActiveClickHandler = () => changeFilter("active", id);
    const onCompletedClickHandler = () => changeFilter("completed", id);
    const onDeleteTodoList = () => removeTodoList(id);
    const addTaskHandler = (title: string) => {
        addTask(title, id);
    }
    const onChangeTitleTodoList = (title: string) => {
        changeTitleTodoList(id, title);
    }

    const addTaskwrap  = (title:string) => {
        addTask(title, id);
    }

    return (
        <div>
            <h3>
                <EditableSpan value={title} onChange={onChangeTitleTodoList}/>
                {/*<button onClick={onDeleteTodoList}>x</button>*/}
                <IconButton onClick={onDeleteTodoList}>
                    <Delete />
                </IconButton>
            </h3>

            <AddItemForm addItem={addTaskHandler}/>

            <ul style={ {listStyleType:"none", paddingLeft:"0"}}>
                {
                    tasks.map(({id, title, isDone}) => {
                        const onRemoveHandler = () => removeTask(id, props.id);
                        const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
                            changeStatus(id, e.currentTarget.checked, props.id);
                        }
                        const onChangeTitleHandler = (title: string) => {
                            changeTitle(id, props.id, title)
                        }
                        return (
                            <li key={id} className={isDone ? 'is-done' : ''}>
                               {/* <input type="checkbox"
                                       checked={isDone}
                                       onChange={onChangeHandler}/>*/}
                                <Checkbox  color={"primary"}
                                    checked={isDone}
                                           onChange={onChangeHandler} />
                                <EditableSpan value={title} onChange={onChangeTitleHandler}/>
                                {/*<span>{title}</span>*/}
                                {/*<button onClick={onRemoveHandler}>x</button>*/}
                                <IconButton onClick={onRemoveHandler}>
                                    <Delete />
                                </IconButton>
                            </li>
                        )
                    })
                }
            </ul>
            <div>
                <Button color={"primary"}  variant={filter === 'all' ? "outlined" : "text"}
                    // className={filter === 'all' ? 'active-filter' : ''}
                    onClick={onAllClickHandler}>All
                </Button>
                <Button color={"primary"} variant={filter === 'active' ? "outlined" : "text"}
                    // className={filter === 'active' ? 'active-filter' : ''}
                    onClick={onActiveClickHandler}>Active
                </Button>
                <Button color={"primary"} variant={filter === 'completed' ? "outlined" : "text"}
                    // className={filter === 'completed' ? 'active-filter' : ''}
                    onClick={onCompletedClickHandler}>Completed
                </Button>
            </div>
        </div>
    );
}

