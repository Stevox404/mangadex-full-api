## <u> xFetch </u> 

### 1. xFetch `Function`
Wrapper over Fetch API
* **@param** {`string`} _url_ 
* **@param** {`RequestInfo`} _opts_ 
    * **@prop** {`Object`} _opts.xOpts_ - Some extra options for xFetch
        * **@prop** {`boolean`} _xOpts.alertErr_ 
* **@returns**
    * _data_ `*` - Transformed response data
    * _status_ `number` 
    * _statusText_ `string`
    * ...`Response`

### 2. saveBlob `Function`
Trigger a download link click.
 * **@param** `Blob` _blob_ 
 * **@param** `string` _fileName_ 