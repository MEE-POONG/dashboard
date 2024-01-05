
import AppointmentTabbar from "@/components/EditMemmbers/ApppointmentTabbar";
import AppointList from "../order/orderList";
import OrderList from "./appointList";
import Repairing from "./repairing";
import Repairsuccess from "./repairsuccess";
import Delivery from "./delivery";

const EditAppointment:React.FC =() =>{
    
    const appointmentstabs = [
        // {
        //     label: 'All Members',
        //     content: <div><MembersList /></div>
        // },
        { label: 'รายการจอง', content: <div><OrderList /></div> },
        { label: 'อยู่ระหว่างการซ่อม', content: <div><Repairing /></div> },
        { label: 'ซ่อมเสร็จเรียบร้อยแล้ว', content: <div> <Repairsuccess /> </div> },
         { label: 'จัดส่งเรียบร้อยแล้ว', content: <div> <Delivery /> </div> },
        // Add more tabs as needed
    ];
    return(
        <>
             <div className="flex">
                <h2 className="font-semibold md:text-2xl ml-5">ข้อมูลสมาชิก</h2>
            
            </div>
            <div className="mt-5">
                <AppointmentTabbar appointmentstabs={appointmentstabs} />
            </div>
        </>
    )
}
export default EditAppointment;