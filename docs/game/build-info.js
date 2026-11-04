// Source-tree imports are for development; release copies contain literal build metadata.
import manifest from '../build.json' with {type:'json'};
export const BUILD_ID=manifest.id;
export const SITE_ROOT=new URL('../',import.meta.url);
