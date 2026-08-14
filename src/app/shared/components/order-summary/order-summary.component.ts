import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { CartService } from '../../../core/services/cart.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-order-summary',
  imports: [RouterLink, MatButtonModule, MatFormField, MatLabel, MatInputModule, CurrencyPipe],
  templateUrl: './order-summary.component.html',
  styleUrl: './order-summary.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderSummaryComponent {
  cartService=inject(CartService);
}
