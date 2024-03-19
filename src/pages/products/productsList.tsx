import DeleteMemberModal from "@/components/Modal/DeleteAlertModal";
import useAxios from "axios-hooks";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MdOutlineEdit } from "react-icons/md";
import Pagination from '@/components/Pagination';
import { FaSearch } from "react-icons/fa";
import { Products, Categories } from '@prisma/client';


interface Product {
  id: string;
  productname: string;
  productbrand: string;
  productcost: string;
  productmodel: string;
  description: string;
  price: number;
  stock: number;
  imgFirst: string;
  categoriesId: number | null;
}

interface Category {
  id: number;
  name: string;
}

interface ProductsData {
  products: Product[];
  pagination: {
    total: number;
  };
}

interface CategoriesData {
  categories: Category[];
}


interface Params {
  page: number;
  pageSize: number;
  searchKey: string;
  totalPages: number;
}


const ProductsList: React.FC = (props) => {
  const [params, setParams] = useState<Params>({
    page: 1,
    pageSize: 10,
    searchKey: "",
    totalPages: 1,
  });

  const [{ data: productsData }, getproducts] = useAxios<ProductsData>({
    url: `/api/products?page=${params.page}&pageSize=${params.pageSize}&searchTerm=${params.searchKey}`,
    method: "GET",
  });

  const [
    { data: categoriesData },
    getCategories
  ] = useAxios<CategoriesData>({
    url: "/api/categories", // Assuming this endpoint exists
    method: "GET",
  });

  const [
    { loading: deleteproductLoading, error: deleteproductError },
    executeproductDelete,
  ] = useAxios({}, { manual: true });

  const [filteredproductsData, setFilteredproductsData] = useState<Product[]>([]);
  const [categoriesMap, setCategoriesMap] = useState<Record<number, string>>({});

  useEffect(() => {
    getCategories();
    getproducts();
  }, []);

  useEffect(() => {
    if (productsData?.products) {
      setFilteredproductsData(productsData.products);
    }
  }, [productsData]);

  useEffect(() => {
    if (categoriesData?.categories) {
      const categoriesMap = categoriesData.categories.reduce(
        (map, category) => ({
          ...map,
          [category.id]: category.name,
        }),
        {}
      );
      setCategoriesMap(categoriesMap);
    }
  }, [categoriesData]);

  const deleteproduct = (id: string): Promise<any> => {
    return executeproductDelete({
      url: "/api/products/" + id,
      method: "DELETE",
    }).then(() => {
      setFilteredproductsData((prevproducts) =>
        prevproducts.filter((products) => products.id !== id)
      );
    });
  };

  const handleChangePage = (page: number) => {
    setParams((prevParams) => ({
      ...prevParams,
      page: page,
    }));
  };

  const handleChangePageSize = (size: number) => {
    setParams((prevParams) => ({
      ...prevParams,
      page: 1,
      pageSize: size,
    }));
  };

  const handleChangesearchKey = (search: string) => {
    setParams(prevParams => ({
      ...prevParams,
      searchKey: search,
    }));
  };

  useEffect(() => {
    if (productsData?.products) {
      // Filter the product data based on searchKey
      const filteredData = productsData.products.filter((product: Product | null): product is Product => {
        if (!product) return false;

        const categoriesId = product.categoriesId ?? 0; // Using nullish coalescing operator instead of ||
        const categoryName = categoriesMap[categoriesId];
        // Extract properties and convert them to lowercase
        const {
          productname,
          productbrand,
          productcost,
          productmodel,
          description,
          price,
          stock,
          imgFirst,
        } = product;

        // Convert numeric properties to string and all properties to lowercase for comparison
        const searchKeyLower = params.searchKey.toLowerCase();
        const priceStr = price.toString().toLowerCase();
        const stockStr = stock.toString().toLowerCase();

        // Check if any of the properties contain the searchKey
        const containsSearchKey = [
          productname,
          productbrand,
          productcost,
          productmodel,
          description,
          imgFirst
        ].some(property => property?.toLowerCase().includes(searchKeyLower)) ||
          priceStr.includes(searchKeyLower) ||
          stockStr.includes(searchKeyLower);

        return containsSearchKey;
      });

      setFilteredproductsData(filteredData);
    }
  }, [productsData, params.searchKey, categoriesMap]);




  return (
    <div className="rounded overflow-hidden mt-5 ">

      <div className="w-full lg:w-1/4 mb-2 text-xs lg:text-sm">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-2">
            <FaSearch />
          </span>
          <input
            type="text"
            onChange={e => handleChangesearchKey(e.target.value)}
            placeholder="ค้นหา"
            aria-label="products"
            className="pl-8 pr-4 py-2 w-full rounded-full focus:outline-none focus:border-blue-300 border-gray-300 text-xs lg:text-sm"
          />
        </div>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mb-4">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
          <thead className="text-xs lg:text-sm text-gray-50 uppercase bg-gray-950 ">
            <tr>
              <th scope="col" className="py-3 px-4 lg:px-px text-center border-r">No.</th>
              <th scope="col" className="px-6 py-3">
                Product name
              </th>
              <th scope="col" className="px-6 py-3">
                Picture
              </th>
              <th scope="col" className="px-6 py-3">
                Category
              </th>
              <th scope="col" className="px-6 py-3">
                Price
              </th>
              <th scope="col" className="px-6 py-3">
                Stock
              </th>
              <th scope="col" className="">
                Action
              </th>

            </tr>
          </thead>

          <tbody>
            {filteredproductsData.map((products, index) => (

              <tr key={products.id} className="bg-white border-b ">
                <td className="text-center border-r">{index + 1}</td>
                <th className="px-6 py-3 font-medium text-gray-900 whitespace-nowrap">
                  {products.productname}
                </th>
                <td className="w-24">
                  <img
                    className="p-2"
                    src={`https://imagedelivery.net/QZ6TuL-3r02W7wQjQrv5DA/${products.imgFirst}/public`} alt=""
                  />
                </td>
                <td className="px-6 py-3">
                  <span className="ml-3 rounded-full bg-yellow-100 py-1 px-3 text-xs text-yellow-900 font-semibold">
                    {categoriesMap[products.categoriesId || 0] || ""}
                  </span>
                </td>
                <td className="px-6 py-3">
                  {products.price}
                </td>
                <td className="px-6 py-3">
                  {products.stock}
                </td>

                <td className="px-6 py-3 flex">
                  <DeleteMemberModal data={products} apiDelete={() => deleteproduct(products.id)} />

                  <Link
                    href={`/products/${products.id}`}
                    className="text-green-500 hover:text-green-700"
                  >
                    <MdOutlineEdit />

                  </Link>

                </td>
              </tr>
            ))}
          </tbody>


        </table>
      </div>

      <Pagination
        page={params.page}
        totalPages={productsData?.pagination?.total ?? 0}
        onChangePage={handleChangePage}
        onChangePageSize={handleChangePageSize}
      />

    </div>
  )
}
export default ProductsList;