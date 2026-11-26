import { DirectionalLight } from 'three';
import World from './World';

export default class PostEffectScene extends World {

    constructor(specs) {

        super(specs);

    }

    init() {

        this.setEnvironmentMap();
        this.setLight();
        this.setModel();

    }

    setEnvironmentMap() {

        this.scene.background = this.resources.items.environmentMapTexture;
        this.scene.environment = this.resources.items.environmentMapTexture;

    }

    setLight() {

        this.directionalLight = new DirectionalLight('#ffffff', 3);
        this.directionalLight.castShadow = true;
        this.directionalLight.shadow.mapSize.set(1024, 1024);
        this.directionalLight.shadow.camera.far = 15;
        this.directionalLight.shadow.normalBias = 0.05;
        this.directionalLight.position.set(0.25, 3, - 2.25);

        this.scene.add(this.directionalLight);

    }

    setModel() {

        this.model = this.resources.items.damagedHelmet.scene.clone();
        this.model.scale.set(2, 2, 2);
        this.model.rotation.y = Math.PI * 0.5;

        this.scene.add(this.model);

        this.model.traverse(object => {

            if (object.isMesh && object.material.isMeshStandardMaterial) {

                object.material.envMapIntensity = 2.5;
                object.material.needsUpdate = true;
                object.castShadow = true;
                object.receiveShadow = true;

            }

        })

    }

};