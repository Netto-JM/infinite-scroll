const imageContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');

let isReady = false;
let imagesLoaded = 0;
let totalImages = 0;
let photosArray;
let imageCountToLoad = 5;
let passedSomeTime = false;
let timing;

// Unsplash API
const apiKey = 'iOviUfN6_FschJpMkFOhzDwQDCUcF5DtOK15j4LZ3_k';
let apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${imageCountToLoad}`;

const someTimePassed = () => {
  passedSomeTime = true;
};

const setTimer = () => {
  timing = setInterval(someTimePassed, 1000);
};

//Check if all images were loaded
const imageLoaded = () => {
  imagesLoaded++;
  if (imagesLoaded === totalImages) {
    isReady = true;
    loader.hidden = true;
  }
};

// Helper function to set attributes on DOM Elements
const setAttributes = (element, attributes) => {
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
};

// Create Elements For Links & Photos, Add to DOM
const displayPhotos = () => {
  totalImages += photosArray.length;
  // Run function for each object in photosArray
  photosArray.forEach(photo => {
    // create <a> to link to Unsplash
    const item = document.createElement('a');
    setAttributes(item, {
       href:  photo.links.html,
       target: '_blank'
     });
    //Create <img> for photo
    const img = document.createElement('img');
    setAttributes(img, {
       src:  photo.urls.regular,
       alt: photo.alt_description,
       title: photo.alt_description
     });
    // Event listener, check when each image is finished loading
    img.addEventListener('load', imageLoaded);
    // Put <img> inside <a>, then put both inside imageContainer
    item.appendChild(img);
    imageContainer.appendChild(item);
  });
};

// Get photos from Unsplash API
async function getPhotos() {
  try {
    const response = await fetch(apiUrl);
    photosArray = await response.json();
    displayPhotos();
  } catch (error) {
    console.log("Couldn't get any photos", error);
  }
}

// Check to see if scrolling near bottom of page, Load more photos
window.addEventListener('scroll', () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 && isReady && passedSomeTime) {
    isReady = false;
    passedSomeTime = false;
    clearInterval(timing);
    getPhotos();
    setTimer();
  }
});

// On Load
getPhotos();
(function afterInitialLoad() {
  imageCountToLoad = 30;
  apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${imageCountToLoad}`;
  setTimer();
})();