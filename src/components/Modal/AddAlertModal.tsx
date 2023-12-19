import { useRouter } from 'next/router';
import React from 'react';

interface AddModalProps {
    checkAlertShow: string;
    setCheckAlertShow: React.Dispatch<React.SetStateAction<string>>;
    checkBody: string;
}

const AddModal: React.FC<AddModalProps> = ({ checkAlertShow, setCheckAlertShow, checkBody }) => {
    const handleClose = () => setCheckAlertShow('not');
    const router = useRouter();

    let variant;
    let heading;
    let boding;

    if (checkAlertShow === 'success') {
        variant = 'bg-green-500';
        heading = 'เพิ่มข้อมูลสำเร็จ';
    } else if (checkAlertShow === 'primary') {
        variant = 'bg-blue-500';
        heading = (
            <>
                <div className="animate-spin mr-2 inline-block"></div>
                {'กำลังเพิ่มข้อมูล'}
            </>
        );
    } else if (checkAlertShow === 'danger') {
        variant = 'bg-red-500';
        heading = 'Error เพิ่มข้อมูลไม่สำเร็จ';
    } else if (checkAlertShow === 'warning') {
        variant = 'bg-yellow-500';
        heading = 'กรอกข้อมูลไม่ครบ';
        boding = checkBody;
    }

    const handleClickReload = () => {
        setCheckAlertShow('not');
        router.reload();
    };

    const handleClickBack = () => {
        router.back();
    };

    return (
        <>
            {checkAlertShow !== 'not' && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className={`bg-white p-6 rounded-md shadow-md ${variant}`}>
                        <div className="mb-4">
                            <h2 className="text-xl font-bold text-white">{heading}</h2>
                            {boding && <p className="text-white">{boding}</p>}
                        </div>
                        <div className="flex justify-around">
                            <button
                                onClick={handleClickReload}
                                className={`bg-white text-${variant} py-2 px-4 rounded ${checkAlertShow === 'success' ? 'block' : 'hidden'
                                    }`}
                            >
                                เพิ่มต่อ
                            </button>
                            <button
                                onClick={handleClickBack}
                                className={`bg-white text-${variant} py-2 px-4 rounded ${checkAlertShow === 'success' ? 'block' : 'hidden'
                                    }`}
                            >
                                กลับหน้าจัดการข้อมูล
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AddModal;
