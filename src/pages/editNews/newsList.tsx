import { useEffect, useState } from "react";
import { MdOutlineEdit, MdDelete } from "react-icons/md";
import EditNewsModal from "./EditNews";
import useAxios from "axios-hooks";
import { News } from "@prisma/client";
import Link from "next/link";

interface Params {
    page: number;
    pageSize: number;
    searchKey: string;
    totalPages: number;
}

const NewsList: React.FC = () => {

    const [params, setParams] = useState<Params>({
        page: 1,
        pageSize: 10,
        searchKey: "",
        totalPages: 1,
    });

    const [{ data: newsData }, getnews] = useAxios({
        url: `/api/news?page=${params.page}&pageSize=${params.pageSize}&searchTerm=${params.searchKey}`,
        method: "GET",
    });

    const [
        { loading: deletenewsLoading, error: deletenewsError },
        executenewsDelete,
    ] = useAxios({}, { manual: true });

    const [filterednewssData, setFilterednewssData] = useState<
        News[]
    >([]);

    useEffect(() => {
        setFilterednewssData(newsData?.news ?? []);
    }, [newsData]);

    const deletenews = (id: string): Promise<any> => {
        return executenewsDelete({
            url: "/api/news/" + id,
            method: "DELETE",
        }).then(() => {
            setFilterednewssData((prevnewss) =>
                prevnewss.filter((news) => news.id !== id)
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
        if (newsData?.news) {
            // Filter the registerForm data based on searchKey
            const filteredData = newsData.news.filter((news: any) =>
                // Convert both the searchKey and the relevant data to lowercase for case-insensitive search
                news.title.toLowerCase().includes(params.searchKey.toLowerCase()) ||
                news.subtitle.toLowerCase().includes(params.searchKey.toLowerCase()) ||
                news.detail.toLowerCase().includes(params.searchKey.toLowerCase()) ||
                news.date.toLowerCase().includes(params.searchKey.toLowerCase()) ||
                news.author.toLowerCase().includes(params.searchKey.toLowerCase()) ||
                news.refer.toLowerCase().includes(params.searchKey.toLowerCase()) ||
                news.img.toLowerCase().includes(params.searchKey.toLowerCase())


            );

            setFilterednewssData(filteredData);
        }
    }, [newsData, params.searchKey]);


    return (
        <div className="overflow-hidden rounded-lg lg:shadow-xl m-2">
            <table className="border-collapse w-full">
                <thead className="bg-[#1e293b] text-white  ">
                    <tr className="">
                        <th className="p-3 uppercase font-medium text-sm hidden lg:table-cell text-left ">หัวข้อ</th>
                        <th className="p-3 uppercase font-medium text-sm hidden lg:table-cell text-left">รูปภาพ</th>
                        <th className="p-3 uppercase font-medium text-sm hidden lg:table-cell text-left">รายละเอียด</th>
                        <th className="p-3 uppercase font-medium text-sm hidden lg:table-cell text-right">Actions</th>
                    </tr>
                </thead>

                
                <tbody>
                {filterednewssData
                  .slice() // สร้างสำเนาของอาร์เรย์เพื่อป้องกันการเปลี่ยนแปลงต้นฉบับ
                  .sort((a, b) => new Date(1.30).getTime() - new Date(30.1).getTime()) // เรียงลำดับข้อมูลตามวันที่จากใหม่สู่เก่า
                  .map((news, index) => (
                    <tr key={news.id}
                        className="bg-gray-50 hover:bg-gray-100 flex lg:table-row flex-row lg:flex-row flex-wrap 
                        lg:flex-no-wrap mb-10 lg:mb-0 shadow-xl rounded-lg text-xs md:text-base"
                    >
                        <td className="flex items-center lg:table-cell w-full lg:w-auto border-b">
                            <span className=" bg-[#1e293b] text-white lg:hidden p-2 md:w-28 h-full">หัวข้อ </span>
                            <p className="px-3 py-1 md:p-3 w-3/4 md:w-64 md:truncate ">{news.title}</p>
                        </td>

                        <td className="flex items-center lg:table-cell w-full lg:w-auto border-b">
                            <span className=" bg-[#1e293b] text-white lg:hidden p-2 md:w-28 h-full">รูปภาพ</span>
                            <div className="w-3/4">
                                <img
                                    className="p-2"
                                    src={`https://imagedelivery.net/QZ6TuL-3r02W7wQjQrv5DA/${news.img}/public`} alt=""
                                />
                            </div>
                        </td>

                        <td className="flex items-center lg:table-cell lg:w-auto border-b ">
                            <span className="bg-[#1e293b] text-white lg:hidden p-2 md:w-28 h-full">รายละเอียด</span>
                            <div className="px-3 py-1 line-clamp-1 ">
                                {news.detail}
                            </div>
                        </td>

                        <td className="flex items-center lg:table-cell w-full lg:w-auto border-b">
                            <span className=" bg-[#1e293b] text-white lg:hidden p-2 md:w-28 h-full">Actions</span>
                            <div className="flex justify-end px-5 gap-3">
                                <Link href="#" className="text-red-400 hover:text-red-700"> <MdDelete /></Link>
                                <Link href="#" className="text-green-500 hover:text-green-700" ><MdOutlineEdit /></Link>
                            </div>
                        </td>
                    </tr>
                  ))}
                </tbody>

            </table>
        </div>
    )
}
export default NewsList;