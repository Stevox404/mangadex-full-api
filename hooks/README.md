## <u> Custom Hooks </u>

### 1. usePrevious `Function`
Get the previous value of a variable.
* **@param** {`*`} _value_ 

### 2. useValidator `Function`
Manage input forms.
 * **@param** `object` _defaultValues_ 
 * **@param** `Function` _validatorFunc_ - Function used to validate values in addition to HTML validation tags. Single parameter (`Object`) with current form values

 * **@returns**
    * _values_ `Object`,
    * _errors_ `Object`,
    * _setValue_ `Function` - Updates values using element name tag as key.
        * **@param** `Event` _e_ - input element onChange event
        * **@param** `boolean` _raw_ - If first parameter is object, set to true. 
    * _reset_ `Function` - Used to reset the status of the validator.
        * **@param** `object` _defVal_ - Optional defaulValues. Otherwise uses original default values.
    * _validate_ `Function` - Validates all saved form values.
        * **@param** `object` _vals_ - Optional values object to validate only subset of values.
        * **@param** _opts_
            * _opts.showError_: true - If true, triggers native input validation if error encountered.  

### 3. useRouter `Function`
* **@returns**
    * changePage `Function` - Wrapper over useHistory hook.
        * **@param** `string` _path_ - New path
        * **@param** _opts_
            * _opts.replace_ `boolean` - Replace history with the new path
            * _opts.matchParent_ `boolean` - Concatenate the new path with current path
            * _opts.state_ `object` - State to be pushed to new location object