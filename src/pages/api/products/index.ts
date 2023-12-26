import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;

    switch (method) {
        case 'GET':
            try {
                const page: number = Number(req.query.page) || 1;
                const pageSize: number = Number(req.query.pageSize) || 10;

                const products = await prisma.products.findMany({
                    skip: (page - 1) * pageSize,
                    take: pageSize,
                });

                const totalproducts = await prisma.products.count();
                const totalPage: number = Math.ceil(totalproducts / pageSize);
                res.status(200).json({ products });
            } catch (error) {
                res.status(500).json({ error: "An error occurred while fetching the products" });
            }
            break;

        case 'POST':
            try {
                const newproducts = await prisma.products.create({
                    data: req.body,
                });

                res.status(201).json(newproducts);
            } catch (error) {
                res.status(500).json({ error: "An error occurred while creating the products" });
            }
            break;

        default:
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}