import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  Product,
  ProductsResponse,
} from '@products/interfaces/product.interface';
import { Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl;

interface Options {
  limit?: number;
  offset?: number;
  gender?: string;
}

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private readonly http = inject(HttpClient);

  private productsCache = new Map<string, ProductsResponse>();
  private productCache = new Map<string, Product>();

  getProducts(options: Options): Observable<ProductsResponse> {
    const { limit = 9, offset = 0, gender = '' } = options;
    const key = `${limit}-${offset}-${gender}`; // 9-0-''

    if (this.productsCache.has(key)) {
      return of(this.productsCache.get(key)!);
    }

    return this.http
      .get<ProductsResponse>(`${baseUrl}/products`, {
        params: {
          limit,
          offset,
          gender,
        },
      })
      .pipe(
        tap((res) => console.log(res)),
        tap((resp) => this.productsCache.set(key, resp))
      );
  }

  getProductByIdOrSlug(idSLug: string): Observable<Product> {
    if (this.productCache.has(idSLug)) {
      return of(this.productCache.get(idSLug)!);
    }

    return this.http
      .get<Product>(`${baseUrl}/products/${idSLug}`)
      .pipe(tap((product) => this.productCache.set(idSLug, product)));
  }
}
