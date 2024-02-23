"use client"
import { ShoppingCart } from "lucide-react";
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Separator } from "./ui/separator";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/hooks/use-cart";
import { Product } from "@/payload-types";
import { ScrollArea } from "./ui/scroll-area";
import CartItem from "./CartItem";

const Cart = () => {
  const {items} = useCart()
  const itemCount = items.length;
  const cartTotal = items.reduce((total, {product}) => total + product.Price, 0);
  const fee = 1;
  return (
    <Sheet>
      <SheetTrigger className="flex items-center space-x-2 outline-none">
        <div className="flex items-center justify-between w-full gap-2 text-base">
          <span>
            <ShoppingCart />
          </span>
          <span>{itemCount}</span>
        </div>
      </SheetTrigger>
      <SheetContent>
        <SheetTitle>
          <div className="w-full text-center space-x-1">
            <span>Cart</span>
            <span>({itemCount})</span>
          </div>
        </SheetTitle>
        {itemCount > 0 ? (
          <>
            <SheetHeader>
              <div className="w-full text-left mt-6 mb-2 font-medium text-sm text-muted-foreground">
                <ScrollArea>
                  {items.map(({product},i)=>(
                    <CartItem product={product} key={product.id} />
                  ))}
                </ScrollArea>
              </div>
            </SheetHeader>
            <Separator />
            <div className="w-full space-y-2 text-muted-foreground">
              <div className="w-full mt-5 font-medium text-sm flex justify-between items-center">
                <p>Shipping</p>
                <p>Free</p>
              </div>
              <div className="w-full font-medium text-sm flex justify-between items-center">
                <p>Transaction Fee</p>
                <p>{formatPrice(cartTotal+fee)}</p>
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <Image src='/hippo-empty-cart.png' alt="cart-empty" width={10000} height={10000} className="w-[12rem] h-[12rem]" />
            <div>
              <h1 className="font-semibold text-base mt-2 text-center">Your cart is empty</h1>
              <Link href={'/'}><h1 className="text-blue-500 mt-2 hover:underline underline-offset-2 font-semibold hover:text-blue-700 text-center">Add item to your cart to checkout</h1></Link>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
