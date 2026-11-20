import { DirectionalLight, SRGBColorSpace } from 'three';
import SceneObjectBase from '../SceneObjectBase';

export default class Environment extends SceneObjectBase {

    constructor() {

        super();

        // debug
        if (this.debug.active) {

            this.debugFolder = this.debug.ui.addFolder('Environment');

        }

        this.setSunLight();
        this.setEnvironmentMap();

    }

    setSunLight() {

        this.sunLight = new DirectionalLight('#ffffff', 4);
        this.sunLight.castShadow = true;
        this.sunLight.shadow.camera.far = 15;
        this.sunLight.shadow.mapSize.set(1024, 1024);
        this.sunLight.shadow.normalBias = .05;
        this.sunLight.position.set(3.5, 2, - 1.25);
        this.scene.add(this.sunLight);

        // debug
        if (this.debug.active) {

            this.debugFolder.add(this.sunLight, 'intensity', 0, 10, .001).name('sun intensity');
            this.debugFolder.add(this.sunLight.position, 'x', - 5, 5, .001).name('sun pos x');
            this.debugFolder.add(this.sunLight.position, 'y', - 5, 5, .001).name('sun pos y');
            this.debugFolder.add(this.sunLight.position, 'z', - 5, 5, .001).name('sun pos z');

        }

    }

    setEnvironmentMap() {

        this.environmentMap = {};
        this.environmentMap.intensity = .4;
        this.environmentMap.texture = this.resources.items.environmentMapTexture;
        this.environmentMap.texture.colorSpace = SRGBColorSpace;

        this.scene.environment = this.environmentMap.texture;

        this.environmentMap.updateMaterials = (intensity) => {

            this.scene.traverse((object) => {

                if (object.isMesh && object.material.isMeshStandardMaterial) {

                    object.material.envMap = this.environmentMap.texture;
                    object.material.envMapIntensity = this.environmentMap.intensity;
                    object.material.needsUpdate = true;

                }

            });

        }
        // this.environmentMap.updateMaterials();

        // debug
        if (this.debug.active) {

            this.debugFolder.add(this.environmentMap, 'intensity', 0, 4, .001).name('envMap intensity').onChange(this.environmentMap.updateMaterials);

        }

    }

};