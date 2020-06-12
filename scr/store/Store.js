import { createStore } from 'redux';

const INITIAL_STATE = {
    userData: {}
};

function dataUser(state = INITIAL_STATE, action){
    switch (action.type){
        case 'ADD_DATA':
            return { ...state, userData: action.data};
        default:    
            return state;
    }
}

const store = createStore(dataUser);

export default store;