
import AboutPage from "@/pages/editPages/AboutPage";
import ContactPage from "@/pages/editPages/ContactPage";
import DashboardLayout from "@/components/layout";
import Link from "next/link";
import { MdAutoFixHigh } from "react-icons/md";


const EditPage: React.FC = (props) => {
    return (
        <DashboardLayout>
            <div>
                <div className="flex justify-between mx-2 ">
                    <h2 className="font-semibold text-2xl">จัดการหน้าเว็บ</h2>
                </div>

                <button className="m-5 p-5 shadow-lg rounded-md bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
                    <Link href='./editPages/AboutPage' className="flex items-center gap-2">
                        AboutPage <MdAutoFixHigh />
                    </Link>
                </button>

                <ContactPage />
            </div>
        </DashboardLayout>
    )
}
export default EditPage;