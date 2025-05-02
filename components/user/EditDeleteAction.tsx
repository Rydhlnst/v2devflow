"use client"

import Image from 'next/image';
import React from 'react'
import { Alert } from '../ui/alert';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { toast } from 'sonner';
  
interface Props {
    type: string;
    itemId: string
}

const EditDeleteAction = ({type, itemId}: Props) => {
    const handleEdit = async () => {};
    const handleDelete = async () => {
        if(type === "Question") {

            toast.success("Question Deleted", {
                description: "Your question has been deleted successfully."
            })
        } else if (type === "Answer") {

            toast.success("Answer Deleted", {
                description: "Your answer has been deleted successfully."
            })
        }
    };
  return (
    <div className={`flex items-center justify-end gap-3 max-sm:w-full ${type === "Answer" && "gap-0 justify-center"}`}>
      {
        type === "Question" && (
            <Image src={"/icons/edit.svg"} alt='edit' width={14} height={14} className='cursor-pointer object-contain' onClick={handleEdit}/>
        )
      }
      <AlertDialog>
        <AlertDialogTrigger className='cursor-pointer'>
            <Image src={"/icons/trash.svg"} alt='trash' width={14} height={14}/>
        </AlertDialogTrigger>
        <AlertDialogContent className='background-light800_dark300'>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your account
                and remove your {type === "Question" ? "question" : "answer"} and remove it from our servers.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel className='btn'>Cancel</AlertDialogCancel>
            <AlertDialogAction className='!border-primary-100 !bg-primary-500 !text-light-800' onClick={handleDelete}>Continue</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
        </AlertDialog>

    </div>
  )
}

export default EditDeleteAction
