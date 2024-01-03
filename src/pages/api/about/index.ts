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

                const aboutPage = await prisma.aboutPage.findMany({
                    skip: (page - 1) * pageSize,
                    take: pageSize,
                });

                const totalaboutPage = await prisma.aboutPage.count();
                const totalPage: number = Math.ceil(totalaboutPage / pageSize);
                res.status(200).json({ aboutPage });
            } catch (error) {
                res.status(500).json({ error: "An error occurred while fetching the aboutPage" });
            }
            break;

        case 'POST':
            try {
                const newaboutPage = await prisma.aboutPage.create({
                    data: req.body,
                });

                res.status(201).json(newaboutPage);
            } catch (error) {
                res.status(500).json({ error: "An error occurred while creating the aboutPage" });
            }
            break;

        default:
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}