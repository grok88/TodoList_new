import React from 'react';
import {action} from '@storybook/addon-actions';
import {Task} from './Task';
import {TaskPriorities, TaskStatuses} from "./api/tasks-api";

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
                  task={{
                      id: '1',
                      title: 'React',
                      status: TaskStatuses.Completed,
                      todoListId: 'todoList1',
                      priority: TaskPriorities.low,
                      addedDate: '',
                      deadline: '',
                      description: '',
                      order: 0,
                      startDate: ''
                  }}/>
            <Task removeTask={removeTask} changeTitle={changeTitle}
                  changeStatus={changeStatus} todoListId={'todoList2'} id={'2'}
                  task={{
                      id: '2', status: TaskStatuses.New, title: 'StoryBook', todoListId: 'todoList2',
                      priority: TaskPriorities.low,
                      addedDate: '',
                      deadline: '',
                      description: '',
                      order: 0,
                      startDate: ''
                  }}/>

        </>
    );
}