import DashboardLayout from "@/components/layout";
import NewsList from "./newsList";
import { useState } from "react";
import AddNewsModal from './AddNews';
import { GoPlus } from "react-icons/go";


const EditNews: React.FC = () => {
  const [isAddNewsModalOpen, setAddNewsModalOpen] = useState(false);
  const openAddModal = () => {
    setAddNewsModalOpen(true);
  };

  const closeAddModal = () => {
    setAddNewsModalOpen(false);
  };
  return (
    <>
      <div>
        <div className="flex justify-between mx-2">
          <h2 className="font-semibold text-xl md:text-2xl">จัดการข่าว</h2>
          <button onClick={openAddModal}
            className="bg-[#1E293B] text-white py-0.5 px-1.5 md:py-1.5 md:px-3 text-xs md:text-sm font-semibold rounded-full"
          >
            <p className="hidden md:block">เพิ่มข่าว</p>
            <span className="md:hidden"><GoPlus size={20} /></span>
          </button>
        </div>
        <NewsList />
        
        <AddNewsModal isAddModalOpen={isAddNewsModalOpen} onClose={closeAddModal}  />

      </div>

    </>
  )
}
export default EditNews;