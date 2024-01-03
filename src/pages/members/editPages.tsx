import DashboardLayout from "@/components/layout";
import Link from "next/link";


const EditPage: React.FC = (props) => {
    return (
        <DashboardLayout>
            <div>
                <div className="flex justify-between m-2">
                    <h2 className="font-semibold lg:text-2xl">จัดการหน้าเว็บ</h2>
                </div>
                <div className="bg-gray-100 w-full shadow-md rounded p-5">
                    ชื่อ
                </div>

            </div>
        </DashboardLayout>
    )
}
export default EditPage;