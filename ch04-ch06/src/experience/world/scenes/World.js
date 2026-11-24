import Experience from "../../Experience";

export default class World {

    constructor() {

        this.experience = new Experience();
        this.camera = this.experience.camera.instance;
        this.scene = this.experience.scene;
        this.renderer = this.experience.renderer.instance;
        this.sizes = this.experience.sizes;
        this.time = this.experience.time;
        this.resources = this.experience.resources;
        this.debug = this.experience.debug;
        this.sceneConfig = this.experience.sceneConfig;
        this.events = this.experience.events;

        this.resources.on('ready', () => {
                        
            this.init();
            this.time.start(this.experience.stats);

        });

    }

    // inmplemented by children
    init() {}

    // implemented by children
    tick() {}

    update(delta, elapsed) {

        if (this.resources.ready) {

            this.tick(delta, elapsed);

        }

    }

};