import { MdOutlineEdit, MdDelete } from "react-icons/md";
import React, { useEffect, useState } from "react";
import { Accordion, Button, Card, Col } from "react-bootstrap";
// import ModalRepair from "./ModalRepair";
import Cookies from 'js-cookie';
import useAxios from "axios-hooks";
import axios from "axios";
import { useRouter } from 'next/router';
import { Appointment } from "@prisma/client";
import ModalRepair from "@/components/Modal/AppointmentDetaiModall";
import Pagination from "@/components/Pagination";
import { GoPlus } from "react-icons/go";
import AppointmentSuccess from "@/components/Modal/AppointmentSuccessModal";
import Link from "next/link";
import AppointmentSuccesss from "./add/success/[id]";


interface Params {
    page: number;
    pageSize: number;
    searchKey: string;
    totalPages: number;
}

const AppointList: React.FC = () => {
    //จำนวนหน้าและการจำกัดการแสดงของหน้า
    const router = useRouter();
    const { id } = router.query;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [time, setTime] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");
    const [tel, setTel] = useState("");
    const [email, setEmail] = useState("");
    const [repairmanId, setRepairmanId] = useState("");
    const [userId, setUserId] = useState("");
    const [request, setRequest] = useState("");
    const [UserData, setUserData] = useState({
        fname: "",
        lname: "",
        tel: "",
        email: "",
        time: "",
        userId: ""
    });
    const [params, setParams] = useState<Params>({
        page: 1,
        pageSize: 10,
        searchKey: "",
        totalPages: 1,
    });

    const [{ data: appointmentData }, getUserData] = useAxios({
        url: `/api/appointment?page=${params.page}&pageSize=${params.pageSize}&searchTerm=${params.searchKey}`,
        method: "GET",
    });

    const [
        { loading: deleteappointmentLoading, error: deleteappointmentError },
        executeappointmentDelete,
    ] = useAxios({}, { manual: true });

    const [filteredappointmentsData, setFilteredappointmentsData] = useState<
        Appointment[]
    >([]);

    useEffect(() => {
        setFilteredappointmentsData(appointmentData?.appointment ?? []);
    }, [appointmentData]);

    const deleteappointment = (id: string): Promise<any> => {
        return executeappointmentDelete({
            url: "/api/appointment/" + id,
            method: "DELETE",
        }).then(() => {
            setFilteredappointmentsData((prevappointments) =>
                prevappointments.filter((appointment) => appointment.id !== id)
            );
        });
    };

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

    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 5; // Replace with the actual total number of pages.

    const handlePageChange = (page: number) => {
        // You can implement fetching data for the selected page here
        setCurrentPage(page);
    };
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
    async function markAsRepaireds(appointmentId: any) {
        try {
            await axios.put(`/api/appointment/${appointmentId}`, { repairmanId: loggedInUser.id, status: "อยู่ระหว่างการซ่อม" });

            window.location.reload();
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการอัปเดตสถานะ', error);
        }
    }



    useEffect(() => {
        if (id) {
            fetch(`/api/repairman/${id}`)
                .then((response) => response.json())
                .then((data) => {
                    setUserData(data);
                    setFname(data.fname);
                    setLname(data.lname);
                    setTel(data.tel);
                    setEmail(data.email);
                    setRequest(data.request);
                    setUserId(data.id); // นำ userId มาจากข้อมูลผู้ใช้
                    setTime(data.time);
                    setRepairmanId(data.id);
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.error('Error:', error);
                    setIsLoading(false);
                });
        }
    }, [id]);
    const [appointmentSentToRepairman, setAppointmentSentToRepairman] = useState<string[]>([]);
    async function markAsRepairedss(appointmentId: any) {
        try {
            // ตรวจสอบว่านัดหมายได้รับการจัดส่งไปยังช่างซ่อมหรือไม่
            if (!appointmentSentToRepairman.includes(appointmentId)) {
                await axios.put(`/api/appointment/${appointmentId}`, {
                    repairmanId: loggedInUser.id,
                    status: "ซ่อมแล้ว"
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
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const openAddModal = () => {
        setAddModalOpen(true);
    };

    const closeAddModal = () => {
        setAddModalOpen(false);
    };
    return (
        <div className="overflow-hidden rounded-lg lg:shadow-xl m-2">
            <table className="border-collapse w-full">
                <thead className="bg-[#1e293b] text-white  ">
                    <tr className="">
                        <th className="p-3 uppercase font-medium text-sm hidden lg:table-cell text-left ">คิวจอง</th>
                        <th className="p-3 uppercase font-medium text-sm hidden lg:table-cell text-left">ชื่อลูกค้า</th>
                        <th className="p-3 uppercase font-medium text-sm hidden lg:table-cell text-left">อุปกรณ์</th>
                        <th className="p-3 uppercase font-medium text-sm hidden lg:table-cell text-left">เบอร์โทร</th>
                        <th className="p-3 uppercase font-medium text-sm hidden lg:table-cell text-left">สถานะ</th>
                        <th className="p-3 uppercase font-medium text-sm hidden lg:table-cell text-left">รายละเอียด</th>

                        <th className="p-3 uppercase font-medium text-sm hidden lg:table-cell text-right">จัดการ</th>
                    </tr>
                </thead>

                <tbody>
                    {filteredappointmentsData
                        .filter((appointment) => appointment.status === "อยู่ระหว่างการซ่อม")
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
                                    <span className=" bg-[#1e293b] text-white lg:hidden p-2 w-20 h-full">Status</span>
                                    <span className="ml-3 rounded-full bg-green-400 py-1 px-3 text-xs text-green-800 font-semibold">{appointment.status}</span>
                                </td>

                                {/* เมื่อกดคลิกรายละเอียดจะให้เด้งหน้า Modal  */}
                                <td className="flex items-center lg:table-cell w-full lg:w-auto border-b">
                                    <span className=" bg-[#1e293b] text-white lg:hidden p-2 w-20 h-full">Details</span>
                                    {/* <Link href="#" className="text-indigo-400 hover:text-indigo-900"> รายละเอียด </Link> */}
                                    <ModalRepair appointmentData={appointment}></ModalRepair>
                                </td>



                                <td className="flex items-center lg:table-cell w-full lg:w-auto border-b">
                                    <span className=" bg-[#1e293b] text-white lg:hidden p-2 w-20 md:w-28 h-full">Actions</span>
                                    <div className="flex justify-end px-5 gap-3">
                                        <Link
                                            href={`/appointment/add/success/${appointment.id}`}
                                            className="text-green-500 hover:text-green-700"
                                        >
                                           ซ่อมแล้ว
                                        </Link>

                                    </div>
                                </td>
                            </tr>
                        ))}

                </tbody>

            </table>
            <div>
                <Pagination
                    page={params.page}
                    totalPages={appointmentData?.pagination?.total}
                    onChangePage={handleChangePage}
                    onChangePageSize={handleChangePageSize}
                />
            </div>
        </div>

    )
}
export default AppointList;