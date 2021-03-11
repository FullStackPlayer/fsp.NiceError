# TS-NiceError
An extension for TS/JS Error Object, brings you better development experience.

# Import to your project

### For Deno
~~~ts
// remote import in Deno
import { NiceError } from "https://denopkg.com/FullStackPlayer/TS-NiceError/ne.ts"
// or you can import from deno.land
import { NiceError } from "https://deno.land/x/ts_nice_error/ne.ts"
// local import in Deno
// just copy ./src/NiceError_Deno.ts to your project (of course you should rename it)
import { NiceError } from "path/to/NiceError_Deno.ts"
~~~

### For Node.js
~~~js
// Why npm? This is only a small class, just copy ./dist/NiceError.js to your project!
// Then you can import it.
import { NiceError } from 'path/to/NiceError.js'
// If you really want to have it via npm, or you are working with typescript, please be patient, i'll finish this soon.
~~~

# Usage

#### Handling inner error

~~~
// a normal js Error
let err = new Error('This is a normal error')

// a NiceError which takes err as it's inner error
let ne1 = new NiceError('A normal error was caught!',{
    name: 'NiceError',
    cause: err,
    info: {
        foo: 'foo'
    }
})

// another NiceError which takes ne1 as it's inner error
let ne2 = new NiceError('An inner NiceError was caught!',{
    name: 'AppError',
    cause: ne1,
    info: {
        bar: 'bar'
    }
})

console.log(ne2.message)
------------------------------
An inner NiceError was caught!

console.log(ne2.fullMessage())
------------------------------
[AppError]: An inner NiceError was caught! <= [NiceError]: A normal error was caught! <= [Error]: This is a normal error

console.log(ne2.fullStack())
----------------------------
[AppError]: An inner NiceError was caught! <= [NiceError]: A normal error was caught! <= [Error]: This is a normal error
    at Object.<anonymous> (./sample/nodeEnv.js:16:11)
    at Module._compile (internal/modules/cjs/loader.js:1063:30)
    at Object.Module._extensions..js (internal/modules/cjs/loader.js:1092:10)
    at Module.load (internal/modules/cjs/loader.js:928:32)
    at Function.Module._load (internal/modules/cjs/loader.js:769:14)
    at Function.executeUserEntryPoint [as runMain] (internal/modules/run_main.js:72:12)
    at internal/main/run_main_module.js:17:47
Caused by [NiceError]: A normal error was caught! <= [Error]: This is a normal error
    at Object.<anonymous> (./sample/nodeEnv.js:7:11)
    at Module._compile (internal/modules/cjs/loader.js:1063:30)
    at Object.Module._extensions..js (internal/modules/cjs/loader.js:1092:10)
    at Module.load (internal/modules/cjs/loader.js:928:32)
    at Function.Module._load (internal/modules/cjs/loader.js:769:14)
    at Function.executeUserEntryPoint [as runMain] (internal/modules/run_main.js:72:12)
    at internal/main/run_main_module.js:17:47
Caused by [Error]: This is a normal error
    at Object.<anonymous> (./sample/nodeEnv.js:4:11)
    at Module._compile (internal/modules/cjs/loader.js:1063:30)
    at Object.Module._extensions..js (internal/modules/cjs/loader.js:1092:10)
    at Module.load (internal/modules/cjs/loader.js:928:32)
    at Function.Module._load (internal/modules/cjs/loader.js:769:14)
    at Function.executeUserEntryPoint [as runMain] (internal/modules/run_main.js:72:12)
    at internal/main/run_main_module.js:17:47

console.log(ne2.fullInfo())
---------------------------
{
    foo: 'foo',
    bar: 'bar'
}
~~~

#### Handling unexpected thown object as inner error

~~~
let err = { foo: 'bar'}
try {
    // just throw an object
    throw err
}
catch(err) {
    // a NiceError which takes the thrown object as inner err
    let ne1 = new NiceError('An object was thrown',{
        name: 'NiceError',
        cause: err
    })

    console.log(ne1.fullMessage())
    ------------------------------
[NiceError]: An object was thrown <= [Throw]: type = object, content = {"foo":"bar"}

    console.log(ne1.fullStack())
    ----------------------------
[NiceError]: An object was thrown <= [Throw]: type = object, content = {"foo":"bar"}
    at Object.<anonymous> (./sample/nodeEnv.js:39:15)
    at Module._compile (internal/modules/cjs/loader.js:1063:30)
    at Object.Module._extensions..js (internal/modules/cjs/loader.js:1092:10)
    at Module.load (internal/modules/cjs/loader.js:928:32)
    at Function.Module._load (internal/modules/cjs/loader.js:769:14)
    at Function.executeUserEntryPoint [as runMain] (internal/modules/run_main.js:72:12)
    at internal/main/run_main_module.js:17:47
Caused by [Throw]: type = object, content = {"foo":"bar"}
    at Object.<anonymous> (./sample/nodeEnv.js:46:21)
    at Module._compile (internal/modules/cjs/loader.js:1063:30)
    at Object.Module._extensions..js (internal/modules/cjs/loader.js:1092:10)
    at Module.load (internal/modules/cjs/loader.js:928:32)
    at Function.Module._load (internal/modules/cjs/loader.js:769:14)
    at Function.executeUserEntryPoint [as runMain] (internal/modules/run_main.js:72:12)
    at internal/main/run_main_module.js:17:47
~~~

# **API**

### Class NiceError

- Property
    - name - String - error name
    - message - String - error message
    - info - Object - context infomation about the error
    - stack - String - stack trace of the error
- Method
    - fullMessage() - String - get all the messages of the error chain path 
    - fullStack() - String - get all the stack infomations of the error chain path
    - fullInfo() - Object - merge all the info objects in this error chain into one big info object


## Enjoy it :-)