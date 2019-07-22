import { $, $wnd } from './_utility';

/* Stretch items */
function initStretch() {
    const $stretchItems = $('.nk-stretch, .nk-blog-isotope-wide');
    if (!$stretchItems.length) {
        return;
    }

    const $customCSS = $('<style>').appendTo('head');

    // add ID
    let uniqid = 1;
    $stretchItems.each(() => {
        if (!$stretchItems.attr('id')) {
            $stretchItems.attr('id', `nk-stretch-item-${uniqid++}`);
        }
    });

    function stretchThumbnails() {
        let styles = '';
        $stretchItems.each(function () {
            const $this = $(this);
            const rect = this.getBoundingClientRect();
            const left = rect.left;
            const right = rect.right - rect.width;
            const ml = parseFloat($this.css('margin-left') || 0);
            const mr = parseFloat($this.css('margin-right') || 0);
            if ($this.hasClass('nk-blog-isotope-wide')) {
                if (left === right) {
                    styles += `#${$this.attr('id')} .nk-post-thumb {
                        left: ${-rect.left + ml}px;
                        right: ${-rect.left + mr}px;
                        width: calc(100% + ${rect.left * 2 - ml - mr}px);
                    }`;
                }
            } else {
                styles += `#${$this.attr('id')} {
                    margin-left: ${ml - left}px;
                    margin-right: ${mr - right}px;
                }`;
            }
        });
        $customCSS.html(styles);

        // relayout isotope
        $stretchItems.closest('.nk-isotope').each(function () {
            if ($(this).data('isotope')) {
                $(this).isotope('layout');
            }
        });
    }
    stretchThumbnails();
    $wnd.on('ready load resize orientationchange', stretchThumbnails);
}

export { initStretch };
