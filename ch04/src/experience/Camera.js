import { PerspectiveCamera } from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Experience from './Experience';

export default class Camera {

    constructor() {

        this.experience = new Experience();
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;
        this.sceneConfig = this.experience.sceneConfig;

        this.setInstance();
        this.setControls();

    }

    setInstance() {

        const { fov, near, far, position = [6, 4, 8] } = this.sceneConfig.camera ?? {};
        this.instance = new PerspectiveCamera(fov, this.sizes.width / this.sizes.height, near, far);
        this.instance.position.set(...position);
        this.scene.add(this.instance);

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

};