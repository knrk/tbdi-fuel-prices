export class User {
    constructor(public username: string, public id: string, private _token: string, private _tokenExpiresAt: Date) {}

    get token() {
        if (!this._tokenExpiresAt || new Date() > this._tokenExpiresAt) {
            localStorage.removeItem('uid');
            localStorage.setItem('uid', JSON.stringify({error: 'Session expired.'}));
            return null;
        }
        return this._token;
    }
}