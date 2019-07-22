
import { options } from './parts/_options';
import { debounceResize, throttleScroll, bodyOverflow, isInViewport, scrollTo } from './parts/_utility';
import { setOptions } from './parts/setOptions';
import { key, initShortcuts } from './parts/shortcuts';
import { initNavbar } from './parts/initNavbar';
import { initNavbarSide } from './parts/initNavbarSide';
import { initNavbarFullscreen } from './parts/initNavbarFullscreen';
import { initNavbarItemsEffect1 } from './parts/initNavbarItemsEffect1';
import { initNavbarDropEffect1 } from './parts/initNavbarDropEffect1';
import { initNavbarDropEffect2 } from './parts/initNavbarDropEffect2';
import { initHeaderTitle } from './parts/initHeaderTitle';
import { initCounters } from './parts/initCounters';
import { initAnchors } from './parts/initAnchors';
import { initVideoBlocks } from './parts/initVideoBlocks';
import { initFullPage } from './parts/initFullPage';
import { initHoverImage } from './parts/initHoverImage';
import { initPortfolio } from './parts/initPortfolio';
import { initShop } from './parts/initShop';
import { initStretch } from './parts/initStretch';
import { initSlider } from './parts/initSlider';
import { initForms } from './parts/initForms';
import { initTeamBlock } from './parts/initTeamBlock';
import { initGmaps } from './parts/initGmaps';
import { initInstagram } from './parts/initInstagram';
import { initTwitter } from './parts/initTwitter';

/* Plugins */
import { initPluginObjectFitImages } from './parts/initPluginObjectFitImages';
import { initPluginStickySidebar } from './parts/initPluginStickySidebar';
import { initPluginNano } from './parts/initPluginNano';
import { initPluginJarallax } from './parts/initPluginJarallax';
import { initPluginFlickity } from './parts/initPluginFlickity';
import { initPluginIsotope } from './parts/initPluginIsotope';
import { initPluginPhotoswipe } from './parts/initPluginPhotoswipe';
import { initPluginJustifiedGallery } from './parts/initPluginJustifiedGallery';
import { initPluginBootstrap } from './parts/initPluginBootstrap';

/*------------------------------------------------------------------

  Skylith Class

-------------------------------------------------------------------*/
class SKYLITH {
    constructor() {
        this.options = options;
    }

    init() {
        // prt:sc:dm

        const self = this;
        self.initNavbar();
        self.initNavbarSide();
        self.initNavbarFullscreen();
        self.initNavbarItemsEffect1();
        self.initNavbarDropEffect1();
        self.initNavbarDropEffect2();
        self.initHeaderTitle();
        self.initCounters();
        self.initAnchors();
        self.initVideoBlocks();
        self.initFullPage();
        self.initHoverImage();
        self.initPortfolio();
        self.initShop();
        self.initStretch();
        self.initSlider();
        self.initForms();
        self.initTeamBlock();
        self.initGmaps();
        self.initInstagram();
        self.initTwitter();
        self.initShortcuts();

        // init plugins
        self.initPluginObjectFitImages();
        self.initPluginStickySidebar();
        self.initPluginNano();
        self.initPluginJarallax();
        self.initPluginFlickity();
        self.initPluginIsotope();
        self.initPluginPhotoswipe();
        self.initPluginJustifiedGallery();
        self.initPluginBootstrap();

        return self;
    }
    setOptions(newOpts) {
        return setOptions.call(this, newOpts);
    }
    debounceResize(func) {
        return debounceResize.call(this, func);
    }
    throttleScroll(callback) {
        return throttleScroll.call(this, callback);
    }
    bodyOverflow(type) {
        return bodyOverflow.call(this, type);
    }
    isInViewport($item, returnRect) {
        return isInViewport.call(this, $item, returnRect);
    }
    scrollTo($to, callback) {
        return scrollTo.call(this, $to, callback);
    }
    key(name, callback) {
        return key.call(this, name, callback);
    }
    initShortcuts() {
        return initShortcuts.call(this);
    }
    initHeaderTitle() {
        return initHeaderTitle.call(this);
    }
    initNavbar() {
        return initNavbar.call(this);
    }
    initNavbarSide() {
        return initNavbarSide.call(this);
    }
    initNavbarFullscreen() {
        return initNavbarFullscreen.call(this);
    }
    initNavbarItemsEffect1() {
        return initNavbarItemsEffect1.call(this);
    }
    initNavbarDropEffect1() {
        return initNavbarDropEffect1.call(this);
    }
    initNavbarDropEffect2() {
        return initNavbarDropEffect2.call(this);
    }
    initCounters() {
        return initCounters.call(this);
    }
    initAnchors() {
        return initAnchors.call(this);
    }
    initVideoBlocks() {
        return initVideoBlocks.call(this);
    }
    initFullPage() {
        return initFullPage.call(this);
    }
    initHoverImage() {
        return initHoverImage.call(this);
    }
    initPortfolio() {
        return initPortfolio.call(this);
    }
    initShop() {
        return initShop.call(this);
    }
    initStretch() {
        return initStretch.call(this);
    }
    initSlider() {
        return initSlider.call(this);
    }
    initForms() {
        return initForms.call(this);
    }
    initTeamBlock() {
        return initTeamBlock.call(this);
    }
    initGmaps() {
        return initGmaps.call(this);
    }
    initInstagram() {
        return initInstagram.call(this);
    }
    initTwitter() {
        return initTwitter.call(this);
    }


    initPluginObjectFitImages() {
        return initPluginObjectFitImages.call(this);
    }
    initPluginStickySidebar() {
        return initPluginStickySidebar.call(this);
    }
    initPluginNano($context) {
        return initPluginNano.call(this, $context);
    }
    initPluginJarallax() {
        return initPluginJarallax.call(this);
    }
    initPluginFlickity() {
        return initPluginFlickity.call(this);
    }
    initPluginIsotope() {
        return initPluginIsotope.call(this);
    }
    initPluginPhotoswipe() {
        return initPluginPhotoswipe.call(this);
    }
    initPluginJustifiedGallery() {
        return initPluginJustifiedGallery.call(this);
    }
    initPluginBootstrap() {
        return initPluginBootstrap.call(this);
    }
}


/*------------------------------------------------------------------

  Init Skylith

-------------------------------------------------------------------*/
window.Skylith = new SKYLITH();
