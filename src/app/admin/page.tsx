import ProductsRepository from "../lib/Repositories/ProductsRepository";
import ProductCard from "../ui/productCard";
export default async function LoginPage() {
  const productsRepository = new ProductsRepository();
  const products = await productsRepository.getAllProducts();
  console.log(products);
  
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