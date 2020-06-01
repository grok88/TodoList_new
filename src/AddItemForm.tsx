import React, {ChangeEvent, KeyboardEvent, useState} from "react";

type AddItemFormPropsType = {
    addItem: (title: string) => void,

}

export const AddItemForm = (props: AddItemFormPropsType) => {
    let [valueTask, setValueTask] = useState<string>('');
    let [error, setError] = useState<string | null>(null);

    // ..Контролируемое поле ввода
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setError(null);
        setValueTask(e.currentTarget.value)
    }
    // При нажатии на enter добавляем таску
    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.charCode === 13) {
            props.addItem(valueTask);
            setValueTask('');
        }
    }
    // При нажатиит кнопки добавляем таску
    const addTaskHandler = () => {
        if (valueTask.trim()) {
            props.addItem(valueTask);
        } else {
            setError('Title is required');
        }
        setValueTask('');
    }

    return (
        <div>
            <input value={valueTask}
                   onChange={onChangeHandler}
                   onKeyPress={onKeyPressHandler}
                   className={error ? 'error' : ''}
            />
            <button onClick={addTaskHandler}>+
            </button>
            {error && <div className={'error-message'}>{error}</div>}
        </div>
    );
}