import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

const baseUrl = `${environment.baseUrl}/files/product/`;

@Pipe({
  name: 'productImage',
})
export class ProductImagePipe implements PipeTransform {
  transform(value: string | string[], ...args: any[]): any {
    if (typeof value === 'string') return baseUrl + value;

    const image = value.at(0);
    if (image) return baseUrl + image;

    return 'assets/images/no-image.jpg';
  }
}
