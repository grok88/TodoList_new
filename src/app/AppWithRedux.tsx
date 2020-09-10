import React, {useCallback, useEffect} from 'react';
import './App.css';
import {
    AppBar,
    Button,
    CircularProgress,
    Container,
    IconButton,
    LinearProgress,
    Toolbar,
    Typography
} from "@material-ui/core";
import {Menu} from '@material-ui/icons';
import {TodolistsList} from "../features/TodolistsList/TodolistsList";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../state/store";
import { RequestStatusType, initializeAppTC} from '../state/app-reducer';
import {ErrorSnackbar} from "../components/ErrorSnackbar/ErrorSnackbar";
import {BrowserRouter, Route} from "react-router-dom";
import {Login} from "../features/Login/Login";
import { logoutTC } from '../features/Login/auth-reducer';

export type FilterValueType = "all" | "active" | "completed";


// export type TaskStateType = {
//     [key: string]: Array<TaskType>;
// }

function AppWithRedux() {

    const status = useSelector<AppRootStateType, RequestStatusType>(state => state.app.status);
    const isInitialized = useSelector<AppRootStateType, boolean>(state => state.app.isInitialized);
    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(initializeAppTC());
    }, []);

    const logoutHandler = useCallback(() => {
        dispatch(logoutTC());
    },[])

    if (!isInitialized) {
        return <div
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>
    }

    return (
        <BrowserRouter>
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
                        {isLoggedIn && <Button color="inherit" onClick={logoutHandler}>Log out</Button>}
                    </Toolbar>
                </AppBar>
                {status === 'loading' && <LinearProgress color="secondary"/>}
                <Container fixed>
                    <Route path={'/login'} render={() => <Login/>}/>
                    <Route exact path={'/'} render={() => <TodolistsList/>}/>
                </Container>
            </div>
        </BrowserRouter>
    );
}

export default AppWithRedux;

