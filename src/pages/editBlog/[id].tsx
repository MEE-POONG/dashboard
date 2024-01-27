import React, { useState, ChangeEvent, useEffect } from 'react';
import useAxios from 'axios-hooks';
import { MdClose } from 'react-icons/md';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/layout';
import EditModalAlert from '@/components/Modal/EditAlertModal';
import Link from 'next/link';
import axios from 'axios';


interface EditBlogModalProps {
    isEditModalOpen: boolean;
    onClose: () => void;
}


const EditBlogModal: React.FC<EditBlogModalProps> = ({ isEditModalOpen, onClose }) => {
    // if (!isEditModalOpen) return null;

    const router = useRouter();
    const { id } = router.query;
    const [
        { loading: updateBlogLoading, error: updateBlogError },
        executeBlogPut,
    ] = useAxios({}, { manual: true });
    const [title, settitle] = useState<string>("");
    const [subtitle, setsubtitle] = useState<string>("");
    const [detail, setdetail] = useState<string>("");
    const [date, setdate] = useState<string>("");
    const [author, setauthor] = useState<string>("");
    const [img, setImg] = useState<File[]>([])
    const [img1, setimg1] = useState<string>("");
    const [alertForm, setAlertForm] = useState<string>("not");
    const [inputForm, setInputForm] = useState<boolean>(false);
    const [checkBody, setCheckBody] = useState<string>("");
    const [imgPreview, setImgPreview] = useState<string | null>(null);

    const handleInputChange = (setter: any) => (event: any) => {
        const newValue = event.target.value;
        if (!isNaN(newValue) && !newValue.includes('.')) {
            setter(newValue);
        }
    };

    const [{ data: blogData }, getBlog] = useAxios({
        url: `/api/blog/${id}`,
        method: "GET",
    });

    const reloadPage = () => {
        window.location.reload();
    };

    useEffect(() => {
        if (blogData) {
            const {
                title,
                subtitle,
                detail,
                date,
                author,
            } = blogData;
            settitle(title);
            setsubtitle(subtitle);
            setdetail(detail);
            setdate(date);
            setauthor(author);
        }
    }, [blogData]);


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
            img ? uploadImage(blogData?.img, img) : null,

        ]);
        let missingFields = [];
        if (!title) missingFields.push("NewsTitle");
        if (!subtitle) missingFields.push("NewsSubTitle");
        if (!detail) missingFields.push("NewsSubDetail");
        if (!date) missingFields.push("date");
        if (!author) missingFields.push("author");

        if (missingFields.length > 0) {
            setAlertForm("warning");
            setInputForm(true);
            setCheckBody(`กรอกข้อมูลไม่ครบ: ${missingFields.join(', ')}`);
        } else {
            try {
                setAlertForm("primary");

                const data = {
                    title,
                    subtitle,
                    detail,
                    date,
                    author,
                    img: imageIDs[0] !== null ? imageIDs[0] : blogData?.img,
                };


                // Execute the update
                const response = await executeBlogPut({
                    url: "/api/blog/" + id,
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


    return (
        <>

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
                        <div className="text-center">
                            <span className="font-semibold bg-amber-300 px-2 rounded-full text-xs">โลโก้</span>
                            <div className="mb-3 ">
                                <img
                                    src={imgPreview
                                        ? `data:image/jpeg;base64,${imgPreview}`
                                        : blogData?.img
                                            ? `https://imagedelivery.net/QZ6TuL-3r02W7wQjQrv5DA/${blogData.img}/500`
                                            : `https://imagedelivery.net/QZ6TuL-3r02W7wQjQrv5DA/4500f404-dbac-40f3-6696-ae768a38e800/500`
                                    }

                                    alt="Image One Preview"
                                    className="object-contain w-48 my-2 mx-auto drop-shadow-lg"
                                    loading="lazy"
                                />

                                <input
                                    id="img"
                                    name="img"
                                    type="file"
                                    onChange={(event) => handleFileUpload(event, setImg, setImgPreview)}
                                    className="mt-1 border rounded-md focus:outline-none focus:border-indigo-500 w-full text-xs"
                                />
                            </div>
                        </div>
                        <div className="md:grid grid-cols-2 gap-4 my-5">
                            <div>
                                <label className="block text-sm font-medium ">ชื่อข่าว</label>
                                <input
                                    className={`mt-1 p-2 border w-full rounded-md text-sm lg:text-base  ${inputForm && title === '' ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    type="text"
                                    value={title}
                                    onChange={(e) => {
                                        const newValue = e.target.value;
                                        if (newValue.length <= 50) {
                                            settitle(newValue);
                                        }
                                    }}
                                    placeholder="name@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">หัวข้อข่าว</label>
                                <input
                                    className={`mt-1 p-2 border w-full rounded-md text-sm lg:text-base  ${inputForm && subtitle === '' ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    type="text"
                                    value={subtitle}
                                    onChange={(e) => setsubtitle(e.target.value)}
                                    placeholder="title2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">วันที่</label>
                                <input
                                    className={`mt-1 p-2 border w-full rounded-md text-sm lg:text-base  ${inputForm && date === '' ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    type="date"
                                    value={date}
                                    onChange={(e) => setdate(e.target.value)}
                                    placeholder="date"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium">ผู้เขียน/ผู้ลงข่าว</label>
                                <input
                                    className={`mt-1 p-2 border w-full rounded-md text-sm lg:text-base  ${inputForm && author === '' ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    type="text"
                                    value={author}
                                    onChange={(e) => setauthor(e.target.value)}
                                    placeholder="author"
                                />
                            </div>
                        </div>


                        <label className="block text-sm font-medium">รายละเอียดข่าว</label>
                        <textarea
                            className={`mt-1 p-2 border w-full rounded-md text-sm lg:text-base  ${inputForm && detail === '' ? 'border-red-500' : 'border-gray-300'
                                }`}
                            value={detail}
                            onChange={(e) => setdetail(e.target.value)}
                            placeholder="NewsSubDetail"
                            style={{ width: '100%', height: '200px' }}
                        />


                        <div className='flex justify-center gap-5 mt-5'>
                            <button
                                onClick={handleSubmit}
                                className='bg-teal-500 text-white hover:bg-teal-300 hover:text-black px-3 py-1 rounded'
                            >
                                Save
                            </button>
                            <Link href='/editBlog' className='bg-gray-950 text-white hover:bg-gray-300 hover:text-black px-3 py-1 rounded'>
                                Back
                            </Link>
                        </div>

                    </div>
                </div>
            </div>

        </>
    )
}
export default EditBlogModal;



