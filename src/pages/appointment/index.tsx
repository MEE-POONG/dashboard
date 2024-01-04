import DashboardLayout from "@/components/layout";
import AppointList from "./appointList";


const EditAppointment:React.FC =() =>{
    return(
        <>
            <div className="">
                <h2 className="font-semibold text-xl ml-5">จัดการการจอง</h2>
                <AppointList/>
            </div>
        </>
    )
}
export default EditAppointment;