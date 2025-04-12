"use client"
import { useSession } from 'next-auth/react'
import Image from 'next/image';
import React, { use, useState } from 'react'
import { toast } from 'sonner';
import {toogleSaveQuestion} from '@/lib/actions/collection.action';
import { ActionResponse } from '@/types/global';

interface Params {
    questionId: string;
    hasSavedQuestionPromise: Promise<ActionResponse<{saved: boolean}>>;
}

const SaveQuestion = ({questionId, hasSavedQuestionPromise} : Params) => {
    const session = useSession();
    const userId= session?.data?.user?.id;
    const [isLoading, setisLoading] = useState(false);

    const {data} = use(hasSavedQuestionPromise);

    const {saved: hasSaved} = data || {}; 

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

  return (
    <Image src={hasSaved ? '/icons/star-filled.svg' : "/icons/star-red.svg"} width={18} height={18} alt='save' className={`cursor-pointer ${isLoading && "opacity-50"}`} onClick={handleSave}/>
  )
}

export default SaveQuestion