import React, {ChangeEvent, useCallback} from "react";
import Checkbox from "@material-ui/core/Checkbox";
import EditableSpan from "./EditableSpan";
import {IconButton} from "@material-ui/core";
import {Delete} from "@material-ui/icons";
import {TaskStatuses, TaskType} from "./api/tasks-api";


type TaskPropsType = {
    removeTask: (id: string, todoListId: string) => void,
    changeStatus: (id: string, status: TaskStatuses, todoListId: string) => void,
    changeTitle: (id: string, todoListId: string, title: string) => void,
    id: string,
    todoListId: string,
    task: TaskType
}
export const Task = React.memo((props: TaskPropsType) => {
    const onRemoveHandler = () => props.removeTask(props.id, props.todoListId);
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        props.changeStatus(props.id, e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New, props.todoListId);
    }
    const onChangeTitleHandler = useCallback((title: string) => {
        props.changeTitle(props.id, props.todoListId, title)
    }, [props.changeTitle, props.id, props.todoListId]);
    return (
        <li key={props.id} className={props.task.status === TaskStatuses.Completed ? 'is-done' : ''}>
            {/* <input type="checkbox"
                                       checked={isDone}
                                       onChange={onChangeHandler}/>*/}
            <Checkbox color={"primary"}
                      checked={props.task.status === TaskStatuses.Completed}
                      onChange={onChangeHandler}/>
            <EditableSpan value={props.task.title} onChange={onChangeTitleHandler}/>
            {/*<span>{title}</span>*/}
            {/*<button onClick={onRemoveHandler}>x</button>*/}
            <IconButton onClick={onRemoveHandler}>
                <Delete/>
            </IconButton>
        </li>
    )
});