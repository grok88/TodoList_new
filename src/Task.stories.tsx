import React from 'react';
import {action} from '@storybook/addon-actions';
import {AddItemForm} from './AddItemForm';
import {Task} from './Task';

export default {
    title: 'Task',
    component: Task,
};
const removeTask = action('Remove button inside Task clicked');
const changeTitle = action('Title changed inside component')
const changeStatus = action('Status changed inside component')

export const TaskBaseExample = () => {
    return (
        <>
            <Task removeTask={removeTask} changeTitle={changeTitle}
                  changeStatus={changeStatus} todoListId={'todoList1'} id={'1'}
                  task={{id: '1', isDone: true, title: 'React'}}/>
            <Task removeTask={removeTask} changeTitle={changeTitle}
                  changeStatus={changeStatus} todoListId={'todoList2'} id={'2'}
                  task={{id: '2', isDone: false, title: 'StoryBook'}}/>

        </>
    );
}