import { PerspectiveCamera } from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Experience from './Experience';

export default class Camera {

    constructor(specs) {

        this.experience = new Experience();
        this.sizes = this.experience.sizes;        
        this.canvas = this.experience.canvas;
        this.specs = specs;

        this.setInstance();
        this.setControls();
        this.stopControls();

    }

    setInstance() {

        const { fov, near, far, position = [6, 4, 8] } = this.specs.camera ?? {};
        this.instance = new PerspectiveCamera(fov, this.sizes.width / this.sizes.height, near, far);
        this.instance.position.set(...position);

    }

    setControls() {

        this.controls = new OrbitControls(this.instance, this.canvas);
        this.controls.enableDamping = true;

    }

    resize() {

        this.instance.aspect = this.sizes.width / this.sizes.height;
        this.instance.updateProjectionMatrix();

    }

    update() {

        this.controls.update();

    }

    stopControls() {

        this.controls.enabled = false;

    }

    startControls() {

        this.controls.enabled = true;

    }

};