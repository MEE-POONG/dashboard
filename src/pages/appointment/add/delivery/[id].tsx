import React, { useState, useEffect } from 'react';
import { Fragment, useRef } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import useAxios from 'axios-hooks';
import { useRouter } from 'next/router';
import EditModalAlert from '@/components/Modal/EditAlertModal';
import Link from 'next/link';
import { Appointment } from '@prisma/client';


interface AddressAppointmentModalProps {
    isEditModalOpen: boolean;
    onClose: () => void;
    appointmentDatas: any;  // คุณสามารถปรับปรุงชนิดของ appointmentDatas ตามต้องการ

}


const AddressAppointmentModal: React.FC<AddressAppointmentModalProps> = ({ appointmentDatas, isEditModalOpen, onClose }: any) => {
    // if (!isEditModalOpen) return null;

    const [open, setOpen] = useState(false)
    const cancelButtonRef = useRef(null)

    const router = useRouter();
    const { id } = router.query;
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
    const [printData, setPrintData] = useState<string>("");


    const handleInputChange = (setter: any) => (event: any) => {
        const newValue = event.target.value;
        if (!isNaN(newValue) && !newValue.includes('.')) {
            setter(newValue);
        }
    };


    const [filteredappointmentsData, setFilteredappointmentsData] = useState<
        Appointment[]
    >([]);


    const handlePrint = () => {
        setPrintData(`ชื่อ: ${appointmentDatas?.fname} ${appointmentDatas?.lname}\n` +
            `เบอร์โทรศัพท์: ${appointmentDatas?.tel}\n` +
            `รายละเอียดการซ่อม : ${appointmentDatas?.detail}\n` +
            `ที่อยู่ : ${appointmentDatas?.Address?.addressline}\n` + `ตำบล : ${appointmentDatas?.Address?.subdistrict}\n` + `อำเภอ : ${appointmentDatas?.Address?.district}\n` +
            `จังหวัด : ${appointmentDatas?.Address?.province}\n` + `รหัสไปรษณีย์ : ${appointmentDatas?.Address?.zipcode}\n`

        );
        window.print();

    };
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
        setPrintData("");

    };

    return (
        <>
            <button onClick={() => setOpen(true)}>
                จัดส่ง
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
                                                    <h1 className='text-xl font-bold'>ที่อยู่จัดส่ง</h1>
                                                    {/* <button className=" bg-blue-950 text-white p-1 rounded" onClick={onClose}>
                            <MdClose />
                        </button> */}
                                                </div>


                                                <div>
                                                    <div className="md:grid grid-cols-2 gap-4 my-5">
                                                        <div>
                                                            <label className="block text-sm font-medium">ชื่อ : {appointmentDatas?.fname} {appointmentDatas?.lname}</label>
                                                        </div>
                                                    </div>
                                                    <div className="md:grid grid-cols-2 gap-4 my-5">
                                                        <div>
                                                            <label className="block text-sm font-medium">เบอร์โทรศัพท์ : {appointmentDatas?.tel}</label>
                                                        </div>
                                                    </div>
                                                    <div className="md:grid grid-cols-2 gap-4 my-5">
                                                        <div>
                                                            <span className="block text-sm font-medium mt-1">รายละเอียดการซ่อม : {appointmentDatas?.detail}</span>
                                                        </div>
                                                    </div>

                                                    <div className="md:grid grid-cols-2 gap-4 my-5">
                                                        <div>
                                                            <label className="block text-sm font-medium">ที่อยู่ : {appointmentDatas?.Address?.addressline}</label>
                                                        </div>
                                                    </div>

                                                    <div className="md:grid grid-cols-2 gap-4 my-5">
                                                        <div>
                                                            <label className="block text-sm font-medium">ตำบล : {appointmentDatas?.Address?.subdistrict}</label>
                                                        </div>
                                                    </div>

                                                    <div className="md:grid grid-cols-2 gap-4 my-5">
                                                        <div>
                                                            <label className="block text-sm font-medium">อำเภอ : {appointmentDatas?.Address?.district}</label>
                                                        </div>
                                                    </div>

                                                    <div className="md:grid grid-cols-2 gap-4 my-5">
                                                        <div>
                                                            <label className="block text-sm font-medium">จังหวัด : {appointmentDatas?.Address?.province}</label>
                                                        </div>
                                                    </div>

                                                    <div className="md:grid grid-cols-3 gap-4 my-5">
                                                        <div>
                                                            <label className="block text-sm font-medium">รหัสไปรษณีย์ : {appointmentDatas?.Address?.zipcode}</label>
                                                        </div>
                                                    </div>

                                                    <div className='flex justify-center mt-5'>
                                                        <button
                                                            onClick={handleSubmit}
                                                            className='bg-teal-500 text-white hover:bg-teal-300 hover:text-black px-4 py-2 rounded mr-3'
                                                        >
                                                            ยืนยันการจัดส่ง
                                                        </button>
                                                        <button
                                                            onClick={handlePrint}
                                                            className='bg-teal-500 text-white hover:bg-teal-300 hover:text-black px-4 py-2 rounded mr-3'
                                                        >
                                                            พิมพ์
                                                        </button>
                                                        <button
                                                            onClick={() => setOpen(false)}
                                                            className='bg-gray-950 text-white hover:bg-gray-300 hover:text-black px-4 py-2 rounded'
                                                        >
                                                            ปิด
                                                        </button>
                                                    </div>
                                                    {printData && (
                                                        <div className="mt-5">
                                                            <h2 className="text-xl font-bold mb-2">ข้อมูลที่พิมพ์</h2>
                                                            <pre>{printData}</pre>
                                                        </div>

                                                    )}
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
export default AddressAppointmentModal;



