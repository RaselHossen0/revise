// RecordCard.jsx
import React from 'react';

const RecordCard = ({ record, index }) => (
  <div className="relative w-70 h-[300px] mr-1" key={index}>
    <svg className="w-full h-full bg-pink" viewBox="0 0 20 20">
      <path fill="pink" d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
    </svg>
    <div className="absolute inset-0 flex flex-col items-center justify-center text-grey">
    <div className='text-lg font-semibold text-center overflow-hidden overflow-ellipsis whitespace-nowrap'>{record.categoryName}</div>
      <div className='text-sm'>{record.count} Records</div>
    </div>
  </div>
);

export default RecordCard;