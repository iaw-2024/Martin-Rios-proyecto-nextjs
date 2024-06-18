import Image from 'next/image';
import { Product } from '@/app/lib/Entities/Product';
import { Cart } from '@/app/lib/Entities/Cart';
//import { useAppContext } from '@/app/context';

interface CardCartProps {
  id : string
  name : string
  description : string
  quantity : number
  price : number
}
export default function CartWrapper(item: CardCartProps) {

  //const { removeFromCart, addToCart } = useAppContext()
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-gray-200 m-4 flex hover:bg-gray-300">
      <div className="px-6 py-4">
        <div>
          <div className="font-bold text-xl mb-2">{item.name}</div>
          <p className="text-gray-700 text-base mb-2">${item.price}</p>
        </div>
        <div className='buttons'>
          <button 
           // onClick={() => removeFromCart(item)}
            className="bg-blue-500 text-white px-1 rounded hover:bg-blue-400 focus:outline-none">
            -
          </button>
          <p className="text-gray-700 justify-center text-base mb-2">cantidad:{item.quantity}</p>
          <button 
          //  onClick={() => addToCart(item)}
            className="bg-blue-500 text-white px-1 rounded hover:bg-blue-400 focus:outline-none">
            +
          </button>
        </div>
      </div>
    </div>
  )
}