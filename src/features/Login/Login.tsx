import React from 'react'
import {Button, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, TextField} from '@material-ui/core'
import {useSelector} from "react-redux";
import {AppRootStateType, useAppDispatch} from "../../state/store";
import {Redirect} from 'react-router-dom';
import {FormikHelpers, useFormik} from "formik";
import {loginTC} from './auth-reducer';
import {LoginErrorType, LoginParamsType} from "../../api/todolists-api";


type FormValuesType = {
    email: string;
    password: string;
    rememberMe: boolean;
}

const validate = (values: LoginParamsType) => {
    const errors: LoginErrorType = {};
    if (!values.email) {
        errors.email = 'Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid email address';
    }

    if (!values.password) {
        errors.password = 'Required';
    } else if (values.password.length < 5) {
        errors.password = 'Must be 5 characters or more';
    }
    return errors;
};

export const Login = () => {

    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn);
    const dispatch = useAppDispatch();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            rememberMe: false
        },
        validate,
        onSubmit: async (values: FormValuesType, formikHelpers: FormikHelpers<FormValuesType>) => {
            const action = await dispatch(loginTC(values));
            // if(action.type === loginTC.rejected.type){
            if (loginTC.rejected.match(action)) {
                if (action.payload?.fieldsError?.length) {
                    const error = action.payload?.fieldsError[0];
                    formikHelpers.setFieldError(error.field, error.error);
                }
            }

            // if (res === bad) show error
        },
    })

    if (isLoggedIn) {
        return <Redirect to={'/'}/>
    }
    return <Grid container justify="center">
        <Grid item xs={4}>
            <form onSubmit={formik.handleSubmit}>
                <FormControl>
                    <FormLabel>
                        <p>To log in get registered
                            <a href={'https://social-network.samuraijs.com/'}
                               target={'_blank'}>here
                            </a>
                        </p>
                        <p>or use common test account credentials:</p>
                        <p>Email: free@samuraijs.com</p>
                        <p>Password: free</p>
                    </FormLabel>
                    <FormGroup>
                        <TextField
                            label="Email"
                            margin="normal"
                            {...formik.getFieldProps('email')}
                        />
                        {formik.errors.email ? <div style={{color: 'red'}}>{formik.errors.email}</div> : null}
                        <TextField
                            type="password"
                            label="Password"
                            margin="normal"
                            {...formik.getFieldProps('password')}
                        />
                        {formik.errors.password ? <div style={{color: 'red'}}>{formik.errors.password}</div> : null}
                        <FormControlLabel
                            label={'Remember me'}
                            control={<Checkbox
                                {...formik.getFieldProps('rememberMe')}
                            />}
                        />
                        <Button type={'submit'} variant={'contained'} color={'primary'}>Login</Button>
                    </FormGroup>
                </FormControl>
            </form>
        </Grid>
    </Grid>
}
