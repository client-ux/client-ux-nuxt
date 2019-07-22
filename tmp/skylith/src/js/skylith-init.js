import { options } from './parts/_options';

if (typeof window.Skylith !== 'undefined') {
    window.Skylith.setOptions(options);
    window.Skylith.init();
}
