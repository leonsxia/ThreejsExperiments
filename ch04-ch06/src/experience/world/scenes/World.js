import { Scene } from 'three';
import Experience from '../../Experience';
import Camera from '../../Camera';

export default class World {

    constructor(specs) {

        this.sceneConfig = specs;
        this.camera = new Camera(specs);
        this.scene = new Scene();
        this.scene.add(this.camera.instance);

        this.sceneObjects = {};

        this.experience = new Experience();
        this.renderer = this.experience.renderer.instance;
        this.sizes = this.experience.sizes;
        this.resources = this.experience.resources;
        this.debug = this.experience.debug;
        this.events = this.experience.events;

        this.resources.on('ready.initWorld', () => {
                        
            this.init();
            this.setDebug();

            for (const object in this.sceneObjects) {

                this.sceneObjects[object].init();
                this.sceneObjects[object].setDebug();

            }            

        });

    }

    // inmplemented by children
    init() {}

    // implemented by children
    tick() {}

    // implemented by children or inherited by children
    suspend() {

        for (const gui in this.debugGui) {

            this.debugGui[gui].hide();

        }

        for (const scene in this.sceneObjects) {

            this.sceneObjects[scene].suspend();

        }

        this.camera.stopControls();

    }

    // implemented by children or inherited by children
    alive() {

        for (const gui in this.debugGui) {

            this.debugGui[gui].show();

        }

        for (const scene in this.sceneObjects) {

            this.sceneObjects[scene].alive();

        }

        this.camera.startControls();

    }

    // implemented by children or inherited by children
    setParameters() {

        this.debugObject = {};

    }

    // implemented by children
    setDebugParameters() {}

    // implemented by children
    setGui() {}

    setDebug() {

        if (this.debug.active) {

            this.debugGui = {};
            this.setDebugParameters();
            this.setGui();

        }

    }

    update(delta, elapsed) {

        if (this.resources.ready) {

            this.tick(delta, elapsed);

        }

    }

};