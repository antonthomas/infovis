import { Injectable } from '@angular/core';
import { GoogleAuthService } from 'ng-gapi';
import GoogleUser = gapi.auth2.GoogleUser;

@Injectable({
  providedIn: 'root',
})
export class DataService {
  public static SESSION_STORAGE_KEY: string = '';
  //@ts-ignore
  private user: GoogleUser;

  constructor(private googleAuth: GoogleAuthService) {
    this.signIn();
    // this.getToken();
  }

  public getToken(): string | null {
    let token: string | null = sessionStorage.getItem(
      DataService.SESSION_STORAGE_KEY
    );
    if (!token) {
      throw new Error('no token set , authentication required');
    }
    return sessionStorage.getItem(DataService.SESSION_STORAGE_KEY);
  }

  public signIn(): void {
    this.googleAuth.getAuth().subscribe((auth) => {
      auth.signIn().then((res) => this.signInSuccessHandler(res));
    });
  }

  private signInSuccessHandler(res: GoogleUser) {
    this.user = res;
    sessionStorage.setItem(
      DataService.SESSION_STORAGE_KEY,
      res.getAuthResponse().access_token
    );
  }
}
