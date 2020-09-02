import React, {useCallback, useEffect} from "react";
import {FilterValueType} from "../../../trash/App";
import {AddItemForm} from "../../../components/AddItemForm/AddItemForm";
import EditableSpan from "../../../components/EditableSpan/EditableSpan";
import {Button, IconButton,} from "@material-ui/core";
import {Delete} from "@material-ui/icons";
import {Task} from "./Task/Task";
import {TaskStatuses, TaskType} from "../../../api/tasks-api";
import {useDispatch} from "react-redux";
import {setTasksThunk} from "../../../state/tasks-reducer";


type PropsType = {
    id: string,
    filter: FilterValueType,
    title: string,
    tasks: Array<TaskType>,
    removeTask: (id: string, todoListId: string) => void,
    changeFilter: (value: FilterValueType, todoListId: string) => void,
    addTask: (title: string, id: string) => void,
    changeStatus: (id: string, status: TaskStatuses, todoListId: string) => void,
    removeTodoList: (todoListId: string) => void,
    changeTitle: (id: string, todoListId: string, title: string) => void,
    changeTitleTodoList: (todoListId: string, title: string) => void
}

export const TodoList = React.memo((props: PropsType) => {
    console.log('TodoList -2')
    const {filter, title, removeTask, changeFilter, addTask, changeStatus, id, removeTodoList, changeTitle, changeTitleTodoList} = props;

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setTasksThunk(id));
    }, []);

    const onAllClickHandler = useCallback(() => changeFilter("all", id), [changeFilter, id]);
    const onActiveClickHandler = useCallback(() => changeFilter("active", id), [changeFilter, id]);
    const onCompletedClickHandler = useCallback(() => changeFilter("completed", id), [changeFilter, id]);

    const onDeleteTodoList = () => removeTodoList(id);

    const addTaskHandler = useCallback((title: string) => {
        addTask(title, id);
    }, [addTask, id]);

    const onChangeTitleTodoList = useCallback((title: string) => {
        changeTitleTodoList(id, title);
    }, [changeTitleTodoList, id]);

    // const addTaskwrap  = (title:string) => {
    //     addTask(title, id);
    // }

    let taskForTodoList = props.tasks;

    if (filter === 'active') {
        taskForTodoList = props.tasks.filter((task) => task.status === TaskStatuses.New);

    }
    if (filter === 'completed') {
        taskForTodoList = props.tasks.filter((task) => task.status === TaskStatuses.Completed);
    }

    return (
        <div>
            <h3>
                <EditableSpan value={title} onChange={onChangeTitleTodoList}/>
                {/*<button onClick={onDeleteTodoList}>x</button>*/}
                <IconButton onClick={onDeleteTodoList}>
                    <Delete/>
                </IconButton>
            </h3>

            <AddItemForm addItem={addTaskHandler}/>

            <ul style={{listStyleType: "none", paddingLeft: "0"}}>
                {
                    taskForTodoList.map(task => <Task key={task.id} id={task.id} todoListId={props.id} task={task}
                                                      changeStatus={changeStatus} changeTitle={changeTitle}
                                                      removeTask={removeTask}/>
                    )
                }
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
        </div>
    );
})

