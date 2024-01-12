import React, { useState, ChangeEvent, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { FaSpinner, FaEdit } from 'react-icons/fa';
import useAxios from 'axios-hooks';
import { MdClose } from 'react-icons/md';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/layout';
import EditModalAlert from '@/components/Modal/EditAlertModal';
import Link from 'next/link';


interface EditAppointmentModalProps {
    isEditModalOpen: boolean;
    onClose: () => void;
}


const EditAppointmentModal: React.FC<EditAppointmentModalProps> = ({ isEditModalOpen, onClose }) => {
    // if (!isEditModalOpen) return null;

    const router = useRouter();
    const { id } = router.query;
    const [
        { loading: updateBlogLoading, error: updateBlogError },
        executeBlogPut,
    ] = useAxios({}, { manual: true });

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

    const [{ data: appointmentData }, getBlog] = useAxios({
        url: `/api/appointment/${id}`,
        method: "GET",
    });

    const reloadPage = () => {
        window.location.reload();
    };

    useEffect(() => {
        if (appointmentData) {
            const {
                detail,
                url,
                receipt: imageId, // Use the uploaded image ID
            } = appointmentData;
            setdetail(detail);
            seturl(url);
            setimg(receipt);
            setimg1(img1);
        }
    }, [appointmentData]);

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



    const handleSubmit = async (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        event.stopPropagation();
        let missingFields = [];
        if (!detail) missingFields.push("รายละเอียดการซ่อม");
        if (!url) missingFields.push("ลิ้งค์");
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
                    detail,
                    date: formattedDate,
                    url,
                    receipt,
                    status:"ซ่อมแล้ว"
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

    return (
        <>

            <div className="">
                <EditModalAlert checkAlertShow={alertForm} setCheckAlertShow={setAlertForm} checkBody={checkBody} />
                <div className="bg-white p-3 md:p-6 rounded shadow-md ">
                    <div className='flex items-center justify-between'>
                        <h1 className='text-xl font-bold'>เพิ่มรายละเอียด</h1>
                        {/* <button className=" bg-blue-950 text-white p-1 rounded" onClick={onClose}>
                            <MdClose />
                        </button> */}
                    </div>


                    <div>
                        <div className="md:grid grid-cols-2 gap-4 my-5">


                            <div>
                                <label className="block text-sm font-medium"></label>
                                <input
                                    className={`mt-1 p-2 border w-full rounded-md text-sm lg:text-base  ${inputForm && !isValidUrl(url) ? 'border-red-500' : 'border-gray-300'}`}
                                    type="url"
                                    value={url}
                                    onChange={(e) => seturl(e.target.value)}
                                    placeholder="ลิ้งค์วีดีโอ"
                                />
                            </div>
                        </div>


                        <label className="block text-sm font-medium">รายละเอียดข่าว</label>
                        <textarea
                            className={`mt-1 p-2 border w-full rounded-md text-sm lg:text-base  ${inputForm && detail === '' ? 'border-red-500' : 'border-gray-300'
                                }`}
                            value={detail}
                            onChange={(e) => setdetail(e.target.value)}
                            placeholder="รายละเอียดการซ่อม"
                            style={{ width: '100%', height: '200px' }}
                        />
                        <div className="mb-3">
                            <label className="block text-sm font-semibold text-gray-950">รูปภาพ</label>
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

                        <div className='flex justify-center gap-5 mt-5'>
                            <button
                                onClick={handleSubmit}
                                className='bg-teal-500 text-white hover:bg-teal-300 hover:text-black px-3 py-1 rounded'
                            >
                                Save
                            </button>
                            <Link href='/appointment' className='bg-gray-950 text-white hover:bg-gray-300 hover:text-black px-3 py-1 rounded'>
                                Back
                            </Link>
                        </div>

                    </div>
                </div>
            </div>

        </>
    )
}
export default EditAppointmentModal;



