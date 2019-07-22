import { $, $wnd, tween } from './_utility';

/*------------------------------------------------------------------

  Init Fullpage

-------------------------------------------------------------------*/
function initFullPage() {
    const $fullPage = $('.nk-fullpage:eq(0)');
    const $eachItems = $fullPage.find('.nk-fullpage-item');
    const $topNavbar = $('.nk-navbar-top');
    if (!$fullPage.length || !$eachItems.length) {
        return;
    }

    // hide footer
    $('.nk-footer').hide();

    $('html').css('overflow', 'hidden');
    $('.nk-main').css('overflow', 'visible');
    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 10);

    // parse slides
    const slides = [];
    $eachItems.each(function () {
        const $this = $(this);
        slides.push({
            $item: $this,
            $viewBtn: $this.find('.nk-fullpage-view-button').html(),
            $content: $this.find('.nk-fullpage-content').html(),
            img: $this.find('.nk-fullpage-image').attr('src') || '',
            letter: $this.attr('data-letter') || '',
            number: $this.attr('data-number') || '',
            bgDark: $this.hasClass('nk-fullpage-item-bg-dark'),
        });
    });

    // image blocks
    const $image1 = $('<div class="nk-fullpage-bg-image">').appendTo($fullPage);
    const $image2 = $('<div class="nk-fullpage-bg-image">').appendTo($fullPage);

    // content
    const $content = $('<div class="nk-fullpage-content">');
    const $content2 = $('<div class="nk-fullpage-content">');
    const $contentButton = $('<div class="nk-fullpage-view-button">');
    $fullPage.append($content);
    $fullPage.append($content2);
    $fullPage.append($contentButton);

    // bullet navigation
    let $bullets = '<ul class="nk-fullpage-nav active">';
    for (let k = 0; k < slides.length; k++) {
        $bullets += `<li>${slides[k].letter}</li>`;
    }
    $bullets += '</ul>';
    $bullets = $($bullets);
    $fullPage.append($bullets);
    const $bulletsItems = $bullets.children('li');

    // numbers
    const $numbers = $('<div class="nk-fullpage-number">');
    const $numbers2 = $('<div class="nk-fullpage-number">');
    $fullPage.append($numbers);
    $fullPage.append($numbers2);

    let isBusy = 0;
    let curIndex = 0;

    // show new slide
    // effect: fade, up, down
    function slideShow(index, effect = 'fade', force) {
        if (typeof slides[index] !== 'undefined' && curIndex !== index && !isBusy || force) {
            isBusy = 1;

            // animate image background
            switch (effect) {
            case 'up':
            case 'down':
                tween.set($image2, {
                    y: effect === 'down' ? '100%' : '-100%',
                    scale: 1.1,
                    display: 'block',
                });
                $image2.css('background-image', `url("${slides[index].img}")`);
                tween.to($image2, 0.5, {
                    y: '0%',
                    scale: 1,
                    force3D: true,
                    ease: Power1.easeInOut,
                    onComplete() {
                        $image2.css('background-image', '');
                        tween.set($image2, {
                            display: 'none',
                            clearProps: 'transform',
                        });
                    },
                });
                tween.to($image1, 0.5, {
                    opacity: 0,
                    scale: 0.9,
                    force3D: true,
                    ease: Power1.easeInOut,
                    onComplete() {
                        $image1.css('background-image', `url("${slides[index].img}")`);
                        tween.set($image1, {
                            opacity: 1,
                            clearProps: 'transform',
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
                tween.to($image2, 0.5, {
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

            // activate bullet
            $bulletsItems.removeClass('active');
            $bulletsItems.eq(index).addClass('active');

            // show slide number
            tween.set($numbers2, {
                opacity: 0,
                y: 0,
                display: 'block',
            });
            $numbers2.html(slides[index].number);
            tween.to($numbers, 0.5, {
                opacity: 0,
                y: -50,
                force3D: true,
            });
            tween.to($numbers2, 0.5, {
                opacity: 1,
                y: 0,
                force3D: true,
                delay: 0.1,
                onComplete() {
                    $numbers.html(slides[index].number);
                    tween.set($numbers, {
                        opacity: 1,
                        y: 0,
                    });
                    tween.set($numbers2, {
                        display: 'none',
                    });
                },
            });

            // set new content
            tween.set($content2, {
                opacity: 0,
                y: effect === 'down' ? 100 : -100,
                scale: 0.9,
                display: 'flex',
            });
            $content2.html(slides[index].$content);
            tween.to($content, 0.5, {
                opacity: 0,
                y: effect === 'down' ? -100 : 100,
                scale: 0.9,
                force3D: true,
                onComplete() {
                    // change navbar color
                    if ($topNavbar.hasClass('nk-navbar-transparent')) {
                        $topNavbar[slides[index].bgDark ? 'addClass' : 'removeClass']('nk-navbar-dark');
                    }
                },
            });
            tween.to($content2, 0.5, {
                opacity: 1,
                y: 0,
                scale: 1,
                force3D: true,
                delay: 0.4,
                onComplete() {
                    $content.html(slides[index].$content);
                    tween.set($content, {
                        opacity: 1,
                        clearProps: 'transform',
                    });
                    tween.set($content2, {
                        display: 'none',
                    });
                },
            });

            // set new button
            $contentButton.html(slides[index].$viewBtn);

            curIndex = index;
        }
    }
    slideShow(curIndex, 'fade', 1);
    $bullets.on('click', '> li', function () {
        const index = $(this).index();
        if (index > curIndex) {
            slideShow(index, 'down');
        } else if (index < curIndex) {
            slideShow(index, 'up');
        }
    });

    // show next / previous slider
    function slideShowNext() {
        if (curIndex !== slides.length - 1) {
            slideShow(curIndex + 1, 'down');
        }
    }
    function slideShowPrev() {
        if (curIndex !== 0) {
            slideShow(curIndex - 1, 'up');
        }
    }

    // next button click
    $('.nk-fullpage').on('click', '.nk-fullpage-scroll-down', (e) => {
        e.preventDefault();
        slideShowNext();
    });

    const wheelEvent = 'onwheel' in document ? 'wheel' : 'mousewheel';
    if (wheelEvent) {
        // mouse wheel scroll
        let timeout;
        let isStopped = true;
        $wnd.on(wheelEvent, (e) => {
            // check if delta >= 2 and mouse under slider
            if (Math.abs(e.originalEvent.deltaY) < 2 || !$(e.target).parents('.nk-fullpage').length) {
                return;
            }

            // we need to check acceleration because of mac os smooth scroll.
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                isStopped = true;
            }, 100);

            if (!isStopped) {
                return;
            }
            isStopped = false;

            if (e.originalEvent.deltaY > 0) {
                slideShowNext();
            } else if (e.originalEvent.deltaY < 0) {
                slideShowPrev();
            }
        });
    }

    // touch swipe
    let touchStart = 0;
    let touchDelta = 0;
    $wnd.on('touchstart', (e) => {
        touchStart = e.originalEvent.touches[0].screenY;
        touchDelta = 0;
    });
    $wnd.on('touchmove touchend', (e) => {
        const y = e.originalEvent.touches && e.originalEvent.touches.length ? e.originalEvent.touches[0].screenY : false;
        touchDelta = y === false ? touchDelta : touchStart - y;

        // check if delta >= 2 and mouse under slider
        if (Math.abs(touchDelta) < 2 || !$(e.target).parents('.nk-fullpage').length) {
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
}

export { initFullPage };
