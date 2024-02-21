import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;

    switch (method) {
        case 'GET':
            try {
                const page: number = Number(req.query.page) || 1;
                const pageSize: number = Number(req.query.pageSize) || 1000000000000000000;

                const order = await prisma.order.findMany({
                    skip: (page - 1) * pageSize,
                    take: pageSize,
                    include: {
                        OrderList: true,
                        User: true, // รวมข้อมูลจากตาราง User ด้วย (ตัวอย่าง)
                        Payment: true,
                        Address: true,
                    },
                });

                const totaluser = await prisma.order.count();
                const totalPage: number = Math.ceil(totaluser / pageSize);
                res.status(200).json({ order });
            } catch (error) {
                res.status(500).json({ error: "An error occurred while fetching the order" });
            }
            break;

        case 'POST':
            try {
                const newuser = await prisma.order.create({
                    data: req.body,
                });

                res.status(201).json(newuser);
            } catch (error) {
                res.status(500).json({ error: "An error occurred while creating the order" });
            }
            break;

        default:
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}