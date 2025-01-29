import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './screens/App';

import { state, persistor } from "./store";

import {Provider} from 'react-redux'
import {PersistGate} from 'redux-persist/integration/react'
import {BrowserRouter} from 'react-router-dom'


import * as serviceWorker from './serviceWorker';

import axios from 'axios'
// axios.defaults.baseURL = 'https://eu-desenvolvo-default-rtdb.firebaseio.com/'
// axios.defaults.baseURL = 'https://e-tv-camara-default-rtdb.firebaseio.com'
axios.defaults.baseURL = 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&part=contentDetails&maxResults=10000&playlistId=PLTrq6afnTQmGtNTPcf5fidnO6wF4ZtSgU&key=AIzaSyAGmrhhQcFv7Ga0Hyc50r9RyANRvdY7QsQ'

ReactDOM.render(

<Provider store={state}>
    <PersistGate persistor={persistor} loading={null} >
        <BrowserRouter>
            <App />
        </BrowserRouter> 
    </PersistGate>
</Provider>
, document.getElementById('root'));

serviceWorker.unregister();
