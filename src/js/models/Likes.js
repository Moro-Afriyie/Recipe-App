export default class Likes {
    constructor() {
        this.likes = [];
    }


    addLike(id, title, author, img) {
        const like = { id, title, author, img };
        this.likes.push(like);

        //Persist or store data in locla storage api
        this.persistData();

        return like;
    }

    deleteLike(id) {
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index, 1) //deletes and mutates the array


        //Persist or store data in locla storage api
        this.persistData()

    }

    isLiked(id) {
        return this.likes.findIndex(el => el.id === id) !== -1;
    }

    getNumLikes() {
        return this.likes.length;
    }


    //store the data in local storage
    persistData() {
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    readStorage() {
        const storage = JSON.parse(localStorage.getItem('likes'));

        //restore likes from the local storage
        if (storage) this.likes = storage;
    }
}