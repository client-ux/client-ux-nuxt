import { $ } from './_utility';

/* PhotoSwipe */
function initPluginPhotoswipe() {
    let $gallery = $('.nk-popup-gallery');
    const $slideshow = $('.nk-slider .nk-slider-fullscreen').closest('.nk-slider');

    if ($slideshow.length) {
        $gallery = $gallery.add($slideshow);
    }

    if (typeof PhotoSwipe === 'undefined' || !$gallery.length) {
        return;
    }

    function parseVideoURL(url) {
        // parse youtube ID
        function getYoutubeID(ytUrl) {
            // eslint-disable-next-line no-useless-escape
            const regExp = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
            const match = ytUrl.match(regExp);
            return match && match[1].length === 11 ? match[1] : false;
        }

        // parse vimeo ID
        function getVimeoID(vmUrl) {
            // eslint-disable-next-line no-useless-escape
            const regExp = /https?:\/\/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/;
            const match = vmUrl.match(regExp);
            return match && match[3] ? match[3] : false;
        }

        const Youtube = getYoutubeID(url);
        const Vimeo = getVimeoID(url);

        if (Youtube) {
            return {
                type: 'youtube',
                id: Youtube,
            };
        } else if (Vimeo) {
            return {
                type: 'vimeo',
                id: Vimeo,
            };
        }

        return false;
    }

    // prepare photoswipe markup
    const markup = '' +
        '<div class="pswp nk-pswp" tabindex="-1" role="dialog" aria-hidden="true">' +
        '   <div class="pswp__bg"></div>' +
        '   <div class="pswp__scroll-wrap">' +
        '      <div class="pswp__container">' +
        '          <div class="pswp__item"></div>' +
        '          <div class="pswp__item"></div>' +
        '          <div class="pswp__item"></div>' +
        '      </div>' +
        '      <div class="pswp__ui pswp__ui--hidden">' +
        '          <div class="pswp__top-bar">' +
        '              <div class="pswp__counter"></div>' +
        '              <a class="pswp__button pswp__button--close" title="Close"></a>' +
        '              <a class="pswp__button pswp__button--share" title="Share"></a>' +
        '              <a class="pswp__button pswp__button--fs" title="Fullscreen"></a>' +
        '              <a class="pswp__button pswp__button--zoom" title="Zoom"></a>' +
        '          </div>' +
        '          <div class="pswp__preloader">' +
        '              <div class="pswp__preloader__icn">' +
        '                  <div class="pswp__preloader__cut">' +
        '                      <div class="pswp__preloader__donut"></div>' +
        '                  </div>' +
        '              </div>' +
        '          </div>' +
        '          <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">' +
        '              <div class="pswp__share-tooltip"></div>' +
        '          </div>' +
        '          <a class="pswp__button pswp__button--arrow--left" title="Previous"></a>' +
        '          <a class="pswp__button pswp__button--arrow--right" title="Next"></a>' +
        '          <div class="pswp__caption">' +
        '              <div class="pswp__caption__center"></div>' +
        '          </div>' +
        '      </div>' +
        '   </div>' +
        '</div>';
    $('body').append(markup);

    // init code
    function parseThumbnailElements(el) {
        const thumbElements = $(el).find('.nk-gallery-item, .nk-slider-item > .nk-slider-image');
        const items = [];
        let $meta;
        let size;
        let videoSize;
        let item;
        let video;

        thumbElements.each(function () {
            $meta = $(this);
            size = ($meta.attr('data-size') || '1920x1080').split('x');
            videoSize = ($meta.attr('data-video-size') || '1920x1080').split('x');
            video = $meta.attr('data-video');
            video = video ? parseVideoURL(video) : video;

            if (video) {
                if (video.type === 'youtube') {
                    video = `<div class="nk-pswp-video"><div><iframe width="640" height="360" src="https://www.youtube.com/embed/${video.id}" frameborder="0" allowfullscreen></iframe></div></div>`;
                } else {
                    video = `<div class="nk-pswp-video"><div><iframe src="https://player.vimeo.com/video/${video.id}?byline=0&portrait=0" width="640" height="360" frameborder="0" allowfullscreen></iframe></div></div>`;
                }

                item = {
                    html: video,
                    vw: parseInt(videoSize[0], 10),
                    vh: parseInt(videoSize[1], 10),
                };
            } else {
                // create slide object
                item = {
                    src: $meta.hasClass('nk-slider-image') ? $meta.attr('src') : $meta.attr('href'),
                    w: parseInt(size[0], 10),
                    h: parseInt(size[1], 10),
                };

                // save link to element for getThumbBoundsFn
                item.el = this;
            }

            items.push(item);
        });

        return items;
    }

    function resizeVideo(data, curItem) {
        if (typeof curItem === 'undefined') {
            if (data && data.itemHolders.length) {
                data.itemHolders.forEach((val) => {
                    if (val.item && val.item.html) {
                        resizeVideo(data, val.item);
                    }
                });
            }
            return;
        }

        // calculate real viewport in pixels
        const vpW = data.viewportSize.x * window.devicePixelRatio;
        let vpH = data.viewportSize.y * window.devicePixelRatio;
        const ratio = curItem.vw / curItem.vh;
        let resultW;
        const $container = $(curItem.container);

        const bars = data.options.barsSize;
        let barTop = 0;
        let barBot = 0;

        if (bars) {
            barTop = bars.top && bars.top !== 'auto' ? bars.top : 0;
            barBot = bars.bottom && bars.bottom !== 'auto' ? bars.bottom : 0;
        }
        vpH -= barTop + barBot;

        if (ratio > vpW / vpH) {
            resultW = vpW;
        } else {
            resultW = vpH * ratio;
        }

        $container.find('.nk-pswp-video').css('max-width', resultW);
        $container.css({
            top: barTop,
            bottom: barBot,
        });
    }

    function openPhotoSwipe(index, galleryElement, disableAnimation, fromURL) {
        const pswpElement = $('.nk-pswp')[0];
        const items = parseThumbnailElements(galleryElement);

        // define options (if needed)
        const options = {
            captionAndToolbarShowEmptyCaptions: false,
            closeEl: true,
            captionEl: false,
            fullscreenEl: true,
            zoomEl: true,
            shareEl: true,
            counterEl: true,
            arrowEl: true,
            shareButtons: [
                { id: 'facebook', label: 'Share in Facebook', url: 'https://www.facebook.com/sharer/sharer.php?u={{url}}' },
                { id: 'twitter', label: 'Share in Twitter', url: 'https://twitter.com/intent/tweet?text={{text}}&url={{url}}' },
                {
                    id: 'pinterest',
                    label: 'Pin to Pinterest',
                    url: 'https://www.pinterest.com/pin/create/button/' +
                '?url={{url}}&media={{image_url}}&description={{text}}',
                },
            ],
            bgOpacity: 1,
            tapToClose: true,
            tapToToggleControls: false,
            showHideOpacity: true,
            galleryUID: galleryElement.getAttribute('data-pswp-uid'),
        };

        if (fromURL) {
            if (options.galleryPIDs) {
                // parse real index when custom PIDs are used
                // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
                for (let j = 0; j < items.length; j++) {
                    if (items[j].pid === index) {
                        options.index = j;
                        break;
                    }
                }
            } else {
                options.index = parseInt(index, 10) - 1;
            }
        } else {
            options.index = parseInt(index, 10);
        }

        // exit if index not found
        if (Number.isNaN(options.index)) {
            return;
        }

        if (disableAnimation) {
            options.showAnimationDuration = 0;
        }

        // Pass data to PhotoSwipe and initialize it
        const gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);

        gallery.listen('resize', function () {
            resizeVideo(this);
        });

        gallery.listen('afterChange', function () {
            resizeVideo(this);
        });

        gallery.init();
    }

    function photoswipeParseHash() {
        const hash = window.location.hash.substring(1);
        const params = {};

        if (hash.length < 5) { // pid=1
            return params;
        }

        const vars = hash.split('&');
        for (let i = 0; i < vars.length; i++) {
            if (!vars[i]) {
                continue;
            }
            const pair = vars[i].split('=');
            if (pair.length < 2) {
                continue;
            }
            params[pair[0]] = pair[1];
        }

        return params;
    }

    // select all gallery elements
    let i = 0;
    $gallery.each(function () {
        const $thisGallery = $(this);
        $thisGallery.attr('data-pswp-uid', i + 1);

        $thisGallery.on('click', '.nk-gallery-item, .nk-slider-fullscreen', function (e) {
            e.preventDefault();
            let index = 0;
            const isSlider = $(this).hasClass('nk-slider-fullscreen');
            const clicked = this;

            $thisGallery.find('.nk-gallery-item, .nk-slider-item').each(function (idx) {
                if (isSlider && $(this).hasClass('nk-slider-item-current') ||
                    !isSlider && this === clicked) {
                    index = idx;
                    return false;
                }
                return true;
            });

            openPhotoSwipe(index, $thisGallery[0]);
        });
        i++;
    });

    // Parse URL and open gallery if it contains #&pid=3&gid=1
    const hashData = photoswipeParseHash();
    if (hashData.pid && hashData.gid) {
        openPhotoSwipe(hashData.pid, $gallery.get(hashData.gid - 1), true, true);
    }
}

export { initPluginPhotoswipe };
