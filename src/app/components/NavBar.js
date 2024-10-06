// src/components/NavBar.js

"use client"; // This makes it a client component
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import for App Router

const NavBar = () => {
    const [isClosed, setIsClosed] = useState(true);
    const router = useRouter();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleNavigation = (path) => {
        router.push(path);
        setDropdownOpen(false); // Close dropdown after navigation
    };
    
    const toggleSidebar = () => {
        setIsClosed(!isClosed);
    };

    return (
        <nav className="bg-black dark:bg-neutral-800 text-white p-4 pr-12 pl-7">
            <div className="flex justify-between items-center">
                <div className="text-xl font-bold cursor-pointer w-12" onClick={() => handleNavigation('/')}>
                    <Image src="/icon.svg" alt="icon logo" width={50} height={50}/>
                </div>

                <div className="relative ml-auto">
                    <button
                        className=""
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                        <div className={`menuToggle2 ${isClosed ? '' : 'active'}`} onClick={toggleSidebar}>
                            <div className="toggle-bar"></div>
                        </div>
                    </button>
                    
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-neutral-700 rounded-md shadow-lg z-10">
                            <button
                                className="block w-full p-4 py-2 text-sm text-center hover:bg-neutral-600"
                                onClick={() => handleNavigation('/newton-backward')}
                            >
                                Newton Backward Interpolations
                            </button>
                            <button
                                className="block w-full p-4 py-2 text-sm text-center hover:bg-neutral-600"
                                onClick={() => handleNavigation('/newton-foward')}
                            >
                                Newton Forward Interpolations
                            </button>
                            <button
                                className="block w-full p-4 py-2 text-sm text-center hover:bg-neutral-600"
                                onClick={() => handleNavigation('/Gauss-seidal')}
                            >
                                Gauss-Seidal Approximation Method
                            </button>
                            <button
                                className="block w-full p-4 py-2 text-sm text-center hover:bg-neutral-600"
                                onClick={() => handleNavigation('/TrapezoidalRule')}
                            >
                                Trapezoidal Rule
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
