import { Scene } from 'three';
import Debug from './utils/Debug';
import Sizes from './utils/Sizes';
import Time from './utils/Time';
import Camera from './Camera';
import Renderer from './Renderer';
import Resourecs from './utils/Resources';
import sources from './sources';
import World from './world/World';
import Stats from 'stats.js';

let instance = null;

export default class Experience {

    constructor(_canvas) {

        // singleton
        if (instance) {

            return instance;

        }
        instance = this;

        // global access
        window.experience = this;

        // options
        this.canvas = _canvas;

        // setup
        this.debug = new Debug();
        this.sizes = new Sizes();
        this.scene = new Scene();
        this.resources = new Resourecs(sources);
        this.camera = new Camera();
        this.renderer = new Renderer();
        this.time = new Time(this.renderer.instance);
        this.world = new World();

        this.stats = new Stats();
        document.body.appendChild(this.stats.dom);

        // resize event
        this.sizes.on('resize', () => {
            
            this.resize();

        });

        // time tick event
        this.time.on('tick', (delta, elapsed) => {

            this.update(delta, elapsed);

        });

    }

    resize() {

        this.camera.resize();
        this.renderer.resize();
        
    }

    update(delta, elapsed) {

        this.camera.update();
        this.world.update(delta, elapsed);
        this.renderer.update();

    }

    destroy() {

        this.sizes.off('resize');
        this.time.off('tick');

        this.scene.traverse((object) => {

            if (object.isMesh) {

                object.geometry.dispose();

                for (const key in object.material) {

                    const value = object.material[key];

                    if (value && typeof value.dispose === 'function') {

                        value.dispose();

                    }

                }

            }

        });

        this.camera.controls.dispose();
        this.renderer.instance.dispose();

        if (this.debug.active) {

            this.debug.ui.destroy();

        }

    }

};