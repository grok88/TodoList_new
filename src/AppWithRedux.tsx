import React, {useCallback, useEffect} from 'react';
import './App.css';
import {TodoList} from "./TodoList";
import {AddItemForm} from "./AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@material-ui/core";
import {Menu} from '@material-ui/icons';
import {
    addTodolistTC,
    changeTodolistFilterAC,
    changeTodolistTitleTC,
    removeTodolistTC,
    SetTodolistsThunk,
    TodolistDomainType
} from "./state/todolists-reducer";
import {addTaskTC, changeTitleStatusAC, removeTaskTC, updateTaskTC} from "./state/tasks-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./state/store";
import {TaskStatuses, TaskType} from "./api/tasks-api";

export type FilterValueType = "all" | "active" | "completed";


export type TaskStateType = {
    [key: string]: Array<TaskType>;
}

function AppWithRedux() {

    useEffect(() => {
        dispatch(SetTodolistsThunk);
    }, []);

    console.log('App - 1');
    let todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(state => state.todolists);
    let tasks = useSelector<AppRootStateType, TaskStateType>(state => state.tasks);
    let dispatch = useDispatch();


    // изменение чекбокса таски
    const changeStatus = useCallback((id: string, status: TaskStatuses, todoListId: string) => {
        dispatch(updateTaskTC(id, todoListId, {status}));
        // const action = changeTaskStatusAC(id, status, todoListId);
        // dispatch(action);
    }, [dispatch]);


    // Изменение тайтла таски
    const changeTitle = useCallback((id: string, todoListId: string, title: string) => {
        const thunk = updateTaskTC(id, todoListId, {title});
        dispatch(thunk);
    }, [dispatch]);


    // Удаление тасок
    const removeTask = useCallback((id: string, todoListId: string) => {
        const action = removeTaskTC(id, todoListId);
        dispatch(action);
    }, [dispatch]);

    // Добавление таски
    const addTask = useCallback((title: string, todoListId: string) => {
        dispatch(addTaskTC(title, todoListId))
        // const action = addTaskAC(title, todoListId);
        // dispatch(action);
    }, [dispatch]);

// изменение фильтра todoList
    const changeFilter = useCallback((value: FilterValueType, todoListId: string) => {
        const action = changeTodolistFilterAC(todoListId, value);
        dispatch(action);
    }, [dispatch]);

    // Изменение тайтла todoList
    const changeTitleTodoList = useCallback((todoListId: string, title: string) => {
        const action = changeTodolistTitleTC(todoListId, title);
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

    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
            <Container fixed>
                <Grid container style={{padding: "10px"}}>
                    <AddItemForm addItem={addTodoList}/>
                </Grid>
                <Grid container spacing={3}>
                    {
                        todolists.map((tl) => {

                            // let taskForTodoList = tasks[tl.id];
                            return (
                                <Grid item key={tl.id}>
                                    <Paper style={{padding: "10px"}} elevation={3}>
                                        <TodoList
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
                </Grid>
            </Container>
        </div>
    );
}

export default AppWithRedux;

