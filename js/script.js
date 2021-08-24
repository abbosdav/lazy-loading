const lazyImages = document.querySelectorAll('img[data-src],source[data-srcset]');
const loadMapBlock = document.querySelector('.load-map');
const windowHeight = document.documentElement.clientHeight;
console.log(windowHeight);
const loadMoreBlock = document.querySelector('.load-more');
console.log(loadMoreBlock,'loadMore');



let lazyImagesPositions = [];
if(lazyImages.length > 0){
    lazyImages.forEach(img =>{
        if(img.dataset.src || img.dataset.srcset){
            lazyImagesPositions.push(img.getBoundingClientRect().top + pageYOffset);
            lazyScrollCheck();
        }
    })
}

window.addEventListener('scroll', lazyScroll);

function lazyScroll(){
    if(lazyImages.length > 0){
        lazyScrollCheck();
    }   
    if(!loadMapBlock.classList.contains('loaded')){
        getMap();
    }
    if(!loadMoreBlock.classList.contains('loading'))
        loadMore();
}


function lazyScrollCheck(){
    let imgIndex = lazyImagesPositions.findIndex(
        item => pageYOffset >item - windowHeight
    );
    if(imgIndex >= 0){
        if(lazyImages[imgIndex].dataset.src){
            lazyImages[imgIndex].src = lazyImages[imgIndex].dataset.src;
            lazyImages[imgIndex].removeAttribute('data-src');
        }
        else if (lazyImages[imgIndex].dataset.srcset){
            lazyImages[imgIndex].srcset = lazyImages[imgIndex].dataset.srcset;
            lazyImages[imgIndex].removeAttribute('data-srcset');
        }                                                   
        delete lazyImagesPositions[imgIndex];
    }
}

function getMap(){
    const loadMapBlockPos = loadMapBlock.getBoundingClientRect().top + pageYOffset;
    console.log(loadMapBlockPos,'loadMapBlockPos');
    if(pageYOffset >loadMapBlockPos - windowHeight){
        const loadMapUrl = loadMapBlock.dataset.map;
        console.log(loadMapUrl,'url');
        if(loadMapUrl){
            loadMapBlock.insertAdjacentHTML(
                "beforeend",
                `<iframe src="${loadMapUrl}" width="100%" height="500px" style="border:0;" allowfullscreen="" loading="lazy"></iframe>`
                // "beforeend",
                // '<iframe src="${loadMapUrl}"  width="100%" height="450" style="border:0;">' 
            );
            loadMapBlock.classList.add('loaded');
        }
    }
}


function loadMore(){
    const loadMoreBlockPos = loadMoreBlock.getBoundingClientRect().top + pageYOffset;
    console.log(loadMoreBlockPos,'loadMoreBlockPos');
    const loadMoreHeight = loadMoreBlock.offsetHeight;
    console.log(loadMoreHeight,'loadMoreHeight');
    if(pageYOffset > (loadMoreBlockPos +loadMoreHeight) - windowHeight){
        getContent();
    }
}
async function getContent() {
    if(!document.querySelector('.loading-icon')){
        loadMoreBlock.insertAdjacentHTML(
            'beforeend',
            `<div class="loading-icon"></div> `
        );
    }
    loadMoreBlock.classList.add('loading');
    console.log(loadMoreBlock,'added');
    
    let response = await fetch('_more.html',{
        method: 'GET',
    });
    // console.log(response,'res');
    if(response.ok){
        let result = await response.text();
        loadMoreBlock.insertAdjacentElementHTML('beforeend',result);
        loadMoreBlock.classList.remove('loading');
        if(document.querySelector('.loading-icon')){
            document.querySelector('.loading-icon').remove();
        }
    }
    else{
        alert('Xatolik yuz berdi!!!');
    }
}