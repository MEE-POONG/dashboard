import DashboardLayout from "@/components/layout"
import MembersList from "./MembersList";
import MemberTabbar from "@/components/EditMemmbers/MemberTabbar";
import React, { useState, useEffect } from "react";
import Cookies from 'js-cookie';
import AdminList from "./AdminsList";
import CustomersList from "./CustomersList";
import RepairmanList from "./RepairmansList";

const Members: React.FC = () => {

    const memberstabs = [
        {
            label: 'All Members',
            content: <div><MembersList /></div>
        },
        { label: 'Admin', content: <div><AdminList/></div> },
        { label: 'Customer', content: <div><CustomersList/></div> },
        { label: 'Repairman', content: <div> <RepairmanList/> </div> },
        // Add more tabs as needed
    ];
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

    return (
        <DashboardLayout  loggedInUser={loggedInUser}>
            <div className="flex">
                <h2 className="font-semibold md:text-2xl ml-5">ข้อมูลสมาชิก</h2>
                <button></button>
            </div>
            <div className="mt-5">
                <MemberTabbar memberstabs={memberstabs} />
            </div>
        </DashboardLayout>
    )
}
export default Members;