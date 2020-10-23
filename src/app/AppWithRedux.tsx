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
import {initializeAppTC} from '../state/app-reducer';
import {ErrorSnackbar} from "../components/ErrorSnackbar/ErrorSnackbar";
import {Route} from "react-router-dom";
import {Login} from "../features/Auth/Login";
import {logoutTC} from '../features/Auth/auth-reducer';
import {selectIsInitialized, selectStatus} from "./selectors";
import {authSelectors} from "../features/Auth";

export type FilterValueType = "all" | "active" | "completed";


// export type TaskStateType = {
//     [key: string]: Array<TaskType>;
// }


function AppWithRedux() {

    const status = useSelector(selectStatus);
    const isInitialized = useSelector(selectIsInitialized);
    const isLoggedIn = useSelector(authSelectors.selectIsLoggedIn);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(initializeAppTC());
    }, []);

    const logoutHandler = useCallback(() => {
        dispatch(logoutTC());
    }, [])

    if (!isInitialized) {
        return <div
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>
    }

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
                    {isLoggedIn && <Button color="inherit" onClick={logoutHandler}>Log out</Button>}
                </Toolbar>
            </AppBar>
            {status === 'loading' && <LinearProgress color="secondary"/>}
            <Container fixed>
                <Route path={'/login'} render={() => <Login/>}/>
                <Route exact path={'/'} render={() => <TodolistsList/>}/>
            </Container>
        </div>
    );
}

export default AppWithRedux;

