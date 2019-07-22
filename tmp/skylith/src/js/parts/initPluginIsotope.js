import { $, $body, tween, debounceResize } from './_utility';

/* Isotope */
function initPluginIsotope() {
    if (typeof window.Isotope === 'undefined') {
        return;
    }
    const self = this;

    $('.nk-isotope').each(function () {
        const $this = $(this);
        const $grid = $this.isotope({
            itemSelector: '.nk-isotope-item',
        });
        $grid.imagesLoaded().progress(() => {
            $grid.isotope('layout');
        });
        $grid.on('arrangeComplete', () => {
            self.debounceResize();
        });

        // filter
        let $filter = [];
        if ($this.parent().hasClass('nk-portfolio-list')) {
            $filter = $this.parent().prev('.nk-isotope-filter');
        } else {
            $filter = $this.prev('.nk-isotope-filter');
        }
        if ($filter.length) {
            $filter.on('click', '[data-filter]', function (e) {
                e.preventDefault();
                const filter = $(this).attr('data-filter');

                $(this).addClass('active').siblings().removeClass('active');

                $grid.isotope({
                    filter: filter === '*' ? '' : `[data-filter*=${filter}]`,
                });
            });
        }
    });

    // filter toggler
    $body.on('click', '[href="#nk-toggle-filter"]:not(.busy)', function (e) {
        const $pagination = $(this).parent('.nk-pagination');
        const $filter = $pagination.next('.nk-isotope-filter');
        const isActive = $filter.hasClass('nk-isotope-filter-active');

        if (!$pagination.length || !$filter.length) {
            return;
        }

        e.preventDefault();
        e.stopPropagation();

        $pagination.addClass('busy');

        if (isActive) {
            $pagination.removeClass('nk-isotope-filter-active');
            $filter.removeClass('nk-isotope-filter-active');

            tween.to($filter.children(), 0.2, {
                opacity: 0,
            });

            tween.to($filter, 0.2, {
                height: 0,
                marginBottom: 0,
                marginTop: 0,
                force3D: true,
                delay: 0.2,
                display: 'none',
                onComplete() {
                    $pagination.removeClass('busy');
                    debounceResize();
                },
            });
        } else {
            $pagination.addClass('nk-isotope-filter-active');
            $filter.addClass('nk-isotope-filter-active');

            $filter.css('height', 'auto');
            const filterHeight = $filter.height();
            $filter.css('height', 0);
            tween.set($filter.children(), {
                y: -10,
                opacity: 0,
            });
            tween.to($filter, 0.2, {
                height: filterHeight,
                marginBottom: 30,
                marginTop: -23,
                force3D: true,
                display: 'block',
            });

            tween.staggerTo($filter.children(), 0.2, {
                y: 0,
                opacity: 1,
                delay: 0.1,
            }, 0.04, () => {
                $pagination.removeClass('busy');
                debounceResize();
            });
        }
    });
}

export { initPluginIsotope };
