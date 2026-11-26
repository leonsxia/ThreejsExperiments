import { WebGLRenderer, PCFShadowMap, CineonToneMapping, ACESFilmicToneMapping, NoToneMapping, AgXToneMapping, ReinhardToneMapping, LinearToneMapping, NeutralToneMapping } from 'three';
import Experience from './Experience';

export default class Renderer {

    constructor() {

        this.experience = new Experience();
        this.canvas = this.experience.canvas;
        this.sizes = this.experience.sizes;

        this.setInstance();
        this.setMenuRenderer();

    }

    setInstance() {

        this.instance = new WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            powerPreference: 'high-performance'
        });
        this.instance.toneMapping = ACESFilmicToneMapping;
        this.instance.toneMappingExposure = 1;
        this.instance.shadowMap.enabled = true;
        this.instance.shadowMap.type = PCFShadowMap; 

        this.resize();

        console.log(`max anisotropy supported: ${this.instance.capabilities.getMaxAnisotropy()}`);

    }

    setMenuRenderer() {

        const menu = this.experience.menu;
        this.rendererFolder = menu.addFolder('Renderer');
        this.rendererFolder.add(this.instance, 'toneMapping', {
                NoToneMapping: NoToneMapping,
                ACESFilmicToneMapping: ACESFilmicToneMapping,
                AgXToneMapping: AgXToneMapping,
                ReinhardToneMapping: ReinhardToneMapping,
                CineonToneMapping: CineonToneMapping,
                LinearToneMapping: LinearToneMapping,
                NeutralToneMapping: NeutralToneMapping
            })
            .name('Tone Mapping')
            .onChange(value => this.instance.toneMapping = value);

    }

    changeWorld(world) {

        if (world.debugObject?.clearColor) {

            this.instance.setClearColor(world.debugObject.clearColor);

        } else if (world.sceneConfig.renderer?.clearColor) {

            this.instance.setClearColor(world.sceneConfig.renderer.clearColor);

        } else {

            this.instance.setClearColor('#211d20');

        }

        this.scene = world.scene;
        this.camera = world.camera;

    }

    resize() {

        this.instance.setSize(this.sizes.width, this.sizes.height);
        this.instance.setPixelRatio(this.sizes.pixelRatio);

    }

    update() {

        this.instance.render(this.scene, this.camera.instance);

    }

}