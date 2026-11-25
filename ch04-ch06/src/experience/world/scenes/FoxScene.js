import World from './World';
import Environment from "../components/foxScene/Environment";
import Fox from "../components/foxScene/Fox";
import Hamburger from "../components/foxScene/Hamburger";
import Floor from "../components/foxScene/Floor";

export default class FoxScene extends World {

    name = 'FoxScene';

    constructor(specs) {

        super(specs);

    }

    init() {

        const sceneObjectConfig = { attachTo: this };
        this.sceneObjects.environment = new Environment(sceneObjectConfig);
        this.sceneObjects.floor = new Floor(sceneObjectConfig);
        this.sceneObjects.fox = new Fox(sceneObjectConfig);
        this.sceneObjects.hamburger = new Hamburger(sceneObjectConfig);
        this.sceneObjects.environment.environmentMap.updateMaterials();

    }

    tick(delta, elapsed) {

        this.sceneObjects.fox.tick(delta);
        this.sceneObjects.hamburger.tick(delta);

    }

};