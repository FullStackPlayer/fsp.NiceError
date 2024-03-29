export class NiceError {
    constructor(msg, opts) {
        this.name = 'NiceError';
        this.message = 'Empty';
        this.chain = [];
        this.info = {};
        this.cause = null;
        this.stack = (new Error).stack || '';
        if (msg && msg !== '')
            this.message = msg;
        if (opts && opts) {
            const keys = Object.keys(opts);
            const badParams = [];
            for (const key of keys) {
                if (Object.keys(this).indexOf(key) < 0) {
                    badParams.push(key);
                }
            }
            if (badParams.length > 0) {
                console.log('\x1b[33m%s\x1b[0m', 'Warning!!! You have provided bad parameter(s): [' + badParams.join(',') + '], it will be ignored, but we strongly suggest you to check your code again!');
            }
            if (opts.name)
                this.name = opts.name;
            if (opts.chain)
                this.chain = opts.chain;
            if (opts.cause)
                this.cause = opts.cause;
            if (opts.info)
                this.info = opts.info;
            if (opts.stack)
                this.stack = opts.stack;
        }
        this.stack = this.stack.replace('Error', this.fullMessage());
        this.stack = this._removeSelfFromStack(this.stack);
        this.stack = this._removeCWD(this.stack);
    }
    fullMessage() {
        return this._getCauseMessage(this);
    }
    _getCauseMessage(err) {
        let result = '';
        if (err instanceof Error)
            result = `[${err.name}]: ${err.message}`;
        else if (err instanceof NiceError) {
            result = `[${err.name}${err.chain.length > 0 ? '@' + err.chain.join('/') : ''}]: ${err.message}`;
            if (err.cause)
                result += ' <= ' + this._getCauseMessage(err.cause);
        }
        else {
            result = '[Throw]: type = ' + typeof err;
            const str = JSON.stringify(err);
            if (str.length <= 100)
                result = result + ', content = ' + str;
            else
                result = result + ', content = ' + str.substring(0, 99) + '...';
        }
        return result;
    }
    fullStack() {
        let fstack = this._getFullStack(this, true);
        fstack = this._removeSelfFromStack(fstack);
        fstack = this._removeCWD(fstack);
        return fstack;
    }
    _getFullStack(err, isFirst) {
        let result = '';
        let causedBy = '';
        if (isFirst !== true)
            causedBy = 'Caused by ';
        if (err instanceof NiceError) {
            result = causedBy + err.stack;
            if (err.cause)
                result += `\r\n` + this._getFullStack(err.cause);
        }
        else if (err instanceof Error && err.stack) {
            result = causedBy + err.stack.replace(err.name, '[' + err.name + ']');
        }
        return result;
    }
    fullInfo() {
        return this._getFullInfo(this);
    }
    _getFullInfo(ne) {
        const result = {};
        if (ne instanceof NiceError) {
            const keys = Object.keys(ne.info);
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                result[key] = ne.info[key];
            }
            if (ne.cause && ne.cause instanceof NiceError) {
                const subInfo = this._getFullInfo(ne.cause);
                const keys = Object.keys(subInfo);
                for (let i = 0; i < keys.length; i++) {
                    const key = keys[i];
                    result[key] = subInfo[key];
                }
            }
        }
        return result;
    }
    _removeSelfFromStack(str) {
        const jsRegExp = /\s{1,}?at [ \S]*?NiceError[\S]*? \(\S*?\/NiceError.js:\d*:\d*\)[\n\r]{1,}/g;
        const tsRegExp = /\s{1,}?at [ \S]*?NiceError[\S]*? \(\S*?\/NiceError.ts:\d*:\d*\)[\n\r]{1,}/g;
        return str.replace(jsRegExp, `\r\n`).replace(tsRegExp, `\r\n`).replace(/(\r\n){2,}/g, `\r\n`).replace(/file:\/\//g, ``);
    }
    _removeCWD(str) {
        if (NiceError.execPath !== '') {
            const regStr = NiceError.execPath.replace(/\//g, `\\/`);
            const regExp = new RegExp(regStr, 'g');
            return str.replace(regExp, `.`);
        }
        return str;
    }
}
NiceError.execPath = '';
export default NiceError;
