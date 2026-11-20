import Experience from "../Experience";
import Environment from "./Environment";
import Fox from "./Fox";
import Hamburger from "./Hamburger";
import Floor from "./Floor";

export default class World {

    constructor() {

        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.time = this.experience.time;
        this.resources = this.experience.resources;

        this.resources.on('resources.ready', () => {
            
            this.environment = new Environment();
            this.floor = new Floor();
            this.fox = new Fox();
            this.hamburger = new Hamburger();
            this.environment.environmentMap.updateMaterials();

            this.time.start(this.experience.stats);

        });

    }

    update(delta, elapsed) {

        if (this.resources.ready) {

            this.fox.update(delta);
            this.hamburger.update(delta);

        }

    }

};