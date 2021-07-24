import { ACTIONS } from "Redux/actions";

export function user(state = null, action) {
    switch (action.type){
        case 'user/fetchedData': {
            const data = action.payload[ACTIONS.FETCH_USER];
            if(data){
                return data;
            }
            return state;
        }
        case 'user/loggedOut': {
            return null;
        }
        default: return state;
    }
}

export function language(state = 'en', action) {
    switch (action.type){
        case 'language/set': {
            return action.payload;
        }
        default: return state;
    }
}

export function pending(state = [], action) {
    switch(action.type){
        case 'pendingAction/start': {
            return [...state, action.payload];
        }
        case 'pendingAction/end': {
            const idx = state.indexOf(action.payload);
            state.splice(idx, 1);
            return [...state];
        }
        default: return state;
    }
}



export function notifications(state = [], action) {
    switch (action.type) {
        case 'notification/added': {
            return [...state, action.payload]
        }
        case 'notification/edited': {
            const idx = state.findIndex(n => n.key === action.payload.key);
            if (idx > -1) {
                state[idx].dismissed = true;
            }
            const notif = action.payload;
            notif.key = notif.newKey;
            delete notif.newKey;
            return [...state, { ...notif }];
        }
        case 'notification/dismissed': {
            const idx = state.findIndex(n => n.key === action.payload);
            console.log(idx);
            if (idx > -1) {
                state[idx].dismissed = true;
            }
            return [...state];
        }
        case 'notification/removed': {
            const idx = state.findIndex(n => n.key === action.payload);
            if (idx > -1) {
                state.splice(idx, 1);
            }
            return [...state];
        }
        default: return state;
    }
}

export function firstRender(state = true, action) {
    if(state && action.type === 'pendingAction/end'){
        return false;
    }
    return state;
}