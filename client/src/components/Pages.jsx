import React from 'react';

const Pages = ({ quantity, numberForPage, current, change }) => {
    const pages = Math.ceil(quantity / numberForPage);

    let pagesArray = [];
    for (let i = 0; i < pages; i++) {
        pagesArray.push(i + 1);
    }

    return (
        <div className='pages_container'>
            {pagesArray.map(page =>
                <span onClick={() => change(page - 1)} className={current + 1 == page ? 'page_current' : 'page_item'} key={page}><p>{page}</p></span>
            )}
        </div>
    )
}

export default Pages;