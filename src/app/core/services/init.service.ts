import { inject, Injectable } from '@angular/core';
import { CartService } from './cart.service';
import { forkJoin, of } from 'rxjs';
import { AccountService } from './account.service';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class InitService {
  private cartService=inject(CartService);
  private accountService=inject(AccountService);
  init(){
    const cartId=localStorage.getItem('cart-id');
    const cart$=cartId ? this.cartService.getCart(cartId):of(null)
    return forkJoin({
      cart:cart$,
      user:this.accountService.getUserInfo().pipe(catchError(()=>of(null)))
    });
  }
}
