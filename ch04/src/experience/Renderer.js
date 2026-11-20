import { WebGLRenderer, CineonToneMapping, ACESFilmicToneMapping, PCFShadowMap, NoToneMapping, AgXToneMapping } from 'three';
import Experience from './Experience';

export default class Renderer {

    constructor() {

        this.experience = new Experience();
        this.canvas = this.experience.canvas;
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.camera = this.experience.camera;
        this.sceneConfig = this.experience.sceneConfig;

        this.setInstance();

    }

    setInstance() {

        this.instance = new WebGLRenderer({
            canvas: this.canvas,
            antialias: true
        });
        this.instance.toneMapping = NoToneMapping;
        this.instance.toneMappingExposure = 1;
        this.instance.shadowMap.enabled = true;
        this.instance.shadowMap.type = PCFShadowMap;

        if (this.sceneConfig.renderer?.clearColor) {

            this.instance.setClearColor(this.sceneConfig.renderer?.clearColor);

        } else {

            this.instance.setClearColor('#211d20');

        }

        this.resize();

        console.log(this.instance.capabilities.getMaxAnisotropy());

    }

    resize() {

        this.instance.setSize(this.sizes.width, this.sizes.height);
        this.instance.setPixelRatio(this.sizes.pixelRatio);

    }

    update() {

        this.instance.render(this.scene, this.camera.instance);

    }

}