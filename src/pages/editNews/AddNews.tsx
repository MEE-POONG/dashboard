// components/Modal.tsx
import AddModalAlert from '@/components/Modal/AddAlertModal';
import axios from 'axios';
import React, { ChangeEvent, useState } from 'react';
import { MdClose } from "react-icons/md";

interface AddNewsModalProps {
    isAddModalOpen: boolean;
    onClose: () => void;
    checkAlertShow: string;
    setCheckAlertShow: React.Dispatch<React.SetStateAction<string>>;
    checkBody: string;
}
const AddNewsModal: React.FC<AddNewsModalProps> = ({ isAddModalOpen, onClose }) => {
    if (!isAddModalOpen) return null;

    const [title, settitle] = useState<string>("");
    const [subtitle, setsubtitle] = useState<string>("");
    const [detail, setdetail] = useState<string>("");
    const [date, setdate] = useState<string>("");
    const [author, setauthor] = useState<string>("");
    const [refer, setrefer] = useState<string>("");
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
        settitle("");
        setsubtitle("");
        setdetail("");
        setdate("");
        setauthor("");
        setrefer("");
        setimg(null);
        setAlertForm("not");
        setInputForm(false);
        setCheckBody("");
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        if (file) {
            setimg(file);
        }
    };

    const handleSubmit = async (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        event.stopPropagation();
        let missingFields = [];
        if (!title) missingFields.push("title");
        if (!subtitle) missingFields.push("subtitle");
        if (!detail) missingFields.push("detail");
        if (!date) missingFields.push("date");
        if (!author) missingFields.push("author");
        if (!refer) missingFields.push("refer");
        if (!img) missingFields.push("img");

        if (missingFields.length > 0) {
            setAlertForm("warning");
            setInputForm(true);
            setCheckBody(`กรอกข้อมูลไม่ครบ: ${missingFields.join(', ')}`);
        } else {
            try {
                setAlertForm("primary");
                if (img) {
                    const formData = new FormData();
                    formData.append("file", img);
                    const uploadResponse = await axios.post(
                        "https://upload-image.me-prompt-technology.com/",
                        formData
                    );

                    if (uploadResponse.status === 200) {
                        const responseData = uploadResponse.data;
                        const imageId = responseData.result.id;

                        const data = {
                            title,
                            subtitle,
                            detail,
                            date,
                            author,
                            refer,
                            img: imageId,
                        };

                        const response = await axios.post("/api/news", data);
                        if (response && response.status === 201) {
                            setAlertForm("success");
                            setTimeout(() => {
                                clear();
                            }, 5000);
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
                    <h2 className='text-xl font-bold'>เพิ่มข่าว</h2>
                    <button className=" bg-blue-500 text-white p-2 rounded" onClick={onClose}>
                        <MdClose />
                    </button>
                </div>

                <div>
                    <div className="d-flex space-between my-10">
                        <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700">ชื่อข่าว</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => settitle(e.target.value)}
                                className={`mt-1 p-2 border w-full ${inputForm && title === "" ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                placeholder="ชื่อข่าว"
                            />
                        </div>
                        <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700">หัวข้อข่าวย่อย</label>
                            <input
                                type="text"
                                value={subtitle}
                                onChange={(e) => setsubtitle(e.target.value)}
                                className={`mt-1 p-2 border w-full ${inputForm && subtitle === "" ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                placeholder="หัวข้อข่าวย่อย"
                            />
                        </div>
                        <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700">รายละเอียด</label>
                            <input
                                type="text"
                                value={detail}
                                onChange={(e) => setdetail(e.target.value)}
                                className={`mt-1 p-2 border w-full ${inputForm && detail === "" ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                placeholder="รายละเอียด"
                            />
                        </div>
                        <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700">วันที่</label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setdate(e.target.value)}
                                className={`mt-1 p-2 border w-full ${inputForm && date === "" ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                placeholder="วันที่"
                            />
                        </div>
                        <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700">ผู้เขียน</label>
                            <input
                                type="text"
                                value={author}
                                onChange={(e) => setauthor(e.target.value)}
                                className={`mt-1 p-2 border w-full ${inputForm && author === "" ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                placeholder="ผู้เขียน"
                            />
                        </div>
                        <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700">อ้างอิง</label>
                            <input
                                type="text"
                                value={refer}
                                onChange={(e) => setrefer(e.target.value)}
                                className={`mt-1 p-2 border w-full ${inputForm && refer === "" ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                placeholder="อ้างอิง"
                            />
                        </div>
                        <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700">รูปภาพ</label>
                            <input
                                type="file"
                                onChange={handleFileUpload}
                                className={`mt-1 border w-full ${inputForm && img === null ? 'border-red-500' : 'border-gray-300'} rounded-md`}
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

export default AddNewsModal;
