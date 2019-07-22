import { $ } from './_utility';

/*------------------------------------------------------------------

  Shortcuts
  https://github.com/madrobby/keymaster

-------------------------------------------------------------------*/
function key(name, fn) {
    if (typeof window.key === 'undefined') {
        return;
    }
    name = this.options && this.options.shortcuts && this.options.shortcuts[name];

    if (name) {
        window.key(name, fn);
    }
}
function initShortcuts() {
    if (typeof window.key === 'undefined' || !this.options.enableShortcuts) {
        return;
    }

    const self = this;

    // FullScreen Video
    self.key('closeFullscreenVideo', () => {
        if (self.closeFullScreenVideo) {
            self.closeFullScreenVideo();
        }
    });

    // post single
    self.key('postScrollToComments', () => {
        const $comments = $('#comments');
        if ($comments.length) {
            self.scrollTo($comments);
        }
    });

    // Side Left Navbar
    const $leftSide = $('.nk-navbar-left-side');
    self.key('toggleSideLeftNavbar', () => {
        self.toggleSide($leftSide);
    });
    self.key('openSideLeftNavbar', () => {
        self.openSide($leftSide);
    });
    self.key('closeSideLeftNavbar', () => {
        self.closeSide($leftSide);
    });

    // Side Right Navbar
    const $rightSide = $('.nk-navbar-right-side');
    self.key('toggleSideRightNavbar', () => {
        self.toggleSide($rightSide);
    });
    self.key('openSideRightNavbar', () => {
        self.openSide($rightSide);
    });
    self.key('closeSideRightNavbar', () => {
        self.closeSide($rightSide);
    });

    // Fullscreen Navbar
    self.key('toggleFullscreenNavbar', () => {
        self.toggleFullscreenNavbar();
    });
    self.key('openFullscreenNavbar', () => {
        self.openFullscreenNavbar();
    });
    self.key('closeFullscreenNavbar', () => {
        self.closeFullscreenNavbar();
    });

    // Left Navbar
    self.key('toggleLeftNavbar', () => {
        self.toggleLeftNavbar();
    });
    self.key('openLeftNavbar', () => {
        self.openLeftNavbar();
    });
    self.key('closeLeftNavbar', () => {
        self.closeLeftNavbar();
    });

    // ESC - use also inside form elements
    window.key.filter = (event) => {
        const { tagName } = (event.target || event.srcElement);
        const isContentEditable = (event.target || event.srcElement).getAttribute('contenteditable');
        const isESC = window.key.isPressed('esc');
        return isESC || !(isContentEditable || tagName === 'INPUT' || tagName === 'SELECT' || tagName === 'TEXTAREA');
    };
}

export { key, initShortcuts };
