import { useSnackbar } from 'notistack';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { usePrevious } from 'Utils/shared/flitlib';
import { Button } from '@material-ui/core';

function NotificationManager() {
    const { closeSnackbar, enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();
    const notifications = useSelector(({ notifications }) => notifications);
    const prevNotifications = usePrevious([...notifications]);

    /** @param {string} key - notification identifier */
    const removeNotification = (key) => {
        return {
            type: 'notification/removed',
            payload: key
        }
    }

    const notifAction = (key) => (
        <Button color='primary' onClick={e => {
            dispatch(removeNotification(key))
        }} >
            Dismiss
        </Button>
    );
    
    useEffect(() => {
        (prevNotifications || []).forEach(pNtf => {
            const key = pNtf.key;
            if (!notifications.some(ntf => ntf.key === key)) {
                if(Date.now() - pNtf.addTime < 1000){
                    window.setTimeout(() => {
                        closeSnackbar(key);
                    }, 1000);
                } else{
                    closeSnackbar(key);
                }
            }
        });

        let count = 3, i = 0;
        while (count > 0) {
            const ntf = notifications[i];
            if (!ntf) break;
            if (ntf.dismissed) {
                dispatch(removeNotification(ntf.key));
                closeSnackbar(ntf.key);
                continue;
            }
            enqueueSnackbar(ntf.message, {
                variant: ntf.variant,
                persist: ntf.persist,
                key: ntf.key,
                autoHideDuration: ntf.autoHideDuration,
                preventDuplicate: true,
                onExited: (e, key) => {
                    dispatch(removeNotification(key))
                },
                onClose: (e, reason, key) => {
                    if(ntf.onClose){
                        ntf.onClose(e, reason, key);
                    }
                },
                action: ntf.action === undefined ? notifAction: ntf.action,
            });
            i++;
            count--;
        }
    }, [notifications, prevNotifications]);

    return (
        null
    )
}


export default NotificationManager;