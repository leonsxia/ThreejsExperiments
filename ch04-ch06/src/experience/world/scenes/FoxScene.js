import World from './World';
import Environment from "../components/foxScene/Environment";
import Fox from "../components/foxScene/Fox";
import Hamburger from "../components/foxScene/Hamburger";
import Floor from "../components/foxScene/Floor";

export default class FoxScene extends World {

    name = 'FoxScene';

    constructor() {

        super();

    }

    init() {

        this.environment = new Environment();
        this.floor = new Floor();
        this.fox = new Fox();
        this.hamburger = new Hamburger();
        this.environment.environmentMap.updateMaterials();

    }

    tick(delta, elapsed) {

        this.fox.update(delta);
        this.hamburger.update(delta);

    }

};