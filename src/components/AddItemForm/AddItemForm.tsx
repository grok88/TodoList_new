import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import {IconButton, TextField} from "@material-ui/core";
import {AddBox} from "@material-ui/icons";


type AddItemFormType = {
    addItem: (title: string) => void;
    disabled?:boolean;
}

export const AddItemForm = React.memo((props: AddItemFormType) => {
    console.log('AddItemForm -3');
    let [valueTask, setValueTask] = useState<string>('');
    let [error, setError] = useState<string | null>(null);


    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        if (error !== null) {
            setError(null);
        }
        setValueTask(e.currentTarget.value)
    }


    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.charCode === 13) {
            if (valueTask.trim()) {
                props.addItem(valueTask);
                setValueTask('');
            } else {
                setError('Title is required');
            }
        }
    }


    const addItemHandler = () => {
        if (valueTask.trim()) {
            props.addItem(valueTask);
            setValueTask('');
        } else {
            setError('Title is required');
        }

    }

    return (
        <div>
            {/*  <input

                value={valueTask}
                   onChange={onChangeHandler}
                   onKeyPress={onKeyPressHandler}
                   className={error ? 'error' : ''}
            />*/}
            <TextField disabled={props.disabled}
                variant={"outlined"}
                label={"Title"}
                helperText={error}
                error={!!error}
                value={valueTask}
                onChange={onChangeHandler}
                onKeyPress={onKeyPressHandler}
                // className={error ? 'error' : ''}
            />
            {/*<button onClick={addItemHandler}>+</button>*/}
            {/*<Button onClick={addItemHandler} variant={"contained"} color={"primary"}>+</Button>*/}
            <IconButton onClick={addItemHandler} color={"primary"} disabled={props.disabled}>
                <AddBox/>
            </IconButton>
            {/*{error && <div className={'error-message'}>{error}</div>}*/}
        </div>
    );
});