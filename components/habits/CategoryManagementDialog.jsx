"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Settings, Plus, Edit, Trash2, FolderOpen } from "lucide-react";
import IconSelector from "./IconSelector";

export default function CategoryManagementDialog({
    isCategoryDialogOpen,
    setIsCategoryDialogOpen,
    newCategory,
    setNewCategory,
    categories,
    habits,
    handleAddCategory,
    handleEditCategory,
    handleDeleteCategory,
    iconMap,
}) {
    return (
        <Dialog
            open={isCategoryDialogOpen}
            onOpenChange={setIsCategoryDialogOpen}>
            <DialogTrigger asChild>
                <Button variant='outline'>
                    <Settings className='mr-2 h-4 w-4' />
                    Manage Categories
                </Button>
            </DialogTrigger>
            <DialogContent className='max-w-4xl'>
                <DialogHeader>
                    <DialogTitle>Manage Categories</DialogTitle>
                    <DialogDescription>
                        Create, edit, and delete categories to organize your habits.
                    </DialogDescription>
                </DialogHeader>
                <div className='space-y-6'>
                    {/* Add New Category Section */}
                    <div className='space-y-4'>
                        <h3 className='text-lg font-semibold'>
                            Add New Category
                        </h3>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div className='space-y-2'>
                                <Label htmlFor='new-category-name'>
                                    Category Name
                                </Label>
                                <Input
                                    id='new-category-name'
                                    placeholder='Enter category name'
                                    value={newCategory.name}
                                    onChange={(e) =>
                                        setNewCategory({
                                            ...newCategory,
                                            name: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className='space-y-2'>
                                <Label>Category Icon</Label>
                                <IconSelector
                                    iconMap={iconMap}
                                    selectedIcon={newCategory.icon}
                                    onIconSelect={(icon) =>
                                        setNewCategory({
                                            ...newCategory,
                                            icon,
                                        })
                                    }
                                />
                            </div>
                        </div>
                        <Button
                            onClick={handleAddCategory}
                            disabled={!newCategory.name.trim()}
                            className='w-full md:w-auto'>
                            <Plus className='mr-2 h-4 w-4' />
                            Add Category
                        </Button>
                    </div>

                    {/* Existing Categories Section */}
                    <div className='space-y-4'>
                        <h3 className='text-lg font-semibold'>
                            Existing Categories
                        </h3>
                        {categories.length === 0 ? (
                            <div className='text-center py-8 text-gray-500'>
                                <FolderOpen className='mx-auto h-12 w-12 text-gray-300 mb-2' />
                                <p>No categories yet</p>
                                <p className='text-sm'>
                                    Create your first category above
                                </p>
                            </div>
                        ) : (
                            <div className='grid gap-3'>
                                {categories.map((category) => {
                                    const CategoryIcon =
                                        iconMap[category.icon] || iconMap.FolderOpen;
                                    return (
                                        <div
                                            key={category.id}
                                            className='flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors'>
                                            <div className='flex items-center space-x-3'>
                                                <div className='w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center'>
                                                    <CategoryIcon className='h-4 w-4 text-blue-600' />
                                                </div>
                                                <div>
                                                    <h4 className='font-medium'>
                                                        {category.name}
                                                    </h4>
                                                    <p className='text-sm text-gray-500'>
                                                        {habits.filter(
                                                            (habit) =>
                                                                habit.category?.id ===
                                                                category.id
                                                        ).length}{" "}
                                                        habits
                                                    </p>
                                                </div>
                                            </div>
                                            <div className='flex items-center space-x-2'>
                                                <Button
                                                    variant='ghost'
                                                    size='sm'
                                                    onClick={() =>
                                                        handleEditCategory(category)
                                                    }
                                                    className='h-8 w-8 p-0'
                                                    title='Edit Category'>
                                                    <Edit className='h-4 w-4' />
                                                </Button>
                                                <Button
                                                    variant='ghost'
                                                    size='sm'
                                                    onClick={() =>
                                                        handleDeleteCategory(
                                                            category.id
                                                        )
                                                    }
                                                    className='h-8 w-8 p-0 text-red-600 hover:text-red-700'
                                                    title='Delete Category'>
                                                    <Trash2 className='h-4 w-4' />
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        variant='outline'
                        onClick={() => {
                            setIsCategoryDialogOpen(false);
                            setNewCategory({
                                name: "",
                                icon: "FolderOpen",
                            });
                        }}>
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
