import { MdOutlineEdit, MdDelete } from "react-icons/md";
import React, { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import DeleteMemberModal from "@/components/Modal/DeleteAlertModal";
import useAxios from "axios-hooks";
import { useRouter } from 'next/router';
import { UserName } from "@prisma/client";
import Pagination from "@/components/Pagination";
import { FaSearch } from "react-icons/fa";
import Link from "next/link";



interface Params {
    page: number;
    pageSize: number;
    searchKey: string;
    totalPages: number;
}

const CustomersList: React.FC = () => {

    const router = useRouter();
    const { id } = router.query;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [username, setAdmin] = useState("");
    const [UserData, setUserData] = useState({


    });

    //จำนวนหน้าและการจำกัดการแสดงของหน้า
    const [params, setParams] = useState<Params>({
        page: 1,
        pageSize: 10,
        searchKey: "",
        totalPages: 1,
    });

    const [{ data: userNameData }, getUserData] = useAxios({
        url: `/api/userName?page=${params.page}&pageSize=${params.pageSize}&searchTerm=${params.searchKey}`,
        method: "GET",
    });

    const [
        { loading: deleteuserLoading, error: deleteuserError },
        executeuserDelete,
    ] = useAxios({}, { manual: true });

    const [filteredappointmentsData, setFilteredappointmentsData] = useState<
        UserName[]
    >([]);

    useEffect(() => {
        setFilteredappointmentsData(userNameData?.userName ?? []);
    }, [userNameData]);

    const deleteuser = (id: string): Promise<any> => {
        return executeuserDelete({
            url: "/api/userName/" + id,
            method: "DELETE",
        }).then(() => {
            setFilteredappointmentsData((prevuser) =>
                prevuser.filter((userName) => userName.id !== id)
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
        if (userNameData?.userName) {
            // Filter the registerForm data based on searchKey
            const filteredData = userNameData.userName.filter((userName: any) =>
                // Convert both the searchKey and the relevant data to lowercase for case-insensitive search
                userName.username.toLowerCase().includes(params.searchKey.toLowerCase())
            );

            setFilteredappointmentsData(filteredData);
        }
    }, [userNameData, params.searchKey]);

    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 5; // Replace with the actual total number of pages.

    const handlePageChange = (page: number) => {
        // You can implement fetching data for the selected page here
        setCurrentPage(page);
    };


    //



    //

    useEffect(() => {
        if (id) {
            fetch(`/api/userName/${id}`)
                .then((response) => response.json())
                .then((data) => {
                    setUserData(data);
                    setAdmin(data.username);
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.error('Error:', error);
                    setIsLoading(false);
                });
        }
    }, [id]);
    useEffect(() => {
        getUserData();
    }, []);

    return (
        <div className="w-full rounded-md overflow-hidden">
            <div className="w-full lg:w-1/4 mb-2 text-xs lg:text-sm">
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                        <FaSearch />
                    </span>
                    <input
                        type="text"
                        onChange={e => handleChangesearchKey(e.target.value)}
                        placeholder="ค้นหาข่าว"
                        aria-label="news"
                        className="pl-8 pr-4 py-2 w-full rounded-full focus:outline-none focus:border-blue-300 border-gray-300 text-xs lg:text-sm"
                    />
                </div>
            </div>
            <table className="border-collapse w-full">
                <thead className="bg-purple-500 text-white">
                    <tr>
                        <th className="p-3 font-bold text-bass hidden lg:table-cell text-left">ลำดับ</th>
                        <th className="p-3 font-bold text-bass hidden lg:table-cell text-left px-6">ชื่อ</th>
                        <th className="p-3 font-bold text-bass hidden lg:table-cell text-left"></th>
                        <th className="p-3 font-bold text-bass hidden lg:table-cell text-left"></th>
                        {/* <th className="p-3 font-bold text-bass hidden lg:table-cell text-center">Role</th> */}
                        <th className="p-3 font-bold text-bass hidden lg:table-cell text-right px-6 ">จัดการ</th>

                    </tr>
                </thead>
                <tbody>
                    {filteredappointmentsData
                        .map((admin, index) => (
                            <tr className="flex lg:table-row flex-row lg:flex-row flex-wrap lg:flex-no-wrap mb-5 lg:mb-0 rounded-lg text-xs md:text-sm lg:text-base ">
                                <td className="flex items-center gap-3 w-full lg:w-auto lg:p-2 border-b lg:table-cell ">
                                    <span className="bg-purple-500 p-2 w-20 text-right table-cell lg:hidden font-bold text-white">No. :</span>
                                    <p>{index + 1}</p>
                                </td>
                                <td className="flex items-center gap-3 w-full lg:w-auto lg:p-2 border-b lg:table-cell">
                                    <span className="bg-purple-500 p-2 w-20 text-right table-cell lg:hidden font-bold text-white">Name :</span>
                                    <p className="px-3 py-1">{admin.username} </p>
                                </td>
                                {/* <td className="md:flex items-center gap-3 w-full lg:w-auto lg:p-2 border-b lg:table-cell hidden">
                                    <span className="bg-purple-500 p-2 w-20 text-right table-cell lg:hidden font-bold text-white">Mail :</span>
                                    <p className="px-3 py-1">{admin.email}</p>
                                </td>*/}
                                <td className="md:flex items-center gap-3 w-full lg:w-auto lg:p-2 border-b lg:table-cell hidden">
                                    <span className="bg-purple-500 p-2 w-20 text-right table-cell lg:hidden font-bold text-white">Phone :</span>
                                    <p className="px-3 py-1"></p>
                                </td>
                                <td className="flex items-center gap-3 w-full lg:w-auto lg:p-2 border-b lg:table-cell text-center">
                                    <span className="bg-purple-500 p-2 w-20 text-right table-cell lg:hidden font-bold text-white">Role :</span>
                                    <p className="px-3 py-1"></p>
                                </td>
                                <td className="flex items-center gap-3 w-full lg:w-auto lg:p-2 border-b lg:table-cell">
                                    <span className=" bg-purple-500 p-2 w-20 text-right table-cell lg:hidden font-bold text-white">Actions :</span>
                                    <div className="flex justify-end gap-2 md:px-5">
                                        <DeleteMemberModal data={admin} apiDelete={() => deleteuser(admin.id)} />
                                        <Link href={`/members/edit/Admin/${admin.id}`} className="text-green-500 hover:text-green-700" ><MdOutlineEdit /></Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
            <Pagination
                page={params.page}
                totalPages={userNameData?.pagination?.total}
                onChangePage={handleChangePage}
                onChangePageSize={handleChangePageSize}
            />
        </div>
    )
}
export default CustomersList;