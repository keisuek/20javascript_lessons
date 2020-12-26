const imageContainer = document.getElementById("image-container");
const loader = document.getElementById("loader");

//image loading
let ready = false;
let imagesLoaded = 0;
let totalImage = 0;
let photosArray = [];
let initialload = true;

//unsplash api
let count = 5;
const apiKey = "hrk5f_5-h6DuZQ_CPsZlSMnNQjDUrtA8OhNuwPxAefw";
let apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${count}`;

//「DRY(Don't Repeat Yourself)」の原則を思い出そう→setAttributeを繰り返し書くのではなく処理を関数としてまとめる
function setAttributes(element, attributes) {
	for (const key in attributes) {
		element.setAttribute(key, attributes[key]);
	}
}

//check if all images were loaded
function imageLoad() {
	imagesLoaded++;
	if (imagesLoaded === totalImage) {
		ready = true;
		loader.hidden = true;
		initialload = false;
		count = 20;
		apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${count}`;
	}
}

//create elements for links & photos, add to dom.
function photoDisplay() {
	imagesLoaded = 0;
	totalImage = photosArray.length;
	//run function for each object in photosArray
	photosArray.forEach((photo) => {
		const item = document.createElement("a");
		setAttributes(item, {
			href: photo.links.html,
			target: "_blank",
		});

		const img = document.createElement("img");
		setAttributes(img, {
			src: photo.urls.regular,
			alt: photo.alt_description,
			title: photo.alt_description,
		});

		img.addEventListener("load", imageLoad);

		//put <img> inside <a>, then put both inside <image-container>
		item.appendChild(img);
		imageContainer.appendChild(item);
	});
}

async function getPhotos() {
	try {
		const response = await fetch(apiUrl);
		photosArray = await response.json();
		photoDisplay();
	} catch (error) {
		console.log(error);
	}
}

//check to see if scrolling near bottom of page, load more photos
window.addEventListener("scroll", () => {
	if (
		window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 &&
		ready
	) {
		ready = false;
		getPhotos();
	}
});

getPhotos();
