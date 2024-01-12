import React, { useState, ChangeEvent, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { FaSpinner, FaEdit } from 'react-icons/fa';
import useAxios from 'axios-hooks';
import { MdClose } from 'react-icons/md';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/layout';
import EditModalAlert from '@/components/Modal/EditAlertModal';
import Link from 'next/link';
import { Appointment } from '@prisma/client';


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
                fname,
                lname,
                tel,
                request,
                message,
                url,
                receipt: imageId, // Use the uploaded image ID
            } = appointmentData;
            setdetail(detail);
            setfname(fname);
            setlname(lname);
            settel(tel);
            setrequest(request);
            setmessage(message);
            seturl(url);
            setimg(receipt);
            setimg1(img1);
        }
    }, [appointmentData]);

    useEffect(() => {
        console.log(appointmentData)
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
    const [filteredappointmentsData, setFilteredappointmentsData] = useState<
        Appointment[]
    >([]);


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
        setFilteredappointmentsData(appointmentData?.appointment ?? []);
    }, [appointmentData]);
    return (
        <>

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
                                <label className="block text-sm font-medium">ชื่อ :{appointmentData?.fname} </label>

                            </div>
                        </div>
                        <div className="md:grid grid-cols-2 gap-Y4 my-5">
                            <div>
                                <label className="block text-sm font-medium">นามสกุล :{appointmentData?.lname}  </label>

                            </div>
                        </div>
                        <div className="md:grid grid-cols-2 gap-4 my-5">
                            <div>
                                <label className="block text-sm font-medium">เบอร์โทรศัพท์ :{appointmentData?.tel}  </label>
                            </div>
                        </div>
                        <div className="md:grid grid-cols-2 gap-4 my-5">
                            <div>
                                <label className="block text-sm font-medium">วันที่จอง :{appointmentData?.time}  </label>
                            </div>
                        </div>
                        <div className="md:grid grid-cols-2 gap-4 my-5">
                            <div>
                                <label className="block text-sm font-medium">request :{appointmentData?.request}  </label>
                            </div>
                        </div>
                        <div className="md:grid grid-cols-2 gap-4 my-5">
                            <div>
                                <label className="block text-sm font-medium">ข้อความ :{appointmentData?.message}  </label>
                            </div>
                        </div>
                        <div className="md:grid grid-cols-2 gap-4 my-5">
                            <div>
                                <label className="block text-sm font-medium">รายละเอียดการซ่อม :{appointmentData?.detail}  </label>
                            </div>
                        </div>
                        <div className="md:grid grid-cols-2 gap-4 my-5">
                            <div>
                                <label className="block text-sm font-medium">ที่อยู่ :{appointmentData?.Address?.addressline}  </label>
                            </div>
                        </div>
                        <div className="md:grid grid-cols-2 gap-4 my-5">
                            <div>
                                <label className="block text-sm font-medium">ตำบล :{appointmentData?.Address?.subdistrict}  </label>
                            </div>
                        </div>

                        <div className="md:grid grid-cols-2 gap-4 my-5">
                            <div>
                                <label className="block text-sm font-medium">อำเภอ :{appointmentData?.Address?.district}  </label>
                            </div>
                        </div>

                        <div className="md:grid grid-cols-2 gap-4 my-5">
                            <div>
                                <label className="block text-sm font-medium">จังหวัด :{appointmentData?.Address?.province}</label>                            </div>
                        </div>

                        <div className="md:grid grid-cols-2 gap-4 my-5">
                            <div>
                                <label className="block text-sm font-medium">รหัสไปรษณีย์ :{appointmentData?.Address?.zipcode}  </label>
                            </div>
                        </div>

                        <div className='flex justify-center gap-5 mt-5'>
                            <button
                                onClick={handleSubmit}
                                className='bg-teal-500 text-white hover:bg-teal-300 hover:text-black px-3 py-1 rounded'
                            >
                                ยืนยันการจัดส่ง
                            </button>
                            <Link href='/appointment' className='bg-gray-950 text-white hover:bg-gray-300 hover:text-black px-3 py-1 rounded'>
                                กลับ
                            </Link>
                        </div>

                    </div>
                </div>
            </div>

        </>
    )
}
export default EditAppointmentModal;



