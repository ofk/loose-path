# loose-path

loose-path is node path like path operation functions.

## Examples

```js
const loosePath = require('loose-path');

console.log(loosePath.join('http://example.com/dir/', '../../file'));
// => 'http://example.com/file'
```
