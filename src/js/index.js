import { PixabayAPI } from "./pixabay-api";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";


const gallery = document.querySelector('.gallery');
const searchForm = document.querySelector('.search-form');
const loadMoreBtn = document.querySelector('.load-more');
const pixabayAPI = new PixabayAPI();
const target = document.querySelector('.js-guard');
// let page = 1;
const simplelightbox = new SimpleLightbox('.gallery a', {});

const options = {
  root: null,
  rootMargin: "400px",
  threshold: 1.0,
};

const observer = new IntersectionObserver(handleIntersect, options);
searchForm.addEventListener('submit', handlerSearchForm);
// loadMoreBtn.addEventListener('click', handlerLoadMoreBtn);

function handlerSearchForm(evt) {
  evt.preventDefault();
  // loadMoreBtn.hidden = true;
  gallery.innerHTML = '';
  const searchQuery = evt.currentTarget.elements['searchQuery'].value.trim();
  pixabayAPI.q = searchQuery;
  searchPhotos();
  
}

async function searchPhotos() {
  try {
    pixabayAPI.page = 1;
    const { data } = await pixabayAPI.fetchPhotos();
    if (data.hits.length < 1) {
      Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      // loadMoreBtn.hidden = true;
      return;
    }
    Notify.success(`Hooray! We found ${data.totalHits} images.`);
    gallery.insertAdjacentHTML('beforeend', createMarkup(data.hits));

    observer.observe(target);
    simplelightbox.refresh();
    // loadMoreBtn.hidden = false;
  } catch (error) {
    console.log(error);
    
  };
}

function handleIntersect(evt) {
  pixabayAPI.page += 1;
  if (evt[0].isIntersecting) {
    searchMorePhotos(); 
  }
}

 
async function searchMorePhotos() {
  try {
    const result = pixabayAPI.page * 40;
    const { data } = await pixabayAPI.fetchPhotos();
    gallery.insertAdjacentHTML('beforeend', createMarkup(data.hits)); 
    if (result >= data.totalHits) {
      Notify.failure("We're sorry, but you've reached the end of search results.");
      // loadMoreBtn.hidden = true;
      return;
    };
    // addSmoothScroll();
    simplelightbox.refresh();
  } catch (error) {
    
  }

}

function createMarkup(arr) {
    const markup = arr.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => 
        `<a href="${largeImageURL}">
        <div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" width='350' height='200'/>
  <div class="info">
    <p class="info-item">
      <b>Likes: ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${downloads}</b>
    </p>
  </div>
        </div>
        </a>
        `
    );
    return markup.join('');

}



//<-----------------------------функціонал для кнопки load more-------------------------->


// function handlerLoadMoreBtn() {
//   pixabayAPI.page += 1;
//   searchMorePhotos();
   
// }

// async function searchMorePhotos() {
//   try {
//     const result = pixabayAPI.page * 40;
//     const { data } = await pixabayAPI.fetchPhotos();
//     if (result >= data.totalHits) {
//       Notify.failure("We're sorry, but you've reached the end of search results.");
//       loadMoreBtn.hidden = true;
//       return;
//     };
//     gallery.insertAdjacentHTML('beforeend', createMarkup(data.hits)); 
//     // addSmoothScroll();
//     simplelightbox.refresh();
//   } catch (error) {
    
//   }
// }

// function addSmoothScroll() {
//   const { height: cardHeight } = document
//     .querySelector(".gallery")
//     .firstElementChild.getBoundingClientRect();
//   window.scrollBy({
//     top: cardHeight * 2,
//     behavior: "smooth",
//   });
// }