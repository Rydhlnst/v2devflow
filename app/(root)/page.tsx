import { auth, signOut } from "@/auth";

const Home = async () => {
  const session = await auth();
  return (
    <div className="">
        <h1>Ambatukamm</h1>
    </div>
  );
}

export default Home;