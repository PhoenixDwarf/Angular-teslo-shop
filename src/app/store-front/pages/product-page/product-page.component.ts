import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '@products/services/products.service';

@Component({
  selector: 'app-product-page',
  imports: [],
  templateUrl: './product-page.component.html',
})
export class ProductPageComponent {
  activatedRoute = inject(ActivatedRoute);
  productService = inject(ProductsService);

  productIdSlug: string = this.activatedRoute.snapshot.params['idSLug'];

  productResource = rxResource({
    params: () => this.productIdSlug,
    stream: () => {
      return this.productService.getProductByIdOrSlug(this.productIdSlug);
    },
  });
}
