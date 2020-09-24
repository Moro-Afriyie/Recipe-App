// UI for the search

import { elements } from './base'

//named export
export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = '';
};


export const highlightSelected = id => {
    const resultsArr = Array.from(document.querySelectorAll('.results__link'));
    resultsArr.forEach(el => {
        el.classList.remove('results__link--active');
    });
    document.querySelector(`.results__link[href="#${id}"]`).classList.add('results__link--active');

};

//replaces names with length greater than 17 with ...
export const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if (title.length > limit) {
        title.split(' ').reduce((acc, cur) => {
            if (acc + cur.length <= limit) {
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0);

        return `${newTitle.join(' ')} ...`;
    }

    return title;

}

//clears the results after the user enters a new one
export const clearResults = () => {
    elements.searchResList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
}

const renderRecipe = recipe => {
    const markup = `
    <li>
        <a class="results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>


`;
    elements.searchResList.insertAdjacentHTML("beforeend", markup);
}


//type: 'prev' or 'next'
const creatButton = (page, type) => `

    <button class="btn-inline results__btn--${type}" data-goto=${type==='prev'?page-1: page+1}>
    <span>Page ${type==='prev'?page-1: page+1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type==='prev'? 'left' : 'right'}"></use>
        </svg>
        
    </button>


`;
const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);
    let button;
    if (page === 1 && pages > 1) {

        //button to go to next page
        button = creatButton(page, 'next');

    } else if (page < pages) {

        //Both buttons
        button = `
            ${ creatButton(page, 'prev')}
            ${ creatButton(page, 'next')}
        `

    } else if (page === pages && pages > 1) {


        //button to go to the previous page
        button = creatButton(page, 'prev');
    }

    elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};

//Places the search results unto the screen
export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    //render results of current page
    //display 10 results per page
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;


    recipes.slice(start, end).forEach(renderRecipe);

    //render pagination buttons
    renderButtons(page, recipes.length, resPerPage);
};