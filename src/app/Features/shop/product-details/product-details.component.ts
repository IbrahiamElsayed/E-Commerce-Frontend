import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal
} from '@angular/core';

import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

import { ShopService } from '../../../core/services/shop.service';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { CartService } from '../../../core/services/cart.service';

import { Product } from '../../../shared/models/product';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    CurrencyPipe,
    RouterLink,
    MatButton,
    MatIconButton,
    MatIcon,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailsComponent implements OnInit {

  private shopService = inject(ShopService);
  private snackbar = inject(SnackbarService);
  private activatedRoute = inject(ActivatedRoute);
  private cartService = inject(CartService);

  product = signal<Product | null>(null);

  quantityIncart = 0;

  quantity = signal(1);

  ngOnInit(): void {
    this.loadProduct();
  }

  loadProduct() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');

    if (!id) return;

    this.shopService.getProduct(+id).subscribe({
      next: (product) => {
        this.product.set(product);
        this.quantity.set(1);
        this.updateQuantityInCart();
      },

      error: (error) => {
        console.error(error);
        this.snackbar.error('Failed to load product');
      }
    });
  }

  updateQuantityInCart() {
    const product = this.product();

    if (!product) return;

    this.quantityIncart =
      this.cartService.cart()?.items
        .find(x => x.productId === product.id)
        ?.quantity ?? 0;

    this.quantity.set(this.quantityIncart || 1);
  }

  getButtonText() {
    return this.quantityIncart > 0
      ? 'Update Cart'
      : 'Add Cart';
  }

  updateCart() {

    const product = this.product();

    if (!product) return;

    const currentQuantity = this.quantity();
    const cartQuantity = this.quantityIncart;

    if (currentQuantity > cartQuantity) {

      const itemsToAdd = currentQuantity - cartQuantity;

      this.cartService.addItemToCart(
        product,
        itemsToAdd
      );

    } else if (currentQuantity < cartQuantity) {

      const itemsToRemove = cartQuantity - currentQuantity;

      this.cartService.removeItemFromCart(
        product.id,
        itemsToRemove
      );
    }

    this.quantityIncart = currentQuantity;

    this.snackbar.success(
      `${product.name} cart updated`
    );
  }

  addToCart() {

    const product = this.product();

    if (!product) return;

    this.cartService.addItemToCart(
      product,
      this.quantity()
    );

    this.snackbar.success(
      `${product.name} added to cart`
    );

    this.quantityIncart = this.quantity();
  }

  buyNow() {

    const product = this.product();

    if (!product) return;

    this.cartService.addItemToCart(
      product,
      this.quantity()
    );

    this.snackbar.success(
      `Added ${product.name} to cart`
    );
  }

  increment() {

    const stock = this.product()?.QuantityInStock ?? 0;

    if (this.quantity() < stock) {
      this.quantity.update(q => q + 1);
    }
  }

  decrement() {

    this.quantity.update(
      q => Math.max(1, q - 1)
    );
  }
}