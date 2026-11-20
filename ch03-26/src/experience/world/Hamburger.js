import Experience from '../Experience';

export default class Hamburger {

    rotateYVel = 1;

    constructor() {

        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.debug = this.experience.debug;

        // debug
        if (this.debug.active) {

            this.debugFolder = this.debug.ui.addFolder('Hamburger');

        }

        // resource
        this.resource = this.resources.items.hamburgerModel;

        this.setModel();

    }

    setModel() {

        this.model = this.resource.scene;
        this.model.scale.set(5, 5, 5);
        this.model.position.set(0, 0.015, 1.5);
        this.scene.add(this.model);

        this.model.traverse((object) => {

            if (object.isMesh) {

                object.castShadow = true;
                object.receiveShadow = true;

            }

        });

        if (this.debug.active) {

            this.debugFolder.add(this, 'rotateYVel', - 2, 2, .01).name('rotation speed');

        }

    }

    update(delta) {

        this.model.rotation.y += delta * this.rotateYVel;

    }

};