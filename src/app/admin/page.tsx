import ProductsRepository from "../lib/Repositories/ProductsRepository";
import ProductCard from "../ui/admin/productCard";
import { unstable_noStore as noStore } from 'next/cache';
export default async function LoginPage() {
  noStore();
  const productsRepository = new ProductsRepository();
  const products = await productsRepository.getAllProducts();
  
  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}