import handler from '@/pages/api/hello';
import { useRouter } from 'next/router';
import React from 'react';
import { FaSpinner } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';

interface AddModalAlertProps {
    checkAlertShow: string;
    setCheckAlertShow: React.Dispatch<React.SetStateAction<string>>;
    checkBody: string;
}

const AddModalAlert: React.FC<AddModalAlertProps> = ({ checkAlertShow, setCheckAlertShow, checkBody }) => {
    const handleClose = () => setCheckAlertShow('not');
    const router = useRouter();

    let variant;
    let heading;
    let boding;

    if (checkAlertShow === 'success') {
        variant = 'bg-white text-teal-500';
        heading = 'เพิ่มข้อมูลเรียบร้อยจ้า';
    } else if (checkAlertShow === 'primary') {
        variant = 'bg-white';
        heading = (
            <>
                <div className="animate-spin mr-2 inline-block text-cyan-600">
                    <FaSpinner />
                </div>
                {'กำลังเพิ่มข้อมูล'}

            </>
        );
    } else if (checkAlertShow === 'danger') {
        variant = 'bg-red-500';
        heading = 'Error เพิ่มข้อมูลไม่สำเร็จ';
    } else if (checkAlertShow === 'warning') {
        variant = 'bg-yellow-300';
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
                <div className="fixed top-0 left-0 w-full h-screen flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className={`p-6 rounded-md shadow-md ${variant}`}>
                        <div className="">
                            <div className='flex justify-between mb-4 gap-5'>
                                <h2 className="text-xl font-bold ">{heading}</h2>
                                <button onClick={handleClose} 
                                className={`bg-black text-white px-1.5 rounded
                                ${checkAlertShow === 'warning' ? 'block' : 'hidden'
                                    }
                                `}><MdClose /></button>
                            </div>
                            {boding &&
                                <div className="text-white">
                                    {boding}
                                </div>
                            }
                        </div>
                        <div className="flex justify-around">
                            <button
                                onClick={handleClickReload}
                                className=
                                {`text-semibold text-${variant} py-2 px-4 rounded 
                                    ${checkAlertShow === 'success' ? 'block' : 'hidden'
                                    }`
                                }
                            >
                                OK
                            </button>
                            {/* <button
                                onClick={handleClickBack}
                                className={`bg-white text-${variant} py-2 px-4 rounded ${checkAlertShow === 'success' ? 'block' : 'hidden'
                                    }`}
                            >
                                กลับหน้าจัดการข้อมูล
                            </button> */}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AddModalAlert;
