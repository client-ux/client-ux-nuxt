import { $ } from './_utility';

/* JustifiedGallery */
function initPluginJustifiedGallery() {
    if (typeof $.fn.justifiedGallery === 'undefined') {
        return;
    }

    $('.nk-justified-gallery').each(function () {
        const $this = $(this);
        const margin = parseFloat($this.data('margins')) || 30;
        $this
            .css({
                marginLeft: -margin,
                marginRight: -margin,
                width: `calc(100% + ${margin * 2}px)`,
            })
            .justifiedGallery({
                rowHeight: $this.data('rowHeight') || 300,
                maxRowHeight: $this.data('maxRowHeight') || 400,
                lastRow: $this.data('lastRow') || 'justify',
                margins: margin,
            });
    });
}

export { initPluginJustifiedGallery };
