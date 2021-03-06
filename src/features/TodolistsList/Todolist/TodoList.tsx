import React, {useCallback, useEffect} from "react";
import {FilterValueType} from "../../../trash/App";
import {AddItemForm} from "../../../components/AddItemForm/AddItemForm";
import EditableSpan from "../../../components/EditableSpan/EditableSpan";
import {Button, IconButton, Paper,} from "@material-ui/core";
import {Delete} from "@material-ui/icons";
import {Task} from "./Task/Task";
import {TaskStatuses} from "../../../api/tasks-api";
import {useDispatch} from "react-redux";
import {setTasksThunk, TaskDomainType} from "../../../state/tasks-reducer";
import {RequestStatusType} from "../../../state/app-reducer";
import {loginTC} from "../../Auth/auth-reducer";


type PropsType = {
    id: string,
    entityStatus: RequestStatusType;
    filter: FilterValueType,
    title: string,
    tasks: Array<TaskDomainType>,
    removeTask: (id: string, todoListId: string) => void,
    changeFilter: (value: FilterValueType, todoListId: string) => void,
    addTask: (title: string, id: string) => void,
    changeStatus: (id: string, status: TaskStatuses, todoListId: string) => void,
    removeTodoList: (todoListId: string) => void,
    changeTitle: (id: string, todoListId: string, title: string) => void,
    changeTitleTodoList: (todoListId: string, title: string) => void
}

export const TodoList = React.memo((props: PropsType) => {
    const {filter, title, removeTask, changeFilter, addTask, changeStatus, id, removeTodoList, changeTitle, changeTitleTodoList} = props;

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setTasksThunk(id));
    }, []);

    const onAllClickHandler = useCallback(() => changeFilter("all", id), [changeFilter, id]);
    const onActiveClickHandler = useCallback(() => changeFilter("active", id), [changeFilter, id]);
    const onCompletedClickHandler = useCallback(() => changeFilter("completed", id), [changeFilter, id]);

    const onDeleteTodoList = () => removeTodoList(id);

    const addTaskHandler = useCallback(async (title: string) => {
        const resultAction = await addTask(title, id);
    }, [addTask, id]);

    const onChangeTitleTodoList = useCallback((title: string) => {
        changeTitleTodoList(id, title);
    }, [changeTitleTodoList, id]);

    let taskForTodoList = props.tasks;

    if (filter === 'active') {
        taskForTodoList = props.tasks.filter((task) => task.status === TaskStatuses.New);

    }
    if (filter === 'completed') {
        taskForTodoList = props.tasks.filter((task) => task.status === TaskStatuses.Completed);
    }

    return (
        <Paper elevation={3} style={{position:'relative', padding: "10px"}}>
            <IconButton size={"small"} onClick={onDeleteTodoList} disabled={props.entityStatus === 'loading'} style={{position:'absolute', top:'5px', right:'5px'}}>
                <Delete fontSize={"small"}/>
            </IconButton>
            <h3>
                <EditableSpan value={title} onChange={onChangeTitleTodoList}
                              disabled={props.entityStatus === 'loading'}/>

            </h3>

            <AddItemForm addItem={addTaskHandler} disabled={props.entityStatus === 'loading'}/>

            <ul style={{listStyleType: "none", paddingLeft: "0"}}>
                {
                    taskForTodoList.map(task => <Task key={task.id} id={task.id} todoListId={props.id} task={task}
                                                      changeStatus={changeStatus} changeTitle={changeTitle}
                                                      removeTask={removeTask}/>
                    )
                }
                {!taskForTodoList.length && <div style={{ padding:'5px', color:'grey'}}>No task</div>}
            </ul>
            <div>
                <Button color={"primary"} variant={filter === 'all' ? "outlined" : "text"}
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
        </Paper>
    );
})

