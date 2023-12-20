import React, { useState, ChangeEvent } from 'react';
import ReactDOM from 'react-dom';
import { FaSpinner, FaEdit } from 'react-icons/fa';
import handler from '../../pages/api/hello';

interface NewsData {
    title: string;
    // Add other properties of your 'data' object here
}

interface UpdateModalProps {
    data: NewsData;
    apiUpdate: (data: NewsData) => Promise<any>;
}

const UpdateNewsModal: React.FC<UpdateModalProps> = ({ data, apiUpdate }) => {
    const [show, setShow] = useState<boolean>(false);
    const [checkUpdate, setCheckUpdate] = useState<string>('not');
    const [updatedData, setUpdatedData] = useState<NewsData>(data);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    let heading = 'แก้ไขข้อมูล';
    let detail;
    let variant = '';

    if (checkUpdate === 'success') {
        variant = 'bg-green-500';
        detail = 'แก้ไขข้อมูลสำเร็จ';
    } else if (checkUpdate === 'primary') {
        variant = 'bg-blue-500';
        detail = (
            <>
                <div className="animate-spin mr-2 inline-block text-rose-600 text-lg">
                    <FaSpinner />
                </div>
                {'กำลังแก้ไขข้อมูล'}
            </>
        );
    } else if (checkUpdate === 'danger') {
        variant = 'bg-red-500';
        detail = 'Error แก้ไขข้อมูลไม่สำเร็จ';
    } else if (checkUpdate === 'warning') {
        variant = 'bg-yellow-500';
        detail = 'กรอกข้อมูลไม่ครบ';
    }

    const handleUpdate = () => {
        setCheckUpdate('primary');
        apiUpdate(updatedData)
            .then(() => {
                setCheckUpdate('success');
                setTimeout(() => {
                    setCheckUpdate('not');
                    handleClose();
                }, 1000);
            })
            .catch(() => {
                setCheckUpdate('danger');
            });
    };

    const handleCloseAndReset = () => {
        handleClose();
        setCheckUpdate('not');
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUpdatedData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
        <>
            <button className="text-blue-400 hover:text-blue-700" onClick={handleShow}>
                <FaEdit />
            </button>
            {show && (
                <div
                    className="fixed top-0 left-0 w-full h-screen flex items-center justify-center bg-gray-800 bg-opacity-50"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-headline"
                >
                    <div className={`p-6 bg-gray-100 rounded-md ${variant}`}>
                        <h3 className="font-semibold text-lg">ต้องการ{`${heading}`}ใช่ไหม ?</h3>
                        <div className="mt-2">
                            <p className="text-sm text-black">{detail}</p>
                        </div>
                        {/* Assume 'data' contains the properties of a news item */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Title</label>
                            <input
                                type="text"
                                name="title"
                                value={updatedData.title}
                                onChange={handleInputChange}
                                className="mt-1 p-2 border rounded-md w-full"
                            />
                        </div>
                        <div className={`mt-5 flex justify-between`}>
                            <button
                                className={`bg-blue-500 hover:bg-blue-700 font-bold text-white  py-2 px-4 rounded ${checkUpdate === 'not' || checkUpdate === 'danger' ? 'my-2' : 'hidden'
                                    }`}
                                onClick={handleUpdate}
                            >
                                บันทึก
                            </button>
                            <button
                                className={`bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded ${checkUpdate === 'not' || checkUpdate === 'danger' ? 'my-2' : 'hidden'
                                    }`}
                                onClick={handleClose}
                            >
                                ยกเลิก
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default UpdateNewsModal;
