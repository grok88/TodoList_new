import React, {useCallback} from 'react';
import './App.css';
import {TodoList} from "./TodoList";
import {AddItemForm} from "./AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@material-ui/core";
import {Menu} from '@material-ui/icons';
import {
    addTodolistAC,
    changeTodolistFilterAC,
    changeTodolistTitleAC,
    removeTodolistAC, TodolistDomainType
} from "./state/todolists-reducer";
import {addTaskAC, changeTaskStatusAC, changeTitleStatusAC, removeTaskAC} from "./state/tasks-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./state/store";
import {TaskStatuses, TaskType} from "./api/tasks-api";

export type FilterValueType = "all" | "active" | "completed";


export type TaskStateType = {
    [key: string]: Array<TaskType>;
}

function AppWithRedux() {
    console.log('App - 1');
    let todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(state => state.todolists);
    let tasks = useSelector<AppRootStateType, TaskStateType>(state => state.tasks);
    let dispatch = useDispatch();


    // изменение чекбокса таски
    const changeStatus = useCallback((id: string, status: TaskStatuses, todoListId: string) => {
        const action = changeTaskStatusAC(id, status, todoListId);
        dispatch(action);
    }, [dispatch]);


    // Изменение тайтла таски
    const changeTitle = useCallback((id: string, todoListId: string, title: string) => {
        const action = changeTitleStatusAC(id, title, todoListId);
        dispatch(action);
    }, [dispatch]);


    // Удаление тасок
    const removeTask = useCallback((id: string, todoListId: string) => {
        const action = removeTaskAC(id, todoListId);
        dispatch(action);
    }, [dispatch]);

    // Добавление таски
    const addTask = useCallback((title: string, todoListId: string) => {
        const action = addTaskAC(title, todoListId);
        dispatch(action);
    }, [dispatch]);

    const changeFilter = useCallback((value: FilterValueType, todoListId: string) => {
        const action = changeTodolistFilterAC(todoListId, value);
        dispatch(action);
    }, [dispatch]);
    // Изменение тайтла todoList
    const changeTitleTodoList = useCallback((todoListId: string, title: string) => {
        const action = changeTodolistTitleAC(todoListId, title);
        dispatch(action);
    }, [dispatch]);
    // Удаление таски-листа
    const removeTodoList = useCallback((todoListId: string) => {
        const action = removeTodolistAC(todoListId);
        dispatch(action);
    }, [dispatch]);
    // Добавление таски
    const addTodoList = useCallback((title: string) => {
        const action = addTodolistAC(title);
        dispatch(action);
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

