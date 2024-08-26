import { json, MetaFunction } from '@remix-run/cloudflare';
import { useState } from 'react';
import type {
  LoaderFunctionArgs,
  ActionFunctionArgs,
} from "@remix-run/node"
import { Form, useLoaderData, useSubmit } from "@remix-run/react"
import { drizzle } from "drizzle-orm/d1"
import { fastFoodLog } from "../drizzle/schema.server"
import Time from '../components/Time';

type LoaderData = {
  lastEntry: {
    id: number;
    fastFoodName: string;
    dateEaten: string;
  } | null;
};

export const meta: MetaFunction = () => {
  return [
    { title: "Fast Food Tracker" },
    {
      name: "description",
      content: "Welcome to Remix on Cloudflare!",
    },
  ];
};

export async function action({
  request,
  context,
}: ActionFunctionArgs) {
  const formData = await request.formData();
  const fastFoodName = formData.get("fastFoodName") as string;
  const dateEaten = formData.get("date") as string;

  const db = drizzle(context.cloudflare.env.DB);

  await db
    .insert(fastFoodLog)
    .values({ fastFoodName, dateEaten })
    .execute();

  return json(
    { message: "Fast food entry added" },
    { status: 201 }
  );
}

import { asc, desc } from "drizzle-orm"; // Ensure you import the 'desc' function if available

export async function loader({
  context,
}: LoaderFunctionArgs) {
  const db = drizzle(context.cloudflare.env.DB);

  // Fetch the most recent entry from the "fastFoodLog" table
  const lastEntry = await db
    .select({
      id: fastFoodLog.id,
      fastFoodName: fastFoodLog.fastFoodName,
      dateEaten: fastFoodLog.dateEaten,
    })
    .from(fastFoodLog)
    .orderBy(asc(fastFoodLog.dateEaten)) // Use 'desc' to specify descending order
    .limit(1)
    .execute();

    return json<LoaderData>({
      lastEntry: lastEntry[0] || null,
    });
}


export default function Index() {
  const { lastEntry } = useLoaderData<LoaderData>();
  const [inputValue, setInputValue] = useState('');
  const [inputDate, setInputDate] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const submit = useSubmit();


  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = () => {
    submit(
      {
        fastFoodName: inputValue,
        date: inputDate,
      },
      { method: "post" }
    );
    handleCloseModal();
  }

  const lastEatenDate = lastEntry?.dateEaten ? new Date(lastEntry.dateEaten) : null;


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center space-y-4">
        <Time date={lastEatenDate} />
        <p className="text-lg font-medium">Since you last ate fast food</p>
        <p className="text-lg">You last ate: <span className="font-bold">{lastEntry?.fastFoodName || "N/A"}</span></p>
        <button 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={handleOpenModal}
        >
          Log Fast Food
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-lg font-medium mb-4">Log Fast Food</h2>
            <Form method='POST' onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="fastFoodName" className="block text-sm font-medium">
                  Fast Food Name
                </label>
                <input 
                  type="text" 
                  name="fastFoodName" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label htmlFor="date" className="block text-sm font-medium">
                  Date
                </label>
                <input 
                  type="date"
                  name="date"
                  value={inputDate}
                  onChange={(e) => setInputDate(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button 
                  type="button" 
                  onClick={handleCloseModal} 
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Submit
                </button>
              </div>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
}
