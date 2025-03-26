import { auth } from "@/auth";
import QuestionCards from "@/components/cards/QuestionCards";
import HomeFilter from "@/components/filters/HomeFilter";
import LocalSearch from "@/components/search/LocalSearch";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";
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


const questions = [
  {
    _id: "1",
    title: "How to create a new react app?",
    description: "I am trying to create a new react app but I am not able to do it. Can someone help me?",
    tags: [
      {_id: "1", name: "React"},
      {_id: "2", name: "JavaScript"}
    ],
    author: {_id: "1", name: "John Doe", image: ""},
    upvotes: 10,
    answers: 5,
    views: 100,
    createdAt: new Date()
  }
]

interface SearchParams {
  searchParams: Promise<{[key: string]: string}>
}

const Home = async ({searchParams}: SearchParams) => {
  
  const users = await test();
  console.log(users)
  const session = await auth();

  console.log("Session: ", session);
  const {query = "", filter = ""} = await searchParams;

  // Ga pakai kurung kurawal
  const filteredQuestions = questions.filter((question) => {
    const matchesQuery = question.title.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filter ? question.tags[0].name.toLowerCase() === filter.toLowerCase() : true;
    return matchesQuery && matchesFilter;
  });
  return (
    <>
      <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="">
          All Questions
        </h1>
        <Button className="primary-gradient py-3 !text-light-900 min-h-[46px]" asChild>
          <Link href={ROUTES.ASK_QUESTION}>Ask a Questions</Link>
        </Button>
      </section>
      <section className="mt-11">
        <LocalSearch 
          imgSrc={"/icons/search.svg"} placeholder="Search questions..." route="/" otherClasses="flex-1"
        />
      </section>
      <HomeFilter/>
      <div className="mt-10 flex w-full flex-col gap-6">
        {filteredQuestions.map((question) => (
          <QuestionCards key={question._id} question={question}/>
        ))}
      </div>
    </>
  );
}

export default Home;