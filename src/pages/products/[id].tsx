import EditModalAlert from '@/components/Modal/EditAlertModal';
import axios from 'axios';
import useAxios from 'axios-hooks';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ChangeEvent, useEffect, useState } from 'react';
import { BsArrowBarLeft } from 'react-icons/bs';
import { MdClose } from 'react-icons/md';



interface ProductData {
  productname: string;
  price: string;
  imgFirst: string;
  imgSecond: string;
  imgThird: string;
  imgFourth: string;
  stock: string;
  categoriesId: string;
}

// Add this above your component definition
interface UploadResponse {
  status: number;
  data: {
    result: {
      id: string;
    };
  };
}

const EditProductModal: React.FC = (props) => {
  const router = useRouter();
  const { id } = router.query;
  const [
    { loading: updateProductLoading, error: updateProductError },
    executeProductPut,
  ] = useAxios({}, { manual: true });
  const [productname, setProductName] = useState<string>('');
  const [productbrand, setProductBrand] = useState<string>('');
  const [productmodel, srtProductModel] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [productcost, setProductCost] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [stock, setStock] = useState<string>('');
  const [imgFirst, setImgFrist] = useState<string>('');
  const [imgSecond, setImgSecond] = useState<string>('');
  const [imgThird, setImgThird] = useState<string>('');
  const [imgFourth, setImgFourth] = useState<string>('');
  const [categoriesId, setCategoriesId] = useState('');

  

  const [alertForm, setAlertForm] = useState<string>("not");
  const [inputForm, setInputForm] = useState<boolean>(false);
  const [checkBody, setCheckBody] = useState<string>("");

  // Update handleInputChange function
  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newValue = event.target.value;
    if (!isNaN(Number(newValue)) && !newValue.includes('.')) {
      setter(newValue);
    }
  };

  const [imgPreview, setimgPreview] = useState<string | null>(null);

  const [{ data: productData }, getProducts] = useAxios({
    url: `/api/products/${id}`,
    method: "GET",
  });

  const reloadPage = () => {
    window.location.reload();
  };

  useEffect(() => {
    if (productData) {
      const {
        productname,
        description,
        price,
        imgFirst,
        imgSecond,
        imgThird,
        imgFourth,
        stock,
        categoriesId,
      } = productData;
      setProductName(productname);
      setDescription(description);
      setPrice(price);
      setImgFrist(imgFirst);
      setImgSecond(imgSecond);
      setImgThird(imgThird);
      setImgFourth(imgFourth);
      setStock(stock);
      setCategoriesId(categoriesId);
    }
  }, [productData]);

  // Update handleFileUpload function
  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    setImage: React.Dispatch<React.SetStateAction<File | null>>,
    setPreview: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  // Update deleteImage function
  const deleteImage = async (imageId: string) => {
    try {
      await axios.delete(`https://upload-image.me-prompt-technology.com/?name=${imageId}`);
    } catch (error) {
      console.error('Delete failed: ', error);
    }
  };

  // Update uploadImage function
  const uploadImage = async (img: string, image: File) => {
    const uploadFormData = new FormData();
    uploadFormData.append('file', image);
    try {
      const uploadResponse = await axios.post<UploadResponse>(
        'https://upload-image.me-prompt-technology.com/',
        uploadFormData
      );

      if (uploadResponse?.status === 200) {
        deleteImage(img);
        return uploadResponse?.data?.result?.id;
      }
    } catch (error) {
      console.error('Upload failed: ', error);
    }
    return null;
  };


  const handleSubmit = async (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const imageIDs = await Promise.all([
      imgFirst ? uploadImage(productData?.imgFirst, imgFirst) : null,
      imgSecond ? uploadImage(productData?.imgSecond, imgSecond) : null,
      imgThird ? uploadImage(productData?.imgThird, imgThird) : null,
      imgFourth ? uploadImage(productData?.imgFourth, imgFourth) : null,
    ]);

    try {
      setAlertForm("primary");

      const data = {
        productname,
        price,
        stock,
        categoriesId,
        imgFirst: imageIDs[0] !== null ? imageIDs[0] : productData?.imgFirst,
        imgSecond: imageIDs[1] !== null ? imageIDs[1] : productData?.imgSecond,
        imgThird: imageIDs[2] !== null ? imageIDs[2] : productData?.imgThird,
        imgFourth: imageIDs[3] !== null ? imageIDs[3] : productData?.imgFourth,
      };

      // Execute the update
      const response = await executeProductPut({
        url: "/api/products/" + id,
        method: "PUT",
        data
      });

      if (response && response.status === 200) {
        setAlertForm("success");
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
  };




  return (
    <div className="p-5">
      <Link href='/products' className='hover:text-amber-400 font-bold flex items-center'><BsArrowBarLeft/> กลับ</Link>
      <h4 className='text-xl font-bold mt-5 '>แก้ไขรายการสินค้า</h4>
      <EditModalAlert checkAlertShow={alertForm} setCheckAlertShow={setAlertForm} checkBody={checkBody} />
      <div className='mt-5 border-b py-3'>
        <div className='grid md:grid-cols-5 gap-3'>
          <div className='md:col-span-3 lg:col-span-4 '>
            <div className="relative md:mt-2 border rounded-md bg-white mb-5">
              <label htmlFor="" className="absolute -top-2 md:-top-3 ml-2 font-semibold bg-amber-300 px-2 rounded-full text-xs">ชื่อสินค้า</label>
              <input
                className={`mt-1 p-2 border-0 w-full rounded-md text-xs md:text-base ${inputForm && productname === '' ? 'border-red-500' : 'border-gray-300'
                  }`}
                type="text"
                value={productname}
                onChange={(e) => {
                  const newValue = e.target.value;
                  if (newValue.length <= 50) {
                    setProductName(newValue);
                  }
                }}
                placeholder="999" />
            </div>
          </div>
          <div className='md:col-span-2 lg:col-span-1'>
            <div className="relative md:mt-2 border rounded-md bg-white mb-5">
              <label htmlFor="" className="absolute -top-2 md:-top-3 ml-2 font-semibold bg-amber-300 px-2 rounded-full text-xs">ราคา / หน่วย</label>
              <input min={0}
                className={`mt-1 p-2 border-0 w-full rounded-md text-xs md:text-base text-right ${inputForm && price === '' ? 'border-red-500' : 'border-gray-300'
                  }`}
                type="number"
                value={price}
                onChange={(e) => {
                  const newValue = e.target.value;
                  if (newValue.length <= 50) {
                    setPrice(newValue);
                  }
                }}
                placeholder="999" />
            </div>
          </div>
        </div>

        <div className="mb-3 md:flex gap-3 mt-2">
          <div className="relative md:mt-2 border rounded-md bg-white mb-5">
            <label htmlFor="" className="absolute -top-2 md:-top-3 ml-2 font-semibold bg-amber-300 px-2 rounded-full text-xs">ประเภทของสินค้า</label>
           <select name="" id="" className={`mt-1 p-2 border-0 w-full rounded-md text-xs md:text-base ${inputForm && categoriesId === '' ? 'border-red-500' : 'border-gray-300'
                }`}>
            <option value="">Select a Category</option>
            <option value=""></option>
           </select >
          
          </div>
          <div className="relative mt-5 md:mt-2 border rounded-md bg-white mb-5">
            <label htmlFor="" className="absolute -top-2 md:-top-3 ml-2 font-semibold bg-amber-300 px-2 rounded-full text-xs">จำนวน <span className="text-gray-500">(เครื่อง/ชิ้น/อัน)</span></label>
            <input min={0}
              className={`mt-1 p-2 border-0 w-full rounded-md text-xs md:text-base text-right ${inputForm && stock === '' ? 'border-red-500' : 'border-gray-300'
                }`}
              type="text"
              value={stock}
              onChange={(e) => {
                const newValue = e.target.value;
                if (newValue.length <= 50) {
                  setStock(newValue);
                }
              }}
              placeholder="999" />
          </div>

        </div>

        <div className="relative mt-5 md:mt-2 p-2 border w-full rounded-md bg-white mb-5">
          <span className="absolute -top-2 md:-top-3 font-semibold bg-amber-300 px-2 rounded-full text-xs"> เกี่ยวกับสินค้า  </span>
          <textarea className={`mt-1 p-2 border-0 w-full rounded-md text-xs md:text-base  ${inputForm && description === '' ? 'border-red-500' : 'border-gray-300'
            }`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            rows={8} />
        </div>

        {/* ส่วนแก้ไขรูปภาพ */}
        <div className="md:flex flex-wrap justify-between mt-5">
          {/* ภาพที่ 1 */}
          <div className="text-center">
            <span className="font-semibold bg-amber-300 px-2 rounded-full text-xs">ภาพที่ 1</span>
            <div className="mb-3 ">
              <img
                src={imgPreview
                  ? `data:image/jpeg;base64,${imgPreview}`
                  : productData?.imgFirst
                    ? `https://imagedelivery.net/QZ6TuL-3r02W7wQjQrv5DA/${productData.imgFirst}/500`
                    : `https://imagedelivery.net/QZ6TuL-3r02W7wQjQrv5DA/4500f404-dbac-40f3-6696-ae768a38e800/500`
                }
                alt="Image One Preview"
                className="object-contain w-28 lg:w-48 my-2 mx-auto drop-shadow-lg"
                loading="lazy"
              />

              <input
                id="img1"
                name="img1"
                type="file"
                onChange={(event) => handleFileUpload(event, setImgFrist, setimgPreview)}
                className="mt-1 border rounded-md focus:outline-none focus:border-indigo-500 w-full text-xs"
              />
            </div>
          </div>
          {/* ภาพที่ 2 */}
          <div className="text-center">
            <span className="font-semibold bg-amber-300 px-2 rounded-full text-xs">ภาพที่ 2</span>
            <div className="mb-3 ">
              <img
                src={imgPreview
                  ? `data:image/jpeg;base64,${imgPreview}`
                  : productData?.imgSecond
                    ? `https://imagedelivery.net/QZ6TuL-3r02W7wQjQrv5DA/${productData.imgSecond}/500`
                    : `https://imagedelivery.net/QZ6TuL-3r02W7wQjQrv5DA/4500f404-dbac-40f3-6696-ae768a38e800/500`
                }
                alt="Image One Preview"
                className="object-contain w-28 lg:w-48 my-2 mx-auto drop-shadow-lg"
                loading="lazy"
              />

              <input
                id="imgSecond"
                name="imgSecond"
                type="file"
                onChange={(event) => handleFileUpload(event, setImgSecond, setimgPreview)}
                className="mt-1 border rounded-md focus:outline-none focus:border-indigo-500 w-full text-xs"
              />
            </div>
          </div>
          {/* ภาพที่ 3 */}
          <div className="text-center">
            <span className="font-semibold bg-amber-300 px-2 rounded-full text-xs">ภาพที่ 3</span>
            <div className="mb-3 ">
              <img
                src={imgPreview
                  ? `data:image/jpeg;base64,${imgPreview}`
                  : productData?.imgThird
                    ? `https://imagedelivery.net/QZ6TuL-3r02W7wQjQrv5DA/${productData.imgThird}/500`
                    : `https://imagedelivery.net/QZ6TuL-3r02W7wQjQrv5DA/4500f404-dbac-40f3-6696-ae768a38e800/500`
                }
                alt="Image One Preview"
                className="object-contain w-28 lg:w-48 my-2 mx-auto drop-shadow-lg"
                loading="lazy"
              />

              <input
                id="imgThird"
                name="imgThird"
                type="file"
                onChange={(event) => handleFileUpload(event, setImgThird, setimgPreview)}
                className="mt-1 border rounded-md focus:outline-none focus:border-indigo-500 w-full text-xs"
              />
            </div>
          </div>
          {/* ภาพที่ 4 */}
          <div className="text-center">
            <span className="font-semibold bg-amber-300 px-2 rounded-full text-xs">ภาพที่ 4</span>
            <div className="mb-3 ">
              <img
                src={imgPreview
                  ? `data:image/jpeg;base64,${imgPreview}`
                  : productData?.imgFourth
                    ? `https://imagedelivery.net/QZ6TuL-3r02W7wQjQrv5DA/${productData.imgFourth}/500`
                    : `https://imagedelivery.net/QZ6TuL-3r02W7wQjQrv5DA/4500f404-dbac-40f3-6696-ae768a38e800/500`
                }
                alt="Image One Preview"
                className="object-contain w-28 lg:w-48 my-2 mx-auto drop-shadow-lg"
                loading="lazy"
              />

              <input
                id="imgFourth"
                name="imgFourth"
                type="file"
                onChange={(event) => handleFileUpload(event, setImgFourth, setimgPreview)}
                className="mt-1 border rounded-md focus:outline-none focus:border-indigo-500 w-full text-xs"
              />
            </div>
          </div>

        </div>
      </div>
      <div className="flex justify-center gap-5 mt-5">
        <button
          onClick={handleSubmit}
          className='bg-teal-500 text-white hover:bg-teal-300 hover:text-black px-3 py-1 rounded'
        >
          Save
        </button>
        <Link href='/products' className='bg-gray-950 text-white hover:bg-gray-300 hover:text-black px-3 py-1 rounded'>
          Back
        </Link>
      </div>
    </div>
  );
};

export default EditProductModal;
