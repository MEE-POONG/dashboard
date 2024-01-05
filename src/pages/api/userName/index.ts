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

                const userName = await prisma.userName.findMany({
                    skip: (page - 1) * pageSize,
                    take: pageSize,
                });

                const totaluserName = await prisma.userName.count();
                const totalPage: number = Math.ceil(totaluserName / pageSize);
                res.status(200).json({ userName });
            } catch (error) {
                res.status(500).json({ error: "An error occurred while fetching the userName" });
            }
            break;

        case 'POST':
            try {
                const newuserName = await prisma.userName.create({
                    data: req.body,
                });

                res.status(201).json(newuserName);
            } catch (error) {
                res.status(500).json({ error: "An error occurred while creating the userName" });
            }
            break;

        default:
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}