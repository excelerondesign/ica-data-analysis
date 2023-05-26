import { Loader } from '@googlemaps/js-api-loader';

const loader = new Loader({
    apiKey: import.meta.env.PUBLIC_GOOGLE_MAPS,
    version: 'weekly'
});

export const library = await loader.load()