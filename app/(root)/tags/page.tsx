import TagCard from '@/components/cards/TagCards';
import DataRenderer from '@/components/DataRenderer';
import LocalSearch from '@/components/search/LocalSearch';
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
      <section className='mt-11'>
        <LocalSearch route={ROUTES.TAGS} imgSrc='/icons/search.svg' placeholder='Search by tag name...' iconPosition="left" otherClasses='flex-1'/>
      </section>
      <DataRenderer
        success={success} data={tags} error={error} empty={EMPTY_TAGS} render={(tags) => (
          <div className='mt-10 flex w-full flex-wrap gap-4'>
              {tags.map((tag) => <TagCard key={tag._id} {...tag}/>)}
          </div>
        )}
      />
    </>
  )
}

export default Tags