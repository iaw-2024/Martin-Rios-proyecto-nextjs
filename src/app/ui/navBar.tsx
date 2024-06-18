import Link from 'next/link';
import AuthButton from './LogoutButton';
import {  Session } from 'next-auth';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/auth-config';
import LogoutButton from './LogoutButton';
import LoginButton from './LoginButton';
import CartButton from './dashboard/CartButton';
import Image from "next/image";
import HomeButton from './HomeButton';


const NavBar  = async ()=>{
  
  const session:Session|null = await getServerSession(authOptions)
  console.log(session)
  let AuthButton = (session)? 
  <LogoutButton></LogoutButton>:
  <LoginButton></LoginButton>
  

    return (
      <div className="bg-gradient-to-tr from-violet-800 to-pink-800 sticky top-0">
        <div className="container mx-auto flex justify-between items-center">
          <HomeButton></HomeButton>
          <div className="flex items-center w-full max-w-md mx-4">
            <input 
              type="text" 
              className="w-full px-4 py-2 rounded-l-lg focus:outline-none" 
              placeholder="Search..."
            />
            <button 
              className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 focus:outline-none"
            >
              Search
            </button>
          </div>
          <CartButton></CartButton>
          {AuthButton}
        </div>
      </div>
    )
}

export default NavBar;