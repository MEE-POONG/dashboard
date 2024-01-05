import { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import Link from 'next/link';
import { Accordion, Button, Card, Col } from "react-bootstrap";
import Cookies from 'js-cookie';

import { Appointment } from '@prisma/client';
import useAxios from "axios-hooks";
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import axios from 'axios';

export default function ModalRepair({ appointmentData }: any) {
    const [open, setOpen] = useState(false)
    const router = useRouter();
    const cancelButtonRef = useRef(null)

    const [
        { loading: deleteappointmentLoading, error: deleteappointmentError },
        executeappointmentDelete,
    ] = useAxios({}, { manual: true });

    const [filteredappointmentsData, setFilteredappointmentsData] = useState<
        Appointment[]
    >([]);
    const deleteappointment = async (id: string): Promise<any> => {
        try {
            await executeappointmentDelete({
                url: "/api/appointment/" + id,
                method: "DELETE",
            });

            // ทำการรีเฟรชหน้าจอ
            //router.reload();
        } catch (error) {
            console.error("Error deleting appointment:", error);
        }
    };

    //รับคิวเชื่อมไอดีช่าง
    const [UserData, setUserData] = useState({
        fname: "",
        lname: "",
        tel: "",
        email: "",
        time: "",
        userId: ""
    });
    const [fname, setFname] = useState<string>("");
    const [lname, setLname] = useState<string>("");
    const [tel, setTel] = useState<string>("");
    const [time, setTime] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [request, setRequest] = useState<string>("");
    const [userId, setuserId] = useState<string>("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [message, setMessage] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
    const [repairmanId, setrepairmanId] = useState<string>("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [{ error: errorMessage, loading: IndexActivityLoading }, executeIndexActivity] = useAxios(
        { url: '/api/appointment/repair', method: 'POST' },
        { manual: true }
    )

    const { id } = router.query; // ดึงค่า id จาก query parameters
    const handleSubmit = async (e: { preventDefault: () => void }) => {
        // e.preventDefault();

        // ตั้งค่าเวลาเป็นวันที่ปัจจุบัน
        const currentDate = new Date();

        const formattedDate = currentDate.toISOString(); // ปรับรูปแบบตามต้องการ

        // ส่งข้อมูลไปยัง API
        try {
            setIsLoading(true);
            const response = await executeIndexActivity({
                data: {
                    fname,
                    lname,
                    time: formattedDate,
                    request,
                    email,
                    tel,
                    userId,
                    repairmanId,
                    status: "อยู่ระหว่างการซ่อม",
                },
            });


            setIsSuccess(true);
            setMessage("สำเร็จ! คุณได้ทำการรับคิวซ่อมเรียบร้อยแล้ว");
            setIsModalOpen(true);
        } catch (error) {
            setIsSuccess(false);
            setMessage("เกิดข้อผิดพลาดในการรับคิวซ่อม");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetch(`/api/user/${id}`)
                .then((response) => response.json())
                .then((data) => {
                    console.log(data.id);
                    setUserData(data);
                    setFname(data.fname);
                    setLname(data.lname);
                    setTel(data.tel);
                    setEmail(data.email);
                    setRequest(data.request)
                    setuserId(data.id)
                    setTime(data.time)
                    setrepairmanId(data.id)
                    // setAddress(data);
                    // console.log(data);

                    setIsLoading(false); // ตั้งค่า isLoading เป็น false เมื่อโหลดเสร็จสมบูรณ์

                })
                .catch((error) => {
                    console.error('Error:', error);
                    setIsLoading(false); // ตั้งค่า isLoading เป็น false เมื่อโหลดเสร็จสมบูรณ์

                });

        }
    }, [id]);

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
    async function markAsRepaireds(appointmentId: any) {
        try {
            await axios.put(`/api/appointment/${appointmentId}`, { repairmanId: loggedInUser.id, status: "อยู่ระหว่างการซ่อม" });
            window.location.reload();
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการอัปเดตสถานะ', error);
        }
    }

    //ถึงนี้
    return (
        <>
            <button onClick={() => setOpen(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-file-description" width="32" height="32" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
                    <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"></path>
                    <path d="M9 17h6"></path>
                    <path d="M9 13h6"></path>
                </svg>
            </button>

            {open ? (
                <Transition.Root show={open} as={Fragment}>
                    <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpen}>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                        </Transition.Child>

                        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                >
                                    <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                        <div className='m-10 space-y-2'>
                                            <div className='grid grid-cols-12 grid-rows-2 space-x-1'>
                                                <p className='col-span-3 row-span-2 text-right'>ชื่ออุปกรณ์ซ่อม :</p>
                                                <p className='col-span-9 row-span-2 text-rose-500'><strong>{appointmentData.request}</strong></p>
                                            </div>
                                            <div className='grid grid-cols-12 grid-rows-2 space-x-1'>
                                                <p className='col-span-3 row-span-2 text-right'>ชื่อผู้ส่งซ่อม :</p>
                                                <p className='col-span-9 row-span-2  text-rose-500'><strong>{appointmentData.fname} {appointmentData.lname}</strong></p>
                                            </div>

                                            {/* <div className='grid grid-cols-12 grid-rows-2 space-x-1'>
                                                <p className='col-span-3 row-span-2 text-right'>ราคา :</p>
                                                <p className='col-span-9 row-span-2'>250 บาท</p>
                                            </div> */}
                                            {/* <div className='grid grid-cols-12 grid-rows-2 space-x-1'>
                                                <p className='col-span-3 row-span-2 text-right'>วันที่จองคิวซ่อม </p>
                                                <p className='col-span-9 row-span-2 text-rose-500'> <strong>{new Date(appointmentData.time).toLocaleDateString('th-TH', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    // month: 'long',
                                                    day: 'numeric',
                                                })}</strong></p>
                                            </div> */}
                                            {/* <div className='grid grid-cols-12 grid-rows-2 space-x-1'>
                                                <p className='col-span-3 row-span-2 text-right'>หมายเลขคิวซ่อม :</p>
                                                <p className='col-span-9 row-span-2'>{appointmentData.id}</p>
                                            </div> */}

                                            <div className='grid grid-cols-12 grid-rows-2 space-x-1'>
                                                <p className='col-span-3 row-span-2 text-right'>วันที่จองซ่อม :</p>
                                                <p className='col-span-9 row-span-2 text-rose-500'>
                                                    <strong>
                                                        {new Date(appointmentData.time).toLocaleDateString('th-TH', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                        })}
                                                    </strong>
                                                </p>

                                            </div>
                                            <div className='grid grid-cols-12 grid-rows-2 space-x-1'>
                                                <p className='col-span-3 row-span-2 text-right'>สถานะคำสั่งซื้อ :</p>
                                                <p className='col-span-9 row-span-2 text-rose-500'> <strong> {appointmentData.status} </strong></p>
                                            </div>
                                            <div className='grid grid-cols-12 grid-rows-2 space-x-1'>
                                                <p className='col-span-3 row-span-2 text-right'>เบอร์โทรศัพท์ :</p>
                                                <p className='col-span-9 row-span-2  text-rose-500'><strong>{appointmentData.tel}</strong></p>
                                            </div>
                                            <div className='grid grid-cols-12 grid-rows-2 space-x-1'>
                                                <p className='col-span-3 row-span-2 text-right'>รายละเอียด :</p>
                                                <p className='col-span-9 row-span-2  text-rose-500'><strong>{appointmentData.message}</strong></p>
                                            </div>
                                            {/* ถ้ามีข้อมูล หรือ วีดีโอในฐานข้อมูลจะแสดงคำว่าดูวีดีโอ ถ้าไม่มีจะแสดงคำว่า ไม่มีวีดีโอ */}
                                            <div className='grid grid-cols-12 grid-rows-2 space-x-1'>
                                                <p className='col-span-3 row-span-2 text-right'>วีดีโอ :</p>
                                                {appointmentData.video ? (
                                                    <a href={appointmentData.video} target="_blank" className='col-span-9 row-span-2 text-rose-500'>
                                                        <strong>ดูวีดีโอ</strong>
                                                    </a>
                                                ) : (
                                                    <p className='col-span-9 row-span-2 text-rose-500'>ไม่มีวีดีโอ</p>
                                                )}
                                            </div>

                                        </div>
                                        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                            <button
                                                type="button"
                                                className="mt-3 inline-flex w-full justify-center rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white hover:text-black shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                                onClick={() => setOpen(false)}
                                                ref={cancelButtonRef}
                                            >
                                                ปิด
                                            </button>
                                            {/* <Button className="text-red-400 hover:text-red-900" onClick={() => markAsRepaireds(appointmentData.id)}>
                                                รับซ่อม
                                            </Button> */}
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition.Root>
            ) : null}
        </>
    )
}