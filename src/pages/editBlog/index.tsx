import BlogList from "./blogList";
import AddBlogModal from "./addBlog";
import { useState } from "react";
import { GoPlus } from "react-icons/go";


const EditBlog: React.FC = () => {

    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const openAddModal = () => {
        setAddModalOpen(true);
    };

    const closeAddModal = () => {
        setAddModalOpen(false);
    };
    return (
        <>
            <div>
                <div className="flex justify-between mx-2">
                    <h2 className="font-semibold text-2xl">จัดการบทความ</h2>
                    <button onClick={openAddModal}
                        className="bg-[#1E293B] text-white py-0.5 px-1.5 md:py-1.5 md:px-3 text-xs md:text-sm font-semibold rounded-full"
                    >
                        <p className="hidden md:block">เพิ่ม</p>
                        <span className="md:hidden"><GoPlus size={20} /></span>
                    </button>
                </div>
                <BlogList />

                <AddBlogModal isAddModalOpen={isAddModalOpen} onClose={closeAddModal} />
            </div>
        </>
    )
}
export default EditBlog;