// Global app controller
import Search from './models/Search';
import { elements, renderLoader, clearLoader } from './views/base'
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as likesView from './views/likesView';




/** Global state of the app 
 * - Search object
 * - Current recipe object
 * - Shopping List object
 * - Liked recipes
 */
const state = {};




/**
 * SEARCH CONTROLLER
 */
const controlSearch = async() => {
    // 1. Get query from the view
    const query = searchView.getInput();


    if (query) {
        // 2. New search object and add to state
        state.search = new Search(query);

        // 3. Prepare the UI for the results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try {
            // 4. search for recipes
            await state.search.getResults();


            // 5. Render results on UI
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch {
            alert('Something wrong with the search...');
            clearLoader();
        }

    }

}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault(); //prevents the page from refreshing when the user clicks on the search button
    controlSearch(); // function to control the search button
});




elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');

    if (btn) {
        const gotoPage = parseInt(btn.dataset.goto);
        searchView.clearResults();

        //goes to the next page
        searchView.renderResults(state.search.result, gotoPage);

    }
});


/**
 * RECIPE CONTROLLER
 */

const controlRecipe = async() => {
    const id = window.location.hash.replace('#', ''); //get the id from url

    if (id) {

        //Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        //Create new recipe object
        state.recipe = new Recipe(id);

        //Highlight selected search item
        if (state.search) searchView.highlightSelected(id);


        try {
            //Get recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();


            //Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            //render the recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
        } catch {
            //add messages to the user interface
            alert('Error processing recipe');
        }

    }
};

// add event listner to multiple events
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));


/**
 *LIST CONTROLLER
 */

const controlList = () => {
    //create a new list if there is none yet
    if (!state.list) state.list = new List();

    //add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });

};


/**
 *LIKES CONTROLLER
 */

const controlLike = () => {
    //if there isn't any likes then create one 
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    //user has not yet liked current recipe
    if (!state.likes.isLiked(currentID)) {
        //Add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );

        //Toggle the like button
        likesView.toggleLikedBtn(true);

        //Add like to UI list
        likesView.renderLike(newLike);


    }
    //user has not yet liked current recipe
    else {
        //Remove like from the state
        state.likes.deleteLike(currentID);

        //Toggle the like button
        likesView.toggleLikedBtn(false);
        //Remove like from UI list
        likesView.deleteLike(currentID);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
};

//Restore liked recipes on page load
window.addEventListener('load', () => {
    state.likes = new Likes();

    //Restore get the likes from the local storage
    state.likes.readStorage();

    //Toggle like menu button
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    //Render existing likes
    state.likes.likes.forEach(like => likesView.renderLike(like));
});








//Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    //handle the delete button
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        //Delete from state
        state.list.deleteItem(id);

        //Delete from UI
        listView.deleteItem(id);
    }
    //handle the count update
    else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value);
        state.list.updateCount(id, val);
    }
});




//event delegation. Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        //decrease btutton is clicked
        //.btn-decrease * means or any child element
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }

    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        //increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {

        //Add ingredients to shopping list button
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        //likes button controller
        controlLike();
    }

});