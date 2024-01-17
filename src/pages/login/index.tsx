import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout';
// import ComponentsNavbar from '../../components/Thenavbar';
import { FaFacebook, FaGoogle, FaInstagram, FaYoutube } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaXTwitter } from "react-icons/fa6";
import Cookies from 'js-cookie';
import { MdClose } from 'react-icons/md';

// import Navbar from '../../components/Navbar';

interface LoginModal {
    isAddModalOpen: boolean;
    onClose: () => void;
    checkAlertShow: string;
    setCheckAlertShow: React.Dispatch<React.SetStateAction<string>>;
    checkBody: string;
}

const LoginModal: React.FC<LoginModal> = ({ isAddModalOpen, onClose }) => {
    if (!isAddModalOpen) return null;

    const [data, setData] = useState<{ user: { email: string, password: string } } | null>(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginSuccess, setLoginSuccess] = useState(false);
    const [loginMessage, setLoginMessage] = useState("");
    const router = useRouter();
    const [loggedInUser, setLoggedInUser] = useState<any>(null);



    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            // Fetch user data
            const response = await fetch("/api/repairman");
            const data = await response.json();
            const match = data?.repairman?.find((repairman: { email: string, tel: string, id: string }) => {
                return repairman.email === email && repairman.tel === password;
            });
            if (match) {
                setLoginSuccess(true);

                // Save user data to cookies
                Cookies.set('user', JSON.stringify(match));
                // Save user role to cookies
                Cookies.set('userRole', match.role);

                // Redirect to home page with user ID
                router.push('/');
                window.location.reload();


            } else {
                setLoginSuccess(false);
                setLoginMessage("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
            }

        } catch (error) {
            console.error("An error occurred:", error);
        }
    };

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
    // Logintest.tsx (หรือชื่อไฟล์ที่เกี่ยวข้อง)
    // ... โค้ดอื่น ๆ ของ Logintest
    const handleLogout = () => {
        // ลบข้อมูลจาก cookies
        Cookies.remove('user');
        // ทำการ redirect หรือ reload หน้า
        window.location.reload();
    };
    // ... โค้ดอื่น ๆ ของ Logintest

    return (
        <div className='login-page'>
            < >

                <div className="fixed top-0 left-0 w-full h-screen flex items-center justify-center bg-black bg-opacity-25 p-2">
                    <div className="bg-white p-3 md:p-6 rounded shadow-md">
                        <div className='flex items-center justify-between'>
                            <h2 className='text-xl mx-auto font-bold'>เข้าสู่ระบบ</h2>
                            <button className="bg-blue-500 text-white p-2 rounded" onClick={onClose}>
                                <MdClose />
                            </button>
                        </div>
                        <div>
                            <div className="d-flex space-between my-1">
                                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md mb-auto">
                                    <div className="bg-white py-9 px-4 shadow sm:rounded-lg sm:px-10 mb-24">
                                        <form className="space-y-6" action="" method="POST">
                                            <div id="input" >
                                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                                    อีเมล
                                                </label>
                                                <input
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    id="email"
                                                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                                    placeholder="กรอกอีเมล"
                                                />
                                            </div>

                                            <div id="input" >
                                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                                    รหัสผ่าน
                                                </label>
                                                <input
                                                    type="password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    id="password"
                                                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                                    placeholder="กรอกรหัสผ่าน"
                                                />
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <input id="remember_me" name="remember_me" type="checkbox"
                                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                                                    <label className="block text-sm font-medium mx-1 text-gray-700">
                                                        จำอีเมล
                                                    </label>
                                                </div>
                                                <div className="text-sm">
                                                    <Link href="#" className="font-medium text-blue-600 hover:text-blue-500">
                                                        ลืมรหัสผ่าน?
                                                    </Link>
                                                </div>
                                            </div>

                                            <div>
                                                <button type="submit"
                                                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-slate-800 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 "
                                                    onClick={handleLogin}
                                                >
                                                    เข้าสู่ระบบ

                                                </button>
                                            </div>
                                            {loginMessage && <p className={`text-${loginSuccess ? "success" : "danger"}`}>{loginMessage} </p>}
                                        </form>
                                        <div className="mt-6">

                                            <div className="relative">
                                                <div className="absolute inset-0 flex items-center">
                                                    <div className="w-full border-t border-gray-300"></div>
                                                </div>
                                                <div className="relative flex justify-center text-sm">
                                                    <span className="px-2 bg-gray-100 text-gray-500">
                                                        เข้าสู่ระบบด้วยวิธีอื่นๆ
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="mt-6 grid grid-cols-3 gap-3">
                                                <div>
                                                    <Link href="#"
                                                        className="w-full flex items-center justify-center px-8 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                                                        <img className="h-5 w-5" src="https://www.svgrepo.com/show/512120/facebook-176.svg"
                                                            alt="" />
                                                    </Link>
                                                </div>
                                                <div>
                                                    <Link href="#"
                                                        className="w-full flex items-center justify-center px-8 py-3 border border-gray-300  rounded-md shadow-sm text-[20px]  text-gray-700 bg-white hover:bg-gray-50">
                                                        <FaXTwitter />
                                                    </Link>
                                                </div>
                                                <div>
                                                    <Link href="#"
                                                        className="w-full flex items-center justify-center px-8 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                                                        <img className="h-5 w-5" src="https://www.svgrepo.com/show/506498/google.svg"
                                                            alt="" />
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                        </div>
                    </div>
                </div>
            </>
        </div>


    );
};

export default LoginModal;
