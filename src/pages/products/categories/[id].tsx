import useAxios from "axios-hooks";
import React, { useState } from "react";

interface EditCategoryModalProps {
    isEditCategoryModalOpen: boolean;
    onClose: () => void;
    checkBody: string;
}

const EditCategoryModal: React.FC<EditCategoryModalProps> = ({ isEditCategoryModalOpen, onClose }) => {
    if (!isEditCategoryModalOpen) return null;

    const [{ error: errorMessage, loading: CategoriesLoading }, executeCategories] = useAxios(
        { url: `/api/categories/${categories.id}`, method: 'PUT' },
        { manual: true }
    );
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
            if (response && response.status === 200) {
                setAlertForm("success");
                setTimeout(() => {
                    clear();
                    onClose(); // ปิด Modal หลังจากที่แก้ไขเรียบร้อย
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
        </>
    )
}
export default EditCategoryModal;