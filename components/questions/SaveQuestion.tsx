"use client"
import { useSession } from 'next-auth/react'
import Image from 'next/image';
import React, { useState } from 'react'
import { toast } from 'sonner';
import {toogleSaveQuestion} from '@/lib/actions/collection.action';

const SaveQuestion = ({questionId} : {questionId: string}) => {
    const session = useSession();
    const userId= session?.data?.user?.id;
    const [isLoading, setisLoading] = useState(false);

    const handleSave = async () => {
        if(!userId) return toast.error("You need to logged in to save a question")
        setisLoading(true);

        try {
            const {success, data, error} =  await toogleSaveQuestion({questionId});

            if(!success) throw new Error(error?.message || "Failed to save question");

            toast(`${data?.saved ? "Saved" : "Unsaved"} successfully`)
        } catch (error) {
            toast.error("Error", {description: error instanceof Error ? error.message : "An error occured"})
        } finally {
            setisLoading(false)
        }
    }

    const hasSaved = false;
  return (
    <Image src={hasSaved ? '/icons/star-filled.svg' : "/icons/star-red.svg"} width={18} height={18} alt='save' className={`cursor-pointer ${isLoading && "opacity-50"}`}/>
  )
}

export default SaveQuestion