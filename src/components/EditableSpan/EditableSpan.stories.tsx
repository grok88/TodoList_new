import React from 'react';
import {action} from '@storybook/addon-actions';
import EditableSpan from "./EditableSpan";

export default {
    title: 'EditableSpan',
    component: EditableSpan,
};
const onChange = action('Change  value');


export const EditableSpanBaseExample = () => {
    return <EditableSpan value={'Start value'} onChange={onChange} />
}