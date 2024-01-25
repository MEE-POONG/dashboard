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
    const [imgFirst, setImgFirst] = useState<string>('');
    const [imgSecond, setImgSecond] = useState<string>('');
    const [imgThird, setImgThird] = useState<string>('');
    const [imgFourth, setImgFourth] = useState<string>('');

    const [categoriesId, setCategoriesId] = useState('');

    const [inputForm, setInputForm] = useState<boolean>(false);
    const [checkBody, setCheckBody] = useState<string>("");

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, imgKey: string) => {
        const file = event.target.files && event.target.files[0];
        if (file) {
            switch (imgKey) {
                case 'imgFirst':
                    setImgFirst(URL.createObjectURL(file));
                    break;
                case 'imgSecond':
                    setImgSecond(URL.createObjectURL(file));
                    break;
                case 'imgThird':
                    setImgThird(URL.createObjectURL(file));
                    break;
                case 'imgFourth':
                    setImgFourth(URL.createObjectURL(file));
                    break;
                default:
                    break;
            }
        }
    };

    return (
        <>
            <div className="fixed top-0 left-0 w-full h-screen flex items-center justify-center bg-black bg-opacity-25 p-2 mt-36 md:mt-24">
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
                                        <input type="text" name="" id="" className="mt-1 p-2 border-0 w-full rounded-md text-xs md:text-base" />
                                    </div>
                                </div>
                                <div className='md:col-span-2 lg:col-span-1'>
                                    <div className="relative md:mt-2 border rounded-md bg-white mb-5">
                                        <span className="absolute -top-2 md:-top-3 ml-2 font-semibold bg-amber-300 px-2 rounded-full text-xs"> ราคา/หน่วย</span>
                                        <input type="number" min={0} name="" id="" className="mt-1 p-2 border-0 w-full text-right rounded-md text-xs md:text-base" />
                                    </div>
                                </div>
                            </div>

                            <div className="mb-3 md:flex gap-3">
                                <div className="relative md:mt-2 border rounded-md bg-white mb-5">
                                    <label htmlFor="" className="absolute -top-2 md:-top-3 ml-2 font-semibold bg-amber-300 px-2 rounded-full text-xs">ประเภทของสินค้า</label>
                                    <select name="" id="" className="mt-1 p-2 border-0 w-full md:w-56 rounded-md text-xs md:text-base">
                                        <option value="">เลือกประเภท</option>
                                        <option value="">ประเภท ก</option>
                                        <option value="">ประเภท ข</option>
                                        <option value="">ประเภท ค</option>
                                        <option value="">ประเภท ง</option>
                                    </select>
                                </div>
                                <div className="relative md:mt-2 border rounded-md bg-white mb-5">
                                    <label htmlFor="" className="absolute -top-2 md:-top-3 ml-2 font-semibold bg-amber-300 px-2 rounded-full text-xs">จำนวน <span className="text-gray-500">(เครื่อง/ชิ้น/อัน)</span></label>
                                    <input type="number" name="" id="" min={0} className="mt-1 p-2 border-0 w-full text-right rounded-md text-xs md:text-base" />
                                </div>

                            </div>

                            <div className="relative md:mt-2 border rounded-md bg-white mb-5">
                                <label className="absolute -top-2 md:-top-3 ml-2 font-semibold bg-amber-300 px-2 rounded-full text-xs">รายละเอียด</label>
                                <textarea
                                    className={`mt-1 p-2 border-0 w-full rounded-md text-xs md:text-base`}
                                    placeholder="รายละเอียด"
                                />
                            </div>
                            <div className="mt-5 flex flex-wrap justify-between gap-4">
                                <div className="">
                                    <label className="block text-sm font-semibold text-gray-950">รูปภาพ 1</label>
                                    {imgFirst && (
                                        <div className="mt-2 w-24">
                                            <img
                                                src={imgFirst}
                                                alt="Selected Image"
                                                className="max-w-full h-auto"
                                            />
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        onChange={(e) => handleFileUpload(e, 'imgFirst')}
                                        className={`mt-1 border text-xs w-full ${inputForm && imgFirst === '' ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                        placeholder="รูปภาพ 1"
                                    />
                                </div>
                                <div className="">
                                    <label className="block text-sm font-semibold text-gray-950">รูปภาพ 2</label>
                                    {imgSecond && (
                                        <div className="mt-2 w-24">
                                            <img
                                                src={imgSecond}
                                                alt="Selected Image"
                                                className="max-w-full h-auto"
                                            />
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        onChange={(e) => handleFileUpload(e, 'imgSecond')}
                                        className={`mt-1 border text-xs w-full ${inputForm && imgSecond === '' ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                        placeholder="รูปภาพ 2"
                                    />
                                </div>
                                <div className="">
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
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="text-end">
                        <button
                            className="bg-green-500 text-white px-4 py-2 rounded-md mx-2"
                        // onClick={handleSubmit}
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
