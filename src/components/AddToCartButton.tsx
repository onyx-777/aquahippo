"use client";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useCart } from "@/hooks/use-cart";
import { Product } from "@/payload-types";

const AddToCartButton = ({product}: {product: Product}) => {
  const { addItem } = useCart();
  const [success, SetIsSuccess] = useState<Boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      SetIsSuccess(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [success]);

  return (
    <Button size={"lg"} className="w-full"  onClick={() => {SetIsSuccess(true); addItem(product)}}>
      {success ? "Added!" : "Add to cart"}
    </Button>
  );
};

export default AddToCartButton;
