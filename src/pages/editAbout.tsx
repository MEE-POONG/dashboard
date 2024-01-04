import DashboardLayout from "@/components/layout";
import { About } from "@prisma/client";
import useAxios from "axios-hooks";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";



const EditAboutPage: React.FC = (props) => {

    const router = useRouter();
    const { id } = router.query;
    const [
        { loading: updatePageLoading, error: updatePageError },
        executeNewsPut,
    ] = useAxios({}, { manual: true });
    const [title, setTitle] = useState<string>("");
    const [subtitleOne, setSubtitleOne] = useState<string>("");
    const [subtitleTwo, setSubtitleTwo] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [logo, setLogo] = useState<string>("");
    const [banner, setBanner] = useState<string>("");
    const [phoneOne, setPhoneOne] = useState<string>("");
    const [phoneTwo, setPhoneTwo] = useState<string>("");
    const [address, setAddress] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [fbname, setFBname] = useState<string>("");
    const [line, setLine] = useState<string>("");
    const [alertForm, setAlertForm] = useState<string>("not");
    const [inputForm, setInputForm] = useState<boolean>(false);
    const [checkBody, setCheckBody] = useState<string>("");

    const handleInputChange = (setter: any) => (event: any) => {
        const newValue = event.target.value;
        if (!isNaN(newValue) && !newValue.includes('.')) {
            setter(newValue);
        }
    };

    const [{ data: AboutData }, getAbout] = useAxios({
        url: `/api/about/${id}`,
        method: "GET",
    });

    const reloadPage = () => {
        window.location.reload();
    };

    useEffect(() => {
        if (AboutData) {
            const {
                title,
                subtitleOne,
                subtitleTwo,
                description,
                address,
                email,
                phoneOne,
                phoneTwo,
                logo: imageId, // Use the uploaded image ID
            } = AboutData;
            setTitle(title);
            setSubtitleOne(subtitleOne);
            setSubtitleTwo(subtitleTwo);
            setAddress(address);
            setEmail(email);
            setPhoneOne(phoneOne);
            setPhoneTwo(phoneTwo);
            setLogo(logo);
        }
    }, [AboutData]);



    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                const splittedString = base64String.split(",")[1]; // ตัดส่วน "data:image/png;base64," ออก
                setLogo(splittedString);
            };
            reader.readAsDataURL(file);
        }
    };


    // const handleSubmit = async (event: React.MouseEvent<HTMLElement>) => {
    //     event.preventDefault();
    //     event.stopPropagation();
    //     let missingFields = [];
    //     if (!title) missingFields.push("NewsTitle");
    //     if (!subtitle) missingFields.push("NewsSubTitle");
    //     if (!detail) missingFields.push("NewsSubDetail");
    //     if (!date) missingFields.push("date");
    //     if (!author) missingFields.push("author");

    //     if (missingFields.length > 0) {
    //         setAlertForm("warning");
    //         setInputForm(true);
    //         setCheckBody(`กรอกข้อมูลไม่ครบ: ${missingFields.join(', ')}`);
    //     } else {
    //         try {
    //             setAlertForm("primary");

    //             const data = {
    //                 title,
    //                 subtitle,
    //                 detail,
    //                 date,
    //                 author,
    //                 // newImg,
    //                 /*img,*/
    //             };


    //             // Execute the update
    //             const response = await executeNewsPut({
    //                 url: "/api/news/" + id,
    //                 method: "PUT",
    //                 data
    //             });
    //             if (response && response.status === 200) {
    //                 setAlertForm("success");
    //                 setTimeout(() => {
    //                     // reloadPage();
    //                 }, 5000);
    //             } else {
    //                 setAlertForm("danger");
    //                 throw new Error('Failed to update data');
    //             }
    //         } catch (error) {
    //             setAlertForm("danger");
    //         }
    //     }
    // };

    return (
        <DashboardLayout>
            <div>
                <div className="flex justify-between m-2">
                    <h2 className="font-semibold lg:text-2xl">จัดการหน้าเว็บ</h2>
                </div>

                <div className="bg-gray-100 w-full shadow-md rounded p-5 ">
                    <div>
                        <label htmlFor="" className="text-sm lg:text-base">ชื่อ:</label>
                        <input type="text" className="mt-1 p-2 border-0 w-full rounded-md text-sm lg:text-base" />
                        <input
                            className="mt-1 p-2 border w-full rounded-md text-sm lg:text-base"
                            type="text"
                            value={title}
                            onChange={(e) => {
                                const newValue = e.target.value;
                                if (newValue.length <= 50) {
                                    setTitle(newValue);
                                }
                            }}
                            placeholder="title"
                        />

                    </div>

                    <div className="mt-5">
                        <label htmlFor="" className="text-sm lg:text-base">เกี่ยวกับเรา</label>
                        <textarea className="mt-1 p-2 border-0 w-full rounded-md text-sm lg:text-base"></textarea>
                    </div>

                </div>

            </div>
        </DashboardLayout>
    )
}
export default EditAboutPage;