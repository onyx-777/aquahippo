import Image from "next/image";
import Link from "next/link";
import React, { FC } from "react";

interface NavItemViewProps {
  category: {
    label: string;
    value: string;
    featured: {
      name: string;
      href: string;
      imageSrc: string;
    }[];
  };
}

const NavItemView: FC<NavItemViewProps> = ({ category }) => {

  return (
    <div className="flex justify-between items-center gap-5 lg:px-2 xl:px-20 bg-white h-[23rem] w-screen px-20 pt-2 shadow-lg">
      {category.featured.map((category) => (
        <div key={category.name}>
          <Image
            src={category.imageSrc}
            alt={category.name}
            width={1000}
            height={1000}
            className="rounded-lg h-[15rem] w-full"
          />
          <div className="font-medium my-1">
          <p>{category.name}</p>
          <p className="text-muted-foreground">Shop now</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NavItemView;
