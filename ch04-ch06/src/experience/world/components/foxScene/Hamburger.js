import SceneObjectBase from '../SceneObjectBase';

export default class Hamburger extends SceneObjectBase {

    rotateYVel = 1;

    constructor(specs) {

        super(specs);

        // resource
        this.resource = this.resources.items.hamburgerModel;

        this.setModel();

    }

    setDebugParameters() {

        this.debugGui.debugFolder = this.debug.ui.addFolder('Hamburger');

    }

    setGui() {

        this.debugGui.debugFolder.add(this, 'rotateYVel', - 2, 2, .01).name('rotation speed');

    }

    setModel() {

        this.model = this.resource.scene.clone();
        this.model.scale.set(5, 5, 5);
        this.model.position.set(0, 0.015, 1.5);
        this.scene.add(this.model);

        this.model.traverse((object) => {

            if (object.isMesh) {

                object.castShadow = true;
                object.receiveShadow = true;

            }

        });

    }

    tick(delta) {

        this.model.rotation.y += delta * this.rotateYVel;

    }

};