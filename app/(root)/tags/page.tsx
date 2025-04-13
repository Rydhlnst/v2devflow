import TagCard from '@/components/cards/TagCards';
import DataRenderer from '@/components/DataRenderer';
import CommonFilter from '@/components/filters/CommonFilter';
import Pagination from '@/components/Pagination';
import LocalSearch from '@/components/search/LocalSearch';
import { TagFilters } from '@/constants/filter';
import ROUTES from '@/constants/routes';
import { EMPTY_TAGS } from '@/constants/states';
import { getTags } from '@/lib/actions/tag.action'
import { RouterParams } from '@/types/global';
import React from 'react'

const Tags = async ({searchParams}: RouterParams) => {
  const {page, pageSize, query, filter} = await searchParams;
  const {success, data, error} = await getTags({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query, filter
  });

  const {tags} = data || {};

  console.log("TAGS", JSON.stringify(tags,  null, 2));
  return (
    <>
      <h1 className='h1-bold text-dark100_light900'>Tags</h1>
      <section className='mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center'>
        <LocalSearch route={ROUTES.TAGS} imgSrc='/icons/search.svg' placeholder='Search by tag name...' iconPosition="left" otherClasses='flex-1'/>
        <CommonFilter filters={TagFilters} otherClasses="min-h-[56px] sm:min-w-[170px]"/>
      </section>
      <DataRenderer
        success={success} data={tags} error={error} empty={EMPTY_TAGS} render={(tags) => (
          <div className='mt-10 flex w-full flex-wrap gap-4'>
              {tags.map((tag) => <TagCard key={tag._id} {...tag}/>)}
          </div>
        )}
      />
      <Pagination page={page} isNext={data?.isNext || false}/>
    </>
  )
}

export default Tags