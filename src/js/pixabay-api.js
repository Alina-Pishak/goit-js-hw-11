import axios from "axios";

export class PixabayAPI {
    #BASE_URL = 'https://pixabay.com/api/';
    #API_KEY = '38608937-02ef803e1bcfc9fecc3c5d49f';
    q = null;
    page = 1;
    async fetchPhotos() {
         const searchParams = new URLSearchParams({
             key: this.#API_KEY,
             image_type: 'photo',
             orientation: 'horizontal',
             safesearch: true,
             per_page: 40,
             q: this.q,
             page: this.page,
         }
         );
        return await axios.get(`${this.#BASE_URL}?${searchParams}`);
}
}

