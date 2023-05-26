import { Loader } from '@googlemaps/js-api-loader';

/** Below is a bandaid solution for netlify not being able to get env variables the same way Astro does locally */
const loader = new Loader({
    apiKey: import.meta.env.PUBLIC_GOOGLE_MAPS ?? 'AIzaSyA35IqWX-zVrvJyG5UPX3BeRtO1IudPGKw',
    version: 'weekly'
});

export const library = await loader.load()