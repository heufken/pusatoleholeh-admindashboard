import React, { useState, useEffect } from 'react';

import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import FilterButton from '../components/DropdownFilter';
import { getAllSellers, toggleSellerBan } from '../api/seller';
import toast from 'react-hot-toast';

function SellerManagement() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sellers, setSellers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const sellersData = await getAllSellers();
      setSellers(sellersData);
    } catch (error) {
      toast.error(error.message || 'Failed to fetch sellers data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle ban/unban
  const handleToggleBan = async (userId) => {
    try {
      const response = await toggleSellerBan(userId);
      toast.success(response.message);
      // Update local state
      setSellers(sellers.map(seller => 
        seller._id === userId 
          ? { ...seller, isBanned: !seller.isBanned }
          : seller
      ));
    } catch (error) {
      toast.error(error.message || 'Failed to update seller status');
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            {/* Page header */}
            <div className="sm:flex sm:justify-between sm:items-center mb-8">
              {/* Left: Title */}
              <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">Seller Management</h1>
              </div>

              {/* Right: Actions */}
              <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                {/* Filter button */}
                <FilterButton align="right" />
                {/* Add seller button */}
                <button className="btn bg-violet-500 hover:bg-violet-600 text-white">
                  <svg className="w-4 h-4 fill-current opacity-50 shrink-0" viewBox="0 0 16 16">
                    <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                  </svg>
                  <span className="hidden xs:block ml-2">Add Seller</span>
                </button>
              </div>
            </div>

            {/* Sellers Table */}
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl">
              <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
                <h2 className="font-semibold text-gray-800 dark:text-gray-100">
                  All Sellers <span className="text-gray-400 dark:text-gray-500 font-medium">{sellers.length}</span>
                </h2>
              </header>
              <div className="p-3">
                {isLoading ? (
                  <div className="text-center py-4">Loading...</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="table-auto w-full dark:text-gray-300">
                      <thead className="text-xs uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700 dark:bg-opacity-50">
                        <tr>
                          <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                            <div className="font-semibold text-left">Name</div>
                          </th>
                          <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                            <div className="font-semibold text-left">Email</div>
                          </th>
                          <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                            <div className="font-semibold text-left">Status</div>
                          </th>
                          <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                            <div className="font-semibold text-right">Actions</div>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700">
                        {sellers.map((seller) => (
                          <tr key={seller._id}>
                            <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-10 h-10 shrink-0 mr-2 sm:mr-3">
                                  <img 
                                    className="rounded-full" 
                                    src={seller.image?.url || "https://via.placeholder.com/40x40"} 
                                    width="40" 
                                    height="40" 
                                    alt={seller.name} 
                                  />
                                </div>
                                <div className="font-medium text-gray-800 dark:text-gray-100">
                                  {seller.name}
                                </div>
                              </div>
                            </td>
                            <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                              <div className="text-left">{seller.email}</div>
                            </td>
                            <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                              <div className={`inline-flex font-medium rounded-full text-center px-2.5 py-0.5 ${
                                seller.isBanned
                                  ? 'bg-red-100 dark:bg-red-400/30 text-red-600 dark:text-red-400'
                                  : 'bg-emerald-100 dark:bg-emerald-400/30 text-emerald-600 dark:text-emerald-400'
                              }`}>
                                {seller.isBanned ? 'Banned' : 'Active'}
                              </div>
                            </td>
                            <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                              <div className="flex justify-end">
                                <button 
                                  onClick={() => handleToggleBan(seller._id)}
                                  className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 rounded-full"
                                >
                                  <span className="sr-only">Toggle Ban</span>
                                  <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32">
                                    <circle cx="16" cy="16" r="2" />
                                    <circle cx="10" cy="16" r="2" />
                                    <circle cx="22" cy="16" r="2" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default SellerManagement;
