import { Products } from '@prisma/client';
import useAxios from 'axios-hooks';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { MdClose } from 'react-icons/md';

interface EditProductModalProps {
  data: Products;
  onSave: (updatedData: Products) => void;
  isEditModalOpen: boolean;
  onClose: () => void;
  checkAlertShow: string;
  setCheckAlertShow: React.Dispatch<React.SetStateAction<string>>;
  checkBody: string;
}

const EditProductModal: React.FC<EditProductModalProps> = ({ data, onSave, onClose }) => {

  const [editedData, setEditedData] = useState<Products>({ ...data });

  const router = useRouter();
  const { id } = router.query;
  const [
    { loading: updateNewsLoading, error: updateNewsError },
    executeNewsPut,
  ] = useAxios({}, { manual: true });
  const [productname, setProductname] = useState<string>("");
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
      setProductname(productname);
    }
  }, [productData]);





  const handleSave = () => {
    onSave(editedData);
    onClose();
  };

  return (
    <div className="fixed top-0 left-0 w-full h-screen flex items-center justify-center bg-black bg-opacity-25 p-2 z-50">
      <form className="bg-white p-3 md:p-6 rounded shadow-md" >
        <div className='flex items-center justify-between'>
          <h2 className='text-xl font-bold'>แก้ไข</h2>
          <button className=" bg-blue-500 text-white p-2 rounded" onClick={onClose}>
            <MdClose />
          </button>
        </div>

      </form>
    </div>
  );
};

export default EditProductModal;
