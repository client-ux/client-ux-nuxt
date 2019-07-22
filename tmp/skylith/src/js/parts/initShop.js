import { $, tween, debounceResize } from './_utility';

/* Shop */
function initShop() {
    const self = this;
    const $header = $('.nk-shop-header');
    const $products = $('.nk-shop-products');

    // saved layout size.
    let layoutSize = localStorage.getItem('skylith-shop-layout-size');
    if (!layoutSize) {
        if ($products.hasClass('nk-shop-products-1-col')) {
            layoutSize = 1;
        } else if ($products.hasClass('nk-shop-products-2-col')) {
            layoutSize = 2;
        } else if ($products.hasClass('nk-shop-products-4-col')) {
            layoutSize = 4;
        } else {
            layoutSize = 3;
        }
    }

    function updateLayoutClass(size = 3) {
        size = parseInt(size, 10) || 3;

        $('.nk-shop-layout-toggle').removeClass('active')
            .filter(`[data-cols="${size}"]`).addClass('active');

        $products.removeClass('nk-shop-products-1-col nk-shop-products-2-col nk-shop-products-3-col nk-shop-products-4-col').addClass(`nk-shop-products-${size}-col`);

        localStorage.setItem('skylith-shop-layout-size', size);
    }

    if ($products.length) {
        updateLayoutClass(layoutSize);

        // on layout toggle click.
        $header.on('click', '.nk-shop-layout-toggle:not(.active)', function (e) {
            e.preventDefault();
            const $this = $(this);
            updateLayoutClass($this.attr('data-cols'));
        });
    }

    // filter toggle
    const $filter = $('.nk-shop-filter');

    function toggleFilter() {
        const active = $filter.hasClass('active');

        tween.set($filter, {
            display: 'block',
            height: 'auto',
            marginBottom: '',
            paddingTop: '',
            paddingBottom: '',
        });
        tween.set($filter, {
            height: $filter.outerHeight(),
        });
        if (active) {
            tween.to($filter, 0.3, {
                display: 'none',
                height: 0,
                paddingTop: 0,
                paddingBottom: 0,
                marginBottom: 0,
                ease: Power1.easeInOut,
                onComplete() {
                    $filter.removeAttr('style');
                    debounceResize();
                },
            });

            $filter.removeClass('active');
            $('.nk-shop-filter-toggle').removeClass('active');
        } else {
            tween.from($filter, 0.3, {
                height: 0,
                paddingTop: 0,
                paddingBottom: 0,
                marginBottom: 0,
                ease: Power1.easeInOut,
                onComplete() {
                    $filter.removeAttr('style');
                    debounceResize();
                },
            });

            $filter.addClass('active');
            $('.nk-shop-filter-toggle').addClass('active');
        }
    }

    if ($filter.length) {
        $header.on('click', '.nk-shop-filter-toggle', (e) => {
            e.preventDefault();
            toggleFilter();
        });
    }

    // Cart toggle
    const $cart = $('.nk-shop-cart');

    if ($cart.length) {
        $header.on('click', '.nk-shop-cart-toggle', (e) => {
            e.preventDefault();
            $cart.toggleClass('active');
        });
        $('.nk-shop-cart-close').on('click', (e) => {
            e.preventDefault();
            $cart.toggleClass('active');
        });
        $cart.on('click', function (e) {
            if (e.target === this) {
                e.stopPropagation();
                $cart.toggleClass('active');
            }
        });
    }


    // scroll to ratings
    $('a.nk-product-rating').on('click', function (e) {
        const isHash = this.hash;
        if (isHash) {
            const $hashBlock = $(isHash).closest('.nk-tabs');
            if ($hashBlock.length) {
                self.scrollTo($hashBlock);
            }
            $('.nk-tabs').find(`[data-toggle="tab"][href="${isHash}"]`).click();
        }
        e.preventDefault();
    });

    // carousel for products
    $('.nk-product-carousel').each(function () {
        const $carousel = $(this).find('.nk-carousel-inner');
        const $thumbs = $(this).find('.nk-product-carousel-thumbs');
        const $thumbsCont = $thumbs.children();
        let curY = 0;
        let thumbsH = 0;
        let thumbsContH = 0;
        let thumbsBusy = false;

        function updateValues() {
            if ($thumbsCont[0]._gsTransform && $thumbsCont[0]._gsTransform.y) {
                curY = $thumbsCont[0]._gsTransform.y;
            } else {
                curY = 0;
            }
            thumbsH = $thumbs.height();
            thumbsContH = $thumbsCont.height();
        }

        $thumbsCont.on('click', '> div', function () {
            if (thumbsBusy) {
                return;
            }

            const index = $(this).index();
            $carousel.flickity('select', index);
        });

        $carousel.on('select.flickity', () => {
            const api = $carousel.data('flickity');
            if (!api) {
                return;
            }
            // set selected nav cell
            const $selected = $thumbsCont.children().removeClass('active').eq(api.selectedIndex).addClass('active');

            // scroll nav
            updateValues();
            const selectedTop = $selected.position().top + curY;
            if (selectedTop < 0) {
                tween.to($thumbsCont, 0.2, {
                    y: curY - selectedTop,
                });
            } else {
                const selectedH = $selected.outerHeight(true);
                if (selectedTop + selectedH > thumbsH) {
                    tween.to($thumbsCont, 0.2, {
                        y: curY - (selectedTop + selectedH - thumbsH),
                    });
                }
            }
        });

        let startY = false;
        const mc = new Hammer.Manager($thumbs[0]);
        mc.add(new Hammer.Pan({
            pointers: 1,
            threshold: 0,
        }));
        mc.on('pan press', (e) => {
            e.preventDefault();

            // init
            if (startY === false) {
                updateValues();
                startY = curY;
            }

            // move
            thumbsBusy = true;
            if (thumbsContH > thumbsH) {
                curY = Math.min(0, Math.max(e.deltaY + startY, thumbsH - thumbsContH));
                tween.set($thumbsCont, {
                    y: curY,
                });
            }
            if (e.isFinal) {
                startY = false;

                setTimeout(() => {
                    thumbsBusy = false;
                }, 0);
            }
        });
    });
}

export { initShop };
