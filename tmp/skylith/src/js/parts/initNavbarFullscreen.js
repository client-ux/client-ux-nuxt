import { $, $wnd, $doc } from './_utility';

/*------------------------------------------------------------------

  Init Navbar Fullscreen

-------------------------------------------------------------------*/
function initNavbarFullscreen() {
    const self = this;
    const $navbar = $('.nk-navbar-full');

    self.fullscreenNavbarIsOpened = () => $navbar.hasClass('open');

    self.toggleFullscreenNavbar = () => {
        self[self.fullscreenNavbarIsOpened() ? 'closeFullscreenNavbar' : 'openFullscreenNavbar']();
    };
    self.openFullscreenNavbar = () => {
        if (self.fullscreenNavbarIsOpened() || !$navbar.length) {
            return;
        }

        // active all togglers
        $('.nk-navbar-full-toggle').addClass('active');

        $navbar.addClass('open');

        // prevent body scrolling
        self.bodyOverflow(1);

        // trigger event
        $wnd.trigger('nk-open-full-navbar', [$navbar]);
    };

    self.closeFullscreenNavbar = () => {
        if (!self.fullscreenNavbarIsOpened() || !$navbar.length) {
            return;
        }

        // deactive all togglers
        $('.nk-navbar-full-toggle').removeClass('active');

        // open navbar block
        $navbar.removeClass('open');

        // restore body scrolling after a small delay
        setTimeout(() => {
            if (!self.fullscreenNavbarIsOpened()) {
                self.bodyOverflow(0);
            }
        }, 150);

        // trigger event
        $wnd.trigger('nk-close-full-navbar', [$navbar]);
    };

    $doc.on('click', '.nk-navbar-full-toggle', (e) => {
        self.toggleFullscreenNavbar();
        e.preventDefault();
    });

    $wnd.on('nk-open-share-place', self.closeFullscreenNavbar);
}

export { initNavbarFullscreen };
