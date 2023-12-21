import React, { useState } from "react";

const DashboardFooter: React.FC = () => {

    return (
        <div className=" ">
            <footer className="ml-14 mt-10 text-black font-bold transform ease-in-out duration-500 flex-none h-full flex items-center justify-center">
                <div className="text-xs lg:text-sm text-center bg-gray-300 py-5 w-full">
                    Copyright © in 2023
                    by 
                    <a href="https://www.meepoong.com/" className="hover:text-yellow-400">
                        Me Prompt Technology Company Limited.
                    </a>
                </div>
            </footer>
        </div>
    )
}
export default DashboardFooter;