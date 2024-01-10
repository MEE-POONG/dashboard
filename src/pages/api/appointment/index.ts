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

                const appointment = await prisma.appointment.findMany({
                    skip: (page - 1) * pageSize,
                    take: pageSize,
                    // สามารถเพิ่ม include เพื่อ Join กับตารางอื่น ๆ ตามที่ต้องการ
                    include: {
                        Address: true,
                        User: true, // รวมข้อมูลจากตาราง User ด้วย (ตัวอย่าง)
                        Repairman: true,
                    },
                });

                const totalblog = await prisma.appointment.count();
                const totalPage: number = Math.ceil(totalblog / pageSize);
                res.status(200).json({ appointment });
            } catch (error) {
                res.status(500).json({ error: "An error occurred while fetching the appointment" });
            }
            break;

        case 'POST':
            try {
                const newblog = await prisma.appointment.create({
                    data: req.body,
                });

                res.status(201).json(newblog);
            } catch (error) {
                res.status(500).json({ error: "An error occurred while creating the appointment" });
            }
            break;

        default:
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}