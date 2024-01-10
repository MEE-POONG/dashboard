import React, { useState, ChangeEvent, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { FaSpinner, FaEdit } from 'react-icons/fa';
// import handler from '../../pages/api/hello';

import useAxios from 'axios-hooks';
import { MdClose } from 'react-icons/md';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/layout';
import EditModalAlert from '@/components/Modal/EditAlertModal';
import Link from 'next/link';
import Cookies from 'js-cookie';


interface EditNewsModalProps {
    isEditModalOpen: boolean;
    onClose: () => void;
}


const EditNewsModal: React.FC<EditNewsModalProps> = ({ isEditModalOpen, onClose }) => {
    // if (!isEditModalOpen) return null;

    const router = useRouter();
    const { id } = router.query;
    const [
        { loading: updateNewsLoading, error: updateNewsError },
        executeNewsPut,
    ] = useAxios({}, { manual: true });
    const [fname, setfname] = useState<string>("");
    const [lname, setlname] = useState<string>("");
    const [tel, settel] = useState<string>("");
    const [email, setemail] = useState<string>("");
    const [img, setimg] = useState<string>("");
    const [alertForm, setAlertForm] = useState<string>("not");
    const [inputForm, setInputForm] = useState<boolean>(false);
    const [checkBody, setCheckBody] = useState<string>("");

    const handleInputChange = (setter: any) => (event: any) => {
        const newValue = event.target.value;
        if (!isNaN(newValue) && !newValue.includes('.')) {
            setter(newValue);
        }
    };

    const [{ data: RepairmanData }, getNews] = useAxios({
        url: `/api/repairman/${id}`,
        method: "GET",
    });

    const reloadPage = () => {
        window.location.reload();
    };

    useEffect(() => {
        if (RepairmanData) {
            const {
                fname,
                lname,
                tel,
                email,
                img: imageId, // Use the uploaded image ID
            } = RepairmanData;
            setfname(fname);
            setlname(lname);
            settel(tel);
            setemail(email);
            setimg(img);

        }
    }, [RepairmanData]);


    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                const splittedString = base64String.split(",")[1]; // ตัดส่วน "data:image/png;base64," ออก
                setimg(splittedString);
            };
            reader.readAsDataURL(file);
        }
    };


    const handleSubmit = async (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        event.stopPropagation();
        let missingFields = [];
        if (!fname) missingFields.push("fname");
        if (!lname) missingFields.push("lname");
        if (!tel) missingFields.push("tel");
        if (!email) missingFields.push("email");


        if (missingFields.length > 0) {
            setAlertForm("warning");
            setInputForm(true);
            setCheckBody(`กรอกข้อมูลไม่ครบ: ${missingFields.join(', ')}`);
        } else {
            try {
                setAlertForm("primary");

                const data = {
                    tel,
                    fname,
                    lname,
                    email,

                    // newImg,
                    /*img,*/
                };


                // Execute the update
                const response = await executeNewsPut({
                    url: "/api/repairman/" + id,
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

    const [loggedInUser, setLoggedInUser] = useState<any>(null);
    useEffect(() => {
        const fetchData = async () => {
            const userDataFromCookies = Cookies.get('user');
            if (userDataFromCookies) {
                const parsedUser = JSON.parse(userDataFromCookies);
                setLoggedInUser(parsedUser);
            }
        };

        fetchData();
    }, []);
    return (
        < >

            <div className="">
                <EditModalAlert checkAlertShow={alertForm} setCheckAlertShow={setAlertForm} checkBody={checkBody} />
                <div className="bg-white p-3 md:p-6 rounded shadow-md ">
                    <div className='flex items-center justify-between'>
                        <h1 className='text-xl font-bold'>Edit News</h1>
                        {/* <button className=" bg-blue-950 text-white p-1 rounded" onClick={onClose}>
                            <MdClose />
                        </button> */}
                    </div>


                    <div>
                        <div className="md:grid grid-cols-2 gap-4 my-5">
                            <div>
                                <label className="block text-sm font-medium">ชื่อ</label>
                                <input
                                    className={`mt-1 p-2 border w-full rounded-md text-sm lg:text-base  ${inputForm && fname === '' ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    type="text"
                                    value={fname}
                                    onChange={(e) => setfname(e.target.value)}
                                    placeholder="ชื่อ"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">นามสกุล</label>
                                <input
                                    className={`mt-1 p-2 border w-full rounded-md text-sm lg:text-base  ${inputForm && lname === '' ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    type="text"
                                    value={lname}
                                    onChange={(e) => setlname(e.target.value)}
                                    placeholder="นามสกุล"
                                />
                            </div>
                            <div>
                            <label className="block text-sm font-medium">เบอร์โทรศัพท์</label>
                                <input
                                    className={`mt-1 p-2 border w-full rounded-md text-sm lg:text-base  ${inputForm && tel === '' ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    type="text"
                                    value={tel}
                                    onChange={(e) => settel(e.target.value)}
                                    placeholder="เบอร์โทรศัพท์"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">อีเมล</label>
                                <input
                                    className={`mt-1 p-2 border w-full rounded-md text-sm lg:text-base  ${inputForm && email === '' ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    type="text"
                                    value={email}
                                    onChange={(e) => setemail(e.target.value)}
                                    placeholder="อีเมล"
                                />
                            </div>
                        </div>
                        
                        <div className='flex justify-center gap-5 mt-5'>
                            <button
                                onClick={handleSubmit}
                                className='bg-teal-500 text-white hover:bg-teal-300 hover:text-black px-3 py-1 rounded'
                            >
                                Save
                            </button>
                            <Link href='/members' className='bg-gray-950 text-white hover:bg-gray-300 hover:text-black px-3 py-1 rounded'>
                                Back
                            </Link>
                        </div>

                    </div>
                </div>
            </div>

        </>
    )
}
export default EditNewsModal;

