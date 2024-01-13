import { useState } from "react";
import { MdClose } from "react-icons/md";

interface AddProductModalProps {
    isAddModalOpen: boolean;
    onClose: () => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ isAddModalOpen, onClose }) => {
    if (!isAddModalOpen) return null;

    const [alertForm, setAlertForm] = useState<string>("not");
    const [inputForm, setInputForm] = useState<boolean>(false);
    const [checkBody, setCheckBody] = useState<string>("");

    return (
        <>
            <div className="fixed top-0 left-0 w-full h-screen flex items-center justify-center bg-black bg-opacity-25 p-2">
                <div className="bg-white p-3 md:p-10 rounded shadow-md md:w-3/4">
                    <div className='flex items-center justify-between'>
                        <h2 className='text-xl font-bold'>เพิ่มสินค้า</h2>
                        <button className=" bg-blue-500 text-white p-2 rounded" onClick={onClose}>
                            <MdClose />
                        </button>
                    </div>

                    <div>
                        <div className="d-flex space-between my-10">
                            <div className="mb-3">
                                <label className="block text-sm font-semibold text-gray-950">รูปภาพ 1</label>
                                <input type="file" name="" id="" className="text-xs" />
                            </div>
                            <div className="mb-3">
                                <label className="block text-sm font-semibold text-gray-950">ชื่อสินค้า</label>
                                <input type="text"
                                    className={`mt-1 p-2 border text-sm w-full rounded-md`}
                                />

                            </div>
                            <div className="mb-3">
                                <label className="block text-sm font-semibold text-gray-950">รายละเอียด</label>
                                <textarea
                                    className={`mt-1 p-2 border text-sm w-full h-64 rounded-md`}
                                    placeholder="รายละเอียด"
                                />
                            </div>
                            <div className="mt-5 flex flex-wrap">
                                <div className="">
                                    <label className="block text-sm font-semibold text-gray-950">รูปภาพ 2</label>
                                    <input type="file" name="" id="" className="text-xs" />
                                </div>
                                <div className="">
                                    <label className="block text-sm font-semibold text-gray-950">รูปภาพ 3</label>
                                    <input type="file" name="" id="" className="text-xs" />
                                </div>
                                <div className="">
                                    <label className="block text-sm font-semibold text-gray-950">รูปภาพ </label>
                                    <input type="file" name="" id="" className="text-xs" />
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
