import { User } from "../payload-types";
import { Access, CollectionConfig } from "payload/types";

const idAdminOrHasAccessToImages = ():Access => async ({req})=>{
    const user = req.user as User | undefined;

    if(!user) return false
    if(user.role === "admin") return true;

    return {
        user : {
            equals : req.user.id
        }
    }


}

export const Media:CollectionConfig={
    slug : "media",
    hooks : {
        beforeChange : [
            ({req, data})=>{
                return {...data, user : req.user.id}
            }
        ]
    },

    // DIFFERENT
    access : {
        // read : async ({req})=>{
        //     const referer = req.headers.referer;

        //     if (!req.user || !referer?.includes('sell')) {
        //         true
        //     }

        //     return await idAdminOrHasAccessToImages()({req})
        // },

        read : ()=>true,
        update : async({req})=>{
            return await idAdminOrHasAccessToImages()({req})
        },

        delete : async({req})=>{
            return await idAdminOrHasAccessToImages()({req})
        },

    },
    admin : {
        hidden : ({user})=> user.role !=="admin" 
    },
    upload : {
        staticURL : '/media',
        staticDir : 'media',
        imageSizes : [
            {
                name : 'thumbnail',
                width : 400,
                height : 300,
                position : 'centre'
            },
            {
                name : 'card',
                width : 768,
                height : 1080,
                position : 'centre'
            },
            {
                name : 'tablet',
                width : 1024,
                height : undefined,
                position : 'centre'
            },
        ],
        mimeTypes : ['image/*']
    },
    fields : [
        {
            name : 'user',
            type : 'relationship',
            relationTo : 'users',
            required : true,
            hasMany : false,
            admin : {
                condition :()=>false
            }
        }
    ]
}