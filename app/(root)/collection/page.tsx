import { auth } from "@/auth";
import QuestionCards from "@/components/cards/QuestionCards";
import DataRenderer from "@/components/DataRenderer";
import CommonFilter from "@/components/filters/CommonFilter";
import HomeFilter from "@/components/filters/HomeFilter";
import LocalSearch from "@/components/search/LocalSearch";
import { CollectionFilters } from "@/constants/filter";
import ROUTES from "@/constants/routes";
import { EMPTY_QUESTIONS } from "@/constants/states";
import { getSavedQuestions } from "@/lib/actions/collection.action";
import { api } from "@/lib/api";
import handleError from "@/lib/handlers/error";

const test = async () => {
  try {
    return await api.users.getAll();
  } catch (error) {
    return handleError(error)
  }
}

interface SearchParams {
  searchParams: Promise<{[key: string]: string}>
}

const Collection = async ({searchParams}: SearchParams) => {
  const {page, pageSize, query, filter}= await searchParams;
  const {success, data, error} = await getSavedQuestions({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || "",
    filter: filter || ""
  })

  const {collection} = data || {};

  const users = await test();
  console.log(users)
  const session = await auth();

  console.log("Session: ", session);

  return (
    <>
        <h1 className="h1-bold text-dark100_light900">
          Saved Question
        </h1>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch 
          imgSrc={"/icons/search.svg"} placeholder="Search questions..." route={ROUTES.COLLECTION} otherClasses="flex-1" iconPosition="left"
        />
        <CommonFilter filters={CollectionFilters} otherClasses="min-h-[56px] sm:min-w-[170px]"/>
      </div>
      <HomeFilter/>
      <DataRenderer
        success={success}
        error={error}
        data={collection}
        empty={EMPTY_QUESTIONS}
        render={(collection) => (
          <div className="mt-10 flex w-full flex-col gap-6">
            {collection.map((item) => (
              <QuestionCards key={item._id} question={item.question}/>
            ))}
          </div>
        )}
      />
    </>
  );
}

export default Collection;