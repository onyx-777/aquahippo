"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Products = void 0;
const config_1 = __importDefault(require("../../config"));
const stripe_1 = require("../../lib/stripe");
const addUser = ({ req, data }) => {
    const user = req.user;
    return Object.assign(Object.assign({}, data), { user: user.id });
};
const syncUser = async ({ req, doc }) => {
    const fullUser = await req.payload.findByID({
        collection: "users",
        id: req.user.id,
    });
    if (fullUser && typeof fullUser === "object") {
        const { products } = fullUser;
        const allIds = [
            ...((products === null || products === void 0 ? void 0 : products.map((product) => typeof product === "object" ? product.id : product)) || []),
        ];
        const createdProductIds = allIds.filter((id, index) => allIds.indexOf(id) === index);
        const dataToUpdate = [...createdProductIds, doc.id];
        await req.payload.update({
            collection: "users",
            id: fullUser.id,
            data: {
                products: dataToUpdate,
            },
        });
    }
};
const isAdminOrHasAccess = () => ({ req: { user: _user } }) => {
    const user = _user;
    if ((user === null || user === void 0 ? void 0 : user.role) === "admin")
        return true;
    if (!user)
        return false;
    const userProductIds = (user.products || []).reduce((acc, product) => {
        if (!product)
            return acc;
        if (typeof product === "string") {
            acc.push(product);
        }
        else {
            acc.push(product.id);
        }
        return acc;
    }, []);
    return {
        id: {
            in: userProductIds,
        },
    };
};
exports.Products = {
    slug: "products",
    admin: {
        useAsTitle: "name",
    },
    access: {
        read: isAdminOrHasAccess(),
        update: isAdminOrHasAccess(),
        delete: isAdminOrHasAccess(),
    },
    hooks: {
        afterChange: [syncUser],
        beforeChange: [
            addUser,
            async (args) => {
                if (args.operation === "create") {
                    const data = args.data;
                    const createProduct = await stripe_1.stripe.products.create({
                        name: data.name,
                        default_price_data: {
                            currency: "USD",
                            unit_amount: Math.round(data.Price * 100),
                        },
                    });
                    const updated = Object.assign(Object.assign({}, data), { stripeId: createProduct.id, priceId: createProduct.default_price });
                    return updated;
                }
                else if (args.operation === "update") {
                    const data = args.data;
                    const updatedProduct = await stripe_1.stripe.products.update(data.stripeId, {
                        name: data.name,
                        default_price: data.priceId,
                    });
                    const updated = Object.assign(Object.assign({}, data), { stripeId: updatedProduct.id, priceId: updatedProduct.default_price });
                    return updated;
                }
            },
        ],
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
        {
            name: "name",
            label: "Name",
            type: "text",
            required: true,
        },
        {
            name: "description",
            label: "Product Details",
            type: "textarea",
        },
        {
            name: "Price",
            label: "Price in USD",
            type: "number",
            required: true,
            min: 0,
            max: 1000,
        },
        {
            name: "category",
            label: "Category",
            required: true,
            type: "select",
            options: config_1.default.map(({ label, value }) => ({ label, value })),
        },
        {
            name: "product_files",
            label: "Product File(s)",
            type: "relationship",
            relationTo: "product_files",
            hasMany: false,
            required: true,
        },
        {
            name: "approvedForSale",
            label: "Product Status",
            type: "select",
            defaultValue: "pending",
            access: {
                read: ({ req }) => req.user.role === "admin",
                create: ({ req }) => req.user.role === "admin",
                update: ({ req }) => req.user.role === "admin",
            },
            options: [
                {
                    label: "Approved",
                    value: "approved",
                },
                {
                    label: "Pending Verification",
                    value: "pending",
                },
                {
                    label: "Denied Verification",
                    value: "denied",
                },
            ],
        },
        {
            name: "priceId",
            access: {
                create: () => false,
                read: () => false,
                update: () => false,
            },
            type: "text",
            admin: {
                hidden: true,
            },
        },
        {
            name: "stripeId",
            access: {
                create: () => false,
                read: () => false,
                update: () => false,
            },
            type: "text",
            admin: {
                hidden: true,
            },
        },
        {
            name: "images",
            type: "array",
            label: "Product Images",
            minRows: 1,
            maxRows: 4,
            required: true,
            labels: {
                singular: "Image",
                plural: "Images",
            },
            fields: [
                {
                    name: "image",
                    type: "upload",
                    relationTo: "media",
                    required: true,
                },
            ],
        },
    ],
};
