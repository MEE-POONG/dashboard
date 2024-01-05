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

                const repairman = await prisma.repairman.findMany({
                    skip: (page - 1) * pageSize,
                    take: pageSize,
                });

                const totalrepairman = await prisma.repairman.count();
                const totalPage: number = Math.ceil(totalrepairman / pageSize);
                res.status(200).json({ repairman });
            } catch (error) {
                res.status(500).json({ error: "An error occurred while fetching the repairman" });
            }
            break;

        case 'POST':
            try {
                const newrepairman = await prisma.repairman.create({
                    data: req.body,
                });

                res.status(201).json(newrepairman);
            } catch (error) {
                res.status(500).json({ error: "An error occurred while creating the repairman" });
            }
            break;

        default:
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}