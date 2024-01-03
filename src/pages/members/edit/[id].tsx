import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from 'next/head';
import { Button, Card, Col, Dropdown, FloatingLabel, Form, Image, Row } from "react-bootstrap";
// import BankSelect from "@/components/Input/Bankselect";
import useAxios from "axios-hooks";
import Link from "next/link";
import DashboardLayout from "@/components/layout";
import Cookies from 'js-cookie';
import EditModal from "./EditModal";
import { Modal } from 'react-bootstrap';



const BlogAdd: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;
    const [
        { loading: updateBlogLoading, error: updateBlogError },
        executeBlogPut,
    ] = useAxios({}, { manual: true });
    const [showAlert, setShowAlert] = useState<boolean>(false);

    const handleShowAlert = () => setShowAlert(true);
    const handleCloseAlert = () => setShowAlert(false);
    const [fname, setfname] = useState<string>("");
    const [lname, setlname] = useState<string>("");
    const [tel, settel] = useState<string>("");
    const [email, setemail] = useState<string>("");
    const [img, setimg] = useState<string>("");
    const [alertForm, setAlertForm] = useState<string>("not");
    const [inputForm, setInputForm] = useState<boolean>(false);
    const [checkBody, setCheckBody] = useState<string>("");



    const handleInputChange = (setter: any) => (event: any) => {
        const newValue = event.target.value;
        if (!isNaN(newValue) && !newValue.includes('.')) {
            setter(newValue);
        }
    };



    const [{ data: BlogData }, getBlog] = useAxios({
        url: `/api/repairman/${id}`,
        method: "GET",
    });

    const reloadPage = () => {
        window.location.reload();
    };


    useEffect(() => {
        if (BlogData) {
            const {

                fname,
                lname,
                tel,
                email,
                img: imageId, // Use the uploaded image ID
                // ... (ตาม field อื่น ๆ)
            } = BlogData;


            setfname(fname);
            setlname(lname);
            settel(tel);
            setemail(email);
            setimg(img);


            // ... (กำหนดค่า state อื่น ๆ)
        }
    }, [BlogData]);


    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                const splittedString = base64String.split(",")[1]; // ตัดส่วน "data:image/png;base64," ออก
                setimg(splittedString);
            };
            reader.readAsDataURL(file);
        }
    };


    const handleSubmit = async (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        event.stopPropagation();
        let missingFields = [];

        if (!fname) missingFields.push("fname");
        if (!lname) missingFields.push("lname");
        if (!tel) missingFields.push("tel");
        if (!email) missingFields.push("email");

        if (missingFields.length > 0) {
            setAlertForm("warning");
            setInputForm(true);
            setCheckBody(`กรอกข้อมูลไม่ครบ: ${missingFields.join(', ')}`);
        } else {
            try {
                setAlertForm("primary");

                const data = {
                    tel,
                    fname,
                    lname,
                    email,
                    img,
                };


                // Execute the update
                const response = await executeBlogPut({
                    url: "/api/repairman/" + id,
                    method: "PUT",
                    data
                });
                if (response && response.status === 200) {
                    setAlertForm("success");
                    handleShowAlert();
                    setTimeout(() => {
                        // reloadPage();
                    }, 5000);
                } else {
                    setAlertForm("danger");
                    throw new Error('Failed to update data');
                }
            } catch (error) {
                setAlertForm("danger");
            }
        }
    };

    const [userData, setUserData] = useState<any>({}); // กำหนดประเภทของข้อมูลบทความข่าว
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetch(`/api/repairman/${id}`)
                .then((response) => response.json())
                .then((data) => {
                    setUserData(data); // กำหนดข้อมูลบทความข่าวที่ดึงมา
                    //console.log(data);
                    setIsLoading(false); // ตั้งค่า isLoading เป็น false เมื่อโหลดเสร็จสมบูรณ์

                })
                .catch((error) => {
                    console.error('Error:', error);
                    setIsLoading(false); // ตั้งค่า isLoading เป็น false เมื่อโหลดเสร็จสมบูรณ์

                });
        }
    }, [id]);

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
    return (
        <DashboardLayout loggedInUser={loggedInUser}>
            <Head>
                <title>Phanomwan Backend</title>
                <meta
                    name="description"
                    content="T ACTIVE"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className='Blog-page'>

                <Card>
                    <EditModal checkAlertShow={alertForm} setCheckAlertShow={setAlertForm} checkBody={checkBody} />
                    <Card.Header className="d-flex space-between">
                        <h4 className="mb-0 py-1">
                            แก้ไขข้อมูล
                        </h4>
                    </Card.Header>
                    <Card.Body>
                        <Row>
                            <Col md={4}>
                                <FloatingLabel controlId="BlogTitle" label="ชื่อ" className="mb-3">
                                    <Form.Control
                                        isValid={inputForm && fname !== ""}
                                        isInvalid={inputForm && fname === ""}
                                        type="text"
                                        value={fname}
                                        onChange={e => setfname(e.target.value)}
                                        placeholder="ชื่อ"
                                    />
                                </FloatingLabel>
                            </Col>
                            <Col md={4}>
                                <FloatingLabel controlId="BlogTitle" label="นามสกุล" className="mb-3">
                                    <Form.Control
                                        isValid={inputForm && lname !== ""}
                                        isInvalid={inputForm && lname === ""}
                                        type="text"
                                        value={lname}
                                        onChange={e => setlname(e.target.value)}
                                        placeholder="นามสกุล"
                                    />
                                </FloatingLabel>
                            </Col>
                            <Col md={4}>
                                <FloatingLabel controlId="BlogTitle" label="เบอร์ติดต่อ" className="mb-3">
                                    <Form.Control
                                        isValid={inputForm && tel !== ""}
                                        isInvalid={inputForm && tel === ""}
                                        type="text"
                                        value={tel}
                                        onChange={e => settel(e.target.value)}
                                        placeholder="เบอร์โทรศัพท์"
                                    />
                                </FloatingLabel>
                            </Col>
                            <Col md={4}>
                                <FloatingLabel controlId="date" label="email" className="mb-3">
                                    <Form.Control
                                        isValid={inputForm && email !== ""}
                                        isInvalid={inputForm && email === ""}
                                        type="text"
                                        value={email}
                                        onChange={e => setemail(e.target.value)}
                                        placeholder="อีเมล"
                                    />
                                </FloatingLabel>
                            </Col>



                        </Row>
                    </Card.Body>
                    <Card.Footer className="text-end">
                        <Button variant="success mx-2" onClick={handleSubmit}>
                            ยืนยัน
                        </Button>
                        {/* <Button variant="primary mx-2" onClick={reloadPage}>
              ล้าง
            </Button> */}
                        <Link href="/members" className="btn btn-danger mx-2">
                            ย้อนกลับ
                        </Link>
                    </Card.Footer>

                </Card>
                <Modal show={showAlert} onHide={handleCloseAlert}>
                    <Modal.Header closeButton>
                        <Modal.Title>แก้ไขข้อมูลเรียบร้อยแล้ว</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>ข้อมูลของคุณถูกแก้ไขเรียบร้อยแล้ว</Modal.Body>
                    <Modal.Footer>
                        <Button variant="success" onClick={handleCloseAlert}>
                            ปิด
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </DashboardLayout >
    );
}
export default BlogAdd;

// function setAlertForm(arg0: string) {
//     throw new Error("Function not implemented.");
// }
// function setInputForm(arg0: boolean) {
//     throw new Error("Function not implemented.");
// }

// function setCheckBody(arg0: string) {
//     throw new Error("Function not implemented.");
// }

