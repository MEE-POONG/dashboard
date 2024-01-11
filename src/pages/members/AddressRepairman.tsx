import React, { ChangeEvent, useState, useEffect } from 'react';
import { MdClose } from 'react-icons/md';
import useAxios from 'axios-hooks';
import axios from 'axios';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import AddModalAlert from '@/components/Modal/AddAlertModal';


interface AddRepairmanModalProps {
    isAddModalOpen: boolean;
    onClose: () => void;
    checkAlertShow: string;
    setCheckAlertShow: React.Dispatch<React.SetStateAction<string>>;
    checkBody: string;
}
const AddressRepairman: React.FC<AddRepairmanModalProps> = ({ isAddModalOpen, onClose }) => {
    if (!isAddModalOpen) return null;

    const router = useRouter();
    const { id } = router.query;
    const [CurrentAddressId, setCurrentAddressId] = useState<string | undefined>();
    const [isLoading, setIsLoading] = useState(true);

    const [{ error: errorMessage, loading: BlogLoading }, executeBlog] = useAxios(
        { url: '/api/repairman', method: 'POST' }, { manual: true });
    const [Name, setName] = useState<String>("");
    const [Lname, setLname] = useState<String>("");
    const [img, setimg] = useState<File | null>(null);
    const [alertForm, setAlertForm] = useState<string>("not");
    const [inputForm, setInputForm] = useState<boolean>(false);
    const [checkBody, setCheckBody] = useState<string>("");
    const [TypeAddress, setTypeAddress] = useState<String>("");
    const [AddressLine, setAddressLine] = useState<String>("");
    const [ZipCode, setZipCode] = useState<String>("");
    const [Province, setProvince] = useState<String>("");
    const [provinces, setProvinces] = useState<any[]>([]);
    const [districts, setDistricts] = useState<any[]>([]);
    const [District, setDistrict] = useState<String>("");
    const [subdistricts, setSubDistricts] = useState<any[]>([]);
    const [SubDistrict, setSubDistrict] = useState<String>("");
    const [IsDefaultAddress, setIsDefaultAddress] = useState<boolean>();
    const [repairmanId, setUserId] = useState<String>();
    const [CheckDefault, setCheckDefault] = useState(false);

    //หห
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
        fetch("https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province.json")
            .then((response) => response.json())
            .then((data) => {
                setProvinces(data);
            })
            .catch((error) => {
                console.error("Error fetching provinces:", error);
            });
    }, []);

    const handleProvinceChange = (e: any) => {
        const selectedProvinceName = e.target.value;
        const selectedProvince = provinces.find((province) => province.name_th === selectedProvinceName);
        if (selectedProvince) {
            // ดึงข้อมูลอำเภอที่เกี่ยวข้องกับจังหวัดที่เลือก   
            fetch(`https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_amphure.json`)
                .then((response) => response.json())
                .then((data) => {
                    const filteredDistricts = data.filter((district: any) => district.province_id === selectedProvince.id);
                    setDistricts(filteredDistricts);
                })
                .catch((error) => {
                    console.error("Error fetching districts:", error);
                });
        }
    };

    const handleDistrictChange = (e: any) => {
        const selectedAmphureName = e.target.value;
        const selectedAmphure = districts.find((district) => district.name_th === selectedAmphureName);
        if (selectedAmphure) {
            // ดึงข้อมูลตำบลที่เกี่ยวข้องกับอำเภอที่เลือก
            fetch(`https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_tambon.json`)
                .then((response) => response.json())
                .then((data) => {
                    const filteredSubDistricts = data.filter((subdistrict: any) => subdistrict.amphure_id === selectedAmphure.id);
                    setSubDistricts(filteredSubDistricts);
                })
                .catch((error) => {
                    console.error("Error fetching subdistricts:", error);
                });
        }
    };
    const handleSubDistrictChange = (e: any) => {
        const selectedSubDistrictName = e.target.value;
        const selectedSubDistrict = subdistricts.find((subdistrict) => subdistrict.name_th === selectedSubDistrictName);
        if (selectedSubDistrict) {
            // Update the zip code based on the selected subdistrict
            setZipCode(selectedSubDistrict.zip_code.toString());
            // console.log(selectedSubDistrict.zip_code);
        }
    };

    useEffect(() => {
        if (id) {
            fetch(`/api/user/address/${id}`)
                .then((response) => response.json())
                .then((data) => {
                    // console.log(data.id);
                    setUserId(data.id)
                    // console.log(data.AddressId);
                    // console.log(data.Address);
                    const foundId = data.Address.find((address: { id: String; }) => address.id === data.AddressId);
                    if (foundId) {
                        // เช็คว่ามีที่อยู่ดั่งเดิมไหมถ้ามีเป็น true
                        setIsDefaultAddress(true);
                        // ค้นเจอ ID ใน data.Address
                        // ทำสิ่งที่คุณต้องการกับ foundId
                        // console.log(foundId);
                        // console.log("เจอ id address");
                        // ตั้งค่า ID ของ address ที่มีอยู่
                        setCurrentAddressId(foundId)
                    } else {
                        // เช็คว่ามีที่อยู่ดั่งเดิมไหมถ้า ไม่มี เป็น false
                        setIsDefaultAddress(false);
                        // ไม่พบ ID ที่ตรงกันใน data.Address
                        // console.log('ID ไม่ตรงกับใน data.Address');
                    }

                    setIsLoading(false); // ตั้งค่า isLoading เป็น false เมื่อโหลดเสร็จสมบูรณ์

                })
                .catch((error) => {
                    console.error('Error:', error);
                    setIsLoading(false); // ตั้งค่า isLoading เป็น false เมื่อโหลดเสร็จสมบูรณ์

                });

        }
    }, [id]);

    const UploadAndSetDefault = (UploadData: any) => {
        // กระทำอะไรบางอย่างเมื่อ checkbox ถูกเลือก
        if (
            TypeAddress == "" ||
            AddressLine == "" ||
            ZipCode == "" ||
            Province == "" ||
            District == "" ||
            SubDistrict == ""
        ) {
            {
                alert("กรุณากรอกข้อมูลให้ครบ")
                return;
            }

        }
        fetch(`/api/address`, {
            method: 'POST', // หรือเปลี่ยนเป็น 'POST' หากต้องการใช้การสร้างข้อมูลใหม่
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(UploadData),
        })
            .then((response) => response.json())
            .then((data2) => {

                fetch(`/api/repairman/${id}`, {
                    method: 'PUT', // หรือเปลี่ยนเป็น 'POST' หากต้องการใช้การสร้างข้อมูลใหม่
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ AddressId: data2.id }),
                })
                    .then((response) => {
                        if (response.ok) {
                            // หากสำเร็จในการแก้ไขข้อมูล
                            alert("บันทึกข้อมูลสำเร็จ")
                            console.log("บันทึกข้อมูลสำเร็จ")
                            setIsLoading(false);
                            router.reload();
                        } else {
                            // แสดงข้อผิดพลาดหรือดำเนินการเพิ่มเติมตามที่คุณต้องการ
                            alert("บันทึก ไม่ ข้อมูลสำเร็จ")
                            console.log("บันทึกข้อมูล ไม่ สำเร็จ")
                            console.error('Error:', response.status);
                            setIsLoading(false);
                        }
                    })
                    .catch((error) => {
                        alert("บันทึก ไม่ ข้อมูลสำเร็จ")
                        console.error('Error:', error);
                        setIsLoading(false);
                    });

            })
            .catch((error) => {
                alert("บันทึก ไม่ ข้อมูลสำเร็จ")
                console.error('Error:', error);
                setIsLoading(false);
            });
    }

    const UploadNoDefault = (UploadData: any) => {
        if (

            // TypeAddress == "" ||
            // AddressLine == "" ||
            // ZipCode == "" ||
            Province == "" ||
            District == "" 
            // SubDistrict == ""
        ) {
            {
                alert("กรุณากรอกข้อมูลให้ครบ")
                return;
            }

        }

        fetch(`/api/address`, {
            method: 'POST', // หรือเปลี่ยนเป็น 'POST' หากต้องการใช้การสร้างข้อมูลใหม่
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(UploadData),
        })
            .then((response) => {
                if (response.ok) {
                    // หากสำเร็จในการแก้ไขข้อมูล
                    alert("บันทึกข้อมูลสำเร็จ")
                    console.log("บันทึกข้อมูลสำเร็จ")
                    setIsLoading(false);
                    router.reload();
                } else {
                    // แสดงข้อผิดพลาดหรือดำเนินการเพิ่มเติมตามที่คุณต้องการ
                    alert("บันทึก ไม่ ข้อมูลสำเร็จ")
                    console.log("แบันทึกข้อมูล ไม่ สำเร็จ")
                    console.error('Error:', response.status);
                    setIsLoading(false);
                }
            })
            .catch((error) => {
                alert("บันทึก ไม่ ข้อมูลสำเร็จ")
                console.error('Error:', error);
                setIsLoading(false);
            });

    }


    const SaveAddress = () => {
        setIsLoading(true);

        const UploadData = {

            typeaddress: TypeAddress,
            addressline: AddressLine,
            zipcode: ZipCode,
            province: Province,
            district: District,
            subdistrict: SubDistrict,
            repairmanId: loggedInUser.id,

        }
        if (IsDefaultAddress) {
            if (CheckDefault) {
                // กระทำอะไรบางอย่างเมื่อ checkbox ถูกเลือก
                UploadAndSetDefault(UploadData);
            } else {
                // กระทำอะไรบางอย่างเมื่อ checkbox ไม่ถูกเลือก

                UploadNoDefault(UploadData);
            }
        }
        else {
            if (CheckDefault) {
                UploadAndSetDefault(UploadData);


            } else {
                // กระทำอะไรบางอย่างเมื่อ checkbox ไม่ถูกเลือก

                UploadNoDefault(UploadData);


            }
        }
    }

    //
    return (
        <div className="fixed top-0 left-0 w-full h-screen flex items-center justify-center bg-black bg-opacity-25 p-2">
            <div className="bg-white p-3 md:p-6 rounded shadow-md ">
                <AddModalAlert checkAlertShow={alertForm} setCheckAlertShow={setAlertForm} checkBody={checkBody} />
                <div className='flex items-center justify-between'>
                    <h2 className='text-xl font-bold'>เพิ่มที่อยู่</h2>
                    <button className=" bg-blue-500 text-white p-2 rounded" onClick={onClose}>
                        <MdClose />
                    </button>
                </div>

                <div>
                    <div className="d-flex space-between my-10">
                        {/* <div className="mb-3">
                            <p className="text-[#666363] my-2">ชื่อ</p>
                            <input
                                placeholder="ชื่อ"
                                value={Name.toString()}

                                type="text"
                                className=" w-full h-9 pl-2 border border-b-black focus:outline-none focus:border-b-blue-500 "
                                onChange={(e) => setName(e.target.value)}

                            />
                        </div>
                        <div className="mb-3">
                            <p className="text-[#666363] my-2">นามสกุล</p>
                            <input
                                placeholder="นามสกุล"
                                value={Lname.toString()}

                                type="text"
                                className=" w-full h-9 pl-2 border border-b-black focus:outline-none focus:border-b-blue-500 "
                                onChange={(e) => setLname(e.target.value)}

                            />
                        </div> */}
                        {/* <div className="mb-3">
                            <p className="text-[#666363] my-2">ที่อยู่</p>
                            <input
                                placeholder="ที่อยู่"
                                value={AddressLine.toString()}
                                type="text"
                                className=" w-full h-9 pl-2 border border-b-black focus:outline-none focus:border-b-blue-500 "
                                onChange={(e) => setAddressLine(e.target.value)}

                            />
                        </div>
                        <div className="mb-3">
                            <p className="text-[#666363] my-2  ">ประเภทที่อยู่</p>
                            <select
                                className=" w-full h-9 pl-2  border border-b-black focus:outline-none focus:border-b-blue-500 "
                                onChange={(e) => setTypeAddress(e.target.value)}
                            >
                                <option value="" disabled selected hidden >กรุณาเลือก</option>
                                <option value="บ้าน">บ้าน</option>
                                <option value="ที่ทำงาน">ที่ทำงาน</option>
                                <option value="หอพัก/คอนโด">หอพัก/คอนโด</option>
                            </select>
                        </div> */}

                        <div className="mb-3 md:col-span-6">
                            <p className="text-[#666363] my-2">จังหวัด</p>
                            <select
                                className=" w-full h-9 pl-2  border border-b-black focus:outline-none focus:border-b-blue-500 "
                                onChange={(e) => { setProvince(e.target.value); handleProvinceChange(e); }}
                            >
                                <option value="" disabled selected hidden className="text-gray-500">กรุณาเลือกจังหวัด</option>
                                {provinces.map((province) => (
                                    <option key={province.id} value={province.name_th}>
                                        {province.name_th}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-3 md:col-span-6">
                            <p className="text-[#666363] my-2">อำเภอ/เขต</p>
                            <select
                                className=" w-full h-9 pl-2  border border-b-black focus:outline-none focus:border-b-blue-500 "
                                onChange={(e) => { setDistrict(e.target.value); handleDistrictChange(e) }}

                            >
                                <option value="" disabled selected hidden className="text-gray-500">กรุณาเลือกอำเภอ/เขต</option>
                                {districts.map((district) => (
                                    <option key={district.id} value={district.name_th}>
                                        {district.name_th}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* <div className="mb-3 md:col-span-6">
                            <p className="text-[#666363] my-2">ตำบล/แขวง</p>
                            <select
                                className=" w-full h-9 pl-2 border border-b-black focus:outline-none focus:border-b-blue-500 "
                                onChange={(e) => { setSubDistrict(e.target.value); handleSubDistrictChange(e) }}

                            >
                                <option value="" disabled selected hidden className="text-gray-500">กรุณาเลือกตำบล</option>
                                {subdistricts.map((subdistrict) => (
                                    <option key={subdistrict.id} value={subdistrict.name_th}>
                                        {subdistrict.name_th}
                                    </option>
                                ))}
                            </select>
                        </div> */}
                        {/* <div className="mb-3 md:col-span-6">
                            <p className="text-[#666363] my-2">รหัสไปรษณีย์</p>
                            <input
                                placeholder="รหัสไปรษณีย์"
                                value={ZipCode.toString()}
                                type="text"
                                className=" w-full h-9 pl-2 border border-b-black focus:outline-none focus:border-b-blue-500 "
                                onChange={(e) => setZipCode(e.target.value)}
                            />
                        </div> */}
                    </div>
                </div>
                <div className="text-end">
                    <button
                        className="bg-green-500 text-white px-4 py-2 rounded-md mx-2"
                        onClick={SaveAddress}
                    >
                        ยืนยัน
                    </button>
                    {/* <button onClick={onClose} className="bg-blue-500 text-white px-4 py-2 rounded-md mx-2">ปิด</button> */}
                </div>

            </div>

        </div>

    );
};

export default AddressRepairman;
