import { MdOutlineEdit, MdDelete } from "react-icons/md";
import React, { useEffect, useState } from "react";
import { Accordion, Button, Card, Col } from "react-bootstrap";
// import ModalRepair from "./ModalRepair";
import Cookies from 'js-cookie';
import useAxios from "axios-hooks";
import axios from "axios";
import { BsWrenchAdjustableCircleFill } from "react-icons/bs";
import { useRouter } from 'next/router';
import { Appointment } from "@prisma/client";
import Link from "next/link";
import ModalRepair from "@/components/Modal/AppointmentDetaiModall";

const Repairsuccess: React.FC = () => {
    const [{ data: appointmentData }, getappointment] = useAxios({
        url: `/api/appointment`,
        method: "GET",
    });

    const [
        { loading: deleteappointmentLoading, error: deleteappointmentError },
        executeappointmentDelete,
    ] = useAxios({}, { manual: true });

    const [filteredappointmentsData, setFilteredappointmentsData] = useState<
        Appointment[]
    >([]);

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

    useEffect(() => {
        setFilteredappointmentsData(appointmentData?.appointment ?? []);
    }, [appointmentData]);
    //เมื่อกด รับซ่อม ส่งค่า repairmanId หรือช่างซ่อมลงฐานข้อมูล และปรับสถานะ
    async function markAsRepaireds(appointmentId: any) {
        try {
            await axios.put(`/api/appointment/${appointmentId}`, { repairmanId: loggedInUser.id, status: "จัดส่ง" });
            window.location.reload();
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการอัปเดตสถานะ', error);
        }
    }

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
                        .filter((appointment) => appointment.status === "ซ่อมแล้ว")
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
                                    {/* <a href="#" className="text-indigo-400 hover:text-indigo-900"> รายละเอียด </a> */}
                                    <ModalRepair appointmentData={appointment}></ModalRepair>
                                </td>



                                <td className="flex items-center lg:table-cell w-full lg:w-auto border-b">
                                    <span className=" bg-[#1e293b] text-white lg:hidden p-2 w-20 h-full">Actions</span>
                                    <div className="flex justify-end px-5 gap-3">
                                        {/* ยังกดไม่ได้ ไม่ได้มีการ Login เข้ามา */}
                                        <Button className="text-red-400 hover:text-red-900" onClick={() => markAsRepaireds(appointment.id)}>
                                            จัดส่ง
                                        </Button>
                                        {/* <a href="#" className="text-red-400 hover:text-red-700"> รับคิว </a> */}
                                        {/* <a href="#" className="text-green-500 hover:text-green-700" ><MdOutlineEdit /></a> */}
                                    </div>
                                </td>
                            </tr>
                        ))}

                </tbody>

            </table>



        </div>
    )
}
export default Repairsuccess;