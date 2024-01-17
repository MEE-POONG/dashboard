// pages/api/appointment.js

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

        // ดึงข้อมูลการจองทั้งหมด
        const allAppointments = await prisma.appointment.findMany({
          skip: (page - 1) * pageSize,
          take: pageSize,
          include: {
            Address: true,
            User: true,
            Repairman: true,
          },
        });

        // กรองข้อมูลที่มีสถานะเป็น "กำลังดำเนินการ"
        const inProgressAppointments = allAppointments.filter(appointment => appointment.status === 'กำลังดำเนินการ');

        // ส่งข้อมูลจำนวนการจองที่มีสถานะเป็น "กำลังดำเนินการ" กลับไป
        res.status(200).json({ appointmentCount: inProgressAppointments.length });
      } catch (error) {
        console.error('Error fetching appointment data:', error);
        res.status(500).json({ error: "An error occurred while fetching the appointment" });
      }
      break;

    case 'POST':
      try {
        const newuser = await prisma.appointment.create({
          data: req.body,
        });

        res.status(201).json(newuser);
      } catch (error) {
        res.status(500).json({ error: "An error occurred while creating the appointment" });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
