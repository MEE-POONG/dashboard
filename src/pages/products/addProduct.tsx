import AddModalAlert from "@/components/Modal/AddAlertModal";
import axios from "axios";
import { useState } from "react";
import { MdClose } from "react-icons/md";

interface AddProductModalProps {
    isAddModalOpen: boolean;
    onClose: () => void;
    checkBody: string;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ isAddModalOpen, onClose }) => {
    if (!isAddModalOpen) return null;

    const [productname, setProductName] = useState<string>('');
    const [productbrand, setProductBrand] = useState<string>('');
    const [productmodel, srtProductModel] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [productcost, setProductCost] = useState<string>('');
    const [price, setPrice] = useState<string>('');
    const [imgFirst, setImgFirst] = useState<File | null>(null);
    const [imgSecond, setImgSecond] = useState<File | null>(null);
    const [imgThird, setImgThird] = useState<File | null>(null);
    const [imgFourth, setImgFourth] = useState<File | null>(null);
    const [stock, setStock] = useState<string>('');
    const [categoriesId, setCategoriesId] = useState('');

    const [alertForm, setAlertForm] = useState<string>("not");
    const [inputForm, setInputForm] = useState<boolean>(false);
    const [checkBody, setCheckBody] = useState<string>("");

    const handleInputChange = (setter: any) => (event: any) => {
        const newValue = event.target.value;
        if (!isNaN(newValue) && !newValue.includes('.')) {
            setter(newValue);
        }
    };
    const reloadPage = () => {
        clear();
    };


    // const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, imgKey: string) => {
    //     const file = event.target.files && event.target.files[0];
    //     if (file) {
    //         switch (imgKey) {
    //             case 'imgFirst':
    //                 setImgFirst(URL.createObjectURL(file));
    //                 break;
    //             case 'imgSecond':
    //                 setImgSecond(URL.createObjectURL(file));
    //                 break;
    //             case 'imgThird':
    //                 setImgThird(URL.createObjectURL(file));
    //                 break;
    //             case 'imgFourth':
    //                 setImgFourth(URL.createObjectURL(file));
    //                 break;
    //             default:
    //                 break;
    //         }
    //     }
    // };

    const clear = () => {
        setProductName("");
        setDescription("");
        setPrice("");
        setStock("");
        setImgFirst(null);
        setImgSecond(null);
        setImgThird(null);
        setImgFourth(null),
        setAlertForm("not");
        setInputForm(false);
        setCheckBody("");
    };
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        if (file) {
            setImgFirst(file);
        }
    };

    const handleSubmit = async (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        event.stopPropagation();
        let missingFields = [];
        if (!productname) missingFields.push("productname");
        if (!description) missingFields.push("description");
        if (!price) missingFields.push("price");
        if (!stock) missingFields.push("stock");
        if (!imgFirst) missingFields.push("imgFirst");

        if (missingFields.length > 0) {
            setAlertForm("warning");
            setInputForm(true);
            setCheckBody(`กรอกข้อมูลไม่ครบ: ${missingFields.join(', ')}`);
        } else {
            try {
                setAlertForm("primary");
                if (imgFirst) {
                    const formData = new FormData();
                    formData.append("file", imgFirst);
                    const uploadResponse = await axios.post(
                        "https://upload-image.me-prompt-technology.com/",
                        formData
                    );

                    if (uploadResponse.status === 200) {
                        const responseData = uploadResponse.data;
                        const imageId = responseData.result.id;

                        const data = {
                            productname,
                            description,
                            price,
                            stock,
                            imgFirst: imageId,
                            imgSecond: imageId,
                            imgThird: imageId,
                            imgFourth: imageId,
                        };

                        const response = await axios.post("/api/products", data);
                        if (response && response.status === 201) {
                            setAlertForm("success");
                            setTimeout(() => {
                                clear();
                            }, 5000);
                        } else {
                            setAlertForm("danger");
                            throw new Error('Failed to send data');
                        }
                    } else {
                        setAlertForm("danger");
                        throw new Error('Image upload failed');
                    }
                }
            } catch (error) {
                setAlertForm("danger");
            }
        }
    };



    return (
        <>
            <div className="fixed top-0 left-0 w-full h-screen flex items-center justify-center bg-black bg-opacity-25 p-2 mt-36 md:mt-24">
                <AddModalAlert checkAlertShow={alertForm} setCheckAlertShow={setAlertForm} checkBody={checkBody} />
                <div className="bg-white p-3 md:p-10 rounded shadow-md md:w-3/4">
                    <div className='flex items-center justify-between'>
                        <h2 className='text-xl font-bold'>เพิ่มสินค้า</h2>
                        <button className=" bg-blue-500 text-white p-2 rounded" onClick={onClose}>
                            <MdClose />
                        </button>
                    </div>

                    <div>
                        <div className="my-10">
                            <div className="grid md:grid-cols-5 gap-3">
                                <div className='md:col-span-3 lg:col-span-4 '>
                                    <div className="relative md:mt-2 border rounded-md bg-white mb-5">
                                        <span className="absolute -top-2 md:-top-3 ml-2 font-semibold bg-amber-300 px-2 rounded-full text-xs"> เกี่ยวกับ MNR  </span>
                                        <input type="text" name="" id=""
                                            onChange={(e) => setProductName(e.target.value)}
                                            className={`mt-1 p-2 border-0 w-full rounded-md text-xs md:text-base ${inputForm && productname === "" ? 'border-red-500' : 'border-gray-300'}`} />
                                    </div>
                                </div>
                                <div className='md:col-span-2 lg:col-span-1'>
                                    <div className="relative md:mt-2 border rounded-md bg-white mb-5">
                                        <span className="absolute -top-2 md:-top-3 ml-2 font-semibold bg-amber-300 px-2 rounded-full text-xs"> ราคา/หน่วย</span>
                                        <input type="number" min={0} name="" id=""
                                            onChange={(e) => setPrice(e.target.value)}
                                            className={`mt-1 p-2 border-0 w-full rounded-md text-xs md:text-base text-right ${inputForm && price === "" ? 'border-red-500' : 'border-gray-300'}`} />
                                    </div>
                                </div>
                            </div>

                            <div className="mb-3 md:flex gap-3">
                                <div className="relative md:mt-2 border rounded-md bg-white mb-5">
                                    <label htmlFor="" className="absolute -top-2 md:-top-3 ml-2 font-semibold bg-amber-300 px-2 rounded-full text-xs">ประเภทของสินค้า</label>
                                    <select name="" id=""
                                        onChange={(e) => setCategoriesId(e.target.value)}
                                        className={`mt-1 p-2 border-0 w-full rounded-md text-xs md:text-base ${inputForm && categoriesId === "" ? 'border-red-500' : 'border-gray-300'}`}>
                                        <option value="">เลือกประเภท</option>
                                        <option value="">ประเภท ก</option>
                                        <option value="">ประเภท ข</option>
                                        <option value="">ประเภท ค</option>
                                        <option value="">ประเภท ง</option>
                                    </select>
                                </div>
                                <div className="relative md:mt-2 border rounded-md bg-white mb-5">
                                    <label htmlFor="" className="absolute -top-2 md:-top-3 ml-2 font-semibold bg-amber-300 px-2 rounded-full text-xs">จำนวน <span className="text-gray-500">(เครื่อง/ชิ้น/อัน)</span></label>
                                    <input type="number" name="" id="" min={0}
                                        onChange={(e) => setStock(e.target.value)}
                                        className={`mt-1 p-2 border-0 w-full rounded-md text-xs md:text-base ${inputForm && stock === "" ? 'border-red-500' : 'border-gray-300'}`} />
                                </div>

                            </div>

                            <div className="relative md:mt-2 border rounded-md bg-white mb-5">
                                <label className="absolute -top-2 md:-top-3 ml-2 font-semibold bg-amber-300 px-2 rounded-full text-xs">รายละเอียด</label>
                                <textarea
                                    onChange={(e) => setDescription(e.target.value)}
                                    className={`mt-1 p-2 border-0 w-full rounded-md text-xs md:text-base ${inputForm && description === "" ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="รายละเอียด"
                                />
                            </div>
                            <div className="mt-5 flex flex-wrap justify-between gap-4">
                                <div className="">
                                    <label className="block text-sm font-semibold text-gray-950">รูปภาพ 1</label>
                                    {imgFirst && (
                                        <div className="mt-2 w-24">
                                            <img
                                                src={URL.createObjectURL(imgFirst)}
                                                alt="Selected Image"
                                                className="max-w-full h-auto"
                                            />
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        onChange={handleFileUpload}
                                        className={`mt-1 border text-xs w-full ${inputForm && imgFirst === null ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                        placeholder="รูปภาพ 1"
                                    />
                                </div>
                                <div className="">
                                    <label className="block text-sm font-semibold text-gray-950">รูปภาพ 2</label>
                                    {imgSecond && (
                                        <div className="mt-2 w-24">
                                            <img
                                                src={URL.createObjectURL(imgSecond)}
                                                alt="Selected Image"
                                                className="max-w-full h-auto"
                                            />
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        onChange={handleFileUpload}
                                        className={`mt-1 border text-xs w-full ${inputForm && imgSecond === null ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                        placeholder="รูปภาพ 2"
                                    />
                                </div>
                                {/* <div className="">
                                    <label className="block text-sm font-semibold text-gray-950">รูปภาพ 3</label>
                                    {imgThird && (
                                        <div className="mt-2 w-24">
                                            <img
                                                src={imgThird}
                                                alt="Selected Image"
                                                className="max-w-full h-auto"
                                            />
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        onChange={(e) => handleFileUpload(e, 'imgThird')}
                                        className={`mt-1 border text-xs w-full ${inputForm && imgThird === '' ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                        placeholder="รูปภาพ 3"
                                    />
                                </div>
                                <div className="">
                                    <label className="block text-sm font-semibold text-gray-950">รูปภาพ 4</label>
                                    {imgFourth && (
                                        <div className="mt-2 w-24">
                                            <img
                                                src={imgFourth}
                                                alt="Selected Image"
                                                className="max-w-full h-auto"
                                            />
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        onChange={(e) => handleFileUpload(e, 'imgFourth')}
                                        className={`mt-1 border text-xs w-full ${inputForm && imgFourth === '' ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                        placeholder="รูปภาพ 4"
                                    />
                                </div> */}
                            </div>

                        </div>
                    </div>

                    <div className="text-end">
                        <button
                            className="bg-green-500 text-white px-4 py-2 rounded-md mx-2"
                            onClick={handleSubmit}
                        >
                            ยืนยัน
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
export default AddProductModal;
