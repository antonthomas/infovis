// data.service.ts
import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, tap, Observable, switchMap } from 'rxjs';
import { GoogleApiService, GoogleAuthService } from 'ng-gapi';

@Injectable()
export class DataService {
  private clientId =
    '807145211401-men3dcoe5ou4kvsp3j7d0ehgcipc1jef.apps.googleusercontent.com';
  private projectId = 'infovis-348014';
  public token: string | null = null;
  private endpoint =
    'https://content.googleapis.com/bigquery/v2/projects/infovis/queries?alt=json';
  private headers = new HttpHeaders();
  public logged;
  public loading = true;

  constructor(
    private gapiService: GoogleApiService,
    private authService: GoogleAuthService,
    private httpClient: HttpClient
  ) {
    this.gapiService.onLoad().subscribe();
    this.logged = this.authService.getAuth().pipe(
      tap((auth) => {
        this.token = auth.currentUser.get().getAuthResponse().access_token;
        console.log('Is SignedIn = ' + auth.isSignedIn.get());
        this.headers = this.headers.set(
          'Authorization',
          `Bearer ${this.token}`
        );
      }),
      switchMap((_) => this.read())
    );
  }

  public read() {
    // Optionally, spin a loading indicator when a request is performed.
    this.loading = true;
    // Send the actual query as part of the request body and add the authorization headers.
    return this.httpClient
      .post(
        this.endpoint,
        { query: 'SELECT * FROM infovisdb.all_matches LIMIT 10' },
        { headers: this.headers }
      )
      .pipe(
        tap((res) => {
          console.log(res);
          // Optionally, toggle off the loading indicator and store the current total number of rows.
          //@ts-ignore
          this.total = +res['totalRows'];
          this.loading = false;
          return res;
        })
        /*
        map((res) => {
          // Manipulate the response in accordance with your preference and return the data items expected by the Grid.
          //@ts-ignore
          return res['rows'].map((item) => {
            const productid = +item.f[0].v;
            const productname = item.f[1].v;
            const unitsinstock = +item.f[6].v;
            const unitprice = +item.f[5].v;
            return {
              productid,
              productname,
              unitsinstock,
              unitprice,
            };
          });
        })
        */
      );
  }
}
