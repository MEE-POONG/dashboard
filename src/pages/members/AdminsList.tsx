import { MdOutlineEdit, MdDelete } from "react-icons/md";
import React, { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import DeleteMemberModal from "@/components/Modal/DeleteAlertModal";
import useAxios from "axios-hooks";
import { useRouter } from 'next/router';
import { UserName } from "@prisma/client";




const CustomersList: React.FC = () => {


    const [{ data: UserNameData }, getUserData] = useAxios({
        url: `/api/userName`,
        method: "GET",
    });


    const [filteredappointmentsData, setFilteredappointmentsData] = useState<
        UserName[]
    >([]);
    const [
        { loading: deleteuserLoading, error: deleteuserError },
        executeuserDelete,
    ] = useAxios({}, { manual: true });

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
    const router = useRouter();
    const { id } = router.query;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [username, setAdmin] = useState("");
    const [UserData, setUserData] = useState({


    });
    const [loggedInUser, setLoggedInUser] = useState<any>(null);
    useEffect(() => {
        const fetchData = async () => {
            const userDataFromCookies = Cookies.get('userName');
            if (userDataFromCookies) {
                const parsedUser = JSON.parse(userDataFromCookies);
                setLoggedInUser(parsedUser);
            }
        };

        fetchData();
    }, []);
    useEffect(() => {
        setFilteredappointmentsData(UserNameData?.userName ?? []);
    }, [UserNameData]);
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
                                        <a href={`/members/edit/Admin/${admin.id}`} className="text-green-500 hover:text-green-700" ><MdOutlineEdit /></a>
                                    </div>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    )
}
export default CustomersList;