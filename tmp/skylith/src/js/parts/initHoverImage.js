import { $, wndH, $wnd } from './_utility';

/* Hover Image */
function initHoverImage() {
    const $hoverImages = $('.nk-hover-image');

    if (!$hoverImages.length) {
        return;
    }

    // change image src on links hover
    function setHoverImage($item) {
        $item.each(function () {
            const $this = $(this);
            const $hoverImage = $this.closest('.nk-hover-image');
            $hoverImage.find('.nk-hover-image-links a').removeClass('active');
            $this.addClass('active');

            const $img = $hoverImage.find('.nk-hover-image-img:not(.hide):eq(0)');
            const $clonedImg = $img.clone();

            $img.after($clonedImg);

            $img.attr('src', $this.attr('data-hover-image'));

            // Trigger a reflow, flushing the CSS changes. This need to place new element in dom and show it, then add opacity 0 with transition.
            // Info here - https://stackoverflow.com/questions/11131875/what-is-the-cleanest-way-to-disable-css-transition-effects-temporarily
            // eslint-disable-next-line
            $clonedImg[0].offsetHeight;

            $clonedImg.addClass('hide');

            setTimeout(() => {
                $clonedImg.remove();
            }, 500);
        });
    }

    $hoverImages.on('mouseover', '.nk-hover-image-links a:not(.active)', function () {
        setHoverImage($(this));
    });
    setHoverImage($('.nk-hover-image .nk-hover-image-links a.active'));

    // sticky image
    function updateImagePosition() {
        window.requestAnimationFrame(() => {
            $hoverImages.each(function () {
                const $this = $(this);
                const $cont = $this.find('.nk-hover-image-img-cont');
                const $img = $cont.find('.bg-image');
                const thisRect = $this[0].getBoundingClientRect();
                let setTop = 0;
                let fixed = false;

                // if scrolled page - enable sticky
                if (thisRect.top <= 0 && (wndH - thisRect.bottom) <= 0) {
                    fixed = true;

                    // scrolled down - need to stick to the parent bottom
                } else if ((wndH - thisRect.bottom) > 0) {
                    setTop = thisRect.bottom - thisRect.top - wndH;
                }

                $img.css({
                    position: fixed ? 'fixed' : '',
                    left: fixed ? $cont.offset().left : '',
                    width: fixed ? $cont.width() : '',
                    top: setTop || '',
                });
            });
        });
    }
    updateImagePosition();
    $wnd.on('ready load resize orientationchange scroll', updateImagePosition);
}

export { initHoverImage };
