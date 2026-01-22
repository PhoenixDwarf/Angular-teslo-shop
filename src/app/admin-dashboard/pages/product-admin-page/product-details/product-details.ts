import { Component, computed, inject, input, signal } from '@angular/core';
import { Product } from '@products/interfaces/product.interface';
import { ProductCarouselComponent } from '@products/components/product-carousel/product-carousel.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '@utils/form-utils';
import { FormErrorLabel } from '@shared/components/form-error-label/form-error-label';
import { ProductsService } from '@products/services/products.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'product-details',
  imports: [ProductCarouselComponent, ReactiveFormsModule, FormErrorLabel],
  templateUrl: './product-details.html',
})
export class ProductDetails {
  product = input.required<Product>();

  router = inject(Router);
  fb = inject(FormBuilder);

  productService = inject(ProductsService);

  wasSaved = signal(false);
  temporalImagesBlobURL = signal<string[]>([]);
  currentAndTemporalImages = computed(() => [
    ...this.product().images,
    ...this.temporalImagesBlobURL(),
  ]);
  imageFileList = signal<FileList | undefined>(undefined);

  productForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    slug: [
      '',
      [Validators.required, Validators.pattern(FormUtils.slugPattern)],
    ],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    sizes: [['']],
    images: [[]],
    tags: [''],
    gender: [
      'Men',
      [Validators.required, Validators.pattern(/men|women|kid|unisex/)],
    ],
  });

  sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  ngOnInit(): void {
    this.setFormValue(this.product());
  }

  setFormValue(formLike: Partial<Product>) {
    this.productForm.reset(formLike as any);
    this.productForm.patchValue({ tags: formLike.tags?.join(',') });
  }

  onSizeClicked(size: string) {
    const sizes = this.productForm.value.sizes ?? [];

    if (sizes.includes(size)) sizes.splice(sizes.indexOf(size), 1);
    else sizes.push(size);

    this.productForm.patchValue({ sizes });
  }

  async onSubmit() {
    const isValid = this.productForm.valid;
    this.productForm.markAllAsTouched();

    if (!isValid) return;

    const formValue = this.productForm.value;

    const productLike: Partial<Product> = {
      ...(formValue as any),
      tags:
        formValue.tags
          ?.toLowerCase()
          .split(',')
          .map((tag) => tag.trim()) ?? [],
    };

    console.log(productLike);

    if (this.product().id === 'new') {
      const product = await firstValueFrom(
        this.productService.createProduct(productLike, this.imageFileList()),
      );
      console.log('Product was created');
      this.router.navigate(['/admin/products', product.id]);
    } else {
      await firstValueFrom(
        this.productService.updateProduct(
          this.product().id,
          productLike,
          this.imageFileList(),
        ),
      );
      console.log('Product was updated');
    }

    this.wasSaved.set(true);
    setTimeout(() => this.wasSaved.set(false), 3000);
  }

  onFilesChange(event: Event) {
    const fileList = (event.target as HTMLInputElement).files;
    this.temporalImagesBlobURL.set([]);
    this.imageFileList.set(fileList ?? undefined);

    const imageUrls = Array.from(fileList ?? []).map((file) =>
      URL.createObjectURL(file),
    );

    this.temporalImagesBlobURL.set(imageUrls);
  }
}
