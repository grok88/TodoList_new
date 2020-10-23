import React, {useCallback, useEffect} from "react";
import {
    addTodolistTC,
    changeTodolistFilterAC,
    changeTodolistTitleTC,
    removeTodolistTC,
    setTodolistsThunk,
    TodolistDomainType
} from "../../state/todolists-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../../state/store";
import {TaskStatuses} from "../../api/tasks-api";
import {addTaskTC, removeTaskTC, TaskStateType, updateTaskTC} from "../../state/tasks-reducer";
import {Grid, Paper} from "@material-ui/core";
import {AddItemForm} from "../../components/AddItemForm/AddItemForm";
import {TodoList} from "./Todolist/TodoList";
import {FilterValueType} from "../../app/AppWithRedux";
import {Redirect} from "react-router-dom";
import {selectIsLoggedIn} from "../Auth/selectors";

export const TodolistsList: React.FC = () => {
    const isLoggedIn = useSelector(selectIsLoggedIn);

    useEffect(() => {
        if (!isLoggedIn) {
            return
        }
        dispatch(setTodolistsThunk());
    }, []);


    let todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(state => state.todolists);
    let tasks = useSelector<AppRootStateType, TaskStateType>(state => state.tasks);
    let dispatch = useDispatch();


    // изменение чекбокса таски
    const changeStatus = useCallback((id: string, status: TaskStatuses, todoListId: string) => {
        dispatch(updateTaskTC({taskId: id, todoListId, model: {status}}));
    }, [dispatch]);


    // Изменение тайтла таски
    const changeTitle = useCallback((id: string, todoListId: string, title: string) => {
        const thunk = updateTaskTC({taskId: id, todoListId, model: {title}});
        dispatch(thunk);
    }, [dispatch]);


    // Удаление тасок
    const removeTask = useCallback((taskId: string, todoListId: string) => {
        const action = removeTaskTC({taskId, todoListId});
        dispatch(action);
    }, [dispatch]);

    // Добавление таски
    const addTask = useCallback((title: string, todoListId: string) => {
        dispatch(addTaskTC({title, todoListId}))
        // const action = addTaskAC(title, todoListId);
        // dispatch(action);
    }, [dispatch]);

// изменение фильтра todoList
    const changeFilter = useCallback((value: FilterValueType, todoListId: string) => {
        const action = changeTodolistFilterAC({id: todoListId, filter: value});
        dispatch(action);
    }, [dispatch]);

    // Изменение тайтла todoList
    const changeTitleTodoList = useCallback((todoListId: string, title: string) => {
        const action = changeTodolistTitleTC({id: todoListId, title});
        dispatch(action);
    }, [dispatch]);

    // Удаление таски-листа
    const removeTodoList = useCallback((todoListId: string) => {
        dispatch(removeTodolistTC(todoListId));
        // const action = removeTodolistAC(todoListId);
        // dispatch(action);
    }, [dispatch]);

    // Добавление todoList
    const addTodoList = useCallback((title: string) => {
        dispatch(addTodolistTC(title));
    }, [dispatch]);

    if (!isLoggedIn) {
        return <Redirect to={'/login'}/>
    }
    return (
        <>
            <Grid container style={{padding: "10px"}}>
                <AddItemForm addItem={addTodoList}/>
            </Grid>
            <Grid container spacing={3}>
                {
                    todolists.map((tl) => {
                        return (
                            <Grid item key={tl.id}>
                                <Paper style={{padding: "10px"}} elevation={3}>
                                    <TodoList
                                        entityStatus={tl.entityStatus}
                                        title={tl.title}
                                        id={tl.id}
                                        filter={tl.filter}
                                        tasks={tasks[tl.id]}
                                        removeTask={removeTask}
                                        changeFilter={changeFilter}
                                        addTask={addTask}
                                        changeStatus={changeStatus}
                                        removeTodoList={removeTodoList}
                                        changeTitle={changeTitle}
                                        changeTitleTodoList={changeTitleTodoList}
                                    />
                                </Paper>
                            </Grid>
                        )
                    })
                }
            </Grid></>
    );
}