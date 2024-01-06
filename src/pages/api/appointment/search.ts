import { Prisma, PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

// Define a type for your query parameters
interface QueryParams {
  page?: string;
  pageSize?: string;
  search?: string;
  type?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case "GET":
      await handleGET(req, res);
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

async function handleGET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { page = '1', pageSize = '10', search, type } = req.query as QueryParams;

    const pageNum = parseInt(page, 10) || 1;
    const pageSizeNum = parseInt(pageSize, 10) || 10;

    const skip = (pageNum - 1) * pageSizeNum;
    const take = pageSizeNum;
    const searchCondition = search && search.length >= 3 ? {
      title: { contains: search, mode: 'insensitive' as Prisma.QueryMode }
    } : null;

    const andConditions: Prisma.NewsWhereInput[] = [];

    if (search && search.length >= 3) {
      andConditions.push({ title: { contains: search, mode: 'insensitive' as Prisma.QueryMode } });
    }

  
    const whereClause: Prisma.NewsWhereInput = {
      AND: andConditions
    };

    const newsItems = await prisma.appointment.findMany({
      
      skip,
      take,
    });

    const totalNewsCount = await prisma.appointment.count({  });
    const totalPages = Math.ceil(totalNewsCount / pageSizeNum);

    res.status(200).json({
      success: true,
      data: newsItems,
      pagination: {
        total: totalNewsCount,
        totalPages,
        page: pageNum,
        pageSize: pageSizeNum
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching news information" });
  }
}
