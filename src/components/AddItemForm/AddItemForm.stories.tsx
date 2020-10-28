import React from 'react';
import {action} from '@storybook/addon-actions';
import {AddItemForm} from './AddItemForm';

export default {
    title: 'AddItemForm',
    component: AddItemForm,
};

const asyncCallback = async (...params:any[]) => {
    action('AddItemForm clicked')
}
export const AddItemFormBaseExample = (props:any) => {
    return <AddItemForm addItem={asyncCallback} disabled={false}/>
}