// components/Modal.tsx
import AddModalAlert from '@/components/Modal/AddAlertModal';
import axios from 'axios';
import useAxios from 'axios-hooks';
import React, { ChangeEvent, useState } from 'react';
import { MdClose } from "react-icons/md";

interface AddRepairmanModalProps {
    isAddModalOpen: boolean;
    onClose: () => void;
    checkAlertShow: string;
    setCheckAlertShow: React.Dispatch<React.SetStateAction<string>>;
    checkBody: string;
}
const AddRepairman: React.FC<AddRepairmanModalProps> = ({ isAddModalOpen, onClose }) => {
    if (!isAddModalOpen) return null;

    const [{ error: errorMessage, loading: BlogLoading }, executeBlog] = useAxios({ url: '/api/repairman', method: 'POST' }, { manual: true });
    const [fname, setFname] = useState<string>("");
    const [lname, setLname] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [tel, setTel] = useState<string>("");
    const [img, setimg] = useState<File | null>(null);
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

    const clear = () => {
        setFname("");
        setLname("");
        setEmail("");
        setTel("");
        setimg(null);
        setAlertForm("not");
        setInputForm(false);
        setCheckBody("");
    }

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        if (file) {
            setimg(file); // Store the File object
        }
    };

    const handleSubmit = async (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        event.stopPropagation();
        let missingFields = [];
        // Check for missing fields here...
        if (!fname) missingFields.push("ชื่อ");
        if (!lname) missingFields.push("นามสกุล");
        if (!email) missingFields.push("อีเมล");

        if (!tel) missingFields.push("เบอร์โทรศัพท์");


        if (!img) missingFields.push("รูปภาพ");

        if (missingFields.length > 0) {
            // Handle missing fields...
            setAlertForm("warning");
            setInputForm(true);
            setCheckBody(`กรุณาใส่${missingFields.join(', ')}`);
        } else {
            try {
                setAlertForm("primary"); // set to loading

                // Upload the image
                if (img) {
                    const formData = new FormData();
                    formData.append("file", img); // Assuming 'newImg' is a File object
                    const uploadResponse = await axios.post(
                        "https://upload-image.me-prompt-technology.com/",
                        formData
                    );

                    if (uploadResponse.status === 200) {
                        const responseData = uploadResponse.data;
                        const imageId = responseData.result.id;

                        // Prepare the data to send
                        const data = {
                            fname,
                            lname,
                            email,
                            tel,

                            img: imageId, // Use the uploaded image ID

                        };

                        const response = await executeBlog({ data });
                        if (response && response.status === 201) {
                            setAlertForm("success");
                            setTimeout(() => {
                                clear();
                            }, 3000);
                        } else {
                            setAlertForm("danger");
                            throw new Error('Failed to send data');
                        }
                    } else {
                        setAlertForm("danger");
                        throw new Error('Image upload failed');
                    }
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
                    <h2 className='text-xl font-bold'>เพิ่มช่างเข้าสู่ระบบ</h2>
                    <button className=" bg-blue-500 text-white p-2 rounded" onClick={onClose}>
                        <MdClose />
                    </button>
                </div>

                <div>
                    <div className="d-flex space-between my-10">
                        <div className="mb-3">
                            <label className="block text-sm font-semibold text-gray-950">ชื่อ</label>
                            <input
                                type="text"
                                value={fname}
                                onChange={(e) => setFname(e.target.value)}
                                className={`mt-1 p-2 border text-sm w-full ${inputForm && fname === "" ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                placeholder="ชื่อ"
                            />
                        </div>
                        <div className="mb-3">
                            <label className="block text-sm font-semibold text-gray-950">นามสกุล</label>
                            <input
                                type="text"
                                value={lname}
                                onChange={(e) => setLname(e.target.value)}
                                className={`mt-1 p-2 border text-sm w-full ${inputForm && lname === "" ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                placeholder="นามสกุล"
                            />
                        </div>
                        <div className="mb-3">
                            <label className="block text-sm font-semibold text-gray-950">อีเมล</label>
                            <input
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`mt-1 p-2 border text-sm w-full ${inputForm && email === "" ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                placeholder="อีเมล"
                            />
                        </div>
                        <div className="mb-3">
                            <label className="block text-sm font-semibold text-gray-950">เบอร์โทรศัพท์</label>
                            <input
                                type="text"
                                value={tel}
                                onChange={(e) => setTel(e.target.value)}
                                className={`mt-1 p-2 border text-sm w-full ${inputForm && tel === "" ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                placeholder="เบอร์โทรศัพท์"
                            />
                        </div>
                        <div className="mb-3">
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

export default AddRepairman;
