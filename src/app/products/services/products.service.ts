import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '@auth/interfaces/user.interface';
import {
  Gender,
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

const emptyProduct: Product = {
  id: 'new',
  title: '',
  price: 0,
  description: '',
  slug: '',
  stock: 0,
  sizes: [],
  gender: Gender.Men,
  tags: [],
  images: [],
  user: {} as User,
};

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
        tap((resp) => this.productsCache.set(key, resp)),
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

  getProductById(id: string): Observable<Product> {
    if (id === 'new') return of(emptyProduct);

    if (this.productCache.has(id)) return of(this.productCache.get(id)!);

    return this.http
      .get<Product>(`${baseUrl}/products/${id}`)
      .pipe(tap((product) => this.productCache.set(id, product)));
  }

  createProduct(productLike: Partial<Product>): Observable<Product> {
    return this.http
      .post<Product>(`${baseUrl}/products`, productLike)
      .pipe(tap({ next: (product) => this.updateProductCache(product) }));
  }

  updateProduct(
    id: string,
    productLike: Partial<Product>,
  ): Observable<Product> {
    return this.http
      .patch<Product>(`${baseUrl}/products/${id}`, productLike)
      .pipe(
        tap({
          next: (product) => {
            this.updateProductCache(product);
            this.updateProductsCache(product);
          },
        }),
      );
  }

  updateProductCache(product: Product) {
    const productId = product.id;
    this.productCache.set(productId, product);
  }

  updateProductsCache(product: Product) {
    const productId = product.id;
    this.productsCache.forEach((productsResponse) => {
      productsResponse.products = productsResponse.products.map(
        (currentProduct) => {
          return currentProduct.id === productId ? product : currentProduct;
        },
      );
    });
  }
}
