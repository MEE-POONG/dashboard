import useAxios from 'axios-hooks';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { MdClose } from 'react-icons/md';

interface EditProductModalProps {
  checkAlertShow: string;
  setCheckAlertShow: React.Dispatch<React.SetStateAction<string>>;
  checkBody: string;
}

const EditProductModal: React.FC<EditProductModalProps> = () => {


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
  const [imgFirst, setImgFrist] = useState<string>('');
  const [imgSecond, setImgSecond] = useState<string>('');
  const [imgThird, setImgThird] = useState<string>('');
  const [imgFourth, setImgFourth] = useState<string>('');
  const [categoriesId, setCategoriesId] = useState('');
  const [alertForm, setAlertForm] = useState<string>("not");
  const [inputForm, setInputForm] = useState<boolean>(false);
  const [checkBody, setCheckBody] = useState<string>("");

  const handleInputChange = (setter: any) => (event: any) => {
    const newValue = event.target.value;
    if (!isNaN(newValue) && !newValue.includes('.')) {
      setter(newValue);
    }
  };

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
      } = productData;
      setProductName(productname);
    }
  }, [productData]);



  return (
    <div className="p-5">
      <h4 className='text-xl font-bold'>แก้ไขรายการสินค้า</h4>
      <div className='mt-5'>
        <div className='grid grid-cols-5 gap-4'>
          <div className='col-span-4 '>
            <label className="block text-sm font-medium ">ชื่อสินค้า</label>
            <input
              className={`mt-1 p-2 border w-full rounded-md text-sm lg:text-base bg-slate-400/20 ${inputForm && productname === '' ? 'border-red-500' : 'border-gray-300'
                }`}
              type="text"
              value={productname}
              onChange={(e) => {
                const newValue = e.target.value;
                if (newValue.length <= 50) {
                  setProductName(newValue);
                }
              }}
              placeholder="name@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">ราคา/หน่วย </label>
            <div className='flex items-end gap-1'> 
              <input
                className={`mt-1 p-2 border text-right w-full rounded-md text-sm lg:text-base  ${inputForm && price === '' ? 'border-red-500' : 'border-gray-300'
                  }`}
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="price"
              /> บาท
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;
