import React, { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import useAxios from "axios-hooks";
import axios from "axios";
import { useRouter } from 'next/router';
import { Appointment } from "@prisma/client";
import ModalRepair from "@/components/Modal/AppointmentDetaiModall";
import Pagination from "@/components/Pagination";

interface Params {
    page: number;
    pageSize: number;
    searchKey: string;
    totalPages: number;
}

const AppointList: React.FC = () => {
    //จำนวนหน้าและการจำกัดการแสดงของหน้า
    const [params, setParams] = useState<Params>({
        page: 1,
        pageSize: 10,
        searchKey: "",
        totalPages: 1,
    });
    const router = useRouter();
    const { id } = router.query;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [subdistrict, setsubdistrict] = useState();
    const [appointmentSentToRepairman, setAppointmentSentToRepairman] = useState<string[]>([]);

    const [{ data: appointmentData }, getUserData] = useAxios({
        url: `/api/appointment?page=${params.page}&pageSize=${params.pageSize}&searchTerm=${params.searchKey}`,
        method: "GET",
    });

    const [filteredappointmentsData, setFilteredappointmentsData] = useState<
        Appointment[]
    >([]);

    useEffect(() => {
        setFilteredappointmentsData(appointmentData?.appointment ?? []);
    }, [appointmentData]);


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

    const handleChangesearchKey = (search: string) => {
        setParams(prevParams => ({
            ...prevParams,
            searchKey: search,
        }));
    };


    useEffect(() => {
        if (appointmentData?.appointment) {
            // Filter the registerForm data based on searchKey
            const filteredData = appointmentData.appointment.filter((appointment: any) =>
                // Convert both the searchKey and the relevant data to lowercase for case-insensitive search
                appointment.fname.toLowerCase().includes(params.searchKey.toLowerCase()) ||
                appointment.lname.toLowerCase().includes(params.searchKey.toLowerCase()) ||
                appointment.email.toLowerCase().includes(params.searchKey.toLowerCase()) ||
                appointment.tel.toLowerCase().includes(params.searchKey.toLowerCase())

            );

            setFilteredappointmentsData(filteredData);
        }
    }, [appointmentData, params.searchKey]);

    useEffect(() => {
        console.log(subdistrict);
    }, [subdistrict]);
    useEffect(() => {
        console.log(appointmentData);
    }, [appointmentData]);

    //

    const [loggedInUser, setLoggedInUser] = useState<any>(null);
    useEffect(() => {
        const fetchData = async () => {
            const userDataFromCookies = Cookies.get('user');
            if (userDataFromCookies) {
                const parsedUser = JSON.parse(userDataFromCookies);
                setLoggedInUser(parsedUser);
            }
        };

        fetchData();
    }, []);

    //เมื่อกด รับซ่อม ส่งค่า repairmanId หรือช่างซ่อมลงฐานข้อมูล และปรับสถานะ

    async function markAsRepairedss(appointmentId: any) {
        try {
            // ตรวจสอบว่านัดหมายได้รับการจัดส่งไปยังช่างซ่อมหรือไม่
            if (!appointmentSentToRepairman.includes(appointmentId)) {
                await axios.put(`/api/appointment/${appointmentId}`, {
                    repairmanId: loggedInUser.id,
                    status: "อยู่ระหว่างการซ่อม"
                });

                // ปรับปรุงสถานะเพื่อระบุว่านัดหมายได้รับการจัดส่งไปยังช่างซ่อม
                setAppointmentSentToRepairman((prevSent) => [...prevSent, appointmentId]);

                // รีโหลดหน้าหรือปรับปรุงข้อมูลตามที่เหมาะสม
                window.location.reload();
            } else {
                console.warn('นัดหมายได้รับการจัดส่งไปยังช่างซ่อมแล้ว.');
            }
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการอัปเดตสถานะ', error);
        }
    }
    return (
        <div className="overflow-hidden rounded-lg lg:shadow-xl m-2">
            <div>

            </div>
            <table className="border-collapse w-full">
                <thead className="bg-[#1e293b] text-white  ">
                    <tr className="">
                        <th className="p-3 uppercase font-medium text-sm hidden lg:table-cell text-left ">คิวจอง</th>
                        <th className="p-3 uppercase font-medium text-sm hidden lg:table-cell text-left">ชื่อลูกค้า</th>
                        <th className="p-3 uppercase font-medium text-sm hidden lg:table-cell text-left">อุปกรณ์</th>
                        <th className="p-3 uppercase font-medium text-sm hidden lg:table-cell text-left">เบอร์โทร</th>
                        <th className="p-3 uppercase font-medium text-sm hidden lg:table-cell text-left">ที่อยู่</th>
                        <th className="p-3 uppercase font-medium text-sm hidden lg:table-cell text-left">สถานะ</th>
                        <th className="p-3 uppercase font-medium text-sm hidden lg:table-cell text-left">รายละเอียด</th>
                        <th className="p-3 uppercase font-medium text-sm hidden lg:table-cell text-right">จัดการ</th>
                    </tr>
                </thead>

                <tbody>
                    {filteredappointmentsData
                        .filter((appointment) => appointment.status === "กำลังดำเนินการ")
                        .sort((a, b) => new Date(a.time || '').getTime() - new Date(b.time || '').getTime())
                        .map((appointment, index) => (
                            <tr
                                className="bg-gray-50 hover:bg-gray-100 flex lg:table-row flex-row lg:flex-row flex-wrap 
                        lg:flex-no-wrap mb-10 lg:mb-0 shadow-xl rounded-lg text-xs md:text-base"
                            >
                                <td className="flex items-center lg:table-cell w-full lg:w-auto border-b">
                                    <span className=" bg-[#1e293b] text-white lg:hidden p-2 w-20 h-full">Order No.</span>
                                    <p className="px-3 py-1 md:p-3"> 00{index + 1}</p>
                                </td>

                                <td className="flex items-center lg:table-cell w-full lg:w-auto border-b">
                                    <span className=" bg-[#1e293b] text-white lg:hidden p-2 w-20 h-full">Cotumer</span>
                                    <p className="px-3 py-1">{appointment.fname} {appointment.lname}</p>
                                </td>

                                <td className="flex items-center lg:table-cell w-full lg:w-auto border-b">
                                    <span className=" bg-[#1e293b] text-white lg:hidden p-2 w-20 h-full">Products</span>
                                    <p className="px-3 py-1">{appointment.request}</p>
                                </td>

                                <td className="flex items-center lg:table-cell w-full lg:w-auto border-b">
                                    <span className=" bg-[#1e293b] text-white lg:hidden p-2 w-20 h-full">Tel</span>
                                    <span className="px-3 py-1">{appointment.tel}</span>
                                </td>
                                <td className="flex items-center lg:table-cell w-full lg:w-auto border-b">
                                    <span className=" bg-[#1e293b] text-white lg:hidden p-2 w-20 h-full">Address</span>
                                    {/* ตรวจสอบว่า district ของ Address ตรงกับ district ของช่างซ่อมหรือไม่ */}
                                    <span className={`px-3 py-1 ${appointment.Address?.district !== loggedInUser?.fname ? 'text-red-500' : ''}`}>
                                        {appointment.Address?.district}
                                    </span>
                                </td>

                                <td className="flex items-center lg:table-cell w-full lg:w-auto border-b">
                                    <span className=" bg-[#1e293b] text-white lg:hidden p-2 w-20 h-full">Status</span>
                                    <span className="ml-3 rounded-full bg-green-400 py-1 px-3 text-xs text-green-800 font-semibold">{appointment.status}</span>
                                </td>

                                {/* เมื่อกดคลิกรายละเอียดจะให้เด้งหน้า Modal  */}
                                <td className="flex items-center lg:table-cell w-full lg:w-auto border-b">
                                    <span className=" bg-[#1e293b] text-white lg:hidden p-2 w-20 h-full">Details</span>
                                    {/* <a href="#" className="text-indigo-400 hover:text-indigo-900"> รายละเอียด </a> */}
                                    <ModalRepair appointmentData={appointment}></ModalRepair>
                                </td>
                                <td className="flex items-center lg:table-cell w-full lg:w-auto border-b">
                                    <span className=" bg-[#1e293b] text-white lg:hidden p-2 w-20 h-full">Actions</span>
                                    <div className="flex justify-end px-5 gap-3">
                                        {/* เช็คว่า district ตรงกันและยังไม่ได้รับการซ่อม */}
                                        {appointment.Address?.district === loggedInUser?.fname && !appointmentSentToRepairman.includes(appointment.id) && (
                                            <button
                                                className="text-red-400 hover:text-red-900"
                                                onClick={() => markAsRepairedss(appointment.id)}
                                            >
                                                รับซ่อม
                                            </button>
                                        )}
                                        {appointment.Address?.district !== loggedInUser?.fname && (
                                            <span className="text-gray-400">ที่อยู่ไม่ตรงกับคุณ</span>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}

                </tbody>

            </table>

            <Pagination
                page={params.page}
                totalPages={appointmentData?.pagination?.total}
                onChangePage={handleChangePage}
                onChangePageSize={handleChangePageSize}
            />
        </div>
    )
}
export default AppointList;