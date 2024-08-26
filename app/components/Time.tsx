import { useState, useEffect } from 'react';

export const Time = ({ date }: { date: Date | null }) => {
  const [days, setDays] = useState<string | number>('-'); // Allow state to be string or number

  useEffect(() => {
    if (date) {
      const today = new Date();
      const differenceInTime = today.getTime() - date.getTime();
      const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
      setDays(differenceInDays - 1);
    } else {
      setDays('-');
    }
  }, [date]);

  // Determine the background color based on the number of days
  const bgColorClass = typeof days === 'number' ? (days >= 5 ? 'bg-green-200' : 'bg-red-300') : 'bg-gray-200';

  return (
    <div className={`flex justify-center items-center rounded-[30%] w-96 h-96 ${bgColorClass}`}>
      <div className='text-center'>
        <p className='text-9xl p-4 mb-4'>{days}</p>
        <p className='text-5xl'>days</p>
      </div>
    </div>
  );
}

export default Time;
