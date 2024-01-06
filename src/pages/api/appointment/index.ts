import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;

    switch (method) {
        case 'GET':
            try {
                const page: number = Number(req.query.page) || 1;
                const pageSize: number = Number(req.query.pageSize) || 1000000;
        
                const appointments = await prisma.appointment.findMany({
                    skip: (page - 1) * pageSize,
                    take: pageSize,
                    include: {
                        Address: true, // รวมข้อมูลจากตาราง Address ด้วย
                    },
                });
        
                const totalAppointments = await prisma.appointment.count();
                const totalPage: number = Math.ceil(totalAppointments / pageSize);
                
                res.status(200).json({ appointments, totalPage });
            } catch (error) {
                res.status(500).json({ error: "เกิดข้อผิดพลาดขณะดึงข้อมูลการนัดหมาย" });
            }
            break;

        case 'POST':
            try {
                const newappointment = await prisma.appointment.create({
                    data: req.body,
                });

                res.status(201).json(newappointment);
            } catch (error) {
                res.status(500).json({ error: "An error occurred while creating the appointment" });
            }
            break;

        default:
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}