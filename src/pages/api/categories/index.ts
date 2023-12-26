import { PrismaClient, Categories } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;

    switch (method) {
        case 'GET':
            try {
                const page: number = Number(req.query.page) || 1;
                const pageSize: number = Number(req.query.pageSize) || 10;

                const categories = await prisma.categories.findMany({
                    skip: (page - 1) * pageSize,
                    take: pageSize,
                });

                const totalcategories = await prisma.categories.count();
                const totalPage: number = Math.ceil(totalcategories / pageSize);
                res.status(200).json({ categories });
            } catch (error) {
                res.status(500).json({ error: "An error occurred while fetching the categories" });
            }
            break;

        case 'POST':
            try {
                const newcategories = await prisma.categories.create({
                    data: req.body,
                });

                res.status(201).json(newcategories);
            } catch (error) {
                res.status(500).json({ error: "An error occurred while creating the categories" });
            }
            break;

        default:
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}