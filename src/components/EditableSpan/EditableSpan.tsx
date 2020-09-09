import React, {useState, ChangeEvent, KeyboardEvent} from "react";
import {TextField} from "@material-ui/core";

type EditableSpanType = {
    value: string;
    onChange: (newValue: string) => void;
    disabled?:boolean
}

const EditableSpan = React.memo((props: EditableSpanType) => {
    console.log('EditableSpan');

    let [editMode, setEditMode] = useState<boolean>(false);
    let [title, setTitle] = useState<string>(props.value);

    const activateEditMode = () => {
        setEditMode(true);
        setTitle(props.value);
    }
    const disableEditMode = () => {
        setEditMode(false);
    }

    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.charCode === 13) {
            props.onChange(title);
            disableEditMode();
        }
    }
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }

    return (
        editMode ? /*<input value={title}
                          autoFocus
                          onBlur={disableEditMode}
                          onChange={onChangeHandler}
                          onKeyPress={onKeyPressHandler}/>*/
            <TextField
                variant={"outlined"}
                value={title}
                autoFocus
                onBlur={disableEditMode}
                onChange={onChangeHandler}
                onKeyPress={onKeyPressHandler}
                disabled={props.disabled}
            />
            :
            <span onDoubleClick={activateEditMode}>{props.value}</span>
    );
});

export default EditableSpan;