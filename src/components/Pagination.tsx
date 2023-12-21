import React from 'react';
import { MdNavigateNext, MdSkipNext, MdSkipPrevious } from 'react-icons/md';
import { GrFormPrevious } from "react-icons/gr";

interface PageSelectProps {
    page: number;
    totalPages: number;
    onChangePage: (page: number) => void;
    onChangePageSize: (size: number) => void;
}

const PageSelect: React.FC<PageSelectProps> = ({
    page,
    totalPages,
    onChangePage,
    onChangePageSize,
}) => {
    const paginationItems: JSX.Element[] = [];

    let start = page - 2;
    let end = page + 2;

    // Adjust the start and end values when they're out of bounds
    if (start < 1) {
        end += 1 - start;
        start = 1;
    }
    if (end > totalPages) {
        start -= end - totalPages;
        end = totalPages;
    }

    // Generate the range of numbers
    for (let i = start; i <= end; i++) {
        if (i > 0) {
            paginationItems.push(
                <button
                    key={`page-${i}`}
                    className={`mx-1 px-3 py-2 rounded ${i === page ? 'bg-blue-950 text-white' : 'bg-gray-200 text-gray-700'
                        }`}
                    onClick={() => onChangePage(i)}
                >
                    {i}
                </button>
            );
        }
    }

    return (
        <div className="flex items-center justify-between mt-10 mb-24">
            <div className="flex space-x-2 justify-center drop-shadow-lg">
                <button
                    className="px-3 py-2 rounded bg-gray-200 text-gray-700"
                    onClick={() => onChangePage(1)}
                    disabled={page === 1}
                >
                    <MdSkipPrevious />
                </button>
                <button
                    className="px-3 py-2 rounded bg-gray-200 text-gray-700"
                    onClick={() => onChangePage(page - 1)}
                    disabled={page === 1}
                >
                    <GrFormPrevious />
                </button>
                {paginationItems}
                <button
                    className="px-3 py-2 rounded bg-gray-200 text-gray-700"
                    onClick={() => onChangePage(page + 1)}
                    disabled={page === totalPages}
                >
                    <MdNavigateNext />
                </button>
                <button
                    className="px-3 py-2 rounded bg-gray-200 text-gray-700"
                    onClick={() => onChangePage(totalPages)}
                    disabled={page === totalPages}
                >
                    <MdSkipNext />
                </button>
            </div>
            <select
                className="px-3 py-2 rounded bg-gray-200 text-gray-700"
                aria-label="Default select example"
                onChange={(e) => onChangePageSize(Number(e.target.value))}
            >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="30">30</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="300">300</option>
                <option value="500">500</option>
                <option value="1000">1000</option>
            </select>
        </div>
    );
};

export default PageSelect;
