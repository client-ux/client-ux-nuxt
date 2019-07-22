/*------------------------------------------------------------------

  Theme Options

-------------------------------------------------------------------*/
const options = {
    enableShortcuts: true,
    scrollToAnchorSpeed: 700,
    parallaxSpeed: 0.8,

    templates: {
        sliderAuthor: 'Author: {{name}}',
        navbarBackItem: 'Back',

        plainVideoIcon: '<span class="nk-video-icon"><span><span class="nk-play-icon"></span></span></span>',
        plainVideoLoadIcon: '<div class="nk-video-icon nk-video-icon-loading"></div>',
        fullscreenVideoClose: '<span class="nk-icon-close"></span>',

        instagram:
            `<div class="col-3">
                <a href="{{link}}" target="_blank">
                    <img src="{{image}}" alt="{{caption}}" class="nk-img-stretch">
                </a>
            </div>`,
        instagramLoadingText: 'Loading...',
        instagramFailText: 'Failed to fetch data',
        instagramApiPath: 'php/instagram/instagram.php',

        twitter:
            `<div class="nk-twitter">
                <span class="nk-twitter-icon fa fa-twitter"></span>
                <div class="nk-twitter-text">
                   {{tweet}}
                </div>
            </div>`,
        twitterLoadingText: 'Loading...',
        twitterFailText: 'Failed to fetch data',
        twitterApiPath: 'php/twitter/tweet.php',
    },

    shortcuts: {
        closeFullscreenVideo: 'esc',

        postScrollToComments: 'c',

        toggleSideLeftNavbar: 'alt+l',
        openSideLeftNavbar: '',
        closeSideLeftNavbar: 'esc',

        toggleSideRightNavbar: 'alt+r',
        openSideRightNavbar: '',
        closeSideRightNavbar: 'esc',

        toggleFullscreenNavbar: 'alt+f',
        openFullscreenNavbar: '',
        closeFullscreenNavbar: 'esc',

        toggleLeftNavbar: 'alt+n',
        openLeftNavbar: '',
        closeLeftNavbar: 'esc',
    },
};

export { options };
