import { TextureLoader, CubeTextureLoader } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader, DRACO_GLTF_CONFIG } from 'three/addons/loaders/DRACOLoader.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js';
import EventEmitter from './EventEmitter';

export default class Resourecs extends EventEmitter {

    constructor(sources = []) {

        super();

        this.sources = sources;

        this.items = {};
        this.toLoad = this.sources.length;
        this.loaded = 0;

        this.ready = false;

        this.setLoaders();
        this.startLoading();
        
    }

    setLoaders() {

        this.loaders = {};
        this.loaders.gltfLoader = new GLTFLoader();        
        this.loaders.textureLoader = new TextureLoader();
        this.loaders.cubeTextureLoader = new CubeTextureLoader();
        this.loaders.hdrLoader = new HDRLoader();

        // DRACO
        this.loaders.dracoLoader = new DRACOLoader();
        this.loaders.dracoLoader.setDecoderPath(DRACO_GLTF_CONFIG);
        this.loaders.gltfLoader.setDRACOLoader(this.loaders.dracoLoader);

        // font
        this.loaders.fontLoader = new FontLoader();

    }

    startLoading() {

        for (const source of this.sources) {

            switch (source.type) {

                case 'gltfModel':

                    this.loaders.gltfLoader
                        .loadAsync(source.path)
                        .then((file) => {

                            this.sourceLoaded(source, file);

                        }
                    );

                    break;

                case 'texture':

                    this.loaders.textureLoader
                        .loadAsync(source.path)
                        .then((file) => {

                            this.sourceLoaded(source, file);

                        }
                    );

                    break;

                case 'hdr':

                    this.loaders.hdrLoader
                        .loadAsync(source.path)
                        .then((file) => {

                            this.sourceLoaded(source, file);

                        }
                    );

                    break;

                case 'cubeTexture':

                    this.loaders.cubeTextureLoader
                        .loadAsync(source.path)
                        .then((file) => {

                            this.sourceLoaded(source, file);

                        }
                    );

                    break;

                case 'image':
                    
                    const image = new Image();
                    image.src = source.path;

                    const onImageLoad = () => {

                        removeEventListeners();
                        this.sourceLoaded(source, image);

                    };

                    const removeEventListeners = () => {

                        image.removeEventListener('load', onImageLoad);

                    };

                    image.addEventListener('load', onImageLoad);

                    break;

                case 'font':

                    this.loaders.fontLoader
                        .loadAsync(source.path)
                        .then(font => {

                            this.sourceLoaded(source, font);

                        }
                    );

                    break;

            }

        }

    }

    sourceLoaded(source, file) {

        this.items[source.name] = file;

        this.loaded++;

        // console.log(`${source.name} is loaded`);

        if (this.loaded === this.toLoad) {

            this.ready = true;
            this.trigger('ready.initWorld');
            this.trigger('ready.worldsInitCompleted');
            this.trigger('ready.renderEnabled');

        }

    }

}