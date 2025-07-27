import type { MetaFunction } from "@remix-run/node";
import { redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { getUserId } from "~/services/session.server";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {

  console.log(`
    
   
    Index Loader called  with request : ${JSON.stringify(request)}
    
    
    `)
  const userId = await getUserId(request);
  if (!userId) {
    console.log("No user id so we are redirecting to /login")
    return redirect("/login");
  }
  console.log("user id is there so we are redirecting to /notes",userId)
  return redirect("/notes");
}

export default function Index() {
  console.log("INdex page render....");
  return <div>Hello World</div>;
}
