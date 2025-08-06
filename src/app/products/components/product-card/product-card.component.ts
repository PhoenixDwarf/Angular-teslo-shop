import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '@products/interfaces/product.interface';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'product-card',
  imports: [RouterLink],
  templateUrl: './product-card.component.html',
})
export class ProductCardComponent {
  product = input.required<Product>();
  baseUrl = environment.baseUrl;

  imageUrl = computed(() => {
    return `${this.baseUrl}/files/product/${this.product().images[0]}`;
  });
}
