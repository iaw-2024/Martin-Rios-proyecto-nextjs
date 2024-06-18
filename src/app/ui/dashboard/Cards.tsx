import Image from 'next/image';
import AddToCartButton from './AddToCartButton';
import { Product } from '@/app/lib/Entities/Product';


const CardWrapper= ({ product, userID }:{product:Product, userID:string|undefined}
) => {
    return (  
      <div className="max-w-sm rounded overflow-hidden shadow-lg bg-gray-200 m-4 flex flex-col hover:bg-gray-300">
        <Image src={product.imageurl} alt={product.productname} className="w-full h-48 sm:h-64 object-cover" width={100} height={100}/>
        <div className="px-6 py-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="font-bold text-xl mb-2">{product.productname}</div>
          <p className="text-gray-700 text-base mb-2">${product.price}</p>
        </div>
          <AddToCartButton product={product} userID={userID} />
        </div>
      </div>
  );
};export default CardWrapper;