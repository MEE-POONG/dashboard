import useAxios from "axios-hooks";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";


const EditCategoryModal: React.FC = (props) => {
    const router = useRouter();
    const { id } = router.query;
    const [
        { loading: updateNewsLoading, error: updateNewsError },
        executeCategoryPut,
    ] = useAxios({}, { manual: true });

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

    const [{ data: CategoryData }, getNews] = useAxios({
        url: `/api/categories/${id}`,
        method: "GET",
    });
    const reloadPage = () => {
        window.location.reload();
    };

    useEffect(() => {
        if (CategoryData) {
            const {
                name,
            } = CategoryData;
            setName(name);
        }
    }, [CategoryData]);
    const handleSubmit = async (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        event.stopPropagation();
        let missingFields = [];
        if (!name) missingFields.push("Name");

        if (missingFields.length > 0) {
            setAlertForm("warning");
            setInputForm(true);
            setCheckBody(`กรอกข้อมูลไม่ครบ: ${missingFields.join(', ')}`);
        } else {
            try {
                setAlertForm("primary");

                const data = {
                    name,
                };


                // Execute the update
                const response = await executeCategoryPut({
                    url: "/api/categories/" + id,
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
        <div>
            <p>แก้ไข</p>
            <div>
                <label className="block text-sm font-medium ">ชื่อประเภทสินค้า</label>
                <input
                    className={`mt-1 p-2 border w-full rounded-md text-sm lg:text-base  ${inputForm && name === '' ? 'border-red-500' : 'border-gray-300'
                        }`}
                    type="text"
                    value={name}
                    onChange={(e) => {
                        const newValue = e.target.value;
                        if (newValue.length <= 50) {
                            setName(newValue);
                        }
                    }}
                    placeholder="name@example.com"
                />
            </div>
            <div className='flex justify-center gap-5 mt-5'>
                <button
                    onClick={handleSubmit}
                    className='bg-teal-500 text-white hover:bg-teal-300 hover:text-black px-3 py-1 rounded'
                >
                    Save
                </button>
                <Link href='/products/categories' className='bg-gray-950 text-white hover:bg-gray-300 hover:text-black px-3 py-1 rounded'>
                    Back
                </Link>
            </div>
        </div>
    )
}
export default EditCategoryModal;