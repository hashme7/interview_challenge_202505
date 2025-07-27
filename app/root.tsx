import { json, type LoaderFunctionArgs } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { RootLayout } from "~/components/layout/root-layout";
import { getUserId } from "~/services/session.server";
import "~/styles/tailwind.css";

export async function loader({ request }: LoaderFunctionArgs) {
  console.log(`
    
    
    Loader called ${JSON.stringify(request)}
    
    
    `)
  const userId = await getUserId(request);
  return json({ isAuthenticated: !!userId });
}

export default function App() {
  const { isAuthenticated } = useLoaderData<typeof loader>();
  console.log("App component")
  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <RootLayout isAuthenticated={isAuthenticated}>
          <Outlet />
        </RootLayout>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
