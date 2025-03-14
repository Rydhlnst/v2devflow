"use client"

import { QuestionSchema } from '@/lib/validations'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

const QuestionForm = () => {

    const form = useForm({
        resolver: zodResolver(QuestionSchema),
        defaultValues: {
            title: "",
            content: "",
            tags: []
        }
    })

    const handleCreataeQuestion = () => {}
  return (
    <Form {...form}>
        <form action="" className='flex w-full flex-col gap-10' onSubmit={form.handleSubmit(handleCreataeQuestion)}>
            <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                    <FormItem className="flex-col flex w-full gap-2.5">
                        <FormLabel className="paragraph-medium text-dark400_light700">Question Title <span className='text-primary-500'>*</span></FormLabel>
                        <FormControl>
                        <Input required  {...field} className="paragraph-regular text-dark300_light700 no-focus min-h-12 rounded-1.5 border bg- background-light900_dark300 dark:background-light900_dark300 light-border-2"/>
                        </FormControl>
                        <FormDescription className='body-regular text-light-500 mt-2.5'>Be specific and imagine you&apos;re asking a question to another person.</FormDescription>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                    <FormItem className="flex-col flex w-full gap-2.5">
                        <FormLabel className="paragraph-medium text-dark400_light700">Detail explanation of your problem<span className='text-primary-500'>*</span></FormLabel>
                        <FormControl>
                        Editor
                        </FormControl>
                        <FormDescription className='body-regular text-light-500 mt-2.5'>Introduce the problem and expand on waht you&apos;ve put in the title</FormDescription>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                    <FormItem className="flex-col flex w-full gap-2.5">
                        <FormLabel className="paragraph-medium text-dark400_light700">Tags <span className='text-primary-500'>*</span></FormLabel>
                        <FormControl>
                            <div>
                                <Input required  {...field} className="paragraph-regular text-dark300_light700 no-focus min-h-12 rounded-1.5 border bg- background-light900_dark300 dark:background-light900_dark300 light-border-2"/>
                                Tags
                            </div>
                        </FormControl>
                        <FormDescription className='body-regular text-light-500 mt-2.5'>Add up to 3 tags to describe what your question is about. You need to press enter to add a tag</FormDescription>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <div className='mt-16 flex justify-end'>
                    <Button type='submit' className='primary-gradient !text-light-900 w-fit'>Ask a question</Button>
                </div>
        </form>
    </Form>
  )
}

export default QuestionForm