import { auth } from "@/auth";
import QuestionCards from "@/components/cards/QuestionCards";
import DataRenderer from "@/components/DataRenderer";
import CommonFilter from "@/components/filters/CommonFilter";
import HomeFilter from "@/components/filters/HomeFilter";
import Pagination from "@/components/Pagination";
import LocalSearch from "@/components/search/LocalSearch";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/constants/filter";
import ROUTES from "@/constants/routes";
import { EMPTY_QUESTIONS } from "@/constants/states";
import { getQuestions } from "@/lib/actions/question.action";
import { api } from "@/lib/api";
import handleError from "@/lib/handlers/error";
import Link from "next/link";

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

const Home = async ({searchParams}: SearchParams) => {
  const {page, pageSize, query, filter}= await searchParams;
  const {success, data, error} = await getQuestions({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || "",
    filter: filter || ""
  })

  const {questions, isNext} = data || {};

  const users = await test();
  console.log(users)
  const session = await auth();

  console.log("Session: ", session);

  return (
    <>
      <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">
          All Questions
        </h1>
        <Button className="primary-gradient py-3 !text-light-900 min-h-[46px]" asChild>
          <Link href={ROUTES.ASK_QUESTION}>Ask a Questions</Link>
        </Button>
      </section>
      <section className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch 
          imgSrc={"/icons/search.svg"} placeholder="Search questions..." route="/" otherClasses="flex-1" iconPosition="left"
        />
        <CommonFilter filters={HomePageFilters} otherClasses="min-h-[56px] sm:min-w-[170px]" containerClasses="hidden max-md:flex"/>
      </section>
      <HomeFilter/>
      <DataRenderer
        success={success}
        error={error}
        data={questions}
        empty={EMPTY_QUESTIONS}
        render={(questions) => (
          <div className="mt-10 flex w-full flex-col gap-6">
            {questions.map((question) => (
              <QuestionCards key={question._id} question={question}/>
            ))}
          </div>
        )}
      />
      <Pagination page={page} isNext={isNext || false}/>
    </>
  );
}

export default Home;