import AddModalAlert from "@/components/Modal/AddAlertModal";
import useAxios from "axios-hooks";
import { useState } from "react";
import { MdClose } from "react-icons/md";

interface AddCategoryModalProps {
    isAddCategoryModalOpen: boolean;
    onClose: () => void;
    checkBody: string;
}


const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ isAddCategoryModalOpen, onClose }) => {
    if (!isAddCategoryModalOpen) return null;

    const [{ error: errorMessage, loading: CategoriesLoading }, executeCategories] = useAxios({ url: '/api/categories', method: 'POST' }, { manual: true });
    const [name, setName] = useState<string>("");
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

    const clear = () => {
        setName("");

        setAlertForm("not");
        setInputForm(false);
        setCheckBody("");
    }

    const handleSubmit = async (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        event.stopPropagation();

        if (!name) {
            // Handle missing name...
            setAlertForm("warning");
            setInputForm(true);
            setCheckBody("กรุณากรอกชื่อประเภทสินค้า");
            return;
        }

        try {
            setAlertForm("primary"); // set to loading

            // Prepare the data to send
            const data = {
                name,
            };

            const response = await executeCategories({ data });
            if (response && response.status === 201) {
                setAlertForm("success");
                setTimeout(() => {
                    clear();
                }, 3000);
            } else {
                setAlertForm("danger");
                throw new Error('Failed to send data');
            }
        } catch (error) {
            setAlertForm("danger");
        }
    };


    return (
        <>
            <div className="fixed top-0 left-0 w-full h-screen flex items-center justify-center bg-black bg-opacity-25 p-2">
                <div className="bg-white p-3 md:p-10 rounded shadow-md ">
                    <AddModalAlert checkAlertShow={alertForm} setCheckAlertShow={setAlertForm} checkBody={checkBody} />
                    <div className='flex items-center justify-between'>
                        <h2 className='text-base font-bold'>เพิ่มประเภทสินค้า</h2>
                        <button className=" bg-blue-500 text-white p-1 rounded" onClick={onClose}>
                            <MdClose />
                        </button>
                    </div>
                    <div className="mt-3">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={`mt-1 border text-sm w-full ${inputForm && name === "" ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                        />
                    </div>

                    <div className="text-center mt-2">
                        <button
                            className="bg-green-500 text-white px-4 py-2 rounded-md mx-2 text-xs md:text-sm"
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
export default AddCategoryModal;
