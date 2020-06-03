import React, {ChangeEvent, KeyboardEvent, useState} from "react";


type AddItemFormType = {
    addItem: (title: string) => void,
}

export const AddItemForm = (props: AddItemFormType) => {
    let [valueTask, setValueTask] = useState<string>('');
    let [error, setError] = useState<string | null>(null);


    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setError(null);
        setValueTask(e.currentTarget.value)
    }


    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.charCode === 13) {
            props.addItem(valueTask);
            setValueTask('');
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
            <input value={valueTask}
                   onChange={onChangeHandler}
                   onKeyPress={onKeyPressHandler}
                   className={error ? 'error' : ''}
            />
            <button onClick={addItemHandler}>+
            </button>
            {error && <div className={'error-message'}>{error}</div>}
        </div>
    );
}