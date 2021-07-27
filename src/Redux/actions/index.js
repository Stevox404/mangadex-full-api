import { xFetch } from "Utils/shared/flitlib";

export const ACTIONS = {
    FETCH_USER: 'users',
}

export const fetchData = (action) => {
    return async dispatch => {
        dispatch({
            type: `pendingAction/start`,
            payload: action
        });

        try {
            const { data } = await xFetch(`/${action}`);
            dispatch({
                type: `user/fetchedData`,
                payload: { [action]: data }
            });
        } finally {
            dispatch({
                type: `pendingAction/end`,
                payload: action
            });
        }

    }
}

export const login = (auth) => {
    return async dispatch => {
        if (auth) {
            await xFetch('/login', {
                method: 'POST',
                body: auth
            });
        } else {
            const isLoggedIn = document.cookie.match(/isLoggedIn=(.+?)(?:;|$)/);
            if (!isLoggedIn || isLoggedIn[1] !== 'true') {
                return;
            }
        }

        const promises = [];
        promises.push(dispatch(fetchData(ACTIONS.FETCH_USER)));
        await Promise.all(promises);
    }
}

export const logout = () => {
    return async dispatch => {
        xFetch('/login', { method: 'DELETE' });
        document.cookie = "isLoggedIn=false; path=/;";
        dispatch({
            type: 'user/loggedOut'
        });
    }
}





/**
 * @typedef Notification
 * @type {{
    *  message: string,
    *  group: string,
    *  variant: "default"|"info"|"success"|"error"|"warning",
    *  persist: boolean,
    *  autoHideDuration: number,
    *  action: Node|null,
    *  onClose: Function,
    *  showDismissAsIcon: boolean,
    * }}
    */
/**
 * @param {Notification} payload - notification details
 */
export const addNotification = (payload) => {
    return dispatch => {
        const key = Math.random().toString(36).slice(2);
        const addTime = new Date();

        dispatch({
            type: 'notification/added',
            payload: { ...payload, key, addTime }
        });

        return key;
    }
}

/**
 * @param {Notification} payload - notification details
 * @param {string} payload.key - notification identifier
 */
export const editNotification = (payload) => {
    return dispatch => {
        const newKey = Math.random().toString(36).slice(2);
        const addTime = new Date();
        dispatch({
            type: 'notification/edited',
            payload: { ...payload, newKey, addTime }
        });

        return newKey;
    }
}

/**
 * @param {string} key - notification identifier
 */
export const dismissNotification = (key) => {
    return {
        type: 'notification/dismissed',
        payload: key
    }
}