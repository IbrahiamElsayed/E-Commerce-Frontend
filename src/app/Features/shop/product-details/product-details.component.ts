import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ShopService } from '../../../core/services/shop.service';
import { Product } from '../../../shared/models/product';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CurrencyPipe, RouterLink, MatButton, MatIconButton, MatIcon],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailsComponent implements OnInit {

  private shopService = inject(ShopService);
  private activatedRoute = inject(ActivatedRoute);

  product = signal<Product | null>(null);
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
      },
      error: (error) => console.error(error)
    });
  }

  increment() {
    const stock = this.product()?.QuantityInStock ?? 0;
    if (this.quantity() < stock) {
      this.quantity.update(q => q + 1);
    }
  }

  decrement() {
    this.quantity.update(q => Math.max(1, q - 1));
  }
}
