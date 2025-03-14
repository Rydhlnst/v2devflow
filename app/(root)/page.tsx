import { auth, signOut } from "@/auth";
import LocalSearch from "@/components/search/LocalSearch";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";
import Link from "next/link";



const questions = [
  {
    _id: "1",
    title: "How to create a new react app?",
    description: "I am trying to create a new react app but I am not able to do it. Can someone help me?",
    tags: [
      {_id: "1", name: "React"},
      {_id: "2", name: "JavaScript"}
    ],
    author: {_id: "1", name: "John Doe"},
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
  const session = await auth();
  const {query = ""} = await searchParams;

  // Ga pakai kurung kurawal
  const filteredQuestions = questions.filter((question) => 
    question.title.toLowerCase().includes(query?.toLowerCase())
  )
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
      HomeFilter
      <div className="mt-10 flex w-full flex-col gap-6">
        {filteredQuestions.map((question) => (
          <h1 key={question._id}>{question.title}</h1>
        ))}
      </div>
    </>
  );
}

export default Home;