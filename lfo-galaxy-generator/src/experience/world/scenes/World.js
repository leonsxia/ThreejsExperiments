import Experience from "../../Experience";

export default class World {

    constructor() {

        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.renderer = this.experience.renderer.instance;
        this.time = this.experience.time;
        this.resources = this.experience.resources;
        this.debug = this.experience.debug;

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