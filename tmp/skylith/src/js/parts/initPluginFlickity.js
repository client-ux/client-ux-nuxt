import { $, $wnd, wndW, wndH } from './_utility';

function addDefaultArrows($carousel) {
    $('<div class="nk-flickity-arrow nk-flickity-arrow-prev"><span class="pe-7s-angle-left"></span></div>').on('click', () => {
        $carousel.flickity('previous');
    }).appendTo($carousel);

    $('<div class="nk-flickity-arrow nk-flickity-arrow-next"><span class="pe-7s-angle-right"></span></div>').on('click', () => {
        $carousel.flickity('next');
    }).appendTo($carousel);
}

function updateCustomArrows($carousel) {
    const data = $carousel.children('.nk-carousel-inner').data('flickity');
    const currIndex = data.selectedIndex;
    let nextIndex;
    let prevIndex;

    // get next and prev cells
    if (currIndex === 0) {
        nextIndex = 1;
        prevIndex = data.cells.length - 1;
    } else if (currIndex === data.cells.length - 1) {
        nextIndex = 0;
        prevIndex = data.cells.length - 2;
    } else {
        nextIndex = currIndex + 1;
        prevIndex = currIndex - 1;
    }
    const $nextCell = $(data.cells[nextIndex].element);
    const $prevCell = $(data.cells[prevIndex].element);
    const $currCell = $(data.cells[currIndex].element);

    // get name and sources
    const nextName = $nextCell.find('.nk-carousel-item-name').text();
    const prevName = $prevCell.find('.nk-carousel-item-name').text();
    const currName = $currCell.find('.nk-carousel-item-name').html();
    const currLinks = $currCell.find('.nk-carousel-item-links').html();

    // add info to buttons
    $carousel.find('.nk-carousel-next > .nk-carousel-arrow-name').html(nextName);
    $carousel.find('.nk-carousel-prev > .nk-carousel-arrow-name').html(prevName);
    $carousel.find('.nk-carousel-current > .nk-carousel-name').html(currName);
    $carousel.find('.nk-carousel-current > .nk-carousel-links').html(currLinks);
}

// prevent click event fire when drag carousel
function noClickEventOnDrag($carousel) {
    $carousel.on('dragStart.flickity', function () {
        $(this).find('.flickity-viewport').addClass('is-dragging');
    });
    $carousel.on('dragEnd.flickity', function () {
        $(this).find('.flickity-viewport').removeClass('is-dragging');
    });
}

/* Flickity */
function initPluginFlickity() {
    if (typeof window.Flickity === 'undefined') {
        return;
    }

    /*
     * Hack to add imagesLoaded event
     * https://github.com/metafizzy/flickity/issues/328
     */
    Flickity.prototype.imagesLoaded = function () {
        if (!this.options.imagesLoaded) {
            return;
        }
        const _this = this;
        let timeout = false;

        imagesLoaded(this.slider).on('progress', (instance, image) => {
            const cell = _this.getParentCell(image.img);
            _this.cellSizeChange(cell && cell.element);
            if (!_this.options.freeScroll) {
                _this.positionSliderAtSelected();
            }
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                _this.dispatchEvent('imagesLoadedTimeout', null, [image.img, cell.element]);
            }, 100);
        });
    };

    const self = this;

    // carousel 1
    const $carousel1 = $('.nk-carousel > .nk-carousel-inner:not(.flickity-enabled)').parent();
    if ($carousel1.length) {
        $carousel1.children('.nk-carousel-inner').each(function () {
            $(this).flickity({
                pageDots: $(this).parent().attr('data-dots') === 'true' || false,
                autoPlay: parseFloat($(this).parent().attr('data-autoplay')) || false,
                prevNextButtons: false,
                wrapAround: $(this).parent().attr('data-loop') === 'true',
                cellAlign: $(this).parent().attr('data-cell-align') || 'center',
            });
            if ($(this).parent().attr('data-arrows') === 'true') {
                addDefaultArrows($(this));
            }
            updateCustomArrows($(this).parent());
        }).on('select.flickity', function () {
            updateCustomArrows($(this).parent());
        });
        $carousel1.on('click', '.nk-carousel-next', function () {
            $(this).parent().children('.nk-carousel-inner').flickity('next');
        });
        $carousel1.on('click', '.nk-carousel-prev', function () {
            $(this).parent().children('.nk-carousel-inner').flickity('previous');
        });
        noClickEventOnDrag($carousel1.children('.nk-carousel-inner'));
    }

    // carousel 2
    $('.nk-carousel-2 > .nk-carousel-inner:not(.flickity-enabled)').each(function () {
        $(this).flickity({
            pageDots: $(this).parent().attr('data-dots') === 'true' || false,
            autoPlay: parseFloat($(this).parent().attr('data-autoplay')) || false,
            prevNextButtons: false,
            wrapAround: $(this).parent().attr('data-loop') === 'true',
            imagesLoaded: true,
            cellAlign: $(this).parent().attr('data-cell-align') || 'center',
        });
        if ($(this).parent().attr('data-arrows') === 'true') {
            addDefaultArrows($(this));
        }
        noClickEventOnDrag($(this));
    });

    // carousel 3
    const $carousel3 = $('.nk-carousel-3 > .nk-carousel-inner:not(.flickity-enabled)').parent();
    // set height for items
    function setHeightCarousel3() {
        $carousel3.each(function () {
            const $this = $(this);
            const $allImages = $this.find('img');
            const size = $this.attr('data-size') || 0.8;

            // fit item to container
            if (size === 'container') {
                const $cont = $('.container:eq(0)');
                const containerW = $cont.length ? $cont.width() : '';
                $allImages.css({
                    'max-width': containerW,
                    height: 'auto',
                });
            } else {
                let resultH = wndH * size;
                const maxItemW = Math.min($this.parent().width(), wndW) * size;
                $allImages.each(function () {
                    if (this.naturalWidth && this.naturalHeight && resultH * this.naturalWidth / this.naturalHeight > maxItemW) {
                        resultH = maxItemW * this.naturalHeight / this.naturalWidth;
                    }
                });
                $allImages.css('height', resultH);
            }

            $this.children('.nk-carousel-inner').flickity('reposition');
        });
    }
    if ($carousel3.length) {
        $carousel3.children('.nk-carousel-inner').each(function () {
            $(this).flickity({
                pageDots: $(this).parent().attr('data-dots') === 'true' || false,
                autoPlay: parseFloat($(this).parent().attr('data-autoplay')) || false,
                prevNextButtons: false,
                wrapAround: $(this).parent().attr('data-loop') === 'true',
                imagesLoaded: true,
                cellAlign: $(this).parent().attr('data-cell-align') || 'center',
            });
            updateCustomArrows($(this).parent());
            if ($(this).parent().attr('data-arrows') === 'true') {
                addDefaultArrows($(this));
            }
        }).on('select.flickity', function () {
            updateCustomArrows($(this).parent());
        }).on('imagesLoadedTimeout.flickity', () => {
            // fix items height when images loaded
            setHeightCarousel3();
        });
        $carousel3.on('click', '.nk-carousel-next', function () {
            $(this).parents('.nk-carousel-3:eq(0)').children('.nk-carousel-inner').flickity('next');
        });
        $carousel3.on('click', '.nk-carousel-prev', function () {
            $(this).parents('.nk-carousel-3:eq(0)').children('.nk-carousel-inner').flickity('previous');
        });
        setHeightCarousel3();
        self.debounceResize(setHeightCarousel3);
        noClickEventOnDrag($carousel3.children('.nk-carousel-inner'));
    }

    // update products carousel
    const $storeCarousel = $('.nk-carousel-1, .nk-carousel-1, .nk-carousel-2, .nk-carousel-3').filter('.nk-store:not(.nk-store-carousel-enabled)').addClass('.nk-store-carousel-enabled');
    function updateStoreProducts() {
        $storeCarousel.each(function () {
            let currentTallest = 0;
            let currentRowStart = 0;
            const rowDivs = [];
            let topPosition = 0;
            let currentDiv = 0;
            let $el;
            $(this).find('.nk-product').each(function () {
                $el = $(this);
                $el.css('height', '');
                topPosition = $el.position().top;

                if (currentRowStart !== topPosition) {
                    for (currentDiv = 0; currentDiv < rowDivs.length; currentDiv++) {
                        rowDivs[currentDiv].css('height', currentTallest);
                    }
                    rowDivs.length = 0; // empty the array
                    currentRowStart = topPosition;
                    currentTallest = $el.innerHeight();
                    rowDivs.push($el);
                } else {
                    rowDivs.push($el);
                    currentTallest = currentTallest < $el.innerHeight() ? $el.innerHeight() : currentTallest;
                }
                for (currentDiv = 0; currentDiv < rowDivs.length; currentDiv++) {
                    rowDivs[currentDiv].css('height', currentTallest);
                }
            });
        });
    }
    if ($storeCarousel.length) {
        $storeCarousel.children('.nk-carousel-inner').on('imagesLoadedTimeout.flickity', () => {
            // fix items height when images loaded
            setHeightCarousel3();
        });
        self.debounceResize(updateStoreProducts);
        updateStoreProducts();
    }

    // Carousel Parallax
    // thanks to https://github.com/metafizzy/flickity/issues/468#issuecomment-309120518
    $('.nk-carousel, .nk-carousel-2, .nk-carousel-3').filter('[data-parallax="true"]').each(function () {
        const $carousel = $(this).find('.flickity-enabled');
        const flkty = $carousel.data('flickity');
        const $imgs = $carousel.find('.flickity-slider > div .nk-carousel-parallax-img');
        $carousel.on('scroll.flickity', () => {
            flkty.slides.forEach((slide, i) => {
                const img = $imgs[i];
                let x = 0;

                if (i === 0) {
                    x = Math.abs(flkty.x) > flkty.slidesWidth ? (flkty.slidesWidth + flkty.x + flkty.slides[flkty.slides.length - 1].outerWidth + slide.target) : (slide.target + flkty.x);
                } else if (i === flkty.slides.length - 1) {
                    x = Math.abs(flkty.x) + flkty.slides[i].outerWidth < flkty.slidesWidth ? (slide.target - flkty.slidesWidth + flkty.x - flkty.slides[i].outerWidth) : (slide.target + flkty.x);
                } else {
                    x = slide.target + flkty.x;
                }
                $(img).css('transform', `translateX(${x * (-1 / 5)}px)`);
            });
        });
    });

    // Add numbers inside dots
    $('.nk-carousel-dots-3').each(() => {
        let count = 0;
        $('.flickity-page-dots .dot').each(function () {
            count++;
            $(this).append((count < 10 ? '0' : '') + count);
        });
    });

    // Set position to arrows when aligner to the bottom and enabled dots
    function correctBottomArrows(item) {
        const $this = $(item);
        const carouselOffset = $this.offset();
        const $dots = $this.find('.flickity-page-dots .dot');
        const $arrPrev = $this.find('.nk-flickity-arrow-prev');
        const $arrNext = $this.find('.nk-flickity-arrow-next');

        // calculate position for the prev and next arrows
        let prevPosX = false;
        let nextPosX = false;
        let posY = $dots.offset().top;
        $dots.each(function () {
            const $dot = $(this);
            const dotOffset = $dot.offset();

            if (prevPosX === false || prevPosX > dotOffset.left) {
                prevPosX = dotOffset.left;
            }
            if (nextPosX === false || nextPosX < dotOffset.left) {
                nextPosX = dotOffset.left;
            }
        });
        prevPosX -= carouselOffset.left;
        nextPosX -= carouselOffset.left;
        posY -= carouselOffset.top;

        $arrPrev.css({
            top: posY,
            left: prevPosX,
            right: 'auto',
            bottom: 'auto',
        });
        $arrNext.css({
            top: posY,
            left: nextPosX,
            right: 'auto',
            bottom: 'auto',
        });
    }
    let resizeTimeout;
    $wnd.on('ready load resize', () => {
        $('[data-arrows="true"][data-dots="true"].nk-carousel-arrows-bottom-center .flickity-enabled').each(function () {
            correctBottomArrows(this);

            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                correctBottomArrows(this);
            }, 155); // flickity have debounce with 150ms
        });
    });
}

export { initPluginFlickity };
