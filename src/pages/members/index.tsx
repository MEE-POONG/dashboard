
import MemberTabbar from "@/components/EditMemmbers/MemberTabbar";
import React, { useState, useEffect } from "react";
import Cookies from 'js-cookie';
import AdminList from "./AdminsList";
import CustomersList from "./CustomersList";
import RepairmanList from "./RepairmansList";
import { useRouter } from 'next/router';


const Members: React.FC = () => {

    const memberstabs = [
        // {
        //     label: 'All Members',
        //     content: <div><MembersList /></div>
        // },
        { label: 'แอดมิน', content: <div><AdminList /></div> },
        { label: 'ลูกค้า', content: <div><CustomersList /></div> },
        { label: 'ช่างซ่อม', content: <div> <RepairmanList /> </div> },
        // Add more tabs as needed
    ];
   
    return (
        <  >
            <div className="flex">
                <h2 className="font-semibold md:text-2xl ml-5">ข้อมูลสมาชิก</h2>
            
            </div>
            <div className="mt-5">
                <MemberTabbar memberstabs={memberstabs} />
            </div>
        </>
    )
}
export default Members;