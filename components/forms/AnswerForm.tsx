"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { AnswerSchema } from "@/lib/validations"
import { useRef, useState, useTransition } from "react"
import dynamic from "next/dynamic"
import { MDXEditorMethods } from "@mdxeditor/editor"
import Image from "next/image"
import { CreateAnswer } from "@/lib/actions/answer.action"
import { toast } from "sonner"
import { useForm } from "react-hook-form"

const Editor = dynamic(() => import("@/components/editor/index"), {
  ssr: false,
});

const AnswerForm = ({questionId}: {questionId: string}) => {
    const [isAnswer, startAnsweringTransition] = useTransition();
    const [isAISubmitting, setisAISubmitting] = useState(false);

    const editorRef = useRef<MDXEditorMethods>(null);
  // 1. Define your form.
  const form = useForm<z.infer<typeof AnswerSchema>>({
    resolver: zodResolver(AnswerSchema),
    defaultValues: {content: ""}
  })

  const handleSubmit = async (values: z.infer<typeof AnswerSchema>) => {
    startAnsweringTransition(async () => {
        const result = await CreateAnswer({
            questionId, content: values.content
        })
    
        if(result.success) {
            form.reset();
    
            toast("SuccesS", {
                description: "Your answer has been posted successfully"
            })
        } else {
            toast("Error", {
                description: result.error?.message,
            })
        }
    })
    
  }

  return (
    <div>
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
            <h4 className="paragraph-semibold text-dark400_light800">Write your answer here</h4>
            <Button className="btn light-border-2 gap-1.5 rounded-md border px-4 py-2.5 text-primary-500 shadow-none dark:text-primary-500" disabled={isAISubmitting}>
            {isAISubmitting ? (
                            <>
                                <span>Posting...</span>
                            </>
                        ) : (
                            <>
                                <Image src={"/icons/stars.svg"} alt="Generate AI Answer" width={12} height={12} className="object-contain"/>
                                Generate AI Answer
                            </>
                        )}
            </Button>
        </div>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-6 flex w-full flex-col gap-10">
                <FormField
                    control={form.control}
                    name="content"
                    render={({field}) => (
                        <FormItem className="flex w-full flex-col gap-3">
                            <FormControl className="mt-3.5">
                                <Editor value={field.value} editorRef={editorRef} fieldChange={field.onChange}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <div className="flex justify-end">
                    <Button type="submit" className="primary-gradient w-fit">
                        {isAnswer ? (
                            <>
                                <span>Posting...</span>
                            </>
                        ) : (
                            "Post Answer"
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    </div>
  )
}

export default AnswerForm