import React, { useState, useEffect } from 'react';

const NumberList = ({ numbers, selectedIndex, onSelect, itemsPerPage = 10 }) => {
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
        <div className='number-list' style={{ width: '30%', overflowY: 'auto' }}>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                {paginatedNumbers.map((number, index) => (
                    <li
                        key={index}
                        style={{
                            cursor: 'pointer',
                            backgroundColor: startIndex + index === selectedIndex ? 'lightgray' : 'white',
                            padding: '5px',
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
                        style={{ margin: '5px', backgroundColor: i + 1 === currentPage ? 'lightblue' : 'black' }}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default NumberList;
