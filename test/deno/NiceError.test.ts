// deno-lint-ignore-file no-unreachable
import { assertEquals } from "https://deno.land/std@0.106.0/testing/asserts.ts"
import { NiceError } from '../../mod.ts'

Deno.test('An Empty NiceError', () => {
    const emptyNE = new NiceError()
    assertEquals(emptyNE.name,'NiceError')
    assertEquals(emptyNE.message,'Empty')
});

Deno.test('A NiceError With Chain Property', () => {
    const emptyNE = new NiceError('NiceError With Chain', {
        chain: ['root','folder']
    })
    assertEquals(emptyNE.name,'NiceError')
    assertEquals(emptyNE.fullMessage(),'[NiceError@root/folder]: NiceError With Chain')
});

Deno.test('A Nested NiceError', () => {
    const err = new Error('This is a normal error')
    const ne1 = new NiceError('A normal error was caught!',{
        name: 'NiceError',
        cause: err,
        info: {
            foo: 'foo'
        }
    })
    const ne2 = new NiceError('A inner NiceError was caught!',{
        name: 'AppError',
        cause: ne1
    })
    assertEquals(ne2.name,'AppError')
    assertEquals(ne2.message,'A inner NiceError was caught!')
    assertEquals(ne2.fullMessage(),'[AppError]: A inner NiceError was caught! <= [NiceError]: A normal error was caught! <= [Error]: This is a normal error')
    assertEquals(ne2.fullInfo().foo,'foo')
});

Deno.test('A Nested NiceError With Irregular Inner Throw', () => {
    const err = { foo: 'bar'}
    try {
        throw err
    }
    catch(err) {
        const ne1 = new NiceError('An object was thrown',{
            name: 'NiceError',
            cause: err
        })
        assertEquals(ne1.message,'An object was thrown')
        assertEquals(ne1.fullMessage(),'[NiceError]: An object was thrown <= [Throw]: type = object, content = {"foo":"bar"}')
    }
});
