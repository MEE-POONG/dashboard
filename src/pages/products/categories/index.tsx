import { Categories as PrismaCategories } from "@prisma/client";
import useAxios from "axios-hooks";
import { useEffect, useState } from "react";
import { IoIosArrowRoundBack, IoMdAdd } from "react-icons/io";
import AddCategoryModal from "./addCategory";
import EditCategoryModal from "./[id]";
import Link from "next/link";
import DeleteMemberModal from "@/components/Modal/DeleteAlertModal";


interface Params {
    page: number;
    pageSize: number;
    searchKey: string;
    totalPages: number;
}

interface CategoryWithStock extends PrismaCategories {
    stock: number;
}


const CategoryEdit: React.FC = (props) => {

    const [isAddCategoryModalOpen, setAddCategoryModalOpen] = useState(false);
    const openAddCategoryModalOpen = () => { setAddCategoryModalOpen(true); };
    const closeAddCategoryModalOpen = () => { setAddCategoryModalOpen(false); };

    const [params, setParams] = useState<Params>({
        page: 1,
        pageSize: 10,
        searchKey: "",
        totalPages: 1,
    });

    const [
        { data: categoriesData },
        getCategories
    ] = useAxios({
        url: `/api/categories?page=${params.page}&pageSize=${params.pageSize}&searchTerm=${params.searchKey}`,
        method: "GET",
    });

    // const [filteredcategoryData, setFilteredcategoryData] = useState<Categories[]>([]);
    const [filteredcategoryData, setFilteredcategoryData] = useState<CategoryWithStock[]>([]);

    const [
        { loading: deleteCategoryLoading, error: deleteCategoryError },
        executeCategoryDelete,
    ] = useAxios({}, { manual: true });

    useEffect(() => {
        getCategories();
    }, [params]);

    useEffect(() => {
        setFilteredcategoryData(categoriesData?.categories ?? []);
    }, [categoriesData]);

    const deleteCategory = (id: string): Promise<any> => {
        return executeCategoryDelete({
            url: "/api/categories/" + id,
            method: "DELETE",
        }).then(() => {
            setFilteredcategoryData((prevcategories) =>
                prevcategories.filter((categories) => categories.id !== id)
            );
        });
    };


    return (
        <div>
            <Link href={'/products'}><IoIosArrowRoundBack size={20} /></Link>
            <div className="flex justify-between mx-2 mb-3">
                <h2 className="font-semibold text-2xl">รายการประเภทสินค้า</h2>
                <div className="flex">
                    <button onClick={openAddCategoryModalOpen}
                        className="flex items-center bg-green-500 hover:bg-green-800 text-white py-1.5 px-3 text-sm font-semibold rounded-full "
                    >
                        <span><IoMdAdd /></span>
                        <span className="hidden md:block">เพิ่ม</span>
                    </button>
                </div>
            </div>


            <div className="relative overflow-x-auto shadow-md sm:rounded-lg mb-4">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                    <thead className="text-xs lg:text-sm text-gray-50 uppercase bg-gray-950 ">
                        <tr>
                            <th scope="col" className="py-3 px-4 lg:px-px text-center border-r">No.</th>
                            <th scope="col" className="px-6 py-3">
                                Category Name
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Stock
                            </th>
                            <th scope="col" className="">
                                Action
                            </th>

                        </tr>
                    </thead>
                    <tbody>
                        {filteredcategoryData.map((category, index) => (
                            <tr key={category.id} className="bg-white border-b ">
                                <td className="text-center border-r">{index + 1}</td>
                                <th scope="row" className="px-6 py-3 font-medium text-gray-900 whitespace-nowrap">
                                    {category.name}
                                </th>
                                <td className="px-6 py-3">
                                    <span className="ml-3 rounded-full bg-yellow-100 py-1 px-3 text-xs text-yellow-900 font-semibold">
                                        {category.stock} {/* This will now be typed correctly */}
                                    </span>
                                </td>
                                <td className="px-6 py-3 flex">
                                    <DeleteMemberModal data={category} apiDelete={() => deleteCategory(category.id)} />
                                    <Link className="text-indigo-600 hover:text-indigo-900" href={`/products/categories/${category.id}`}>
                                        แก้ไข
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>
            <AddCategoryModal isAddCategoryModalOpen={isAddCategoryModalOpen} onClose={closeAddCategoryModalOpen} />
        </div>

    )
}
export default CategoryEdit;