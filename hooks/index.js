import { useEffect, useRef, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';


/**
 * Get the previous value of a variable.
 * @param {*} value 
 */
export function usePrevious(value) {
    const ref = useRef();

    useEffect(() => {
        ref.current = value;
    }, [value]);

    return ref.current;
}


/**
 * Manage input forms.
 * @param {object=} defaultValues 
 * @param {Function=} validatorFunc - Validation function update errors object.
 *  Single parameter ({object}) with current form values
 */
export const useValidator = (defaultValues, validatorFunc) => {
    /**
     * remove null, undefined or empty str default values
     * @param {object} vals 
     */
    const scrubObject = vals => {
        if (!vals || typeof vals !== 'object') {
            vals = {}
        } else {
            const newVals = {};
            for (let [key, val] of Object.entries(vals)) {
                if ((val !== null && val !== undefined && val !== '')) {
                    newVals[key] = val;
                }
            }
            vals = newVals;
        }
        return vals;
    }


    const [values, setValues] = useState(scrubObject(defaultValues));
    const [errors, setErrors] = useState({});
    
    const valsProxy = new Proxy(values, {
        get: (obj, prop) => obj[prop] ? obj[prop] : ''
    })


    /**
     * Updates values using element name tag as key.
     * @param {Event} e - input element onChange event
     * @param {boolean=} raw - If first parameter is object, set to true. [DEPRECATED]
     */
    const setValue = (e, raw) => {
        let value = e;
        const isEvent = e instanceof Event || !!e.nativeEvent;
        raw = raw === undefined ? !isEvent: raw;
        if (!raw) {
            const { name, type } = e.target;
            let val = e.target.value;
            if (type === 'checkbox') {
                val = e.target.checked;
            }
            value = { [name]: val };
        } else {
            value = scrubObject(value);
        }
        setValues(v => ({ ...v, ...value }));
        // TODO iterate (raw may be many keys)
        for (let [key, val] of Object.entries(value)) {
            if (errors[key]) {
                validate({ [key]: val });
            }
        }
    }

    /**
     * Used to reset the status of the validator.
     * @param {object=} defVal - Optional defaulValues. Otherwise uses original default values.
     */
    const reset = (defVal) => {
        defVal = scrubObject(defVal || defaultValues);
        setValues(defVal);
        setErrors({});
    }

    /**
     * Validates all saved form values. 
     * @param {object=} vals - Optional values object to validate only subset of values.
     */
    const validate = (vals) => {
        if (!vals || typeof vals !== 'object' || Object.keys(vals).length === 0) {
            vals = { ...values };
        }
        let errs = null;
        if (validatorFunc) {
            errs = validatorFunc(vals);
        }
        let valid = !errs || !Object.values(errs).some(e => e);
        if (valid && errs) {
            for (let key of Object.keys(vals)) {
                errs[key] = null;
            }
        }

        setErrors(e => ({ ...e, ...errs }));
        return valid;
    }

    return { 
        values: valsProxy, 
        setValue, 
        reset, 
        errors,
        validate 
    };
}




export const useRouter = () => {
    const history = useHistory();
    const match = useRouteMatch();

    /**
     * @typedef optsObject
     * @property {boolean=} opts.replace - Replace history with the new path
     * @property {boolean=} opts.matchParent - Uses URL() object to resolve 
     *  relative path with router match prop.
     * @property {object=} opts.state - State to be pushed to new location object
     */
    
    /**
     * Wrapper over useHistory hook.
     * @param {string} path - New path
     * @param {optsObject} opts
     */
    const changePage = (path, { replace, matchParent, state } = {}) => {
        if (matchParent) {
            let url = new URL(window.location);
            url.pathname = match.url;
            if(!/\/$/.test(url.pathname)){
                url.pathname += '/';
            }
            path = path.replace(/^\//, '');
            let newPath = new URL(path, url).pathname;
            newPath = newPath.replace(/\/$/, '');

            path = newPath;
        }

        history[replace ? 'replace' : 'push'](path, state);
    }
    return { changePage };
}