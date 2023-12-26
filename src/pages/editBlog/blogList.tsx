import DeleteMemberModal from "@/components/Modal/DeleteAlertModal";
import { Blog } from "@prisma/client";
import useAxios from "axios-hooks";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MdOutlineEdit, MdDelete } from "react-icons/md";
import Pagination from '@/components/Pagination';


interface Params {
    page: number;
    pageSize: number;
    searchKey: string;
    totalPages: number;
}

const BlogList: React.FC = (props) => {

    const [params, setParams] = useState<Params>({
        page: 1,
        pageSize: 10,
        searchKey: "",
        totalPages: 1,
    });

    const [{ data: blogData }, getblog] = useAxios({
        url: `/api/blog?page=${params.page}&pageSize=${params.pageSize}&searchTerm=${params.searchKey}`,
        method: "GET",
    });

    const [
        { loading: deletenewsLoading, error: deletenewsError },
        executenewsDelete,
    ] = useAxios({}, { manual: true });

    const [filteredBlogData, setFilteredBlogData] = useState<
        Blog[]
    >([]);

    useEffect(() => {
        setFilteredBlogData(blogData?.news ?? []);
    }, [blogData]);

    const deleteblog = (id: string): Promise<any> => {
        return executenewsDelete({
            url: "/api/blog/" + id,
            method: "DELETE",
        }).then(() => {
            setFilteredBlogData((prevblog) =>
                prevblog.filter((blog) => blog.id !== id)
            );
        });
    };

    const handleChangePage = (page: number) => {
        setParams((prevParams) => ({
            ...prevParams,
            page: page,
        }));
    };

    const handleChangePageSize = (size: number) => {
        setParams((prevParams) => ({
            ...prevParams,
            page: 1,
            pageSize: size,
        }));
    };

    const handleChangesearchKey = (search: string) => {
        setParams(prevParams => ({
            ...prevParams,
            searchKey: search,
        }));
    };


    useEffect(() => {
        if (blogData?.blog) {
            // Filter the registerForm data based on searchKey
            const filteredData = blogData.blog.filter((blog: any) =>
                // Convert both the searchKey and the relevant data to lowercase for case-insensitive search
                blog.title.toLowerCase().includes(params.searchKey.toLowerCase()) ||
                blog.subtitle.toLowerCase().includes(params.searchKey.toLowerCase()) ||
                blog.detail.toLowerCase().includes(params.searchKey.toLowerCase()) ||
                blog.date.toLowerCase().includes(params.searchKey.toLowerCase()) ||
                blog.author.toLowerCase().includes(params.searchKey.toLowerCase()) ||
                blog.img.toLowerCase().includes(params.searchKey.toLowerCase())


            );

            setFilteredBlogData(filteredData);
        }
    }, [blogData, params.searchKey]);


    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 5; // Replace with the actual total number of pages.

    const handlePageChange = (page: number) => {
        // You can implement fetching data for the selected page here
        setCurrentPage(page);
    };


    return (
        <div className="overflow-hidden rounded-lg lg:shadow-xl m-2">


            <table className="border-collapse w-full">
                <thead className="bg-[#1e293b] text-white  ">
                    <tr className="">
                        <th className="p-3 uppercase font-medium text-sm hidden lg:table-cell text-left border-r">No.</th>
                        <th className="p-3 uppercase font-medium text-sm hidden lg:table-cell text-left ">หัวข้อ</th>
                        <th className="p-3 uppercase font-medium text-sm hidden lg:table-cell text-left ">รูปภาพ</th>
                        <th className="p-3 uppercase font-medium text-sm hidden lg:table-cell text-left ">รายละเอียด</th>
                        <th className="p-3 uppercase font-medium text-sm hidden lg:table-cell text-right">จัดการ</th>
                    </tr>
                </thead>

                <tbody>
                    {filteredBlogData
                        .slice() // สร้างสำเนาของอาร์เรย์เพื่อป้องกันการเปลี่ยนแปลงต้นฉบับ
                        .sort((a, b) => new Date(1.30).getTime() - new Date(30.1).getTime()) // เรียงลำดับข้อมูลตามวันที่จากใหม่สู่เก่า
                        .map((blog, index) => (
                            <tr key={blog.id}
                                className="bg-gray-50 hover:bg-gray-100 flex lg:table-row flex-row lg:flex-row flex-wrap 
                                                lg:flex-no-wrap mb-3 lg:mb-0 shadow-xl rounded-lg text-xs md:text-sm xl:text-base"
                            >
                                <td className="flex items-center lg:table-cell lg:w-3 border-b border-r">
                                    <span className=" bg-[#1e293b] text-white lg:hidden p-2">หัวข้อ </span>
                                    <p className="px-3 py-1 md:p-3">{index + 1}</p>
                                </td>

                                <td className="flex items-center lg:table-cell w-full lg:w-auto border-b">
                                    <span className=" bg-[#1e293b] text-white lg:hidden p-2 w-20 md:w-28 h-full">หัวข้อ </span>
                                    <p className="px-3 py-1 md:p-3 w-full lg:w-80 line-clamp-1 lg:truncate ">{blog.title}</p>
                                </td>

                                <td className="flex items-center lg:table-cell w-full lg:w-auto border-b ">
                                    <span className=" bg-[#1e293b] text-white lg:hidden p-2 w-20 md:w-28 h-full">รูปภาพ</span>
                                    <div className="w-16 md:w-44 ">
                                        <img
                                            className="p-2"
                                            src={`https://imagedelivery.net/QZ6TuL-3r02W7wQjQrv5DA/${blog.img}/public`} alt=""
                                        />
                                    </div>
                                </td>

                                <td className="flex items-center lg:table-cell lg:w-auto border-b ">
                                    <span className="bg-[#1e293b] text-white lg:hidden p-2 w-20 md:w-28 h-full">รายละเอียด</span>
                                    <div className="px-3 py-1 line-clamp-2 ">
                                        {blog.detail}
                                    </div>
                                </td>

                                <td className="flex items-center lg:table-cell w-full lg:w-auto border-b">
                                    <span className=" bg-[#1e293b] text-white lg:hidden p-2 w-20 md:w-28 h-full">Actions</span>
                                    <div className="flex justify-end px-5 gap-3">
                                        <DeleteMemberModal data={blog} apiDelete={() => deleteblog(blog.id)} />

                                        <Link
                                            href={`/editBlog/${blog.id}`}
                                            className="text-green-500 hover:text-green-700"
                                        >
                                            <MdOutlineEdit />
                                        </Link>

                                    </div>
                                </td>
                            </tr>
                        ))}
                </tbody>

            </table>

            <Pagination
                page={params.page}
                totalPages={blogData?.pagination?.total}
                onChangePage={handleChangePage}
                onChangePageSize={handleChangePageSize}
            />

        </div>
    )
}
export default BlogList;