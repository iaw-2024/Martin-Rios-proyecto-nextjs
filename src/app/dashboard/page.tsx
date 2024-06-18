import { CardsSkeleton } from "../ui/dashboard/skeletons";
import CardWrapper from '@/app/ui/dashboard/Cards';
import ProductsRepository from "../lib/Repositories/ProductsRepository";
import { Suspense } from "react";
import { unstable_noStore as noStore } from 'next/cache';
import { getServerSession, Session } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/auth-config";

export default async function DashboardPage() {
  noStore();
  const productsRepository = new ProductsRepository();
  const products = await productsRepository.getAllProducts();
  const session:Session|null = await getServerSession(authOptions)
  
  
  return (
    <div className="">
      <div className="mt-5 padding-x padding-y max-width id='discover">
        <div className="home__text-container">
          <h1 className="text-4xl font-extrabold p-5">Product catalogue</h1>
          <p className="p-5">Explore out products you might like</p>
        </div>

        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
            <Suspense fallback={<CardsSkeleton />}>
              {products.map((product) => (
                <CardWrapper key={product.id} product={product} userID={session?.user.id} />
              ))}
            </Suspense>
          </div>
        </section>  
      </div>
    </div>
  );
}

