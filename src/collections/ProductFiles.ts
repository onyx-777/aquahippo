import { User } from "@/payload-types";
import { BeforeChangeHook } from "payload/dist/collections/config/types";
import { Access, CollectionConfig } from "payload/types";

const addUser: BeforeChangeHook = ({ req, data }) => {
  const user = req.user as User | null;

  return { ...data, user: user?.id };
};

const yourOwnAndPurchased: Access = async({ req }) => {
  const user = req.user as User | null;

  if (user?.role === "admin") return true;

  if (!user) return false;

  const {docs : products} = await req.payload.find({
    collection : "products",
    depth : 0,
    where : {
        user : {
            equals : user.id
        }
    }
  })

  const ownProductFileIds = products.map((product)=>product.product_files).flat()

  const {docs : orders} = await req.payload.find({
    collection : "orders",
    depth : 2,
    where : {
        user : {
            equals : user.id
        }
    }
  })

  const purchasedProductFileIds = orders.map((order)=>{
    return order.products.map((product)=>{
        if(typeof product === "string") return req.payload.logger.error('Search depth is not sufficient to retrieve purchased file Ids');

        return typeof product.product_files === "string" ? product.product_files : product.product_files.id
    })
  }).filter(Boolean).flat()


  return {
    id : {
        in : [
            ...ownProductFileIds,
            ...purchasedProductFileIds
        ]
    }
  }

};

export const ProductFiles: CollectionConfig = {
  slug: "product_files",
  admin: {
    hidden: ({ user }) => user.role !== "admin",
  },

  hooks: {
    beforeChange: [addUser],
  },

  upload: {
    staticURL: "/product_files",
    staticDir: "product_files",
    // mimeTypes: ["images/*, font/*, application/postscript*"],
  },
  access: {
    read: yourOwnAndPurchased,
    update : ({req})=>req.user.role === "admin",
    delete : ({req})=>req.user.role === "admin"
  },
  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
      hasMany: false,
      admin: {
        condition: () => false,
      },
    },
  ],
};
