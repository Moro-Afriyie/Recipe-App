//Search model
import axios from 'axios';



export default class Search {
    constructor(query) {
        this.query = query;
    }


    async getResults() {
        try {
            //fetch api doesn't work on older browsers so i used axios and it automatically returns a jason 
            const res = await axios(`https://forkify-api.herokuapp.com/api/search?&q=${this.query}`);
            this.result = res.data.recipes;
            //console.log(this.result);
        } catch (err) {
            alert(err)
        }

    }
}