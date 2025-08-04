"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
    ChevronDown, 
    ChevronRight, 
    Plus, 
    Edit, 
    Trash2,
    FileText,
    Calendar,
    User,
    Lock,
    Mail,
    Phone,
    MapPin,
    ShoppingCart,
    Package,
    DollarSign,
    Hash,
    Clock,
} from "lucide-react";
import AgendaTable from "./AgendaTable";

const iconMap = {
    FileText,
    Calendar,
    User,
    Lock,
    Mail,
    Phone,
    MapPin,
    ShoppingCart,
    Package,
    DollarSign,
    Hash,
    Clock,
};

export default function AgendaSheet({
    sheet,
    collapsedSheets,
    toggleSheetCollapse,
    setSelectedSheet,
    handleEditRow,
    handleDeleteRow,
}) {
    const getIconComponent = (iconName) => {
        const IconComponent = iconMap[iconName] || iconMap.FileText;
        return <IconComponent className='h-4 w-4' />;
    };

    return (
        <Card>
            <CardHeader className='pb-3'>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                        <div
                            className='flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1 rounded'
                            onClick={() => toggleSheetCollapse(sheet.id)}>
                            {collapsedSheets.has(sheet.id) ? (
                                <ChevronRight className='h-4 w-4' />
                            ) : (
                                <ChevronDown className='h-4 w-4' />
                            )}
                            <CardTitle className='flex items-center gap-2'>
                                {getIconComponent(sheet.icon)}
                                {sheet.name}
                            </CardTitle>
                            <div className='flex gap-1'>
                                <Badge variant='outline'>
                                    {sheet.rows?.length || 0} rows
                                </Badge>
                            </div>
                        </div>
                    </div>
                    <Button
                        onClick={() => setSelectedSheet(sheet)}
                        size='sm'>
                        <Plus className='h-4 w-4 mr-2' />
                        Add Row
                    </Button>
                </div>
            </CardHeader>
            {!collapsedSheets.has(sheet.id) && (
                <CardContent className='pt-0'>
                    <AgendaTable
                        sheet={sheet}
                        handleEditRow={handleEditRow}
                        handleDeleteRow={handleDeleteRow}
                    />
                </CardContent>
            )}
        </Card>
    );
}
