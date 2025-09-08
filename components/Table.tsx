// components/UserTable.tsx
'use client';

import React, { useEffect, useState } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    flexRender,
    ColumnDef,
} from '@tanstack/react-table';
import axios from 'axios';
// import { users } from '@/data/users'; // import your dummy user list



type User = {
    id: number;
    name: string;
    email: string;
};

const columns: ColumnDef<User>[] = [
    { accessorKey: 'Id', header: 'ID' },
    { accessorKey: 'Name', header: 'Name' },
    { accessorKey: 'Email', header: 'Email' },
];

const UserTable = () => {
    const [users, setUsers] = useState([]);
    const table = useReactTable({
        data: users,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });
    const fetchData = async () => {
        const response = await axios.get('/api/user');
        console.log('response', response.data.data);
        // Fetch users from your API
        setUsers(response.data.data);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            <table className="border border-gray-300 w-full mt-4 ">
                <thead className="bg-gray-100 dark:bg-gray-800">
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th key={header.id} className="p-2 border dark:text-invert">
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id} className="p-2 border dark:text-invert">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    {cell.column.id === 'Email' && (
                                        <div className="flex gap-2 mt-1">
                                            <button
                                                className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
                                                onClick={() => alert(`Edit user ${row.getValue('Id')}`)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="px-2 py-1 bg-red-500 text-white rounded text-xs"
                                                onClick={() => alert(`Delete user ${row.getValue('Id')}`)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
                <button
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 dark:bg-gray-800 dark:text-white"
                >
                    Previous
                </button>
                <span>
                    Page {table.getState().pagination.pageIndex + 1} of{' '}
                    {table.getPageCount()}
                </span>
                <button
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 dark:bg-gray-800 dark:text-white"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default UserTable;
