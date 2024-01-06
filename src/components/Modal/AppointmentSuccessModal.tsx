// components/Modal.tsx
import AddModalAlert from '@/components/Modal/AddAlertModal';
import axios from 'axios';
import useAxios from 'axios-hooks';
import React, { useState, ChangeEvent, useEffect } from 'react';
import { MdClose } from "react-icons/md";
import { useRouter } from 'next/router';

interface AddRepairmanModalProps {
    isAddModalOpen: boolean;
    onClose: () => void;
    checkAlertShow: string;
    setCheckAlertShow: React.Dispatch<React.SetStateAction<string>>;
    checkBody: string;
}
const AppointmentSuccess: React.FC<AddRepairmanModalProps> = ({ isAddModalOpen, onClose }) => {
    if (!isAddModalOpen) return null;
    const router = useRouter();
    const { id } = router.query;
    const [{ error: errorMessage, loading: BlogLoading }, executeBlog] = useAxios({ url: '/api/appointment', method: 'POST' }, { manual: true });
    const [fname, setFname] = useState<string>("");
    const [img, setimg] = useState<string>("");
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
        clear();
    };
    const [{ data: AppointmentData }, getNews] = useAxios({
        url: `/api/appointment/${id}`,
        method: "GET",
    });

    useEffect(() => {
        if (AppointmentData) {
            const {
                fname,
                img: imageId, // Use the uploaded image ID
            } = AppointmentData;
            setFname(fname);
            setimg(img);

        }
    }, [AppointmentData]);

    const clear = () => {
        setFname("");
        setAlertForm("not");
        setInputForm(false);
        setCheckBody("");
    }

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                const splittedString = base64String.split(",")[1]; // ตัดส่วน "data:image/png;base64," ออก
                setimg(splittedString);
            };
            reader.readAsDataURL(file);
        }
    };
    const [
        { loading: updateNewsLoading, error: updateNewsError },
        executeNewsPut,
    ] = useAxios({}, { manual: true });

    const handleSubmit = async (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        event.stopPropagation();
        let missingFields = [];
        if (!fname) missingFields.push("ลิ้งค์วีดีโอ");

   
        if (missingFields.length > 0) {
            setAlertForm("warning");
            setInputForm(true);
            setCheckBody(`กรอกข้อมูลไม่ครบ: ${missingFields.join(', ')}`);
        } else {
            try {
                setAlertForm("primary");

                const data = {
              
                    fname,
                    img
                };


                // Execute the update
                const response = await executeNewsPut({
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
                            <label className="block text-sm font-semibold text-gray-950">วีดีโอ</label>
                            <input
                                type="text"
                                value={fname}
                                onChange={(e) => setFname(e.target.value)}
                                className={`mt-1 p-2 border text-sm w-full ${inputForm && fname === "" ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                placeholder="ชื่อ"
                            />
                        </div>
                        
                       
                        {/* <div className="mb-3">
                            <label className="block text-sm font-semibold text-gray-950">รูปภาพ</label>
                            {img && (
                                <div className="mt-2 w-24">
                                    <img
                                        src={URL.createObjectURL(img)}
                                        alt="Selected Image"
                                        className="max-w-full h-auto"
                                    />
                                </div>
                            )}
                            <input
                                type="file"
                                onChange={handleFileUpload}
                                className={`mt-1 border text-sm w-full ${inputForm && img === null ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                placeholder="รูปภาพ"
                            />
                        </div> */}
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
