import { $, $wnd, tween } from './_utility';

/*------------------------------------------------------------------

 Init Slider

 -------------------------------------------------------------------*/
function initSlider() {
    const $sliders = $('.nk-slider');
    if (!$sliders.length) {
        return;
    }

    const self = this;

    // init each slider
    $sliders.each(function () {
        const $slider = $(this);
        const $eachItems = $slider.find('.nk-slider-item');

        // parse slides
        const slides = [];
        $eachItems.each(function () {
            const $this = $(this);
            slides.push({
                $item: $this,
                $content: $this.find('.nk-slider-content').html(),
                img: $this.find('.nk-slider-image').attr('src'),
                author: $this.attr('data-author'),
                title: $this.attr('data-title'),
                thumb: $this.attr('data-thumb'),
            });
        });

        // set height
        const height = $slider.attr('data-height') || 600;
        $slider.css('min-height', height);

        // container for slider items
        const $container = $(`<div class="container${$slider.attr('data-container') === 'false' ? '-fluid' : ''}">`);
        $('<div class="nk-slider-container">').append($container).appendTo($slider);

        // image blocks
        const $image1 = $('<div class="nk-slider-bg-image">').appendTo($slider);
        const $image2 = $('<div class="nk-slider-bg-image">').appendTo($slider);

        // content
        const $content = $('<div class="nk-slider-content">').append('<div></div>').appendTo($container);
        const $content2 = $('<div class="nk-slider-content">').append('<div></div>').appendTo($container);

        // content centering
        const contentCentering = $slider.attr('data-content-centering') || 'bottom';
        $content.addClass(`nk-slider-content-${contentCentering}`);
        $content2.addClass(`nk-slider-content-${contentCentering}`);

        let isBusy = 0;
        let curIndex = 0;

        // autoplay
        const enableAutoplay = $slider.attr('data-autoplay');
        let autoplayTimeout;
        function runAutoplay() {
            clearTimeout(autoplayTimeout);
            if (enableAutoplay) {
                autoplayTimeout = setTimeout(() => {
                    // eslint-disable-next-line
                    slideShowNext();
                }, Math.max(parseInt(enableAutoplay, 10), 1000));
            }
        }

        // author name
        const showAuthor = $slider.attr('data-show-author') === 'true';
        const $author = showAuthor ? $('<div class="nk-slider-author">').appendTo($container) : false;
        function updateAuthor() {
            if (showAuthor && $author) {
                let text = '';
                if (typeof slides[curIndex] !== 'undefined' && slides[curIndex].author) {
                    text = self.options.templates.sliderAuthor.replace('{{name}}', slides[curIndex].author);
                }
                $author.html(text);
            }
        }

        // slide number
        const showSlideNumbers = $slider.attr('data-show-slide-numbers') === 'true';
        const $slideNumbers = showSlideNumbers ? $('<div class="nk-slider-numbers">').appendTo($container) : false;
        function updateSlideNumbers() {
            if (showSlideNumbers && $slideNumbers) {
                $slideNumbers.html(`${(curIndex < 9 ? '0' : '') + (curIndex + 1)} / ${slides.length < 10 ? '0' : ''}${slides.length}`);
            }
        }

        // navigation
        let $rightNav;
        if ($slider.attr('data-show-nav') === 'true') {
            $rightNav = '<ul class="nk-slider-nav">';
            for (let k = 0; k < slides.length; k++) {
                $rightNav += `<li>${k < 9 ? '0' : ''}${k + 1}</li>`;
            }
            $rightNav += '</ul>';
            $rightNav = $($rightNav);
            $container.append($rightNav);

            $rightNav.on('click', 'li:not(.active)', function () {
                const idx = $(this).index();
                let direction = 'right';

                if (idx > curIndex) {
                    direction = 'left';
                }

                // eslint-disable-next-line
                slideShow(idx, direction);
            });
        }
        function updateNavNumbers() {
            if ($rightNav && $rightNav.length) {
                $rightNav.children('li').removeClass('active')
                    .eq(curIndex).addClass('active');
            }
        }

        // bullets
        let $bullets;
        if ($slider.attr('data-show-bullets') === 'true') {
            $bullets = '<ul class="nk-slider-bullets">';
            for (let k = 0; k < slides.length; k++) {
                $bullets += `<li>${k < 9 ? '0' : ''}${k + 1}</li>`;
            }
            $bullets += '</ul>';
            $bullets = $($bullets);
            $container.append($bullets);

            $bullets.on('click', 'li:not(.active)', function () {
                const idx = $(this).index();
                let direction = 'right';

                if (idx > curIndex) {
                    direction = 'left';
                }

                // eslint-disable-next-line
                slideShow(idx, direction);
            });
        }
        function updateBullets() {
            if ($bullets && $bullets.length) {
                $bullets.children('li').removeClass('active')
                    .eq(curIndex).addClass('active');
            }
        }

        // thumbs
        let $thumbs;
        let $thumbsCont;
        let thumbsCurX = 0;
        let thumbsW = 0;
        let thumbsContW = 0;
        let thumbsBusy = false;
        function updateThumbs() {
            if ($thumbsCont && $thumbsCont.length) {
                $thumbsCont.children('li').removeClass('active')
                    .eq(curIndex).addClass('active');

                if ($thumbsCont[0]._gsTransform && $thumbsCont[0]._gsTransform.x) {
                    thumbsCurX = $thumbsCont[0]._gsTransform.x;
                } else {
                    thumbsCurX = 0;
                }
                thumbsW = $thumbs.width();
                thumbsContW = $thumbsCont.width();
            }
        }
        function scrollThumbs() {
            if ($thumbs && $thumbs.length) {
                const $selected = $thumbsCont.children('li').eq(curIndex);
                const selectedLeft = $selected.position().left;
                if (selectedLeft < 0) {
                    tween.to($thumbsCont, 0.2, {
                        x: thumbsCurX - selectedLeft,
                    });
                } else {
                    const selectedW = $selected.outerWidth(true);
                    if (selectedLeft + selectedW > thumbsW) {
                        tween.to($thumbsCont, 0.2, {
                            x: thumbsCurX - (selectedLeft + selectedW - thumbsW),
                        });
                    }
                }
            }
        }
        if ($slider.attr('data-show-thumbs') === 'true') {
            $thumbs = '<div class="nk-slider-thumbs"><ul>';
            for (let k = 0; k < slides.length; k++) {
                $thumbs += `<li><img src="${slides[k].thumb}" alt=""></li>`;
            }
            $thumbs += '</ul></div>';
            $thumbs = $($thumbs);
            $thumbsCont = $thumbs.children();
            $container.append($thumbs);

            $thumbsCont.on('click', 'li:not(.active)', function () {
                if (thumbsBusy) {
                    return;
                }

                const idx = $(this).index();
                let direction = 'right';

                if (idx > curIndex) {
                    direction = 'left';
                }

                // eslint-disable-next-line
                slideShow(idx, direction);

                scrollThumbs();
            });

            // swipe
            let thumbsStartX = false;
            const mc = new Hammer.Manager($thumbs[0]);
            mc.add(new Hammer.Pan({
                pointers: 1,
                threshold: 0,
            }));
            mc.on('pan press', (e) => {
                e.preventDefault();

                // init
                if (thumbsStartX === false) {
                    updateThumbs();
                    thumbsStartX = thumbsCurX;
                }

                // move
                thumbsBusy = true;
                if (thumbsContW > thumbsW) {
                    thumbsCurX = Math.min(0, Math.max(e.deltaX + thumbsStartX, thumbsW - thumbsContW));
                    tween.set($thumbsCont, {
                        x: thumbsCurX,
                    });
                }
                if (e.isFinal) {
                    thumbsStartX = false;

                    setTimeout(() => {
                        thumbsBusy = false;
                    }, 0);
                }
            });
        }

        // show new slide
        // effect: fade, up, down
        function slideShow(index, effect = 'fade', force) {
            if (typeof slides[index] !== 'undefined' && curIndex !== index && !isBusy || force) {
                isBusy = 1;

                // animate image background
                switch (effect) {
                case 'left':
                case 'right':
                    tween.set($image2, {
                        x: effect === 'left' ? '100%' : '-100%',
                        display: 'block',
                    });
                    $image2.css('background-image', `url("${slides[index].img}")`);
                    tween.to($image2, 0.8, {
                        x: '0%',
                        force3D: true,
                        ease: Power1.easeInOut,
                    });
                    tween.to($image1, 0.8, {
                        opacity: 0,
                        scale: 0.9,
                        force3D: true,
                        ease: Power1.easeInOut,
                        onComplete() {
                            $image1.css('background-image', `url("${slides[index].img}")`);
                            tween.set($image1, {
                                scale: 1,
                                opacity: 1,
                            });
                            $image2.css('background-image', '');
                            tween.set($image2, {
                                display: 'none',
                            });
                            isBusy = 0;
                        },
                    });
                    break;
                default: // fade
                    tween.set($image2, {
                        opacity: 0,
                        display: 'block',
                    });
                    $image2.css('background-image', `url("${slides[index].img}")`);
                    tween.to($image2, 0.8, {
                        opacity: 1,
                        force3D: true,
                        onComplete() {
                            $image1.css('background-image', `url("${slides[index].img}")`);
                            $image2.css('background-image', '');
                            tween.set($image2, {
                                display: 'none',
                            });
                            isBusy = 0;
                        },
                    });
                    break;
                }

                // set new content
                tween.set($content2, {
                    opacity: 0,
                    y: effect === 'left' ? 100 : -100,
                    display: 'flex',
                });

                $content2.children().html(slides[index].$content);

                tween.to($content, 0.5, {
                    opacity: 0,
                    y: effect === 'left' ? -100 : 100,
                    force3D: true,
                });
                tween.to($content2, 0.5, {
                    opacity: 1,
                    y: 0,
                    force3D: true,
                    delay: 0.1,
                    onComplete() {
                        $content.children().html(slides[index].$content);

                        tween.set($content, {
                            opacity: 1,
                            clearProps: 'transform',
                        });
                        tween.set($content2, {
                            display: 'none',
                        });
                    },
                });

                curIndex = index;

                $eachItems.removeClass('nk-slider-item-current')
                    .eq(index).addClass('nk-slider-item-current');

                updateAuthor();
                updateSlideNumbers();
                updateNavNumbers();
                updateBullets();
                updateThumbs();
                scrollThumbs();
                runAutoplay();
            }
        }
        slideShow(curIndex, 'fade', 1);

        // show next / previous slider
        function slideShowNext() {
            slideShow((curIndex !== slides.length - 1) ? curIndex + 1 : 0, 'left');
        }
        function slideShowPrev() {
            slideShow(curIndex !== 0 ? curIndex - 1 : (slides.length - 1), 'right');
        }

        // create arrows
        if ($slider.attr('data-show-arrows') === 'true') {
            $('<div class="nk-slider-arrow nk-slider-arrow-prev"><span class="pe-7s-angle-left"></span></div>').appendTo($container);
            $('<div class="nk-slider-arrow nk-slider-arrow-next"><span class="pe-7s-angle-right"></span></div>').appendTo($container);
        }

        // create slideshow controls
        if ($slider.attr('data-show-slideshow-nav') === 'true') {
            $(`<div class="nk-slider-slideshow-nav">
                <div class="nk-slider-arrow nk-slider-arrow-prev"><span class="pe-7s-angle-left"></span></div>
                <div class="nk-slider-arrow nk-slider-arrow-next"><span class="pe-7s-angle-right"></span></div>
                <div class="nk-slider-fullscreen"><span class="pe-7s-expand1"></span></div>
            </div>`).appendTo($container);
        }

        // click on controls
        $slider.on('click', '.nk-slider-arrow-prev', () => {
            slideShowPrev();
        });
        $slider.on('click', '.nk-slider-arrow-next', () => {
            slideShowNext();
        });

        // touch swipe
        let touchStart = 0;
        let touchDelta = 0;
        $wnd.on('touchstart', (e) => {
            touchStart = e.originalEvent.touches[0].screenX;
            touchDelta = 0;
        });
        $wnd.on('touchmove touchend', (e) => {
            const x = e.originalEvent.touches && e.originalEvent.touches.length ? e.originalEvent.touches[0].screenX : false;
            touchDelta = x === false ? touchDelta : touchStart - x;

            // check if delta >= 2 and mouse under slider
            if (Math.abs(touchDelta) < 2 || !$(e.target).parents('.nk-slider').length) {
                return;
            }

            if (e.type === 'touchend') {
                if (touchDelta > 0) {
                    slideShowNext();
                } else if (touchDelta < 0) {
                    slideShowPrev();
                }
            }
        });
    });
}

export { initSlider };
