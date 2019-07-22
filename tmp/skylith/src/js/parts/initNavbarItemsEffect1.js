import { $ } from './_utility';

/*------------------------------------------------------------------

 Init Items Effect 1 for navbars

 -------------------------------------------------------------------*/
function initNavbarItemsEffect1() {
    $('.nk-navbar-items-effect-1 .nk-nav li > a').each(function () {
        $(this).wrapInner('<span>');
    });
}

export { initNavbarItemsEffect1 };
