'use client'
import React from 'react';
import Link from 'next/link';

const Pagination = ({ totalPages, currentPage, query }:{totalPages:number, currentPage:number, query:string}) => {
  return (
    <div className="pagination">
      {currentPage > 1 && (
        <Link href={`?page=${currentPage - 1}`} passHref>
          <div className="pagination-button">Previous</div>
        </Link>
      )}
      {Array.from({ length: totalPages }, (_, index) => (
        <Link key={index + 1} href={`?page=${index + 1}&query=${query}`} passHref>
          <div className={`pagination-button ${currentPage === index + 1 ? 'active' : ''}`}>
            {index + 1}
          </div>
        </Link>
      ))}
      {currentPage < totalPages && (
        <Link href={`?page=${currentPage + 1}&query=${query}`} passHref>
          <div className="pagination-button">Next</div>
        </Link>
      )}
      <style jsx>{`
        .pagination {
          display: flex;
          justify-content: center;
          margin: 20px 0;
        }
        .pagination-button {
          margin: 0 5px;
          padding: 10px 20px;
          cursor: pointer;
        }
        .active {
          font-weight: bold;
        }
        .pagination-button[disabled] {
          cursor: not-allowed;
          opacity: 0.5;
        }
      `}</style>
    </div>
  );
};

export default Pagination;
