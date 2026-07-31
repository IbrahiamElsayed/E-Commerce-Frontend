import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';
import { HttpClient } from '@angular/common/http';
import { Product } from './shared/models/product';
import { Pagination } from './shared/models/pagination';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,HeaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  baseUrl='https://localhost:7170/api/'
  private http=inject(HttpClient);
  protected readonly title = signal('E-Commerce');
  products:Product[]=[];
   ngOnInit(): void {
    this.http.get<Pagination<Product>>(this.baseUrl+'product').subscribe({
      next:response=>this.products=response.date,
      error: error=>console.log(error),
      complete:()=>console.log('Complete')
    })
  }
}
