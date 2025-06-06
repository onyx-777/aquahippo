import { Access, CollectionConfig } from "payload/types";

const adminAndUser: Access = ({req : {user}}) =>{
  if(user.role == "admin") return true;

  return {
    id : {
      equals : user.id
    }
  }
}

export const Users: CollectionConfig = {
  slug: "users",
  auth : {
    verify : {
      generateEmailHTML : ({token}) =>{
        return `<a href="${process.env.NEXT_PUBLIC_SERVER_URL}/verify-email?token=${token}">Click Here</a>`;

      }
    }
  },
  access : {
    read : adminAndUser,
    create : ()=>true,
    update: ({req})=>req.user.role === 'admin',
    delete: ({req})=>req.user.role === 'admin'
  },
  admin : {
    hidden : ({user})=>user.role !== 'admin',
    defaultColumns : ['id']
  },
  fields: [
    {
      name : 'products',
      label : 'Products',
      admin : {
        condition : () => false
      },
      type : 'relationship',
      relationTo : 'products',
      hasMany : true
    },
    {
      name : 'products_files',
      label : 'Products Files',
      admin : {
        condition : () => false
      },
      type : 'relationship',
      relationTo : 'product_files',
      hasMany : true
    },
    {
      name: "role",
      type: "select",
      required:true,
      defaultValue : 'user',
      options: [
        { label: "Admin", value: "admin" },
        { label: "User", value: "user" },
      ],
    },
  ],
};
