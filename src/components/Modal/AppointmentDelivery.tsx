import { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import Link from 'next/link';
import { Accordion, Button, Card, Col } from "react-bootstrap";
import Cookies from 'js-cookie';

import { Address, Appointment } from '@prisma/client';
import useAxios from "axios-hooks";
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import axios from 'axios';
import EditModalAlert from './EditAlertModal';

export default function ModalDelivery({ appointmentDatass }: any) {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const { id } = router.query;
    const [addressData, setAddressData] = useState<Address | null>(null);
    const cancelButtonRef = useRef(null);
    const [
        { loading: updateBlogLoading, error: updateBlogError },
        executeBlogPut,
    ] = useAxios({}, { manual: true });
    const [fname, setfname] = useState<string>("");
    const [lname, setlname] = useState<string>("");
    const [request, setrequest] = useState<string>("");
    const [tel, settel] = useState<string>("");
    const [message, setmessage] = useState<string>("");
    const [detail, setdetail] = useState<string>("");
    const [date, setdate] = useState<string>("");
    const [url, seturl] = useState<string>("");
    const [receipt, setimg] = useState<File | null>(null);
    const [img1, setimg1] = useState<string>("");
    const [alertForm, setAlertForm] = useState<string>("not");
    const [inputForm, setInputForm] = useState<boolean>(false);
    const [checkBody, setCheckBody] = useState<string>("");

    const handleInputChange = (setter: any) => (event: any) => {
        const newValue = event.target.value;
        if (!isNaN(newValue) && !newValue.includes('.')) {
            setter(newValue);
        }
    };

    const reloadPage = () => {
        window.location.reload();
    };
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        if (file) {
            setimg(file); // Store the File object
        }
    };
    const isValidUrl = (url: string) => {
        try {
            new URL(url);
            return true;
        } catch (error) {
            return false;
        }
    };
    const [filteredappointmentsData, setFilteredappointmentsData] = useState<
        Appointment[]
    >([]);
    const [{ data: appointmentDatas }, getBlog] = useAxios({
        url: `/api/appointment/${id}`,
        method: "GET",
        params: { includeAddress: true }, // ปรับเพิ่ม parameter includeAddress เพื่อให้รวมข้อมูล Address
    });


    useEffect(() => {
        if (appointmentDatas) {
            const {
                detail,
                fname,
                lname,
                tel,
                request,
                message,
                url,
                receipt: imageId, // Use the uploaded image ID
                Address, // รวมข้อมูล Address
            } = appointmentDatas;
            setdetail(detail);
            setfname(fname);
            setlname(lname);
            settel(tel);
            setrequest(request);
            setmessage(message);
            seturl(url);
            setimg(receipt);
            setimg1(img1);

            // ตั้งค่า state ของ Address
            setAddressData(Address);
        }
    }, [appointmentDatas]);

    useEffect(() => {
        console.log(appointmentDatass)
    }, [appointmentDatass]);
    useEffect(() => {
        console.log(addressData);
    }, [addressData]);

    const handleSubmit = async (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        event.stopPropagation();
        let missingFields = [];
        if (!detail) missingFields.push("รายละเอียดการซ่อม");
        if (!url) missingFields.push("ลิ้งค์");
        if (!fname) missingFields.push("ชื่อลูกค้า");
        if (!lname) missingFields.push("นามสกุลลูกค้า");
        if (!request) missingFields.push("request");
        if (!message) missingFields.push("ข้อความ");

        if (missingFields.length > 0) {
            setAlertForm("warning");
            setInputForm(true);
            setCheckBody(`กรอกข้อมูล: ${missingFields.join(', ')}`);
        } else {
            try {
                setAlertForm("primary");

                // Set date to the current date (without time)
                const currentDate = new Date();
                const formattedDate = currentDate.toLocaleDateString();

                const data = {
                    fname,
                    lname,
                    tel,
                    request,
                    message,
                    detail,
                    date: formattedDate,
                    url,
                    receipt,
                    status: "จัดส่งแล้ว"
                };

                // Execute the update
                const response = await executeBlogPut({
                    url: "/api/appointment/" + id,
                    method: "PUT",
                    data
                });

                if (response && response.status === 200) {
                    setAlertForm("success");
                    setTimeout(() => {
                        // reloadPage();
                    }, 5000);
                } else {
                    setAlertForm("danger");
                    throw new Error('Failed to update data');
                }
            } catch (error) {
                setAlertForm("danger");
            }
        }
    };
    useEffect(() => {
        setFilteredappointmentsData(appointmentDatass?.appointment ?? []);
    }, [appointmentDatass]);

    return (
        <>
            <button onClick={() => setOpen(true)}>
                รายละเอียด
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

                                        <div className="">
                                            <EditModalAlert checkAlertShow={alertForm} setCheckAlertShow={setAlertForm} checkBody={checkBody} />
                                            <div className="bg-white p-3 md:p-6 rounded shadow-md ">
                                                <div className='flex items-center justify-between'>
                                                    <div>
                                                        <div className="md:grid grid-cols-2 gap-4 my-5">
                                                            <div>
                                                                <label className="block text-sm font-medium">ชื่อ : {appointmentDatass?.fname} {appointmentDatass?.lname}</label>

                                                            </div>
                                                        </div>

                                                        <div className="md:grid grid-cols-2 gap-4 my-5">
                                                            <div>
                                                                <label className="block text-sm font-medium">เบอร์โทรศัพท์ : {appointmentDatass?.tel}  </label>
                                                            </div>
                                                        </div>
                                                        <div className="md:grid grid-cols-2 gap-4 my-5">
                                                            <div>
                                                                <label className="block text-sm font-medium">วันที่จอง : {appointmentDatass?.time}  </label>
                                                            </div>
                                                        </div>
                                                        <div className="md:grid grid-cols-2 gap-4 my-5">
                                                            <div>
                                                                <label className="block text-sm font-medium">request : {appointmentDatass?.request}  </label>
                                                            </div>
                                                        </div>
                                                        <div className="md:grid grid-cols-2 gap-4 my-5">
                                                            <div>
                                                                <label className="block text-sm font-medium">ข้อความ : {appointmentDatass?.message}  </label>
                                                            </div>
                                                        </div>
                                                        <div className="md:grid grid-cols-2 gap-4 my-5">
                                                            <div>
                                                                <label className="block text-sm font-medium">รายละเอียดการซ่อม : {appointmentDatass?.detail}  </label>
                                                            </div>
                                                        </div>
                                                        <div className="md:grid grid-cols-2 gap-4 my-5">
                                                            <div>
                                                                <label className="block text-sm font-medium">ที่อยู่ : {appointmentDatass?.Address?.addressline}  </label>
                                                            </div>
                                                        </div>
                                                        <div className="md:grid grid-cols-2 gap-4 my-5">
                                                            <div>
                                                                <label className="block text-sm font-medium">ตำบล : {appointmentDatass?.Address?.subdistrict}  </label>
                                                            </div>
                                                        </div>

                                                        <div className="md:grid grid-cols-2 gap-4 my-5">
                                                            <div>
                                                                <label className="block text-sm font-medium">อำเภอ : {appointmentDatass?.Address?.district}  </label>
                                                            </div>
                                                        </div>

                                                        <div className="md:grid grid-cols-2 gap-4 my-5">
                                                            <div>
                                                                <label className="block text-sm font-medium">จังหวัด : {appointmentDatass?.Address?.province}</label>
                                                            </div>
                                                        </div>

                                                        <div className="md:grid grid-cols-2 gap-4 my-5">
                                                            <div>
                                                                <label className="block text-sm font-medium">รหัสไปรษณีย์ : {appointmentDatass?.Address?.zipcode}  </label>
                                                            </div>
                                                        </div>

                                                        <div className='flex justify-center gap-5 mt-5'>
                                                            <button
                                                                onClick={handleSubmit}
                                                                className='bg-teal-500 text-white hover:bg-teal-300 hover:text-black px-3 py-1 rounded'
                                                            >
                                                                พิมพ์
                                                            </button>
                                                            <Link href='/appointment' className='bg-gray-950 text-white hover:bg-gray-300 hover:text-black px-3 py-1 rounded'>
                                                                กลับ
                                                            </Link>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
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