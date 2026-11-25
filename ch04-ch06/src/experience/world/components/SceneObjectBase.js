import Experience from '../../Experience.js';

export default class SceneObjectBase {

    constructor(specs) {

        this.attachTo = specs.attachTo;
        this.scene = this.attachTo.scene;
        this.renderer = this.attachTo.renderer;

        this.experience = new Experience();        
        this.resources = this.experience.resources;
        this.debug = this.experience.debug;

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

    }

    // implemented by children or inherited by children
    alive() {

        for (const gui in this.debugGui) {

            this.debugGui[gui].show();

        }

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

};