import { MdOutlineEdit, MdDelete } from "react-icons/md";
import React, { useEffect, useState } from "react";
import { Accordion, Button, Card, Col } from "react-bootstrap";
import Cookies from 'js-cookie';
import useAxios from "axios-hooks";
import { useRouter } from 'next/router';
import { Repairman } from "@prisma/client";
import { User } from "@prisma/client";
import { GoPlus } from "react-icons/go";
import AddRepairman from "./AddRepairman";
import { FaSearch } from "react-icons/fa";
import Pagination from "@/components/Pagination";
interface Params {
    page: number;
    pageSize: number;
    searchKey: string;
    totalPages: number;
}


const RepairmanList: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 5; // Replace with the actual total number of pages.
    const router = useRouter();
    const { id } = router.query;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [time, setTime] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");
    const [tel, setTel] = useState("");
    const [email, setEmail] = useState("");
    const [repairmanId, setRepairmanId] = useState("");
    const [userId, setUserId] = useState("");
    const [request, setRequest] = useState("");
    const [UserData, setUserData] = useState({
        fname: "",
        lname: "",
        tel: "",
        email: "",
        time: "",
        userId: ""
    });
    //จำนวนหน้าและการจำกัดการแสดงของหน้า
    const [params, setParams] = useState<Params>({
        page: 1,
        pageSize: 10,
        searchKey: "",
        totalPages: 1,
    });

    const [{ data: repairmanData }, getUserData] = useAxios({
        url: `/api/repairman?page=${params.page}&pageSize=${params.pageSize}&searchTerm=${params.searchKey}`,
        method: "GET",
    });
    const [
        { loading: deleteuserLoading, error: deleteuserError },
        executeuserDelete,
    ] = useAxios({}, { manual: true });

    const [filteredappointmentsData, setFilteredappointmentsData] = useState<
        Repairman[]
    >([]);

    useEffect(() => {
        setFilteredappointmentsData(repairmanData?.repairman ?? []);
    }, [repairmanData]);

    const deleteuser = (id: string): Promise<any> => {
        return executeuserDelete({
            url: "/api/repairman/" + id,
            method: "DELETE",
        }).then(() => {
            setFilteredappointmentsData((prevuser) =>
                prevuser.filter((repairman) => repairman.id !== id)
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
        if (repairmanData?.repairman) {
            // Filter the registerForm data based on searchKey
            const filteredData = repairmanData.repairman.filter((repairman: any) =>
                // Convert both the searchKey and the relevant data to lowercase for case-insensitive search
                repairman.fname.toLowerCase().includes(params.searchKey.toLowerCase()) ||
                repairman.lname.toLowerCase().includes(params.searchKey.toLowerCase()) ||
                repairman.email.toLowerCase().includes(params.searchKey.toLowerCase()) ||
                repairman.tel.toLowerCase().includes(params.searchKey.toLowerCase())
            );

            setFilteredappointmentsData(filteredData);
        }
    }, [repairmanData, params.searchKey]);



    const handlePageChange = (page: number) => {
        // You can implement fetching data for the selected page here
        setCurrentPage(page);
    };
    //



    const [loggedInUser, setLoggedInUser] = useState<any>(null);
    useEffect(() => {
        const fetchData = async () => {
            const userDataFromCookies = Cookies.get('user');
            if (userDataFromCookies) {
                const parsedUser = JSON.parse(userDataFromCookies);
                setLoggedInUser(parsedUser);
            }
        };

        fetchData();
    }, []);
    useEffect(() => {
        setFilteredappointmentsData(repairmanData?.repairman ?? []);
    }, [repairmanData]);
    useEffect(() => {
        if (id) {
            fetch(`/api/repairman/${id}`)
                .then((response) => response.json())
                .then((data) => {
                    setUserData(data);
                    setFname(data.fname);
                    setLname(data.lname);
                    setTel(data.tel);
                    setEmail(data.email);
                    setRequest(data.request);
                    setUserId(data.id); // นำ userId มาจากข้อมูลผู้ใช้
                    setTime(data.time);
                    setRepairmanId(data.id);
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.error('Error:', error);
                    setIsLoading(false);
                });
        }
    }, [id]);
    //
    const [
        { loading: deleteappointmentLoadings, error: deleteappointmentErrors },
        executeappointmentDeletes,
    ] = useAxios({}, { manual: true });

    const [filteredappointmentsDatas, setFilteredappointmentsDatas] = useState<
        User[]
    >([]);


    useEffect(() => {
        if (id) {
            fetch(`/api/user/${id}`)
                .then((response) => response.json())
                .then((data) => {
                    setUserData(data);
                    setFname(data.fname);
                    setLname(data.lname);
                    setTel(data.tel);
                    setEmail(data.email);
                    setRequest(data.request);
                    setUserId(data.id); // นำ userId มาจากข้อมูลผู้ใช้
                    setTime(data.time);
                    setRepairmanId(data.id);
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.error('Error:', error);
                    setIsLoading(false);
                });
        }
    }, [id]);
    //

    useEffect(() => {
        getUserData();
    }, []);
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const openAddModal = () => {
        setAddModalOpen(true);
    };

    const closeAddModal = () => {
        setAddModalOpen(false);
    };
    return (
        <>
            <div className="w-full rounded-md overflow-hidden">
                <table className="border-collapse w-full">
                    <thead className="bg-purple-500 text-white">
                        <tr>
                            <th className="p-3 font-bold text-bass hidden lg:table-cell text-left">ลำดับ</th>
                            <th className="p-3 font-bold text-bass hidden lg:table-cell text-left">ชื่อ - นามสกุล</th>
                            <th className="p-3 font-bold text-bass hidden lg:table-cell text-left">อีเมล</th>
                            <th className="p-3 font-bold text-bass hidden lg:table-cell text-left">เบอร์โทรศัพท์</th>
                            {/* <th className="p-3 font-bold text-bass hidden lg:table-cell text-center">Role</th> */}
                            <th className="p-3 font-bold text-bass hidden lg:table-cell text-right px-6">จัดการ</th>

                        </tr>
                    </thead>
                    <tbody>
                        {filteredappointmentsData
                            .map((repairman, index) => (
                                <tr className="flex lg:table-row flex-row lg:flex-row flex-wrap lg:flex-no-wrap mb-5 lg:mb-0 rounded-lg text-xs md:text-sm lg:text-base ">
                                    <td className="flex items-center gap-3 w-full lg:w-auto lg:p-2 border-b lg:table-cell ">
                                        <span className="bg-purple-500 p-2 w-20 text-right table-cell lg:hidden font-bold text-white">No. :</span>
                                        <p>{index + 1}</p>
                                    </td>
                                    <td className="flex items-center gap-3 w-full lg:w-auto lg:p-2 border-b lg:table-cell">
                                        <span className="bg-purple-500 p-2 w-20 text-right table-cell lg:hidden font-bold text-white">Name :</span>
                                        <p className="px-3 py-1">{repairman.fname} {repairman.lname}</p>
                                    </td>
                                    <td className="md:flex items-center gap-3 w-full lg:w-auto lg:p-2 border-b lg:table-cell hidden">
                                        <span className="bg-purple-500 p-2 w-20 text-right table-cell lg:hidden font-bold text-white">Mail :</span>
                                        <p className="px-3 py-1">{repairman.email}</p>
                                    </td>
                                    <td className="md:flex items-center gap-3 w-full lg:w-auto lg:p-2 border-b lg:table-cell hidden">
                                        <span className="bg-purple-500 p-2 w-20 text-right table-cell lg:hidden font-bold text-white">Phone :</span>
                                        <p className="px-3 py-1">{repairman.tel}</p>
                                    </td>
                                    {/* <td className="flex items-center gap-3 w-full lg:w-auto lg:p-2 border-b lg:table-cell text-center">
                                    <span className="bg-purple-500 p-2 w-20 text-right table-cell lg:hidden font-bold text-white">Role :</span>
                                    <p className="px-3 py-1">{repairman.status}</p>
                                </td> */}
                                    <td className="flex items-center gap-3 w-full lg:w-auto lg:p-2 border-b lg:table-cell">
                                        <span className=" bg-purple-500 p-2 w-20 text-right table-cell lg:hidden font-bold text-white">Actions :</span>
                                        <div className="flex justify-end gap-2 md:px-5">
                                            <Button className="text-red-400 hover:text-red-900" onClick={() => deleteuser(repairman.id)}>
                                                <MdDelete />
                                            </Button>
                                            <a href={`/members/edit/repairman/${repairman.id}`} className="text-green-500 hover:text-green-700" ><MdOutlineEdit /></a>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>

            </div>
            <div>
                <div className="flex justify-end mt-5 mx-2">
                    <button onClick={openAddModal}
                        className="bg-[#1E293B] text-white py-0.5 px-1.5 md:py-1.5 md:px-3 text-xs md:text-sm font-semibold rounded-full"
                    >
                        <p className="hidden md:block">เพิ่มช่าง</p>
                        <span className="md:hidden"><GoPlus size={20} /></span>
                    </button>
                </div>

                <AddRepairman isAddModalOpen={isAddModalOpen} onClose={closeAddModal} />
            </div>
            <Pagination
                page={params.page}
                totalPages={repairmanData?.pagination?.total}
                onChangePage={handleChangePage}
                onChangePageSize={handleChangePageSize}
            />
        </>
    )
}
export default RepairmanList;