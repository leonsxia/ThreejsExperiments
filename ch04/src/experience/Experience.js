import { Scene } from 'three';
import Debug from './utils/Debug';
import Sizes from './utils/Sizes';
import Events from './utils/Events';
import Time from './utils/Time';
import Camera from './Camera';
import Renderer from './Renderer';
import Resourecs from './utils/Resources';
import sources from './sources';
import config from './config';
import FoxScene from './world/scenes/FoxScene';
import ShaderTestScene from './world/scenes/shaderScenes/ShaderTestScene';
import ShaderPatternScene from './world/scenes/shaderScenes/ShaderPatternScene';
import RagingSea from './world/scenes/shaderScenes/RagingSea';
import Galaxy from './world/scenes/shaderScenes/Galaxy';
import CustomizedMaterialScene from './world/scenes/shaderScenes/CustomizedMaterialScene';
import CoffeeSmokeScene from './world/scenes/shaderScenes/CoffeeSmokeScene';
import HologramScene from './world/scenes/shaderScenes/HologramScene';
import FireworksScene from './world/scenes/shaderScenes/FireworksScene';
import LightsShadingScene from './world/scenes/shaderScenes/LightsShadingScene';
import DemonicSea from './world/scenes/shaderScenes/DemonicSea';
import HalftoneScene from './world/scenes/shaderScenes/HalftoneScene';
import EarthScene from './world/scenes/shaderScenes/EarthScene';
import ParticlesCursorAnimationScene from './world/scenes/shaderScenes/ParticlesCursorAnimationScene';
import ParticlesMorphingScene from './world/scenes/shaderScenes/ParticlesMorphingScene';
import GpgpuFlowFieldParticlesScene from './world/scenes/shaderScenes/GpgpuFlowFieldParticlesScene';
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
        this.sceneConfig = config.GpgpuFlowFieldParticlesScene;
        this.debug = new Debug();
        this.sizes = new Sizes();
        this.scene = new Scene();
        this.resources = new Resourecs(sources);
        this.camera = new Camera();
        this.renderer = new Renderer();
        this.time = new Time(this.renderer.instance);
        this.events = new Events();
        this.worlds = [
            new GpgpuFlowFieldParticlesScene()
        ];

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
        for (const world of this.worlds) {

            world.update(delta, elapsed);

        }

        // make sure worlds are updated before the final render scene
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