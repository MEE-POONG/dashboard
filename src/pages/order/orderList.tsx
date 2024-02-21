import Link from "next/link";
import { MdOutlineEdit, MdDelete } from "react-icons/md";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Order } from "@prisma/client";
import useAxios from "axios-hooks";
import Pagination from "@/components/Pagination";

interface Params {
    page: number;
    pageSize: number;
    searchKey: string;
    totalPages: number;
}
const OrderList: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;
    const [OrderData, setOrderData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [params, setParams] = useState<Params>({
        page: 1,
        pageSize: 10,
        searchKey: "",
        totalPages: 1,
    });
    const [{ data: orderData }, getUserData] = useAxios({
        url: `/api/order?page=${params.page}&pageSize=${params.pageSize}&searchTerm=${params.searchKey}`,
        method: "GET",
    });
    const [filteredordersData, setFilteredordersData] = useState<
        Order[]
    >([]);
    useEffect(() => {
        setFilteredordersData(orderData?.order ?? []);
    }, [orderData]);

    useEffect(() => {
        if (id) {
            fetch(`/api/user/orderlist/${id}`)
                .then((response) => response.json())
                .then((data) => {
                    setOrderData(data.Order);
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.error('Error:', error);
                    setIsLoading(false);
                });
        }
    }, [id]);

    const handleChangePage = (page: number) => {
        setParams((prevParams) => ({
            ...prevParams,
            page: page,
        }));
    };
    const handleChangePageSize = (size: number) => {
        setParams((prevParams) => ({
            ...prevParams,
            page: 1,
            pageSize: size,
        }));
    };

    const handlePaymentSuccess = async (orderId: string) => {
        try {
            // ส่งคำขอ PUT ไปยัง API เพื่ออัปเดตสถานะการชำระเงินของคำสั่งซื้อ
            await fetch(`/api/order/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: 'ชำระเงินเรียบร้อยแล้ว' })
            });
            // รีเฟรชหน้าหลังจากอัปเดตสถานะเรียบร้อย
            router.replace(router.asPath);
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    return (
        <div className="overflow-hidden rounded-lg md:shadow-xl m-2">
            <table className="border-collapse w-full">
                <thead className="bg-[#1e293b] text-white  ">
                    <tr className="">
                        <th className="p-3 uppercase font-medium text-sm hidden md:table-cell text-left ">Order No.</th>
                        <th className="p-3 uppercase font-medium text-sm hidden md:table-cell text-left">ชื่อลูกค้า</th>
                        <th className="p-3 uppercase font-medium text-sm hidden md:table-cell text-left">รายละเอียดสินค้า</th>
                        <th className="p-3 uppercase font-medium text-sm hidden md:table-cell text-left">สถานะ</th>
                        <th className="p-3 uppercase font-medium text-sm hidden md:table-cell text-right">จัดการ</th>
                    </tr>
                </thead>

                <tbody>
                    {filteredordersData
                        .filter((order) => order.status === "ยังไม่ชำระเงิน")
                        .map((order, index) => (
                            <tr
                                className="bg-gray-50 hover:bg-gray-100 flex md:table-row flex-row md:flex-row flex-wrap 
                        md:flex-no-wrap mb-10 md:mb-0 shadow-xl rounded-lg text-xs md:text-base"
                            >
                                <td className="flex items-center md:table-cell w-full md:w-auto border-b">
                                    <span className=" bg-[#1e293b] text-white md:hidden p-2 w-20 h-full">Order No.</span>
                                    <p className="px-3 py-1 md:p-3"> OD-{index + 1}</p>
                                </td>

                                <td className="flex items-center md:table-cell w-full md:w-auto border-b">
                                    <span className=" bg-[#1e293b] text-white md:hidden p-2 w-20 h-full">ลูกค้า</span>
                                    <p className="px-3 py-1">{order.User ? `${order.User.fname} ${order.User.lname}` : 'N/A'}</p>
                                </td>

                                <td className="flex items-center md:table-cell w-full md:w-auto border-b">
                                    <span className=" bg-[#1e293b] text-white md:hidden p-2 w-20 h-full">สินค้า</span>
                                    <p className="px-3 py-1">รายละเอียดสินค้า</p>
                                </td>

                                <td className="flex items-center md:table-cell w-full md:w-auto border-b">
                                    <span className=" bg-[#1e293b] text-white md:hidden p-2 w-20 h-full">สถานะ</span>
                                    <span className="ml-3 rounded-full bg-green-400 py-1 px-3 text-xs text-green-800 font-semibold">{order.status}</span>
                                </td>

                                <td className="flex items-center md:table-cell w-full md:w-auto border-b">
                                    <span className=" bg-[#1e293b] text-white md:hidden p-2 w-20 h-full">การดำเนินการ</span>
                                    <div className="flex justify-end px-5 gap-3">
                                        
                                        <button className="text-green-500 hover:text-green-700" onClick={() => handlePaymentSuccess(order.id)}>ชำระเงินเรียบร้อย</button>
                                    </div>
                                </td>
                            </tr>

                        ))}
                </tbody>

            </table>
            <Pagination
                page={params.page}
                totalPages={orderData?.pagination?.total}
                onChangePage={handleChangePage}
                onChangePageSize={handleChangePageSize}
            />
        </div>
    )
}
export default OrderList;
