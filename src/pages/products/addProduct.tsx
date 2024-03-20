import AddModalAlert from "@/components/Modal/AddAlertModal";
import { Categories } from "@prisma/client";
import axios from "axios";
import useAxios from "axios-hooks";
import { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";

interface AddProductModalProps {
    isAddModalOpen: boolean;
    onClose: () => void;
    checkBody: string;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ isAddModalOpen, onClose }) => {
    if (!isAddModalOpen) return null;

    const [productname, setProductName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [price, setPrice] = useState<string>('');
    const [stock, setStock] = useState<string>('');
    const [images, setImages] = useState<File[]>([]);
    const [categoriesId, setCategoriesId] = useState<string>('');
    const [discountPercent, setDiscountPercent] = useState<number>(0);



    const [alertForm, setAlertForm] = useState<string>('not');
    const [inputForm, setInputForm] = useState<boolean>(false);
    const [checkBody, setCheckBody] = useState<string>('');


    const [
        { data: categoriesData },
        getCategories
    ] = useAxios({
        url: "/api/categories", // Assuming this endpoint exists
        method: "GET",
    });
    const [filteredcategoryData, setFilteredcategoryData] = useState<Categories[]>([]);

    useEffect(() => {
        setFilteredcategoryData(categoriesData?.categories ?? []);
    }, [categoriesData]);

    const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        if (!isNaN(Number(newValue)) && !newValue.includes('.')) {
            setter(newValue);
        }
    };

    const clear = () => {
        setProductName('');
        setDescription('');
        setPrice('');
        setStock('');
        setAlertForm('not');
        setInputForm(false);
        setCheckBody('');
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const selectedImages = Array.from(files);
            setImages(selectedImages);
        }
    };
    const handleAdditionalFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0 && images.length < 4) {
            const selectedImages = Array.from(files);
            setImages(prevImages => [...prevImages, ...selectedImages.slice(0, 4 - prevImages.length)]);
        }
    };

    const handleSubmit = async (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        event.stopPropagation();

        const missingFields: string[] = [];
        if (!productname) missingFields.push('productname');
        if (!description) missingFields.push('description');
        if (!price) missingFields.push('price');
        if (!stock) missingFields.push('stock');
        if (images.length === 0) missingFields.push('images');

        if (missingFields.length > 0) {
            setAlertForm('warning');
            setInputForm(true);
            setCheckBody(`กรอกข้อมูลไม่ครบ: ${missingFields.join(', ')}`);
        } else {
            try {
                setAlertForm('primary');

                const imageIDs = await Promise.all(images.map(async (image) => {
                    const formData = new FormData();
                    formData.append('file', image);
                    const uploadResponse = await axios.post('https://upload-image.me-prompt-technology.com/', formData);
                    if (uploadResponse.status === 200) {
                        const responseData = uploadResponse.data;
                        return responseData.result.id;
                    } else {
                        throw new Error('Image upload failed');
                    }
                }));

                const data = {
                    productname,
                    description,
                    price,
                    stock,
                    imgFirst: imageIDs[0],
                    imgSecond: imageIDs[1],
                    imgThird: imageIDs[2],
                    imgFourth: imageIDs[3],
                    categoriesId,
                    // discount: parseFloat(price) * discountPercent / 100   
                    // Add more fields as needed
                };

                const response = await axios.post('/api/products', data);

                if (response && response.status === 201) {
                    setAlertForm('success');
                    setTimeout(() => {
                        clear();
                    }, 5000);
                } else {
                    setAlertForm('danger');
                    throw new Error('Failed to send data');
                }
            } catch (error) {
                setAlertForm('danger');
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


                            {/* ส่วนลด */}
                            {/* <div className="flex justify-end gap-4">
                                <div className="relative md:mt-2 border rounded-md bg-white mb-5">
                                    <label htmlFor="" className="absolute -top-2 md:-top-3 ml-2 font-semibold bg-amber-300 px-2 rounded-full text-xs">ส่วนลด (%)</label>
                                    <input type="number" min={0} name="" id=""
                                        onChange={(e) => setDiscountPercent(parseFloat(e.target.value))}
                                        className={`mt-1 p-2 border-0 w-full rounded-md text-xs md:text-base text-right ${inputForm && discountPercent === 0 ? 'border-red-500' : 'border-gray-300'}`} />
                                </div>
                                <div className="relative md:mt-2 border rounded-md bg-white mb-5">
                                    <label className="absolute -top-2 md:-top-3 ml-2 font-semibold bg-amber-300 px-2 rounded-full text-xs">ราคาสินค้าที่ลด</label>
                                    <input
                                        value={(parseFloat(price) - (parseFloat(price) * discountPercent / 100)).toFixed(2)}
                                        readOnly
                                        className={`mt-1 p-2 border-0 w-full rounded-md text-xs md:text-base ${inputForm && price === "" ? 'border-red-500' : 'border-gray-300'}`} />
                                </div>
                            </div> */}


                            <div className="mb-3 md:flex gap-3">
                                <div className="relative md:mt-2 border rounded-md bg-white mb-5">
                                    <label htmlFor="" className="absolute -top-2 md:-top-3 ml-2 font-semibold bg-amber-300 px-2 rounded-full text-xs">ประเภทของสินค้า</label>
                                    <select
                                        name=""
                                        id=""
                                        onChange={(e) => setCategoriesId(e.target.value)}
                                        className={`mt-1 p-2 border-0 w-full rounded-md text-xs md:text-base ${inputForm && categoriesId === "" ? "border-red-500" : "border-gray-300"
                                            }`}
                                    >
                                        <option value="">เลือกประเภท</option>
                                        {filteredcategoryData?.map((categories) => (
                                            <option key={categories.id} value={categories.id.toString()}>
                                                {categories.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="relative md:mt-2 border rounded-md bg-white mb-5">
                                    <label htmlFor="" className="absolute -top-2 md:-top-3 ml-2 font-semibold bg-amber-300 px-2 rounded-full text-xs">จำนวน <span className="text-gray-500">(เครื่อง/ชิ้น/อัน)</span></label>
                                    <input type="number" name="" id="" min={0}
                                        onChange={(e) => setStock(e.target.value)}
                                        className={`mt-1 p-2 border-0 w-full rounded-md text-xs text-right md:text-base ${inputForm && stock === "" ? 'border-red-500' : 'border-gray-300'}`} />
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
                                    <input
                                        type="file"
                                        onChange={handleAdditionalFileUpload}
                                        className={`mt-1 border text-xs w-full ${inputForm && images.length < 1 ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                        placeholder="รูปภาพ 2"
                                    />
                                    {images[0] && (
                                        <img
                                            src={URL.createObjectURL(images[0])}
                                            alt="Selected Image 2"
                                            className="mt-2 w-24"
                                        />
                                    )}
                                </div>


                                <div className="">
                                    <label htmlFor="" className="block text-sm font-semibold text-gray-950">รูปภาพ 2</label>
                                    <input
                                        type="file"
                                        onChange={handleAdditionalFileUpload}
                                        className={`mt-1 border text-xs w-full ${inputForm && images.length < 2 ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                        placeholder="รูปภาพ 2"
                                    />
                                    {images[1] && (
                                        <img
                                            src={URL.createObjectURL(images[1])}
                                            alt="Selected Image 2"
                                            className="mt-2 w-24"
                                        />
                                    )}
                                </div>
                                <div className="">
                                    <label htmlFor="" className="block text-sm font-semibold text-gray-950">รูปภาพ 3</label>
                                    <input
                                        type="file"
                                        onChange={handleAdditionalFileUpload}
                                        className={`mt-1 border text-xs w-full ${inputForm && images.length < 3 ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                        placeholder="รูปภาพ 3"
                                    />
                                    {images[2] && (
                                        <img
                                            src={URL.createObjectURL(images[2])}
                                            alt="Selected Image 3"
                                            className="mt-2 w-24"
                                        />
                                    )}
                                </div>
                                <div className="">
                                    <label htmlFor="" className="block text-sm font-semibold text-gray-950">รูปภาพ 4</label>
                                    <input
                                        type="file"
                                        onChange={handleAdditionalFileUpload}
                                        className={`mt-1 border text-xs w-full ${inputForm && images.length < 4 ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                        placeholder="รูปภาพ 3"
                                    />
                                    {images[3] && (
                                        <img
                                            src={URL.createObjectURL(images[3])}
                                            alt="Selected Image 3"
                                            className="mt-2 w-24"
                                        />
                                    )}
                                </div>

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
