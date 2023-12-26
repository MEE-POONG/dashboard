import React from 'react';
import { useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';

interface DeleteModalProps {
    data: any;
    apiDelete: () => Promise<any>;
}

const DeleteMemberModal: React.FC<DeleteModalProps> = ({ data, apiDelete }) => {
    const [show, setShow] = useState<boolean>(false);
    const [checkDelete, setCheckDelete] = useState<string>('not');

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    let heading = 'ลบข้อมูล';
    let detail;
    let variant = '';

    if (checkDelete === 'success') {
        variant = 'bg-green-500';
        detail = 'ลบข้อมูลสำเร็จ';
    } else if (checkDelete === 'primary') {
        variant = 'bg-blue-500';
        detail = (
            <>
                <div className="animate-spin mr-2 inline-block text-rose-600 text-lg">
                    <FaSpinner />
                </div>
                {'กำลังลบข้อมูล'}

            </>
        );
    } else if (checkDelete === 'danger') {
        variant = 'bg-red-500';
        detail = 'Error ลบข้อมูลไม่สำเร็จ';
    } else if (checkDelete === 'warning') {
        variant = 'bg-yellow-500';
        detail = 'กรอกข้อมูลไม่ครบ';
    }

    const handleDelete = () => {
        setCheckDelete('primary');
        apiDelete()
            .then(() => {
                setCheckDelete('success');
                setTimeout(() => {
                    setCheckDelete('not');
                    handleClose();
                }, 1000);
            })
            .catch(() => {
                setCheckDelete('danger');
            });
    };

    const handleCloseAndReset = () => {
        handleClose();
        setCheckDelete('not');
    };

    return (
        <>
            <button className="text-red-400 hover:text-red-700" onClick={handleShow}>
                <MdDelete />
            </button>
            {show && (
                <div
                    className="fixed top-0 left-0 w-full h-screen flex items-center justify-center bg-gray-800 bg-opacity-50 z-10"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-headline"
                >
                    <div className={`p-6 bg-gray-100 rounded-md ${variant}`}>
                        <h3 className="font-semibold text-lg">ต้องการ{`${heading}`}ใช่ไหม ?</h3>
                        <div className="mt-2">
                            <p className="text-sm text-black">{detail}</p>
                        </div>

                        <div className={`mt-5 flex justify-between`}>
                            <button
                                className={`bg-red-500 hover:bg-red-700 font-bold text-white  py-2 px-4 rounded ${checkDelete === 'not' || checkDelete === 'danger' ? 'my-2' : 'hidden'
                                    }`}
                                onClick={handleDelete}
                            >
                                ลบเลย
                            </button>
                            <button
                                className={`bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded ${checkDelete === 'not' || checkDelete === 'danger' ? 'my-2' : 'hidden'
                                    }`}
                                onClick={handleClose}
                            >
                                ไม่ลบละ
                            </button>
                        </div>
                    </div>

                </div>
            )}
        </>
    );
};

export default DeleteMemberModal;

