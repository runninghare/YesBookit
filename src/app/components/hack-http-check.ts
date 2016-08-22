import { Observable } from 'rxjs/Observable';
import { Response, Headers, Http } from '@angular/http';
import {Injectable} from '@angular/core';

@Injectable()
export class AuthDao {

    constructor(public http: Http) { }

    public check(): Observable<Response> {
        return this.http.get('/tsconfig.json', {
        })
    }
}