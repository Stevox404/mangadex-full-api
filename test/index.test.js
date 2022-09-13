'use strict';

import assert from 'assert';

function validateResultsArray(results) {
    if (results.length > 0) {
        assert.ok(results.length);
        results.forEach(elem => assert.strictEqual(typeof elem.id, 'string'));
    } else assert.fail('Returned 0 results.');
}
export {validateResultsArray};