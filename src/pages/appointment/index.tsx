import React from 'react';
import AppointmentTabbar from "@/components/EditMemmbers/ApppointmentTabbar";
import Repairing from "./repairing";
import Repairsuccess from "./repairsuccess";
import Delivery from "./delivery";
import AppointmentList from "./appointList";

const EditAppointment: React.FC = () => {
    // Assuming you get the user's role from somewhere in your application state
    const userRole = "Admin"; // Replace this with the actual user role from your application state
    const isAdmin = userRole === "Admin";
    const appointmentstabs = [
        { label: 'รายการจอง', content: <div><AppointmentList /></div> },
        { label: 'อยู่ระหว่างการซ่อม', content: <div><Repairing /></div> },
        { label: 'ซ่อมเสร็จเรียบร้อยแล้ว', content: <div> <Repairsuccess /> </div> },
        { label: 'จัดส่งเรียบร้อยแล้ว', content: <div> <Delivery /> </div> },
        // Add more tabs as needed
    ];

    // If the user is not an admin, show only the "รายการจอง" tab
    const filteredTabs = isAdmin ? appointmentstabs : [appointmentstabs[0]];

    return (
        <>
            <div className="flex">
                <h2 className="font-semibold md:text-2xl ml-5">รายการจอง</h2>
            </div>
            <div className="mt-5">
                <AppointmentTabbar appointmentstabs={filteredTabs} />
            </div>
        </>
    );
};
export default EditAppointment;
