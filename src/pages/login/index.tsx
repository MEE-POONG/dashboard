import React, { useEffect, useState } from 'react';
import RootLayout from '../../components/layout';
// import ComponentsNavbar from '../../components/Thenavbar';
import { FaFacebook, FaGoogle, FaInstagram, FaYoutube } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaXTwitter } from "react-icons/fa6";
import Cookies from 'js-cookie';
// import Navbar from '../../components/Navbar';


const LoginComponent: React.FC = () => {
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
    
                // Save user data to local storage
                // localStorage.setItem('user', JSON.stringify(match));
    
                // Redirect to home page with user ID
                router.push(`/`);
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

    return (
    <div className='login-page'>
        <RootLayout loggedInUser={loggedInUser}>
        
            <div className=" flex flex-col  sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <img src="/images/ear.gif" className="mx-auto" width='50%' />
                    <h2 className=" text-center text-3xl font-extrabold text-gray-900">
                        เข้าสู่ระบบ
                    </h2>
                    <p className="text-center text-sm text-gray-600 ">
                        หรือ
                        <Link href="./../register" className="font-medium text-blue-600 hover:text-blue-500">
                            &nbsp;สร้างบัญชี
                        </Link>
                    </p>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md mb-auto">
                    <div className="bg-white py-9 px-4 shadow sm:rounded-lg sm:px-10 mb-24">
                        <form className="space-y-6" action="" method="POST">
                            <div id="input" >
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    อีเมล
                                </label>
                                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                       id="email"
                                        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        placeholder="กรอกอีเมล" />
                            </div>

                            <div id="input" >
                                <label  htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    รหัสผ่าน
                                </label>
                                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                                     id="password"
                                        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        placeholder="กรอกรหัสผ่าน" />
                                
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
                                    <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                                        ลืมรหัสผ่าน?
                                    </a>
                                </div>
                            </div>

                            <div>
                                <button type="submit"
                                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-slate-800 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 " onClick={handleLogin}>

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
                                    <a href="#"
                                        className="w-full flex items-center justify-center px-8 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                                        <img className="h-5 w-5" src="https://www.svgrepo.com/show/512120/facebook-176.svg"
                                            alt="" />
                                    </a>
                                </div>
                                <div>
                                    <a href="#"
                                        className="w-full flex items-center justify-center px-8 py-3 border border-gray-300  rounded-md shadow-sm text-[20px]  text-gray-700 bg-white hover:bg-gray-50">
                                        <FaXTwitter/>
                                    </a>
                                </div>
                                <div>
                                    <a href="#"
                                        className="w-full flex items-center justify-center px-8 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                                        <img className="h-5 w-5" src="https://www.svgrepo.com/show/506498/google.svg"
                                            alt="" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            

            </div>
        </RootLayout>
        </div>


    );
};

export default LoginComponent;
//  <div className="flex  justify-center pages-bg-login h-[700px] text-login"  >
//                     <div className="bg-gradient-to-br w-full xl:w-[35%] h-[500px]">
                  
//                         <div className="  p-10 flex flex-col shadow-xl rounded-xl h-[700px]">
//                             <h2 className="text-4xl text-center  font-bold text-white  mb-5 ">
//                                 เข้าสู่ระบบ
//                             </h2>
//                             <form action="" className="w-full">
//                                 <div id="input" className="flex flex-col w-full my-5 ">
//                                     <label htmlFor="email" className="text-white mb-2"
//                                     >อีเมล</label>
//                                     <input
//                                         type="text" value={email} onChange={(e) => setEmail(e.target.value)}
//                                         id="email"
//                                         placeholder="อีเมล"
//                                         className="appearance-none border-2 border-gray-100 rounded-lg px-4 py-3 placeholder-gray-300 focus:outline-none focus:ring-2  focus:shadow-lg text-black "
//                                     />
//                                 </div>
//                                 <div id="input" className="flex flex-col w-full my-5">
//                                     <label htmlFor="password" className="text-white mb-2"
//                                     >รหัสผ่าน</label>
//                                     <input
//                                         type="password" value={password} onChange={(e) => setPassword(e.target.value)}
//                                         id="password"
//                                         placeholder="รหัสผ่าน"
//                                         className="appearance-none border-2 border-gray-100 rounded-lg px-4 py-3 placeholder-gray-300 focus:outline-none focus:ring-2  focus:shadow-lg text-black"
//                                     />
//                                 </div>
//                                 <div id="button" className="flex flex-col w-full my-5">

//                                     <div className="flex">
//                                         <button className="group relative h-12 w-full overflow-hidden rounded-2xl bg-[#0F172A]  text-1xl font-bold text-white" type="submit" onClick={handleLogin}>
//                                             เข้าสู่ระบบ
//                                             <div className="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
//                                         </button>
//                                     </div>

//                                     {loginMessage && <p className={`text-${loginSuccess ? "success" : "danger"}`}>{loginMessage} </p>}
//                                     {/* {loginMessage && <p className={`text-${loginSuccess ? "success" : "danger"}`}>{loginMessage} </p>} */}

//                                 </div>



//                                 <div className="flex items-center text-center text-white " >
//                                     <hr className="border-gray-300 border-1 w-full rounded-md" />
//                                     <label className="block font-medium text-1xl mx-5">หรือ</label>
//                                     <hr className="border-gray-300 border-1 w-full rounded-md" />
//                                 </div>
//                                 <div className="flex my-5">
//                                     <button className="group relative h-12 w-full overflow-hidden rounded-2xl bg-[#1879EB]  text-1xl font-bold text-white">
//                                         <span className="absolute left-4 text-[25px]">
//                                             <FaFacebook />
//                                         </span>
//                                         <span >เข้าสู่ระบบด้วย Facebook</span>
//                                         <div className="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
//                                     </button>
//                                 </div>
//                                 <div className="flex my-3">
//                                     <button className="group relative h-12 w-full overflow-hidden rounded-2xl bg-[#0F172A]  text-1xl font-bold text-white">
//                                         <span className="absolute left-4 text-[25px]">
//                                             <FaGoogle />
//                                         </span>
//                                         <span >เข้าสู่ระบบด้วย Google</span>
//                                         <div className="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
//                                     </button>
//                                 </div>

//                                 <p className=" text-white text-center my-6 ">
//                                     <Link href="./login/forgetpassword">
//                                         ลืมรหัสผ่าน?
//                                     </Link></p>


//                                 <div className=" text-white text-center my-6 ">
//                                     <Link href="./../register">
//                                         <p>ยังไม่มีบัญชีผู้ใช้?</p>
//                                         <span className="text-[#18BCEB]">สมัครสมาชิกใหม่</span>
//                                     </Link>
//                                 </div>
//                             </form>
//                         </div>
//                     </div>
//                 </div>