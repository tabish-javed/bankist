'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const buttonCloseModal = document.querySelector('.btn--close-modal');
const buttonsOpenModal = document.querySelectorAll('.btn--show-modal');
const buttonScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContents = document.querySelectorAll('.operations__content');

const nav = document.querySelector('.nav');


const openModal = function (event) {
    event.preventDefault();
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
};

const closeModal = function (event) {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
};


buttonsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
buttonCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
    }
});


// Button "Learn more" to scroll View Port to Section 1 of the document
buttonScrollTo.addEventListener('click', function (event) {
    section1.scrollIntoView({ behavior: "smooth" });
});

// Page navigation - Attach event handler to all elements - Decrease Performance
// document.querySelectorAll('.nav__link').forEach(function (element) {
//     element.addEventListener('click', function (event) {
//         event.preventDefault();
//         const id = this.getAttribute('href');
//         // console.log(id);
//         document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//     });
// });

// Event Delegation is a solution to have event handler on parent element and get triggered by all of child elements.
// 1 - Add event listener to common parent element.
// 2 - Determine what element originated the event.

document.querySelector('.nav__links').addEventListener('click', function (event) {
    event.preventDefault();
    // Matching strategy
    if (event.target.classList.contains('nav__link')) {
        const id = event.target.getAttribute('href');
        document.querySelector(id).scrollIntoView({ behavior: "smooth" });
        // document.getElementById(id.slice(1)).scrollIntoView({ behavior: "smooth" });
    }
});

// Tabbed component
tabsContainer.addEventListener('click', function (event) {
    const clicked = event.target.closest('.operations__tab');

    // Guard clause
    if (!clicked) return;

    // Remove active classes
    tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
    tabsContents.forEach(content => content.classList.remove('operations__content--active'));

    // Active tab
    clicked.classList.add('operations__tab--active');
    // Activate content area
    document.querySelector(`.operations__content--${clicked.dataset.tab}`)
        .classList.add('operations__content--active');
});

// Menu fade animation
function handleHover (event) {
    if (event.target.classList.contains('nav__link')) {
        const link = event.target;
        const siblings = link.closest('.nav').querySelectorAll('.nav__link');
        // const logo = link.closest('.nav').querySelector('img');
        [...siblings].slice(0, -1).forEach(element => {
            if (element !== link) element.style.opacity = this;
        });
        // logo.style.opacity = this;
    }
}

// Passing "argument" into handler
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));


// STICKY NAVIGATION USING SCROLL EVENT ----
// const initialCoords = section1.getBoundingClientRect();

// window.addEventListener('scroll', function () {
//     if (this.window.scrollY > initialCoords.top)
//         nav.classList.add('sticky');
//     else nav.classList.remove('sticky');
// });


// STICKY NAVIGATION USING THE INTERSECTION OBSERVER API ----

// function observerCallback (entries) {
//     entries.forEach(entry => {
//         console.log(entry);
//     })
// }

// const observerOptions = {
//     root: null,
//     threshold: [0, 0.2]
// };

// // const observer = new IntersectionObserver(observerCallback, observerOptions);
// // observer.observe(section1);
// const observer = new IntersectionObserver(observerCallback, observerOptions);
// observer.observe(section1)


const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

function stickyNav (entries) {
    const [entry] = entries;
    if (!entry.isIntersecting) nav.classList.add('sticky');
    else nav.classList.remove('sticky');
}

const headerObserver = new IntersectionObserver(stickyNav, {
    root: null,
    threshold: 0,
    rootMargin: `${navHeight}px`
});

headerObserver.observe(header);

// REVEAL SECTIONS ----

function revealSection (entries, observer) {
    const [entry] = entries;

    if (!entry.isIntersecting) return;
    entry.target.classList.remove('section--hidden');

    observer.unobserve(entry.target);
}

const sectionObserver = new IntersectionObserver(revealSection, {
    root: null,
    threshold: 0.15
});

const allSections = document.querySelectorAll('.section');
allSections.forEach((section) => {
    sectionObserver.observe(section);
    section.classList.add('section--hidden');
});


// LAZY LOADING IMAGES ----

const imageTargets = document.querySelectorAll('img[data-src]');

function loadImage (entries, observer) {
    const [entry] = entries;

    if (!entry.isIntersecting) return;

    // replace src with data-src
    entry.target.src = entry.target.dataset.src;

    entry.target.addEventListener('load', function () {
        entry.target.classList.remove('lazy-img');
    });

    observer.unobserve(entry.target);
}

const imageObserver = new IntersectionObserver(loadImage, {
    root: null,
    threshold: 0,
    rootMargin: '200px'
});

imageTargets.forEach((image) => imageObserver.observe(image));


// SLIDER

const slides = document.querySelectorAll('.slide');
const buttonLeft = document.querySelector('.slider__btn--left');
const buttonRight = document.querySelector('.slider__btn--right');
let currentSlide = 0;
const maximumSlides = slides.length;


// const slider = document.querySelector('.slider');
// slider.style.transform = 'scale(0.4) translateX(-1200px)';
// slider.style.overflow = 'visible';


function goToSlide (currentSlide) {
    slides.forEach((slide, index) => slide.style.transform = `translateX(${100 * (index - currentSlide)}%)`);
}

goToSlide(0);

// Go to next slide

function nextSlide () {
    if (currentSlide === maximumSlides - 1) {
        currentSlide = 0;
    } else {
        currentSlide++;
    }
    goToSlide(currentSlide);
}

function previousSlide () {
    if (currentSlide === 0) {
        currentSlide = maximumSlides - 1;
    } else {
        currentSlide--;
    }

    goToSlide(currentSlide);
}

buttonRight.addEventListener('click', nextSlide);
buttonLeft.addEventListener('click', previousSlide);


///////////////////////////////////

/*
// SELECTING ELEMENTS

console.log(document.documentElement);
console.log(document.head);
console.log(document.body);

const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');
console.log(allSections);

document.getElementById('section--1');

const allButtons = document.getElementsByTagName('button');
console.log(allButtons);

document.getElementsByClassName('btn');

// CREATING AND INSERTING ELEMENTS
// .insertAdjacentElement() - Used for inserting HTML elements inside of selected element

const message = document.createElement('div');
message.classList.add('cookie-message');
// message.textContent = 'We used cookies for improved functionality and analytics.';
message.innerHTML = `We used cookies for improved functionality and analytics.
<button class="btn btn--close-cookie">Got it!</button>`;
// header.prepend(message)
header.append(message);
// header.append(message.cloneNode(true))

// header.before(message)
// header.after(message);


// DELETE ELEMENTS

document
    .querySelector('.btn--close-cookie')
    .addEventListener('click', function () {
        message.remove();
        // message.parentElement.removeChild(message)
    });


// STYLES

message.style.backgroundColor = '#37383d';
message.style.width = '120%';

console.log(message.style.backgroundColor);

console.log(getComputedStyle(message).color);
console.log(getComputedStyle(message).height);

message.style.height = Number.parseFloat(getComputedStyle(message).height) + 30 + 'px';

document.documentElement.style.setProperty('--color-primary', 'orangered');

// ATTRIBUTES

const logo = document.querySelector('.nav__logo');
console.log(logo.src);
console.log(logo.alt);
console.log(logo.className);

// Non-Standard
console.log(logo.designer);
console.log(logo.getAttribute('designer'));
logo.setAttribute('company', 'Bankist');

console.log(logo.getAttribute('src'));

const link = document.querySelector('.nav__link--btn');
console.log(link.href);
console.log(link.getAttribute('href'));

// Data Attribute
console.log(logo.dataset.versionNumber);

// Classes
logo.classList.add('c', 'i')
logo.classList.remove('c', 'i')
logo.classList.toggle('c')
logo.classList.contains('c');

// Don't use
logo.className = 'jolly'


const buttonScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

buttonScrollTo.addEventListener('click', function (event) {
    // const s1coords = section1.getBoundingClientRect();
    // console.log(s1coords);

    // // console.log(event.target.getBoundingClientRect());

    // console.log('Current Scroll (x/y)', window.scrollX, window.scrollY);
    // console.log('Viewport (width/height) ', document.documentElement.clientWidth, document.documentElement.clientHeight);

    // // Scrolling
    // window.scrollTo(s1coords.left + window.scrollX, s1coords.top + window.scrollY)

    // window.scrollTo({
    //     left: s1coords.left + window.scrollX,
    //     top: s1coords.top + window.scrollY,
    //     behavior: "smooth"
    // });

    section1.scrollIntoView({ behavior: "smooth" });
});

// const h1 = document.querySelector('h1');

// h1.addEventListener('mouseover', function (event) {
//     alert('addEventListener: Great! you are reading the heading!')
// });


// EVENT PROPAGATION -  (1) Document -> Element -> Child Element -> Target Element (2) (Capture Phase)
                        (3) Document <- Element <- Child Element <- Target Element (2) (Bubbling Phase)


const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const randomColor = () => `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;

document.querySelector('.nav__link').addEventListener('click', function (event) {
    this.style.backgroundColor = randomColor();
    console.log('LINK', event.target, event.currentTarget);
    console.log(event.currentTarget === this);

    // Stop propagation
    // event.stopPropagation();
}, {once: true});

document.querySelector('.nav__links').addEventListener('click', function (event) {
    this.style.backgroundColor = randomColor();
    console.log('CONTAINER', event.target, event.currentTarget);
    console.log(event.currentTarget === this);

});

document.querySelector('.nav').addEventListener('click', function (event) {
    this.style.backgroundColor = randomColor();
    console.log('NAV', event.target, event.currentTarget);
    console.log(event.currentTarget === this);
}, {capture: true});



// DOM TRAVERSAL

const h1 = document.querySelector('h1');

// Going downwards: child
console.log(h1.querySelectorAll('.highlight'));
console.log(h1.childNodes);
console.log(h1.children);
h1.firstElementChild.style.color = 'white';
h1.lastElementChild.style.color = 'orangered';

// Going upwards: parents
console.log(h1.parentNode);
console.log(h1.parentElement);
h1.closest('.header__title').style.background = 'var(--gradient-secondary)';

// Going sideways: siblings
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

console.log(h1.previousSibling);
console.log(h1.nextSibling);

console.log(h1.parentElement.children);
[...h1.parentElement.children].forEach(function (element) {
    if (element != h1) element.style.transform = 'scale(0.5';
});

*/
