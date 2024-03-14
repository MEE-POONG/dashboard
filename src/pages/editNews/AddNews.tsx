// components/Modal.tsx
import AddModalAlert from '@/components/Modal/AddAlertModal';
import axios from 'axios';
import useAxios from 'axios-hooks';
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

    const [{ error: errorMessage, loading: NewsLoading }, executeNews] = useAxios({ url: '/api/news', method: 'POST' }, { manual: true });
    const [title, settitle] = useState<string>("");
    const [subtitle, setsubtitle] = useState<string>("");
    const [detail, setdetail] = useState<string>("");
    const [date, setdate] = useState<string>("");
    const [author, setauthor] = useState<string>("");
    const [linksource, setLinkSource] = useState<string>("");
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
        if (!title) missingFields.push("title");
        if (!subtitle) missingFields.push("subtitle");
        if (!detail) missingFields.push("detail");
        if (!date) missingFields.push("date");
        if (!author) missingFields.push("author");
        if (!img) missingFields.push("blogImg");

        if (missingFields.length > 0) {
            // Handle missing fields...
            setAlertForm("warning");
            setInputForm(true);
            setCheckBody(`กรอกข้อมูลไม่ครบ: ${missingFields.join(', ')}`);
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
                            title,
                            subtitle,
                            detail,
                            date,
                            author,
                            img: imageId, // Use the uploaded image ID

                        };

                        const response = await executeNews({ data });
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
        <div className="fixed top-0 left-0 w-full h-screen flex items-center justify-center bg-black bg-opacity-25 p-2 mt-24">
            <div className="bg-white p-3 md:p-6 rounded shadow-md md:w-3/4 ">
                <AddModalAlert checkAlertShow={alertForm} setCheckAlertShow={setAlertForm} checkBody={checkBody} />
                <div className='flex items-center justify-between'>
                    <h2 className='text-xl font-bold'>เพิ่มข่าว</h2>
                    <button className=" bg-blue-500 text-white p-2 rounded" onClick={onClose}>
                        <MdClose />
                    </button>
                </div>

                <div>
                    <div className="md:flex justify-between gap-5">
                        <div className="mb-3 w-full">
                            <label className="block text-sm font-semibold text-gray-950">ชื่อข่าว</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => settitle(e.target.value)}
                                className={`mt-1 p-2 border text-sm w-full ${inputForm && title === "" ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                placeholder="ชื่อข่าว"
                            />
                        </div>
                        <div className="mb-3 w-full">
                            <label className="block text-sm font-semibold text-gray-950">หัวข้อข่าวย่อย</label>
                            <input
                                type="text"
                                value={subtitle}
                                onChange={(e) => setsubtitle(e.target.value)}
                                className={`mt-1 p-2 border text-sm w-full ${inputForm && subtitle === "" ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                placeholder="หัวข้อข่าวย่อย"
                            />
                        </div>
                    </div>
                    <div className="md:flex justify-between gap-5">
                        <div className="mb-3 w-full">
                            <label className="block text-sm font-semibold text-gray-950">ผู้เขียน</label>
                            <input
                                type="text"
                                value={author}
                                onChange={(e) => setauthor(e.target.value)}
                                className={`mt-1 p-2 border text-sm w-full ${inputForm && author === "" ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                placeholder="ผู้เขียน"
                            />

                        </div>
                        <div className="mb-3 w-full">
                            <label className="block text-sm font-semibold text-gray-950">วันที่</label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setdate(e.target.value)}
                                className={`mt-1 p-2 border text-sm w-full ${inputForm && date === "" ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                placeholder="วันที่"
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="block text-sm font-semibold text-gray-950">รายละเอียด</label>
                        <textarea
                            value={detail}
                            onChange={(e) => setdetail(e.target.value)}
                            className={`mt-1 p-5 border text-sm w-full h-40 ${inputForm && detail === "" ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                            placeholder="รายละเอียด"
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

                    <div className="mb-3 w-full">
                        <label className="block text-sm font-seminbold text-gray-950">แหล่งอ้างอิง:</label>
                        <input
                            type="text"
                            value={linksource}
                            onChange={(e) => setLinkSource(e.target.value)}
                            className={`mt-1 p-2 border text-sm w-full ${inputForm && linksource === "" ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                            placeholder="แหล่งอ้างอิง"
                        />
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
                </div>

            </div>

        </div>

    );
};

export default AddNewsModal;
