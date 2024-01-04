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

                const about = await prisma.about.findMany({
                    skip: (page - 1) * pageSize,
                    take: pageSize,
                });

                const totalabout = await prisma.about.count();
                const totalPage: number = Math.ceil(totalabout / pageSize);
                res.status(200).json({ about });
            } catch (error) {
                res.status(500).json({ error: "An error occurred while fetching the about" });
            }
            break;

        case 'POST':
            try {
                const newabout = await prisma.about.create({
                    data: req.body,
                });

                res.status(201).json(newabout);
            } catch (error) {
                res.status(500).json({ error: "An error occurred while creating the about" });
            }
            break;

        default:
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}