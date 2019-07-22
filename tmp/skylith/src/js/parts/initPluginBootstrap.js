import { $, $wnd } from './_utility';

/* Bootstrap */
function initPluginBootstrap() {
    const self = this;

    // Tabs
    $wnd.on('shown.bs.tab', () => {
        self.debounceResize();
    });

    // Tooltips
    $('[data-toggle="tooltip"]').tooltip();
}

export { initPluginBootstrap };
