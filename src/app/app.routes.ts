import { Routes } from '@angular/router';
import { HomeComponent } from './Features/home/home.component';
import { ShopComponent } from './Features/shop/shop.component';
import { ProductDetailsComponent } from './Features/shop/product-details/product-details.component';
import { TestErrorComponent } from './Features/test-error/test-error.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { ServerErrorComponent } from './shared/components/server-error/server-error.component';
import { CartComponent } from './Features/cart/cart.component';
import { CheckoutComponent } from './Features/checkout/checkout.component';
import { LoginComponent } from './Features/account/login/login.component';
import { RegisterComponent } from './Features/account/register/register.component';
import { authGuard } from './core/guards/auth-guard';
import { emptyCartGuard } from './core/guards/emptycartguard-guard';

export const routes: Routes = [
    {path:'',component:HomeComponent},
    {path:'shop',component:ShopComponent},
    {path:'shop/:id',component:ProductDetailsComponent},
    {path:'cart',component:CartComponent},
    {path:'checkout',component:CheckoutComponent,canActivate:[authGuard,emptyCartGuard]},
    {path:'account/login',component:LoginComponent},
     {path:'account/register',component:RegisterComponent},
    {path:'test-error',component:TestErrorComponent},
    {path:'not-found',component:NotFoundComponent},
    {path:'server-error',component:ServerErrorComponent},
    {path:'**',redirectTo:'not-found',pathMatch:'full'}

];
