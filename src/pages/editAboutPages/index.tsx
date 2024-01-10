import DashboardLayout from "@/components/layout";
import { About } from "@prisma/client";
import useAxios from "axios-hooks";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Main } from 'next/document';


const EditAboutPage: React.FC = (props) => {

    const [{ data: aboutData }, getAbout] = useAxios({
        url: "/api/about",
        method: "GET",
    });

    const [filteredaboutData, setFilteredAboutData] = useState<About[]>([]);

     useEffect(() => {
        setFilteredAboutData(aboutData?.about ?? []);
    }, [aboutData]);


    return (
        <>

            <div>
                <div className="flex justify-between m-2">
                    <h2 className="font-semibold text-lg lg:text-2xl">จัดการหน้าเว็บ - หน้าเกี่ยวกับเรา</h2>
                </div>
                {filteredaboutData.map((about) => (
                    <div key={about.id} className="bg-gray-100/75 w-full shadow-md rounded px-2 md:px-10 py-6 ">
                        <div className="mb-10 text-end">
                            <Link href={`/editAboutPages/${about.id}`} passHref
                                className="bg-purple-600 p-1 rounded hover:bg-violet-400 text-white text-sm lg:text-base"
                            >แก้ไข
                            </Link>
                        </div>

                        <div className="relative mt-5 md:mt-1 p-2 border w-full rounded-md text-sm lg:text-base bg-white">
                            <span className="absolute -top-2 md:-top-3 font-semibold bg-amber-300 px-2 rounded-full text-sm"> ชื่อร้าน/บริษัท </span>
                            <div className="mt-2">
                                {about.title}
                            </div>
                        </div>
                        <div className="md:flex justify-between mt-5 gap-5">
                            <div className="text-center">
                                <img
                                    className="p-2 w-24 md:w-44 mx-auto"
                                    src={`https://imagedelivery.net/QZ6TuL-3r02W7wQjQrv5DA/${about.imgLogo}/public`} alt=""
                                />
                                <span className="font-semibold bg-amber-300 px-2 rounded-full text-sm">โลโก้</span>
                            </div>
                            <div className="relative mt-5 md:mt-1 p-2 border w-full rounded-md bg-white mb-5">
                                <span className="absolute -top-2 md:-top-3 font-semibold bg-amber-300 px-2 rounded-full text-sm"> เกี่ยวกับ MNR  </span>
                                <textarea className="w-full border-0 text-sm lg:text-base" name="" value={about.description} rows={4} readOnly />
                            </div>
                        </div>
                        <hr className="my-5" />

                        <div className="relative mt-5 md:mt-1 p-2 border w-full rounded-md text-sm lg:text-base bg-white mb-5">
                            <span className="absolute -top-2 md:-top-3 font-semibold bg-amber-300 px-2 rounded-full text-sm"> ที่อยู่  </span>
                            <div className="mt-2">
                                {about.Address}
                            </div>
                        </div>
                        <div className="relative mt-5 md:mt-1 p-2 border w-full rounded-md text-sm lg:text-base bg-white">
                            <span className="absolute -top-2 md:-top-3 font-semibold bg-amber-300 px-2 rounded-full text-sm"> อีเมล  </span>
                            <div className="mt-2">
                                {about.email}
                            </div>
                        </div>
                        <div className="mt-5 md:flex gap-5">
                            <div className="relative mt-5 md:mt-1 p-2 border w-full rounded-md text-sm lg:text-base bg-white">
                                <span className="absolute -top-2 md:-top-3 font-semibold bg-amber-300 px-2 rounded-full text-sm"> เบอร์โทร  </span>
                                <div className="mt-2">
                                    {about.phoneOne}
                                </div>
                            </div>
                            <div className="relative mt-5 md:mt-1 p-2 border w-full rounded-md text-sm lg:text-base bg-white">
                                <span className="absolute -top-2 md:-top-3 font-semibold bg-amber-300 px-2 rounded-full text-sm"> เบอร์โทร  </span>
                                <div className="mt-2">
                                    {about.phoneTwo}
                                </div>
                            </div>
                        </div>
                        <div className="mt-5 md:flex gap-5">
                            <div className="relative mt-5 md:mt-1 p-2 border w-full rounded-md text-sm lg:text-base bg-white">
                                <span className="absolute -top-2 md:-top-3 font-semibold bg-amber-300 px-2 rounded-full text-sm"> Facebook  </span>
                                <div className="mt-2">
                                    {about.FBname}
                                </div>
                            </div>
                            <div className="relative mt-5 md:mt-1 p-2 border w-full rounded-md text-sm lg:text-base bg-white">
                                <span className="absolute -top-2 md:-top-3 font-semibold bg-amber-300 px-2 rounded-full text-sm"> Line@  </span>
                                <div className="mt-2">
                                    {about.line}
                                </div>
                            </div>
                        </div>

                        
                    </div>
                ))}

            </div>

        </>
    )
}
export default EditAboutPage;