"use client"

import { cn } from '@/lib/utils';
import { useSearchParams, useRouter } from 'next/navigation';
import React from 'react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { formUrlQuery } from '@/lib/url';

interface Props {
    filters: {
        name: string,
        value: string;
    }[];
    otherClasses?: string;
    containerClasses?: string;
}

const CommonFilter = ({filters, otherClasses="", containerClasses=""}: Props) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const paramsFilter = searchParams.get("filter");

    const handleUpdateParams = (value: string) => {
        const newUrl = formUrlQuery({
            params: searchParams.toString(),
            key: "filter",
            value,
        })

        router.push(newUrl, {scroll: false})
    }

  return (
    <div className={cn("relative", containerClasses)}>
        <Select onValueChange={handleUpdateParams} defaultValue={paramsFilter || undefined}>
            <SelectTrigger className={cn("body-regular no-focus light-border background-light800_dark300 text-dark500_light700 border px-5 py-2.5 w-full", otherClasses)} aria-label='Filter Options'>
                <div className='line-clamp-1 flex-1 text-left'>
                    <SelectValue placeholder="Select a filter"/>
                </div>
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {filters.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                            {item.name}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    </div>
  )
}

export default CommonFilter