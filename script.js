'use strict';
const btnScrollTo = document.querySelector(`.btn--scroll-to`);
const section1 = document.querySelector(`.nav__links`);
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const tabs = document.querySelectorAll(`.operations__tab`);
const tabsContainer = document.querySelector(`.operations__tab-container`);
const tabsContent = document.querySelectorAll(`.operations__content`);
const nav = document.querySelector('.nav');

///////////////////////////////////////
// Modal window


const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

////////////////////////////////////
//Button scrolling
btnScrollTo.addEventListener(`click`, function(e){
   /*const s1coords = section1.getBoundingClientRect();
    console.log(s1coords);

    console.log(e.target.getBoundingClientRect());

    console.log(`Current scroll (X/Y)`, window.pageXOffset, pageYOffset);
    console.log(`height/width viewport`, document.documentElement.clientHeight,
    document.documentElement.clientWidth);

    //scrolling
    /*window.scrollTo({
        left: s1coords.left + window.pageXOffset, 
        top: s1coords.top + window.pageYOffset,
        behaviour: `smooth`,
    });*/
    section1.scrollIntoView({behaviour: `smooth`})
});
//////////////////////////////////////
//Page Navigation
/*document.querySelectorAll(`.nav__link`).forEach(function(el){
    el.addEventListener(`click`, function(e){
        e.preventDefault();
       
        const id = this.getAttribute(`href`);
        console.log(id);

        document.querySelector(id).scrollIntoView({behaviour: `smooth`})

    });
});*/

//1.Add event listener to common parent element
//2. Determine what element originated the event.

document.querySelector(`.nav__links`).addEventListener(`click`, function(e){
    console.log(e.target);

    // Matching Strategy 
    if(e.target.classList.contains(`nav__link`)){
        const id = e.target.getAttribute(`href`);
        console.log(id);

        document.querySelector(id).scrollIntoView({behaviour: `smooth`});
       
    }
});

//tabs.forEach(t=> t.addEventListener(`click`,()=> console.log('TAB')));

tabsContainer.addEventListener(`click`, function(e){

    const clicked = e.target.closest(`.operations__tab`);

    //Guard Clause
    if(!clicked) return;

    //remove active classes 
    tabs.forEach(t=> t.classList.remove (`operations__tab--active`));
    tabsContent.forEach(c=> c.classList.remove(`operations__content--active`));

    //Activate Tab
    clicked.classList.add(`operations__tab--active`);

    //Activate content area
    document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add(`operations__content--active`);
    
});

//Menu fade animation
//We want the logo and all the options in the header to fabe when the mouse is taken to a specific option.
//We will attach an event to the parent container and then do event deligation
/*const handleHover = function (e,opacity ){
  if(e.target.classList.contains('nav__link')){// There are no child elements so we are not using closest method
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');// event delegation to parent of all remaining options
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if(el !== link) el.style.opacity = opacity;
    });
    logo.style.opacity = opacity;
    }
};

nav.addEventListener(`mouseover`,function(e){
  handleHover(e,0.5);
});

nav.addEventListener(`mouseout`, function(e){
  handleHover(e,1);
});First way */

//Second way
const handleHover = function (e){
  if(e.target.classList.contains('nav__link')){// There are no child elements so we are not using closest method
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');// event delegation to parent of all remaining options
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if(el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
    }
};

nav.addEventListener(`mouseover`,handleHover.bind(0.5));
nav.addEventListener(`mouseout`,handleHover.bind(1));

//Sticky navigation
const initialCoords = section1.getBoundingClientRect();
console.log(initialCoords);

window.addEventListener(`scroll`, function(){
  if(window.scrollY > initialCoords.top) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
 
});

// we have added class--hidden to all four section (refer to CSS) and tus they are hiddedn.
//We will reveal them now using Intersection observer  API
const allSections = document.querySelectorAll(`.section`)

const revealSection = function(entries, observer){
const [entry] = entries;
//console.log(entry);

//Guard Clause
if(!entry.isIntersecting) return;

entry.target.classList.remove(`section--hidden`);
observer.unobserve(entry.target); // will ensure that the affects appears only once
}

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
} );
allSections.forEach(function(section){
  sectionObserver.observe(section);
  section.classList.add('section--hidden'); // this will hide all 4 sections
});

//Lazy loading images
const imgTargets = document.querySelectorAll(`img[data-src]`);

const loadImg = function(entries, observer){
  const [entry] = entries;
  console.log(entry);

  //Guard Clause
  if(!entry.isIntersecting) return;

  //Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener(`load`, function(){
    entry.target.classList.remove(`lazy-img`);
  });
 observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: `-200px`
});

imgTargets.forEach(img=> imgObserver.observe(img));

