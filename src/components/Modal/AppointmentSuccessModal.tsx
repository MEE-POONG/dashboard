// components/Modal.tsx
import AddModalAlert from '@/components/Modal/AddAlertModal';
import axios from 'axios';
import useAxios from 'axios-hooks';

import { MdClose } from "react-icons/md";
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';

interface AppointmentSuccessProps {
    isAddModalOpen: boolean;
    onClose: () => void;
    appointmentId: string; // เพิ่ม prop นี้
  }
  const AppointmentSuccess: React.FC<AppointmentSuccessProps> = ({ isAddModalOpen, onClose, appointmentId }) => {
    if (!isAddModalOpen) return null;
    const router = useRouter();
    const { id } = router.query;
    const [data, setData] = useState<any>(null);
    const [{ error: errorMessage, loading: BlogLoading }, executeBlog] = useAxios({ url: '/api/appointment', method: 'POST' }, { manual: true });
    const [detail, setdetail] = useState<string>("");
    const [date, setdate] = useState<string>("");
    const [url, seturl] = useState<string>("");
    const [receipt, setimg] = useState<File | null>(null);
    const [alertForm, setAlertForm] = useState<string>("not");
    const [inputForm, setInputForm] = useState<boolean>(false);
    const [checkBody, setCheckBody] = useState<string>("");
    const [
        { loading: updateBlogLoading, error: updateBlogError },
        executeBlogPut,
    ] = useAxios({}, { manual: true });

    const [{ data: AppointmentData }, getNews] = useAxios({
        url: `/api/appointment/${id}`,
        method: "GET",
    });

    const handleInputChange = (setter: any) => (event: any) => {
        const newValue = event.target.value;
        if (!isNaN(newValue) && !newValue.includes('.')) {
            setter(newValue);
        }
    };

    // ฟังก์ชั่นการเคลียข้อมูลที่กรอก
    const reloadPage = () => {
        clear();
    };
    const clear = () => {
        setdetail("");
        seturl("");
        setimg(null);
        setAlertForm("not");
        setInputForm(false);
        setCheckBody("");
    }

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        if (file) {
            setimg(file);
        }
    };

    useEffect(() => {
        if (AppointmentData) {
            const {
                detail,
                date,
                receipt,
            } = AppointmentData;
       
            setdetail(detail);
            setdate(date);
            setimg(receipt);
      
        }
    }, [AppointmentData]);

    const handleSubmit = async (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        event.stopPropagation();
        let missingFields = [];
        if (!detail) missingFields.push("รายละเอียดการซ่อม");
        if (!url) missingFields.push("วีดีโอ");
        if (missingFields.length > 0) {
            setAlertForm("warning");
            setInputForm(true);
            setCheckBody(`กรอกข้อมูลไม่ครบ: ${missingFields.join(', ')}`);
        } else {
            try {
                setAlertForm("primary");

                const data = {
                
                    detail,
                    url,
                 
                    // newImg,
                    /*img,*/
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

    // useEffect(() => {
    //     // ตรวจสอบว่า appointmentId มีค่าหรือไม่ก่อนที่จะทำงาน
    //     if (appointmentId) {
    //         // ทำงานที่ต้องการเมื่อมี appointmentId
    //         fetchData(appointmentId);
    //     }
    // }, [appointmentId]);

    return (
        <div className="fixed top-0 left-0 w-full h-screen flex items-center justify-center bg-black bg-opacity-25 p-2">
            <div className="bg-white p-3 md:p-6 rounded shadow-md ">
                <AddModalAlert checkAlertShow={alertForm} setCheckAlertShow={setAlertForm} checkBody={checkBody} />
                <div className='flex items-center justify-between'>
                    <h2 className='text-xl font-bold'>แจ้งรายละเอียดการซ่อม</h2>
                    <button className=" bg-blue-500 text-white p-2 rounded" onClick={onClose}>
                        <MdClose />
                    </button>
                </div>

                <div>
                    <div className="d-flex space-between my-10">

                        <div className="mb-3">
                            <label className="block text-sm font-semibold text-gray-950">รายละเอียด</label>
                            <input
                                type="text"
                                value={url}
                                onChange={(e) => seturl(e.target.value)}
                                className={`mt-1 p-2 border text-sm w-full ${inputForm && url === "" ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                placeholder="วีดีโอ"
                            />
                        </div>


                        <div className="mb-3">
                            <label className="block text-sm font-seminbold text-gray-950">รายละเอียด</label>
                            <textarea
                                value={detail}
                                onChange={(e) => setdetail(e.target.value)}
                                className={`mt-1 p-2 border text-sm w-full h-64 ${inputForm && detail === "" ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                placeholder="รายละเอียด"
                            />
                        </div>


                        <div className="mb-3">
                            <label className="block text-sm font-seminbold text-gray-950">รูปภาพปก</label>
                            {receipt && (
                                <div className="mt-2 w-24">
                                    <img
                                        src={URL.createObjectURL(receipt)}
                                        alt="Selected Image"
                                        className="max-w-full h-auto"
                                    />
                                </div>
                            )}
                            <input
                                type="file"
                                onChange={handleFileUpload}
                                className={`mt-1 border text-sm w-full ${inputForm && receipt === null ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                placeholder="รูปภาพ"
                            />
                        </div>
                    </div>
                </div>
                <div className="text-end">
                    <button
                        className="bg-green-500 text-white px-4 py-2 rounded-md mx-2"
                        onClick={handleSubmit}
                    >
                        ยืนยัน
                    </button>
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded-md mx-2"
                        onClick={reloadPage}
                    >
                        ล้าง
                    </button>
                    {/* <button onClick={onClose} className="bg-blue-500 text-white px-4 py-2 rounded-md mx-2">ปิด</button> */}
                </div>

            </div>

        </div>

    );
};

export default AppointmentSuccess;
