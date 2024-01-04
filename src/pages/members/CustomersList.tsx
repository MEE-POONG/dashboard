import { MdOutlineEdit, MdDelete } from "react-icons/md";
import React, { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import DeleteMemberModal from "@/components/Modal/DeleteAlertModal";
import useAxios from "axios-hooks";
import { useRouter } from 'next/router';
import { User } from "@prisma/client";




const CustomersList: React.FC = () => {


    const [{ data: userData }, getUserData] = useAxios({
        url: `/api/user`,
        method: "GET",
    });


    const [filteredappointmentsData, setFilteredappointmentsData] = useState<
        User[]
    >([]);
    const [
        { loading: deleteuserLoading, error: deleteuserError },
        executeuserDelete,
    ] = useAxios({}, { manual: true });

    const deleteuser = (id: string): Promise<any> => {
        return executeuserDelete({
            url: "/api/user/" + id,
            method: "DELETE",
        }).then(() => {
            setFilteredappointmentsData((prevuser) =>
                prevuser.filter((user) => user.id !== id)
            );
        });
    };
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
        setFilteredappointmentsData(userData?.user ?? []);
    }, [userData]);
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
    useEffect(() => {
        getUserData();
    }, []);

    return (
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
                        .map((user, index) => (
                            <tr className="flex lg:table-row flex-row lg:flex-row flex-wrap lg:flex-no-wrap mb-5 lg:mb-0 rounded-lg text-xs md:text-sm lg:text-base ">
                                <td className="flex items-center gap-3 w-full lg:w-auto lg:p-2 border-b lg:table-cell ">
                                    <span className="bg-purple-500 p-2 w-20 text-right table-cell lg:hidden font-bold text-white">No. :</span>
                                    <p>{index + 1}</p>
                                </td>
                                <td className="flex items-center gap-3 w-full lg:w-auto lg:p-2 border-b lg:table-cell">
                                    <span className="bg-purple-500 p-2 w-20 text-right table-cell lg:hidden font-bold text-white">Name :</span>
                                    <p className="px-3 py-1">{user.fname} {user.lname}</p>
                                </td>
                                <td className="md:flex items-center gap-3 w-full lg:w-auto lg:p-2 border-b lg:table-cell hidden">
                                    <span className="bg-purple-500 p-2 w-20 text-right table-cell lg:hidden font-bold text-white">Mail :</span>
                                    <p className="px-3 py-1">{user.email}</p>
                                </td>
                                <td className="md:flex items-center gap-3 w-full lg:w-auto lg:p-2 border-b lg:table-cell hidden">
                                    <span className="bg-purple-500 p-2 w-20 text-right table-cell lg:hidden font-bold text-white">Phone :</span>
                                    <p className="px-3 py-1">{user.tel}</p>
                                </td>
                                {/* <td className="flex items-center gap-3 w-full lg:w-auto lg:p-2 border-b lg:table-cell text-center">
                                    <span className="bg-purple-500 p-2 w-20 text-right table-cell lg:hidden font-bold text-white">Role :</span>
                                    <p className="px-3 py-1">{user.status}</p>
                                </td> */}
                                <td className="flex items-center gap-3 w-full lg:w-auto lg:p-2 border-b lg:table-cell">
                                    <span className=" bg-purple-500 p-2 w-20 text-right table-cell lg:hidden font-bold text-white">Actions :</span>
                                    <div className="flex justify-end gap-2 md:px-5">
                                    <DeleteMemberModal data={user} apiDelete={() => deleteuser(user.id)} />
                                        <a href={`/members/edit/Customers/${user.id}`} className="text-green-500 hover:text-green-700" ><MdOutlineEdit /></a>
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