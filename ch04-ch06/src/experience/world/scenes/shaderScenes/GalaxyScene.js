import World from "../World";
import Galaxy from "../../components/galaxy/Galaxy";

export default class GalaxyScene extends World {

    constructor(specs) {

        super(specs);

    }

    init() {
    
        const lfoGalaxy1Config = { attachTo: this };
        const lfoGalaxy2Config = { attachTo: this };
        const lfoGalaxy3Config = { attachTo: this };
        this.sceneObjects.LfoGalaxy001 = new Galaxy(Object.assign(lfoGalaxy1Config, this.sceneConfig.LfoGalaxy001));
        this.sceneObjects.LfoGalaxy002 = new Galaxy(Object.assign(lfoGalaxy2Config, this.sceneConfig.LfoGalaxy002));
        this.sceneObjects.LfoGalaxy003 = new Galaxy(Object.assign(lfoGalaxy3Config, this.sceneConfig.LfoGalaxy003));

    }

    tick(delta, elapsed) {

        for (const galaxy in this.sceneObjects) {

            this.sceneObjects[galaxy].tick(delta, elapsed);

        }

    }

}