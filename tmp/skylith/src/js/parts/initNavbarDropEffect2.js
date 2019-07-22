import { $, tween } from './_utility';

/*------------------------------------------------------------------

 Init Dropdown Effect 2 for side navbars and fullscreen

 -------------------------------------------------------------------*/
function initNavbarDropEffect2() {
    const self = this;
    const $navbars = $('.nk-navbar-drop-effect-2');

    // open / close submenu
    function toggleSubmenu($dropdown) {
        const $nav = $dropdown.closest('.nk-navbar');
        const height = $dropdown.innerHeight();

        // close sibling navigations
        const $openedSiblings = $nav.find('.dropdown.open').filter(function () {
            return !($(this).is($dropdown) || $(this).find($dropdown).length);
        });
        tween.to($openedSiblings, 0.3, {
            height: 0,
            paddingTop: 0,
            paddingBottom: 0,
            display: 'none',
            onComplete() {
                $openedSiblings.attr('style', '');
                $openedSiblings.removeClass('open');
            },
        });

        // show current dropdown
        $dropdown.addClass('open');
        $dropdown.css({
            display: 'block',
            height: 0,
        });

        tween.to($dropdown, 0.3, {
            height,
            onComplete() {
                $dropdown.css('height', '');
                self.initPluginNano($nav);
            },
        });
    }

    $navbars.on('click', '.nk-drop-item > a', function (e) {
        const $dropdown = $(this).next('.dropdown:not(.open)');
        if ($dropdown.length) {
            toggleSubmenu($dropdown);
            e.preventDefault();
        }
    });
}

export { initNavbarDropEffect2 };
