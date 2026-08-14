import { ShopParams } from './../../shared/models/shopParams';
import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ShopService } from '../../core/services/shop.service';
import { SnackbarService } from '../../core/services/snackbar.service';
import { Product } from '../../shared/models/product';
import { ProductItemComponent } from "./product-item/product-item.component";
import { MatDialog } from '@angular/material/dialog';
import { FiltersDialogComponent } from './filters-dialog/filters-dialog.component';
import { MatButton } from '@angular/material/button';
import { MatIcon } from "@angular/material/icon";
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { MatSelectionList, MatListOption, MatSelectionListChange } from "@angular/material/list";
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Pagination } from '../../shared/models/pagination';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, Subscription } from 'rxjs';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [ProductItemComponent, MatButton, MatIcon, MatMenuTrigger, MatMenu, MatSelectionList, MatListOption, MatPaginator, FormsModule],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopComponent implements OnInit, OnDestroy {

  private shopService = inject(ShopService);
  private snackbar = inject(SnackbarService);
  private dialogservice = inject(MatDialog);
  products = signal<Pagination<Product> | null>(null);
  sortOptions = [
    { name: 'Alphabetical', value: 'name' },
    { name: 'Price: Low-High', value: 'priceAsc' },
    { name: 'Price: High-Low', value: 'priceDesc' }
  ];
  shopparams = new ShopParams();
  pageSizeOptions = [5, 10, 15, 20];

  private searchSubject = new Subject<string>();
  private searchSub!: Subscription;

  ngOnInit(): void {
    this.searchSub = this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(search => {
      this.shopparams.search = search;
      this.shopparams.pageNumber = 1;
      this.getProducts();
    });
    this.initializeShop();
  }

  ngOnDestroy(): void {
    this.searchSub.unsubscribe();
  }

  initializeShop() {
    this.shopService.getBrands();
    this.shopService.getTypes();
    this.getProducts();
  }
  getProducts() {
    this.shopService.getProducts(this.shopparams).subscribe({
      next: (response) => {
        this.products.set(response);
      },
      error: (error) => {
        console.error(error);
        this.snackbar.error('Failed to load products');
      }
    });
  }
  onSearchInput(value: string) {
    this.searchSubject.next(value);
  }
  handlePageEvent(event: PageEvent) {
    this.shopparams.pageNumber = event.pageIndex + 1;
    this.shopparams.pageSize = event.pageSize;
    this.getProducts();
  }
  onSortChange(event: MatSelectionListChange) {
    const selectedOption = event.options[0];
    if (selectedOption) {
      this.shopparams.sort = selectedOption.value;
      this.shopparams.pageNumber = 1;
      this.getProducts();
    }
  }
  openFiltersDialog() {
    const dialogRef = this.dialogservice.open(FiltersDialogComponent, {
      minWidth: '500px',
      data: {
        selectedBrands: this.shopparams.brands,
        selectedTypes: this.shopparams.types
      }
    });
    dialogRef.afterClosed().subscribe({
      next: result => {
        if (result) {
          this.shopparams.brands = result.selectedBrands;
          this.shopparams.types = result.selectedTypes;
          this.shopparams.pageNumber = 1;
          this.getProducts();
        }
      }
    })
  }
}
