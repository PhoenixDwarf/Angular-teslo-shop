import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '@products/services/products.service';
import { ProductCarouselComponent } from '@products/components/product-carousel/product-carousel.component';

@Component({
  selector: 'app-product-page',
  imports: [ProductCarouselComponent],
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
