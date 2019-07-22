import { $, $body, $wnd, wndW } from './_utility';

/*------------------------------------------------------------------

  Init Gmaps

-------------------------------------------------------------------*/
function initGmaps() {
    // stretch gmaps
    function stretch() {
        // column stretch
        $('.nk-gmaps-stretch').each(function () {
            const $this = $(this);
            const $row = $this.closest('.row');
            const $col = $this.closest('[class*="col-"]');
            const rectGmap = this.getBoundingClientRect();
            const rectRow = $row[0].getBoundingClientRect();
            const rectCol = $col[0].getBoundingClientRect();
            const leftGmap = rectGmap.left;
            const rightGmap = wndW - rectGmap.right;
            const leftRow = rectRow.left + (parseFloat($row.css('padding-left')) || 0);
            const rightRow = wndW - rectRow.right + (parseFloat($row.css('padding-right')) || 0);
            const leftCol = rectCol.left;
            const rightCol = wndW - rectCol.right;
            const css = {
                'margin-left': 0,
                'margin-right': 0,
            };

            const bodyLeft = parseFloat($body.css('paddingLeft'));
            const bodyRight = parseFloat($body.css('paddingRight'));

            // We need to round numbers because in some situations the same blocks have different offsets, for example
            // Row right is 68
            // Col right is 68.015625
            // I don't know why :(
            if (Math.round(leftRow) === Math.round(leftCol)) {
                const ml = parseFloat($this.css('margin-left') || 0);
                css['margin-left'] = ml - leftGmap + bodyLeft;
            }

            if (Math.round(rightRow) === Math.round(rightCol)) {
                const mr = parseFloat($this.css('margin-right') || 0);
                css['margin-right'] = mr - rightGmap + bodyRight;
            }

            $this.css(css);
        });
    }

    stretch();
    $wnd.on('ready load resize orientationchange', () => {
        stretch();
    });
}

export { initGmaps };
