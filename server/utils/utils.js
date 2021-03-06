const { User } = require('../models');

const checkExistence = (type, value) => User.findOne({ [type]: value });

const genPaginationObj = (currentPage, docs, limit=9) => {
    // Only calcule amount of pages if `currentPage` is greater than 1
    let pages = Math.ceil(docs / limit);
    pages = pages ? pages : 1 // if page is zero return 1
 
    return {
        current: currentPage,
        prev: genPageNumber(currentPage, (currentPage - 1)),
        next: genPageNumber(currentPage, (currentPage + 1), pages),
        pages
    };
};

// return previous or next page it depends on the context this function will be called
const genPageNumber = (currentPage, page, pages=1) => currentPage === pages ? null : page;

// delay responses to slow down bruteforce attempts
const delayResponse = (response, delay=1000) => setTimeout(response, delay);
const addMinutes = (min, timeOut) => new Date(timeOut).valueOf() + (min * 60000);


module.exports = {
    checkExistence,
    genPaginationObj,
    delayResponse,
    addMinutes
};