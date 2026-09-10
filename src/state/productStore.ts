import { atom } from 'jotai';
import { Product } from '../types/models';
import { ProductService } from '../api/services/productService';
import { ProductDto } from '../types/dtos/productDto';
import { organizationIdAtom } from './authStore';

export const productsAtom = atom<Product[]>([]);

export const loadingAtom = atom(false); 

export const selectedProductIdAtom = atom<string>('');

export const selectedProductAtom = atom<Product | null>(null);

export const errorAtom = atom<string | null>(null);

export const getProductByIdAtom = atom(
    (get) => {
        const productId = get(selectedProductIdAtom);
        if (!productId) return null;

        return get(productsAtom).find(product => product.Id === productId) || null;
    },
    async (get, set) => {
        const productId = get(selectedProductIdAtom);
        if (!productId) return null;

        set(loadingAtom, true);
        set(errorAtom, null);

        try {
            const response = await ProductService.getById(get(selectedProductIdAtom));

            const existingProducts = get(productsAtom);
            const productExists = existingProducts.some(product => product.Id === response.Id);
            if (!productExists) {
                set(productsAtom, [...existingProducts, response]);
            }
            else if (existingProducts.some(product => product.Id === response.Id && !Object.is(product, response))) {
                // update the array if some product has been modified
                set(productsAtom, existingProducts.map(product => product.Id === response.Id && Object.is(product, response) ? response : product))
            }
            set(selectedProductAtom, response);   
        } 
        catch (error) {
            set(errorAtom, "Error fetching product");
        } 
        finally {
            set(loadingAtom, false);
        }
    }
);

export const getProductsByOrganizationIdAtom = atom(
    (get) => get(productsAtom),
    async (get, set) => {
        set(loadingAtom, true);
        set(errorAtom, null);

        try {
            const organizationId = get(organizationIdAtom);
            
            if (!organizationId) return;

            const products = await ProductService.getByOrganization(organizationId);

            set(productsAtom, products);
        }
        catch {
            set(errorAtom, "Error getting products");
        }
        finally {
            set(loadingAtom, false);
        }
    }
);

export const createProductAtom = atom(
    null,
    async (get, set, data: ProductDto) => {
        set(loadingAtom, true);
        set(errorAtom, null);
        
        try {
            await ProductService.create(data);

            const products = get(productsAtom);

            set(productsAtom, [...products, { ...data, Created: new Date() }])
        }
        catch {
            set(errorAtom, "Error creating product");
        }
        finally {
            set(loadingAtom, false);
        }
    }
);

export const updateProductAtom = atom(
    null,
    async (get, set, data: ProductDto) => {
        set(loadingAtom, true);
        set(errorAtom, null);
        
        try {
            await ProductService.update(data);

            const products = get(productsAtom);

            const updatedProducts: Product[] = products.map(product =>
                product.Id === data.Id ? { ...product, ...data } : product
            );
            set(productsAtom, updatedProducts)
        }
        catch {
            set(errorAtom, "Error creating product");
        }
        finally {
            set(loadingAtom, false);
        }
    }
);

export const deleteProductAtom = atom(
    null,
    async (get, set, id: string) => {
        set(loadingAtom, true);
        set(errorAtom, null);

        try {
            await ProductService.delete(id);
            
            const products = get(productsAtom);
            set(productsAtom, products.filter(product => product.Id !== id));
        }
        catch {
            set(errorAtom, "Error deleting product")
        }
        finally {
            set(loadingAtom, false);
        }
    }
);

export const editProductDialogOpenAtom = atom<boolean>(false);