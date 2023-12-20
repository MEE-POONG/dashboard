// components/Modal.tsx
import axios from 'axios';
import useAxios from 'axios-hooks';
import Link from 'next/link';
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

    const [{ error: errorMessage, loading: newsLoading }, executenews] = useAxios({ url: '/api/news', method: 'POST' }, { manual: true });
    const [title, settitle] = useState<string>("");
    const [subtitle, setsubtitle] = useState<string>("");
    const [detail, setdetail] = useState<string>("");
    const [date, setdate] = useState<string>("");
    const [author, setauthor] = useState<string>("");
    const [refer, setrefer] = useState<string>("");
    // const [img, setimg] = useState<string>("");
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
        // setimg("");


        setimg(null);
        // setauthor("");

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
        if (!refer) missingFields.push("refer");
        if (!img) missingFields.push("img");


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
                    formData.append("file", img); // Assuming 'img' is a File object
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
                            refer,
                            img: imageId, // Use the uploaded image ID
                            // author,
                        };

                        const response = await executenews({ data });
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
                <div className='flex items-center justify-between'>
                    <h2 className='text-xl font-bold'>เพิ่มข่าว</h2>
                    <button className=" bg-blue-500 text-white p-2 rounded" onClick={onClose}>
                        <MdClose />
                    </button>
                </div>

                <div>
                    <div>
                        <label htmlFor="">ชื่อ/หัวข้อ</label>
                        <input type="text"
                            value={title}
                            onChange={e => settitle(e.target.value)} 
                            className='block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6'
                        />
                    </div>
                </div>

                <div className="card-footer text-end">
                    <button className="btn btn-success mx-2" onClick={handleSubmit}>
                        ยืนยัน
                    </button>
                </div>

            </div>

        </div>

    );
};

export default AddNewsModal;
