# Flitlib

A small library of front-end utilities.

## Installation

```
npm install flitlib
```

## Prerequisites

- Hook utilities require react (>=16.8.0) and react-dom (>=16.8.0).
    - UseRouter hook requires react-router-dom (<=5.1.0).

## Usage

### 1. xFetch
A wrapper over Fetch.

```javascript
import { xFetch } from 'flitlib';

async function saveData(data){
    try{
        const resp = await xFetch('/api', {
            method: 'POST',
            body: data,
        });
        console.log(resp); 
        // {status, statusText, data }
    } catch (err) {
        console.log(err); 
        // Error object with added properties {status, statusText}
    }
}
```

### 2. Hooks
Some custom react hooks

#### a) usePrevious hook
Get the previous value of a variable.

```javascript
import { usePrevious } from 'flitlib';
// other imports

function MyComponent(props){
    const [foo, setFoo] = useState('bar');
    const prevFoo = usePrevious(foo);
    // other code
}
```

#### b) useValidator hook
Manage input forms.

```javascript
import { useValidator } from 'flitlib';
// other imports

function MyComponent(props){
    const defaultValues = {foo: 'bar'};
    const { 
        values, setValue, validate, errors, reset
    } = useValidator(defaultValues);
    // other code

    function handleSave(e){
        if(!validate()) return;
        // other code
    }

    return (
        <form onSubmit={handleSave} >
            <input 
                name='foo' value={values.foo} onChange={setValue}
                required
            />
            <button>Save</button>
        </form>
    );
}
```

#### c) useRouter hook
Wrapper over useHistory hook.

```javascript
import { useRouter } from 'flitlib';
// other imports

function MyComponent(props){
    const { changePage } = useRouter();

    function handleSave(data){
        // save code
        changePage('/home');
    }
    // other code
}
```

---------------

## Release History
+ v0.0.1
    + First release.

## License

ISC