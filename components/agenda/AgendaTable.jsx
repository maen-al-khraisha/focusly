"use client";

import { Button } from "@/components/ui/button";
import {
    Edit,
    Trash2,
    FileText,
    Mail,
    Phone,
    Hash,
    Calendar,
} from "lucide-react";

export default function AgendaTable({ sheet, handleEditRow, handleDeleteRow }) {
    const getColumnTypeIcon = (type) => {
        switch (type) {
            case "email":
                return <Mail className='h-3 w-3' />;
            case "phone":
                return <Phone className='h-3 w-3' />;
            case "url":
                return <Hash className='h-3 w-3' />;
            case "date":
                return <Calendar className='h-3 w-3' />;
            case "number":
                return <Hash className='h-3 w-3' />;
            default:
                return <FileText className='h-3 w-3' />;
        }
    };

    return (
        <div className='overflow-x-auto'>
            <table className='w-full border bg-gray-100 rounded-lg overflow-hidden'>
                <thead>
                    <tr className='border-b' style={{ borderRadius: "20px" }}>
                        {sheet.columns?.map((column) => (
                            <th
                                key={column.id}
                                className='text-left p-3 font-bold'
                                style={{
                                    color: "#fff3b0",
                                    backgroundColor: "#335c67",
                                }}>
                                <div className='flex items-center gap-2'>
                                    {getColumnTypeIcon(column.type)}
                                    {column.name}
                                </div>
                            </th>
                        ))}
                        <th
                            className='text-left p-3 font-bold'
                            style={{
                                color: "#fff3b0",
                                backgroundColor: "#335c67",
                            }}>
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {sheet.rows?.length > 0 ? (
                        sheet.rows.map((row) => (
                            <tr key={row.id} className='border-b'>
                                {sheet.columns?.map((column) => {
                                    const cell = row.cells?.find(
                                        (c) => c.columnId === column.id
                                    );
                                    return (
                                        <td key={column.id} className='p-3'>
                                            {cell?.value || ""}
                                        </td>
                                    );
                                })}
                                <td className='p-3'>
                                    <div className='flex gap-2'>
                                        <Button
                                            size='sm'
                                            variant='outline'
                                            onClick={() =>
                                                handleEditRow(sheet.id, row)
                                            }
                                            className='h-8 w-8 p-0'>
                                            <Edit className='h-3 w-3' />
                                        </Button>
                                        <Button
                                            size='sm'
                                            variant='outline'
                                            onClick={() =>
                                                handleDeleteRow(
                                                    sheet.id,
                                                    row.id
                                                )
                                            }
                                            className='h-8 w-8 p-0 text-red-600 hover:text-red-700'>
                                            <Trash2 className='h-3 w-3' />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={(sheet.columns?.length || 1) + 1}
                                className='p-4 text-center text-gray-500'>
                                No data yet. Click &quot;Add Row&quot; to add
                                your first entry.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
