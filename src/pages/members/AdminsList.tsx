import { MdOutlineEdit, MdDelete } from "react-icons/md";
import React, { useEffect, useState } from "react";
import { Accordion, Button, Card, Col } from "react-bootstrap";
// import ModalRepair from "./ModalRepair";
import Cookies from 'js-cookie';

import useAxios from "axios-hooks";
import axios from "axios";
import { BsWrenchAdjustableCircleFill } from "react-icons/bs";
import { useRouter } from 'next/router';
import { Repairman } from "@prisma/client";
import { User } from "@prisma/client";
import Link from "next/link";


const AdminList: React.FC = () => {
    const [{ data: userData }, getUserData] = useAxios({
        url: `/api/user`,
        method: "GET",
    });

    const [{ data: repairmanData }, getRepairmanData] = useAxios({
        url: `/api/repairman`,
        method: "GET",
    });

    const [
        { loading: deleteappointmentLoading, error: deleteappointmentError },
        executeappointmentDelete,
    ] = useAxios({}, { manual: true });

    const [filteredappointmentsData, setFilteredappointmentsData] = useState<
        Repairman[]
    >([]);

    const deleteappointment = (id: string): void => {
        const shouldDelete = window.confirm("ต้องการลบใช่ไหม?");
        if (shouldDelete) {
            executeappointmentDelete({
                url: "/api/repairman/" + id,
                method: "DELETE",
            }).then(() => {
                setFilteredappointmentsData((prevappointments) =>
                    prevappointments.filter((repairman) => repairman.id !== id)
                );
            });
        }
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
        setFilteredappointmentsData(repairmanData?.repairman ?? []);
    }, [repairmanData]);
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
        getRepairmanData();
        getUserData();
    }, []);
    
    return (
        <div className="w-full rounded-md overflow-hidden">
            <table className="border-collapse w-full">
                <thead className="bg-purple-500 text-white">
                    <tr>
                        <th className="p-3 font-bold text-bass hidden lg:table-cell text-left">No.</th>
                        <th className="p-3 font-bold text-bass hidden lg:table-cell text-left">Name</th>
                        <th className="p-3 font-bold text-bass hidden lg:table-cell text-left">Mail</th>
                        <th className="p-3 font-bold text-bass hidden lg:table-cell text-left">Phone</th>
                        {/* <th className="p-3 font-bold text-bass hidden lg:table-cell text-center">Role</th> */}
                        <th className="p-3 font-bold text-bass hidden lg:table-cell text-right px-6">Action</th>

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
                                        <Button className="text-red-400 hover:text-red-900" onClick={() => deleteappointment(repairman.id)}>
                                        <MdDelete />
                                        </Button>
                                        <a href={`/members/edit/${repairman.id}`} className="text-green-500 hover:text-green-700" ><MdOutlineEdit /></a>
                                    </div>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    )
}
export default AdminList;