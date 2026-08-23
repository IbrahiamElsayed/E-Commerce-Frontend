import { Address, user } from './../../shared/models/user';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class AccountService {
  baseUrl=environment.apiUrl;
  private http=inject(HttpClient);
  currentUser=signal<user |null>(null);
  login(values:any){
    let params=new HttpParams();
    params=params.append('useCookies',true);
    return this.http.post<user>(this.baseUrl+'login', values,{params})

  }
  register(values:any){
    return this.http.post(this.baseUrl+'account/register',values);
  }
  getUserInfo(){
    return this.http.get<user>(this.baseUrl+'account/user-info').pipe(
      map(user => {
        this.currentUser.set(user);
        return user;
      })
    )
  }
  logout(){
    return this.http.post(this.baseUrl+'account/logout',{})
  }
  updateAddress(address:Address){
    return this.http.post(this.baseUrl+'account/adress',address);
  }
  getAuthState(){
    return this.http.get<{isAuthenticated:boolean}>(this.baseUrl+'account/auth-status');

  }
}
