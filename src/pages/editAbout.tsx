import DashboardLayout from "@/components/layout";
import { About } from "@prisma/client";
import useAxios from "axios-hooks";

import { useEffect, useState } from "react";



const EditAboutPage: React.FC = (props) => {

    const [{ data: aboutData }, getnews] = useAxios({
        url: "/api/about",
        method: "GET",
    });

    // const [filteredaboutData, setFilteredAboutData] = useState<
    //     About[]
    // >([]);
    // useEffect(() => {
    //     setFilteredAboutData(aboutData?.about ?? []);
    // }, [aboutData]);

    const router = useRouter();
    const { id } = router.query;
    const [
        { loading: updateNewsLoading, error: updateNewsError },
        executeNewsPut,
    ] = useAxios({}, { manual: true });
    const [title, setTitle] = useState<string>("");
    const [subtitleOne, setSubtitleOne] = useState<string>("");
    const [subtitleTwo, setSubtitleTwo] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [logo, setLogo] = useState<string>("");
    const [banner, setBanner] = useState<string>("");
    const [phoneOne, setPhoneOne] = useState<string>("");
    const [phoneTwo, setPhoneTwo] = useState<string>("");
    const [address, setAddress] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [fbname, setFBname] = useState<string>("");
    const [line, setLine] = useState<string>("");
    const [alertForm, setAlertForm] = useState<string>("not");
    const [inputForm, setInputForm] = useState<boolean>(false);
    const [checkBody, setCheckBody] = useState<string>("");

    const handleInputChange = (setter: any) => (event: any) => {
        const newValue = event.target.value;
        if (!isNaN(newValue) && !newValue.includes('.')) {
            setter(newValue);
        }
    };

    const [{ data: AboutData }, getabout] = useAxios({
        url: `/api/about/${id}`,
        method: "GET",
    });

    const [filteredaboutData, setFilteredAboutData] = useState<
        About[]
    >([]);
    useEffect(() => {
        setFilteredAboutData(aboutData?.about ?? []);
    }, [aboutData]);



    useEffect(() => {
        if (aboutData) {
            const {
                title,
                subtitleOne,
                subtitleTwo,
                description,
                address,
                mail,
                FBname,
                line,
                phoneOne,
                phoneTwo,
                logo: imageId, // Use the uploaded image ID
            } = aboutData;
            setTitle(title);
            setSubtitleOne(subtitleOne);
            setSubtitleTwo(subtitleTwo);
            setDescription(description);
            setAddress(address);
            setLogo(logo);
        }
    }, [aboutData]);


    return (
   <>
            <div>
                <div className="flex justify-between m-2">
                    <h2 className="font-semibold lg:text-2xl">จัดการหน้าเว็บ</h2>
                </div>
                {filteredaboutData.map((about, index) => (
                    <div key={about.id} className="bg-gray-100 w-full shadow-md rounded p-5 ">
                        <div>
                            <label htmlFor="" className="text-sm lg:text-base">ชื่อ:</label>
                            <input type="text" className="mt-1 p-2 border-0 w-full rounded-md text-sm lg:text-base"
                                defaultValue={about.title}
                                onChange={(e) => {
                                    const newValue = e.target.value;
                                    if (newValue.length <= 50) {
                                        setTitle(newValue);
                                    }
                                }}
                            />

                        </div>

                        <div className="mt-5">
                            <label htmlFor="" className="text-sm lg:text-base">เกี่ยวกับเรา</label>
                            <textarea className="mt-1 p-2 border-0 w-full rounded-md text-sm lg:text-base"
                                value={about.description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder=""
                                style={{ width: '100%', height: '200px' }}
                            >
                            </textarea>
                        </div>

                    </div>

                ))}
            </div>
    </>
    )
}
export default EditAboutPage;