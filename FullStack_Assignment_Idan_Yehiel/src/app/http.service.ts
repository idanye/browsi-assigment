import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Publisher, Domain} from "./types";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class HttpService {
    private basePublishersUrl = 'http://localhost:4300/api/publishers';
    private baseDomainsUrl = 'http://localhost:4300/api/domains';

    constructor(private http: HttpClient) {
    }

    getPublishers(): Observable<Publisher[]> {
        return this.http.get<Publisher[]>(this.basePublishersUrl);
    }

    addPublisher(publisher: Publisher): Observable<Publisher> {
        return this.http.post<Publisher>(this.basePublishersUrl, publisher);
    }

    getDomains(): Observable<Domain[]> {
        return this.http.get<Domain[]>(this.baseDomainsUrl);
    }

}
