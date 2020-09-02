import React from 'react';
import AppWithRedux from './AppWithRedux';
import {Provider} from "react-redux";
import store from "../state/store";
import {ReduxStoreProviderDecorator} from '../stories/decorators/ReduxStoreProviderDecorator';

export default {
    title: 'AppWithRedux',
    component: AppWithRedux,
    decorators: [ReduxStoreProviderDecorator]
};

export const AppWithReduxBaseExample = (props:any) => {
    return <AppWithRedux/>
}