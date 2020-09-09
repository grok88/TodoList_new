import React from 'react';
import './App.css';
import {AppBar, Button, Container, IconButton, LinearProgress, Toolbar, Typography} from "@material-ui/core";
import {Menu} from '@material-ui/icons';
import {TodolistsList} from "../features/TodolistsList/TodolistsList";
import {useSelector} from "react-redux";
import {AppRootStateType} from "../state/store";
import {RequestStatusType} from '../state/app-reducer';
import {ErrorSnackbar} from "../components/ErrorSnackbar/ErrorSnackbar";

export type FilterValueType = "all" | "active" | "completed";


// export type TaskStateType = {
//     [key: string]: Array<TaskType>;
// }

function AppWithRedux() {
    const status = useSelector<AppRootStateType, RequestStatusType>(state => state.app.status)
    return (
        <div className="App">
            <ErrorSnackbar/>
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
            {status === 'loading' && <LinearProgress color="secondary" />}
            <Container fixed>
                <TodolistsList/>
            </Container>
        </div>
    );
}

export default AppWithRedux;

