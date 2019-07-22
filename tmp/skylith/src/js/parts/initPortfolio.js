import { $, wndH, debounceResize } from './_utility';

/* Portfolio */
function initPortfolio() {
    const $halfCarousel = $('.nk-portfolio-single-half > .row > div').children('.nk-carousel, .nk-carousel-2, .nk-carousel-3');

    if (!$halfCarousel.length) {
        return;
    }

    // half portfolio carousel size
    debounceResize(() => {
        $halfCarousel.css('height', '');
        $halfCarousel.find('.flickity-viewport').css('height', Math.max(800, Math.min(wndH, $halfCarousel.closest('.nk-portfolio-single-half').height())));
    });
}

export { initPortfolio };
