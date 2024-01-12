// ProductModal.tsx
import { useState } from 'react';

interface EditProductModalProps {
  onClose: () => void;
}

const EditProductModal: React.FC<EditProductModalProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Select category',
    description: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Add logic for submitting the form data here
    // You can call an API or handle the data as needed
    onClose();
  };

  return (
    <div className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
      {/* ... (rest of your modal structure) */}
      <form className="p-4 md:p-5" onSubmit={handleSubmit}>
        {/* ... (your form inputs) */}
        <button
          type="submit"
          className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          <svg className="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add new product
        </button>
      </form>
    </div>
  );
};

export default EditProductModal;
