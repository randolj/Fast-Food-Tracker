import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import "./tailwind.css";
import type { LoaderFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import { sql } from "drizzle-orm";

// This loader runs on every request to the root route
export let loader: LoaderFunction = async ({ context }) => {
  const db = drizzle(context.cloudflare.env.DB);

  // Initialize the database schema
  await db.run(
    sql`CREATE TABLE IF NOT EXISTS fastFoodLog (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fastFoodName TEXT NOT NULL,
      dateEaten TEXT NOT NULL
    );
  `);

  return json({});
};

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
