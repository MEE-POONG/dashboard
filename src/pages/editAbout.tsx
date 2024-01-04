import DashboardLayout from "@/components/layout";
import { About } from "@prisma/client";
import useAxios from "axios-hooks";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";



const EditAboutPage: React.FC = (props) => {

    const [{ data: aboutData }, getnews] = useAxios({
        url: "/api/about",
        method: "GET",
    });

    const [filteredaboutData, setFilteredAboutData] = useState<
        About[]
    >([]);
    useEffect(() => {
        setFilteredAboutData(aboutData?.about ?? []);
    }, [aboutData]);

    const handleInputChange = (setter: any) => (event: any) => {
        const newValue = event.target.value;
        if (!isNaN(newValue) && !newValue.includes('.')) {
            setter(newValue);
        }
    };

    return (
        <DashboardLayout>
            <div>
                <div className="flex justify-between m-2">
                    <h2 className="font-semibold lg:text-2xl">จัดการหน้าเว็บ</h2>
                </div>

                {filteredaboutData.map((about, index) => (
                    <div key={about.id} className="bg-gray-100 w-full shadow-md rounded p-5 ">
                        <div>
                            <label htmlFor="" className="text-sm lg:text-base">ชื่อ:</label>
                            <input type="text" className="mt-1 p-2 border-0 w-full rounded-md text-sm lg:text-base" />
                        </div>

                        <div className="mt-5">
                            <label htmlFor="" className="text-sm lg:text-base">เกี่ยวกับเรา</label>
                            <textarea className="mt-1 p-2 border-0 w-full rounded-md text-sm lg:text-base">
                                {about.description}
                            </textarea>
                        </div>

                    </div>
                ))}

            </div>
        </DashboardLayout>
    )
}
export default EditAboutPage;