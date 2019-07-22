import { $, $doc, $body, tween, $wnd } from './_utility';

/*------------------------------------------------------------------

  Init Navbar

-------------------------------------------------------------------*/
function initNavbar() {
    const self = this;
    const $navbarTop = $('.nk-navbar-top');

    // add mobile navbar
    const $mobileNavItems = $('[data-nav-mobile]');
    if ($mobileNavItems.length) {
        $mobileNavItems.each(function () {
            const $nav = $($(this).html());
            const $mobileNav = $($(this).attr('data-nav-mobile'));

            // insert into mobile nav
            $mobileNav.find('.nk-navbar-mobile-content > ul.nk-nav').append($nav);
        });

        const $nav = $('.nk-navbar-mobile-content > ul.nk-nav');

        // remove background images
        $nav.find('.bg-image, .bg-video').remove();

        // remove mega menus
        $nav.find('.nk-mega-item > .dropdown').each(function () {
            const $drop = $(this).children('ul').addClass('dropdown');

            // fix mega menu columns
            $drop.find('> li > ul').each(function () {
                const $this = $(this);
                const $parent = $this.parent();
                const $label = $this.prev('label');

                // if label exists - make dropdown
                if ($label.length) {
                    $this.addClass('dropdown');
                    $parent.addClass('nk-drop-item');
                    $label.replaceWith($('<a href="#"></a>').html($label.html()));
                } else {
                    $this.children('li').each(function () {
                        $parent.before($(this));
                    });
                    $parent.remove();
                }
            });

            $(this).replaceWith($drop);
        });
        $nav.find('.nk-mega-item').removeClass('nk-mega-item');
    }

    // collapsed navbar
    const $navCollapsed = $navbarTop.find('.nk-nav-collapsed');
    const $navCollapsedToggle = $('.nk-navbar-collapsed-toggle');
    $navCollapsedToggle.on('click', (e) => {
        e.preventDefault();
        if ($navCollapsed.hasClass('showed')) {
            tween.staggerTo($navCollapsed.children(), 0.2, {
                y: -10,
                opacity: 0,
            }, 0.04, () => {
                tween.set($navCollapsed.children(), {
                    visibility: 'hidden',
                });
            });
            $navCollapsedToggle.removeClass('active');
        } else {
            tween.set($navCollapsed.children(), {
                y: -10,
                opacity: 0,
                visibility: 'visible',
            });
            tween.staggerTo($navCollapsed.children(), 0.2, {
                y: 0,
                opacity: 1,
            }, 0.04);
            $navCollapsedToggle.addClass('active');
        }
        $navCollapsed.toggleClass('showed');
    });

    // sticky navbar
    const navbarTop = $navbarTop.length ? $navbarTop.offset().top : 0;
    // fake hidden navbar to prevent page jumping on stick
    const $navbarFake = $('<div>').hide();
    function onScrollNav() {
        const stickyOn = $wnd.scrollTop() >= navbarTop;

        if (stickyOn) {
            $navbarTop.addClass('nk-navbar-fixed');
            $navbarFake.show();
        } else {
            $navbarTop.removeClass('nk-navbar-fixed');
            $navbarFake.hide();
        }
    }
    if ($navbarTop.hasClass('nk-navbar-sticky')) {
        $wnd.on('scroll resize', onScrollNav);
        onScrollNav();

        $navbarTop.after($navbarFake);
        self.debounceResize(() => {
            $navbarFake.height($navbarTop.innerHeight());
        });
    }

    // correct dropdown position
    function correctDropdown($item) {
        if ($item.parent().is('.nk-nav')) {
            const $dropdown = $item.children('.dropdown');
            const $parent = $item.parents('.nk-navbar:eq(0)');
            let $parentContainer = $parent.children('.container');
            $parentContainer = $parentContainer.length ? $parentContainer : $parent;

            // fix right value when sub menu is not hidden
            const css = {
                marginLeft: '',
                marginRight: '',
                marginTop: 0,
            };

            $dropdown.css(css);

            let rect = $dropdown[0].getBoundingClientRect();
            const rectContainer = $parentContainer[0].getBoundingClientRect();
            const itemRect = $item[0].getBoundingClientRect();

            // move dropdown from right corner (right corner will check in nav container)
            if (rect.right > rectContainer.right) {
                css.marginLeft = rectContainer.right - rect.right;
                $dropdown.css(css);
                rect = $dropdown[0].getBoundingClientRect();
            }

            // move dropdown from left corner
            if (rect.left < 0) {
                css.marginLeft = -rect.left;
                $dropdown.css(css);
                rect = $dropdown[0].getBoundingClientRect();
            }

            // check if dropdown not under item
            const currentLeftPost = rect.left + (css.marginLeft || 0);
            if (currentLeftPost > itemRect.left) {
                css.marginLeft = (css.marginLeft || 0) - (currentLeftPost - itemRect.left);
            }

            // correct top position
            // 10 - transform value
            css.marginTop = $parent.innerHeight() - $dropdown.offset().top + $parent.offset().top + 10;

            $dropdown.css(css);
        }
    }
    $navbarTop.on('mouseenter', 'li.nk-drop-item', function () {
        correctDropdown($(this));
    });

    // correct on page load.
    $navbarTop.find('li.nk-drop-item').each(function () {
        correctDropdown($(this));
    });

    // hide / show
    // add / remove solid color
    const $autohideNav = $navbarTop.filter('.nk-navbar-autohide');
    self.throttleScroll((type, scroll) => {
        const start = 400;
        const hideClass = 'nk-onscroll-hide';
        const showClass = 'nk-onscroll-show';

        // hide / show
        if (type === 'down' && scroll > start) {
            $autohideNav.removeClass(showClass).addClass(hideClass);
        } else if (type === 'up' || type === 'end' || type === 'start') {
            $autohideNav.removeClass(hideClass).addClass(showClass);
        }

        // add solid color
        if ($navbarTop.hasClass('nk-navbar-transparent') && $navbarTop.hasClass('nk-navbar-sticky')) {
            $navbarTop[`${scroll > 70 ? 'add' : 'remove'}Class`]('nk-navbar-solid');
        }
    });


    // left navbar
    const $navbarLeft = $('.nk-navbar-left');
    let isOpenedLeft;
    const $overlay = $('<div class="nk-navbar-overlay">').appendTo($body);

    self.fullscreenNavbarIsOpened = () => isOpenedLeft;

    self.toggleLeftNavbar = () => {
        self[isOpenedLeft ? 'closeLeftNavbar' : 'openLeftNavbar']();
    };
    self.openLeftNavbar = () => {
        if (isOpenedLeft || !$navbarLeft.length) {
            return;
        }
        isOpenedLeft = 1;

        // active all togglers
        $('.nk-navbar-left-toggle').addClass('active');

        // open
        $navbarLeft.addClass('open');

        // show overlay
        if ($navbarLeft.hasClass('nk-navbar-overlay-content')) {
            tween.to($overlay, 0.3, {
                opacity: 0.6,
                display: 'block',
            });
        }

        // prevent body scrolling
        self.bodyOverflow(1);

        // trigger event
        $wnd.trigger('nk-open-left-navbar', [$navbarLeft]);
    };
    self.closeLeftNavbar = (dontTouchBody) => {
        if (!isOpenedLeft || !$navbarLeft.length) {
            return;
        }
        isOpenedLeft = 0;

        // deactive all togglers
        $('.nk-navbar-left-toggle').removeClass('active');

        // open
        $navbarLeft.removeClass('open');

        // hide overlay
        if ($navbarLeft.hasClass('nk-navbar-overlay-content')) {
            tween.to($overlay, 0.3, {
                opacity: 0,
                display: 'none',
            });
        }

        // restore body scrolling
        if (!dontTouchBody) {
            self.bodyOverflow(0);
        }

        // trigger event
        $wnd.trigger('nk-close-left-navbar', [$navbarLeft]);
    };

    // overlay
    $doc.on('click', '.nk-navbar-overlay', () => {
        self.closeLeftNavbar();
    });

    $doc.on('click', '.nk-navbar-left-toggle', (e) => {
        self.toggleLeftNavbar();
        e.preventDefault();
    });

    $wnd.on('nk-open-share-place', self.closeLeftNavbar);
}

export { initNavbar };
