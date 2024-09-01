import React, { useState, useEffect } from 'react';

const NumberList = ({ numbers, selectedIndex, onSelect, itemsPerPage = 15}) => {
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        if (selectedIndex !== null) {
            const page = Math.floor(selectedIndex / itemsPerPage) + 1;
            setCurrentPage(page);
        }
    }, [selectedIndex, itemsPerPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleClick = (index) => {
        onSelect(index);
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedNumbers = numbers.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className='number-list' style={{ width: '30%'}}>
            <ul style={{ listStyleType: 'none', padding:0 }}>
                {paginatedNumbers.map((number, index) => (
                    <li
                        key={index}
                        style={{
                            cursor: 'pointer',
                            backgroundColor: startIndex + index === selectedIndex ? 'lightgray' : '#f5f5f5',
                            padding: '2px',
                            borderBottom: '1px solid #ddd'
                        }}
                        onClick={() => handleClick(startIndex + index)}
                    >
                        {number}
                    </li>
                ))}
            </ul>
            <div className='pagination'>
                {Array.from({ length: Math.ceil(numbers.length / itemsPerPage) }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => handlePageChange(i + 1)}
                        style={{ margin: '0.2px', backgroundColor: i + 1 === currentPage ? 'lightpink' : 'lightgray' }}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default NumberList;
