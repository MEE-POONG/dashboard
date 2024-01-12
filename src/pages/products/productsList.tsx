import DeleteMemberModal from "@/components/Modal/DeleteAlertModal";
import useAxios from "axios-hooks";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MdOutlineEdit } from "react-icons/md";
import Pagination from '@/components/Pagination';
import { FaSearch } from "react-icons/fa";
import { Products, Categories } from '@prisma/client';


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

    const [{ data: productsData }, getproducts] = useAxios({
        // url: `/api/products?page=${params.page}&pageSize=${params.pageSize}&searchTerm=${params.searchKey}&include=categories`,
        url: `/api/products?page=${params.page}&pageSize=${params.pageSize}&searchTerm=${params.searchKey}`,
        method: "GET",
    });

    const [
        { data: categoriesData },
        getCategories
    ] = useAxios({
        url: "/api/categories", // Assuming this endpoint exists
        method: "GET",
    });

    const [
        { loading: deleteproductLoading, error: deleteproductError },
        executeproductDelete,
    ] = useAxios({}, { manual: true });

    const [filteredproductsData, setFilteredproductsData] = useState<Products[]>([]);
    const [categoriesMap, setCategoriesMap] = useState<Record<number, string>>({});

    useEffect(() => {
        getCategories(); // Fetch category data on component mount
        getproducts();
    }, []); // Fetch products and categories on component mount

    useEffect(() => {
        setFilteredproductsData(productsData?.products ?? []);
    }, [productsData]);

    useEffect(() => {
        if (categoriesData?.categories) {
            // Create a map of category IDs to category names
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
        if (productsData?.product) {
            // Filter the product data based on searchKey
            const filteredData = productsData.product.filter((products: Products | null) => {
                if (products) {
                    const categoriesId = products.categoriesId || 0; // Default to 0 if categoriesId is undefined
                    const categoryName = categoriesMap[categoriesId] || ""; // Get category name from the map
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

                    } = products;

                    // Check if any of the properties contain the searchKey
                    const containsSearchKey =
                        (productname?.toLowerCase().includes(params.searchKey.toLowerCase()) ?? false) ||
                        (productbrand?.toLowerCase().includes(params.searchKey.toLowerCase()) ?? false) ||
                        (productmodel?.toLowerCase().includes(params.searchKey.toLowerCase()) ?? false) ||
                        (description?.toLowerCase().includes(params.searchKey.toLowerCase()) ?? false) ||
                        (productcost?.toLowerCase().includes(params.searchKey.toLowerCase()) ?? false) ||
                        (price?.toLowerCase().includes(params.searchKey.toLowerCase()) ?? false) ||
                        (stock?.toLowerCase().includes(params.searchKey.toLowerCase()) ?? false) ||
                        (imgFirst?.toLowerCase().includes(params.searchKey.toLowerCase()) ?? false);

                    return containsSearchKey;
                }
                return false; // If product is null, don't include it in the filtered results
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
                totalPages={productsData?.pagination?.total}
                onChangePage={handleChangePage}
                onChangePageSize={handleChangePageSize}
            />

        </div>
    )
}
export default ProductsList;