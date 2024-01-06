import React, { useEffect, useState, ChangeEvent } from "react";
import EditModalAlert from "@/components/Modal/EditAlertModal";
import useAxios from "axios-hooks";
import Link from "next/link";
import { useRouter } from "next/router";


interface AboutData {
    id: number;
    title: string;
    subtitleOne: string;
    subtitleTwo: string;
    description: string;
    Address: string;
    email: string;
    FBname: string;
    line: string;
    phoneOne: string;
    phoneTwo: string;
    logo: string; // Image ID
  }

const AboutPage: React.FC = (props) => {

    const router = useRouter();
    const { id } = router.query;
    const [
        { loading: updateAboutLoading, error: updateAboutError },
        executeAboutPut,
    ] = useAxios({}, { manual: true });
    const [title, setTitle] = useState<string>("");
    const [subtitleOne, setSubtitleOne] = useState<string>("");
    const [subtitleTwo, setSubtitleTwo] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [logo, setLogo] = useState<string>("");
    const [banner, setBanner] = useState<string>("");
    const [phoneOne, setPhoneOne] = useState<string>("");
    const [phoneTwo, setPhoneTwo] = useState<string>("");
    const [Address, setAddress] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [FBname, setFBname] = useState<string>("");
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

    const [{ data: aboutData }, getAbout] = useAxios({
        url: `/api/about/${id}`,
        method: "GET",
    });

    const reloadPage = () => {
        window.location.reload();
    };

    useEffect(() => {
        if (aboutData) {
            const {
                title,
                subtitleOne,
                subtitleTwo,
                description,
                Address,
                email,
                FBname,
                line,
                phoneOne,
                phoneTwo,
                logo: imageId, // Use the uploaded image ID
            } = aboutData;
            setTitle(title);
            setSubtitleOne(subtitleOne);
            setSubtitleTwo(subtitleTwo);
            setDescription(description);
            setAddress(Address);
            setLogo(logo);
            setEmail(email);
            setFBname(FBname);
            setLine(line);
            setPhoneOne(phoneOne);
            setPhoneTwo(phoneTwo);
        }
    }, [aboutData]);

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

    const handleSubmit = async (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        event.stopPropagation();

        try {
            setAlertForm("primary");

            const data = {
                title,
                description,
                subtitleOne,
                subtitleTwo,
                Address,
                email,
                phoneOne,
                phoneTwo,
                FBname,
                line,
            };

            // Execute the update
            const response = await executeAboutPut({
                url: "/api/about/" + id,
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
    };


    return (
        <>
            <div>
                <div className="flex justify-between m-2">
                    <h2 className="font-semibold lg:text-2xl">แก้ไข</h2>
                </div>

                <div className="bg-gray-100 w-full shadow-md rounded p-5">
                    <EditModalAlert checkAlertShow={alertForm} setCheckAlertShow={setAlertForm} checkBody={checkBody} />

                    <div className="relative mt-5 md:mt-1 border w-full rounded-md text-sm lg:text-base bg-white">
                        <span className="absolute -top-2 left-2 md:-top-3 font-semibold bg-amber-300 px-2 rounded-full text-sm"> ชื่อร้าน/บริษัท </span>
                        <input
                            className={`mt-1  border-0 w-full text-sm lg:text-base  ${inputForm && title === '' ? 'border-red-500' : 'border-gray-300'
                                }`}
                            type="text"
                            value={title}
                            onChange={(e) => {
                                const newValue = e.target.value;
                                if (newValue.length <= 50) {
                                    setTitle(newValue);
                                }
                            }}
                            placeholder="name@example.com"
                        />
                    </div>

                    <div className="md:flex justify-between mt-5 gap-5">
                        <div className="text-center">
                            <img
                                className="p-2 w-24 md:w-44 mx-auto"
                                src={logo} alt=""
                            />
                            โลโก้
                        </div>
                        <div className="relative mt-5 md:mt-1 p-2 border w-full rounded-md bg-white mb-5">
                            <span className="absolute -top-2 md:-top-3 font-semibold bg-amber-300 px-2 rounded-full text-sm"> เกี่ยวกับ MNR  </span>
                            <textarea className={`mt-1 p-2 border-0 w-full rounded-md text-sm lg:text-base  ${inputForm && description === '' ? 'border-red-500' : 'border-gray-300'
                                }`}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Description"
                                rows={8} />
                        </div>
                    </div>
                    <hr className="my-5" />

                    <div className="relative mt-5 md:mt-1 mb-5 border w-full rounded-md text-sm lg:text-base bg-white">
                        <span className="absolute -top-2 left-2 md:-top-3 font-semibold bg-amber-300 px-2 rounded-full text-sm"> ที่อยู่ </span>
                        <input
                            className={`mt-1  border-0 w-full text-sm lg:text-base  ${inputForm && Address === '' ? 'border-red-500' : 'border-gray-300'
                                }`}
                            type="text"
                            value={Address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="name@example.com"
                        />
                    </div>

                    <div className="relative mt-5 md:mt-1 border w-full rounded-md text-sm lg:text-base bg-white">
                        <span className="absolute -top-2 md:-top-3 font-semibold bg-amber-300 px-2 rounded-full text-sm"> อีเมล  </span>
                        <input
                            className={`mt-1  border-0 w-full text-sm lg:text-base  ${inputForm && email === '' ? 'border-red-500' : 'border-gray-300'
                                }`}
                            type="text"
                            value={email}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="name@example.com"
                        />
                    </div>
                    <div className="mt-5 md:flex gap-5">
                        <div className="relative mt-5 md:mt-1 border w-full rounded-md text-sm lg:text-base bg-white">
                            <span className="absolute -top-2 md:-top-3 font-semibold bg-amber-300 px-2 rounded-full text-sm"> เบอร์โทร  </span>
                            <input
                                className={`mt-1  border-0 w-full text-sm lg:text-base  ${inputForm && phoneOne === '' ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                type="text"
                                value={phoneOne}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="name@example.com"
                            />
                        </div>
                        <div className="relative mt-5 md:mt-1 border w-full rounded-md text-sm lg:text-base bg-white">
                            <span className="absolute -top-2 md:-top-3 font-semibold bg-amber-300 px-2 rounded-full text-sm"> เบอร์โทร  </span>
                            <input
                                className={`mt-1  border-0 w-full text-sm lg:text-base  ${inputForm && phoneTwo === '' ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                type="text"
                                value={phoneTwo}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="name@example.com"
                            />
                        </div>
                    </div>
                    <div className="mt-5 md:flex gap-5">
                        <div className="relative mt-5 md:mt-1 border w-full rounded-md text-sm lg:text-base bg-white">
                            <span className="absolute -top-2 md:-top-3 font-semibold bg-amber-300 px-2 rounded-full text-sm"> เบอร์โทร  </span>
                            <input
                                className={`mt-1  border-0 w-full text-sm lg:text-base  ${inputForm && FBname === '' ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                type="text"
                                value={FBname}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="name@example.com"
                            />
                        </div>
                        <div className="relative mt-5 md:mt-1 border w-full rounded-md text-sm lg:text-base bg-white">
                            <span className="absolute -top-2 md:-top-3 font-semibold bg-amber-300 px-2 rounded-full text-sm"> เบอร์โทร  </span>
                            <input
                                className={`mt-1  border-0 w-full text-sm lg:text-base  ${inputForm && line === '' ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                type="text"
                                value={line}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="name@example.com"
                            />
                        </div>
                    </div>

                    <div className="relative mt-5 md:mt-1 p-2 border w-full rounded-md bg-white mb-5">
                        <span className="absolute -top-2 md:-top-3 font-semibold bg-amber-300 px-2 rounded-full text-sm"> โลโก้ </span>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                        />
                    </div>

                    <div className="mt-5 flex justify-center gap-4">
                        <button
                            onClick={handleSubmit}
                            className='bg-teal-500 text-white hover:bg-teal-300 hover:text-black px-3 py-1 rounded'
                        >
                            Save
                        </button>
                        <Link href='/editAboutPages' className='bg-gray-950 text-white hover:bg-gray-300 hover:text-black px-3 py-1 rounded'>
                            Back
                        </Link>
                    </div>

                </div>

            </div>
        </>
    )
}
export default AboutPage;