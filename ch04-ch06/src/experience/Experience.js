import Debug from './utils/Debug';
import Sizes from './utils/Sizes';
import Events from './utils/Events';
import Time from './utils/Time';
import Renderer from './Renderer';
import Resourecs from './utils/Resources';
import sources from './sources';
import WorldBuilder, { initialWorld, sceneLabels } from './world/WorldBuilder';

import GUI from 'lil-gui';
import Stats from 'stats.js';


let instance = null;

export default class Experience {

    ready = false;

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
        this.stats = new Stats();
        this.setMenu();

        // setup
        this.debug = new Debug();
        this.sizes = new Sizes();
        this.resources = new Resourecs(sources);
        this.renderer = new Renderer();
        this.time = new Time(this.renderer.instance);
        this.events = new Events();
        this.worldBuilder = new WorldBuilder();
        this.worlds = this.worldBuilder.build();

        // resize event
        this.sizes.on('resize', () => {

            this.resize();

        });

        // time tick event
        this.time.on('tick', (delta, elapsed) => {

            this.update(delta, elapsed);

        });

        // resources ready event
        this.resources.on('ready.worldsInitCompleted', () => {

            window.setTimeout(() => {

                this.worldBuilder.revealScene(
                    null,                    
                    () => {

                        this.debug.hideAll().show();
                        this.menu.show();
                        document.body.appendChild(this.stats.dom);
                        // change to the initial world
                        this.currentWorld.alive();

                    }
                );

            }, 0);

        });

        this.time.start(this.stats);

    }

    setMenu() {

        this.menu = new GUI({
            title: 'Menu',
            width: 200
        }).hide();
        this.menu.domElement.style.setProperty('left', '81px');

        this.menu.add({ world: initialWorld }, 'world', sceneLabels)
            .name('Select World')
            .onChange(value => {

                this.changeWorld(value);

            });

    }

    changeWorld(world) {

        this.currentWorld?.suspend();
        this.currentWorld = this.worlds[world];
        this.currentWorld.alive();

    }

    resize() {

        for (const world in this.worlds) {

            this.worlds[world].camera.resize();

        }

        this.renderer.resize();

    }

    update(delta, elapsed) {

        // if (!this.ready) return;

        this.currentWorld.camera.update();
        this.currentWorld.update(delta, elapsed);

        // make sure worlds are updated before the final render scene
        if (this.currentWorld.postProcessor.enabled) {

            this.currentWorld.postProcessor.update(delta, elapsed);

        } else {

            this.renderer.update();

        }

    }

    destroy() {

        this.sizes.off('resize');
        this.time.off('tick');

        // dispose all worlds
        for (const world in this.worlds) {

            const worldScene = this.worlds[world];

            worldScene.scene.traverse((object) => {

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

            worldScene.camera.controls.dispose();

        }

        this.renderer.instance.dispose();

        if (this.debug.active) {

            this.debug.ui.destroy();

        }

    }

};