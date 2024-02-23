"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductFiles = void 0;
const addUser = ({ req, data }) => {
    const user = req.user;
    return Object.assign(Object.assign({}, data), { user: user === null || user === void 0 ? void 0 : user.id });
};
const yourOwnAndPurchased = async ({ req }) => {
    const user = req.user;
    if ((user === null || user === void 0 ? void 0 : user.role) === "admin")
        return true;
    if (!user)
        return false;
    const { docs: products } = await req.payload.find({
        collection: "products",
        depth: 0,
        where: {
            user: {
                equals: user.id
            }
        }
    });
    const ownProductFileIds = products.map((product) => product.product_files).flat();
    const { docs: orders } = await req.payload.find({
        collection: "orders",
        depth: 2,
        where: {
            user: {
                equals: user.id
            }
        }
    });
    const purchasedProductFileIds = orders.map((order) => {
        return order.products.map((product) => {
            if (typeof product === "string")
                return req.payload.logger.error('Search depth is not sufficient to retrieve purchased file Ids');
            return typeof product.product_files === "string" ? product.product_files : product.product_files.id;
        });
    }).filter(Boolean).flat();
    return {
        id: {
            in: [
                ...ownProductFileIds,
                ...purchasedProductFileIds
            ]
        }
    };
};
exports.ProductFiles = {
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
        update: ({ req }) => req.user.role === "admin",
        delete: ({ req }) => req.user.role === "admin"
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
