import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { CartService } from '../../core/services/cart.service';
import { CartItemComponent } from "./cart-item/cart-item.component";
import { OrderSummaryComponent } from "../../shared/components/order-summary/order-summary.component";

@Component({
  selector: 'app-cart',
  imports: [CartItemComponent, OrderSummaryComponent, RouterLink, MatButtonModule, MatIcon],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartComponent {
  cartService=inject(CartService);
  
}
