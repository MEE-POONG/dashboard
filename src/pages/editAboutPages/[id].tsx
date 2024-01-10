import React, { useEffect, useState, ChangeEvent } from "react";
import EditModalAlert from "@/components/Modal/EditAlertModal";
import useAxios from "axios-hooks";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";


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
    imgLogo: string; // Use the uploaded image ID
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
    const [imgLogo, setImgLogo] = useState<string>("");
    const [imgbanner, setImgBanner] = useState<string>("");
    const [phoneOne, setPhoneOne] = useState<string>("");
    const [phoneTwo, setPhoneTwo] = useState<string>("");
    const [Address, setAddress] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [FBname, setFBname] = useState<string>("");
    const [line, setLine] = useState<string>("");

    const [imglogoPreview, setImgLogoPreview] = useState<string | null>(null);

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
            } = aboutData;
            setTitle(title);
            setSubtitleOne(subtitleOne);
            setSubtitleTwo(subtitleTwo);
            setDescription(description);
            setAddress(Address);
            setEmail(email);
            setFBname(FBname);
            setLine(line);
            setPhoneOne(phoneOne);
            setPhoneTwo(phoneTwo);
        }
    }, [aboutData]);

    const handleFileUpload = (
        event: ChangeEvent<HTMLInputElement>,
        setImage: React.Dispatch<React.SetStateAction<File | null>>,
        setPreview: React.Dispatch<React.SetStateAction<string | null>>
    ) => {
        const file = event.target.files && event.target.files[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setPreview(base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    const deleteImage = async (imageId: string) => {
        try {
            await axios.delete(`https://upload-image.me-prompt-technology.com/?name=${imageId}`);
        } catch (error) {
            console.error("Delete failed: ", error);
        }
    };
    const uploadImage = async (img: any, image: any) => {
        const uploadFormData = new FormData();
        uploadFormData.append("file", image);
        try {
            const uploadResponse = await axios.post(
                "https://upload-image.me-prompt-technology.com/",
                uploadFormData
            );

            if (uploadResponse?.status === 200) {
                deleteImage(img);
                return uploadResponse?.data?.result?.id;
            }
        } catch (error) {
            console.error("Upload failed: ", error);
        }
        return null;
    };


    const handleSubmit = async (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        event.stopPropagation();
        const imageIDs = await Promise.all([
            imgLogo ? uploadImage(aboutData?.imgLogo, imgLogo) : null,

        ]);

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
                imgLogo: imageIDs[0] !== null ? imageIDs[0] : aboutData?.imgLogo,

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

                    <div className="relative mt-5 md:mt-1 border w-full rounded-md text-xs md:text-base bg-white">
                        <span className="absolute -top-2 left-2 md:-top-3 font-semibold bg-amber-300 px-2 rounded-full text-xs"> ชื่อร้าน/บริษัท </span>
                        <input
                            className={`mt-1  border-0 w-full text-xs md:text-base  ${inputForm && title === '' ? 'border-red-500' : 'border-gray-300'
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
                            <span className="font-semibold bg-amber-300 px-2 rounded-full text-xs">โลโก้</span>
                            <div className="mb-3">
                                <img
                                    src={imglogoPreview
                                        ? `data:image/jpeg;base64,${imglogoPreview}`
                                        : aboutData?.imgLogo
                                            ? `https://imagedelivery.net/QZ6TuL-3r02W7wQjQrv5DA/${aboutData.imgLogo}/500`
                                            : `https://imagedelivery.net/QZ6TuL-3r02W7wQjQrv5DA/4500f404-dbac-40f3-6696-ae768a38e800/500`
                                    }

                                    alt="Image One Preview"
                                    className="object-contain w-48 my-2 mx-auto"
                                    loading="lazy"
                                />

                                <input
                                    id="imgLogo"
                                    name="imgLogo"
                                    type="file"
                                     onChange={(event) => handleFileUpload(event, setImgLogo, setImgLogoPreview)}
                                    className="mt-1 border rounded-md focus:outline-none focus:border-indigo-500 w-full text-xs"
                                />
                            </div>

                        </div>





                        <div className="relative mt-5 md:mt-1 p-2 border w-full rounded-md bg-white mb-5">
                            <span className="absolute -top-2 md:-top-3 font-semibold bg-amber-300 px-2 rounded-full text-xs"> เกี่ยวกับ MNR  </span>
                            <textarea className={`mt-1 p-2 border-0 w-full rounded-md text-xs md:text-base  ${inputForm && description === '' ? 'border-red-500' : 'border-gray-300'
                                }`}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Description"
                                rows={8} />
                        </div>
                    </div>
                    <hr className="my-5" />

                    <div className="relative mt-5 md:mt-1 mb-5 border w-full rounded-md text-xs md:text-base bg-white">
                        <span className="absolute -top-2 left-2 md:-top-3 font-semibold bg-amber-300 px-2 rounded-full text-xs"> ที่อยู่ </span>
                        <textarea
                            className={`mt-1  border-0 w-full text-xs md:text-base  ${inputForm && Address === '' ? 'border-red-500' : 'border-gray-300'
                                }`}
                            value={Address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="name@example.com"
                            rows={2}
                        />
                    </div>

                    <div className="relative mt-5 md:mt-1 border w-full rounded-md text-xs md:text-base bg-white">
                        <span className="absolute -top-2 md:-top-3 font-semibold bg-amber-300 px-2 rounded-full text-xs"> อีเมล  </span>
                        <input
                            className={`mt-1  border-0 w-full text-xs md:text-base  ${inputForm && email === '' ? 'border-red-500' : 'border-gray-300'
                                }`}
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@example.com"
                        />
                    </div>
                    <div className="mt-5 md:flex gap-5">
                        <div className="relative mt-5 md:mt-1 border w-full rounded-md text-xs md:text-base bg-white">
                            <span className="absolute -top-2 md:-top-3 font-semibold bg-amber-300 px-2 rounded-full text-xs"> เบอร์โทร  </span>
                            <input
                                className={`mt-1  border-0 w-full text-xs md:text-base  ${inputForm && phoneOne === '' ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                type="text"
                                value={phoneOne}
                                onChange={(e) => setPhoneOne(e.target.value)}
                                placeholder="name@example.com"
                            />
                        </div>
                        <div className="relative mt-5 md:mt-1 border w-full rounded-md text-xs md:text-base bg-white">
                            <span className="absolute -top-2 md:-top-3 font-semibold bg-amber-300 px-2 rounded-full text-xs"> เบอร์โทร  </span>
                            <input
                                className={`mt-1  border-0 w-full text-xs md:text-base  ${inputForm && phoneTwo === '' ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                type="text"
                                value={phoneTwo}
                                onChange={(e) => setPhoneTwo(e.target.value)}
                                placeholder="name@example.com"
                            />
                        </div>
                    </div>
                    <div className="mt-5 md:flex gap-5">
                        <div className="relative mt-5 md:mt-1 border w-full rounded-md text-xs md:text-base bg-white">
                            <span className="absolute -top-2 md:-top-3 font-semibold bg-amber-300 px-2 rounded-full text-xs"> Facebook  </span>
                            <input
                                className={`mt-1  border-0 w-full text-xs md:text-base  ${inputForm && FBname === '' ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                type="text"
                                value={FBname}
                                onChange={(e) => setFBname(e.target.value)}
                                placeholder="name@example.com"
                            />
                        </div>
                        <div className="relative mt-5 md:mt-1 border w-full rounded-md text-xs md:text-base bg-white">
                            <span className="absolute -top-2 md:-top-3 font-semibold bg-amber-300 px-2 rounded-full text-xs"> Line@  </span>
                            <input
                                className={`mt-1  border-0 w-full text-xs md:text-base  ${inputForm && line === '' ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                type="text"
                                value={line}
                                onChange={(e) => setLine(e.target.value)}
                                placeholder="name@example.com"
                            />
                        </div>
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