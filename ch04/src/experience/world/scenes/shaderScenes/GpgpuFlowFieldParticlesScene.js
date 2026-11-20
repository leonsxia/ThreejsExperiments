import { Points, ShaderMaterial, Uniform, Float32BufferAttribute, AdditiveBlending, Color, BufferGeometry, SphereGeometry } from 'three';
import World from '../World';
import vertexShader from '../../../shaders/gpgpuFlowFieldParticles/vertex.glsl';
import fragmentShader from '../../../shaders/gpgpuFlowFieldParticles/fragment.glsl';

export default class GpgpuFlowFieldParticlesScene extends World {

    constructor() {

        super();

    }

    init() {

        this.setParameters();
        this.setModel();
        this.setParticles();

        // debug
        if (this.debug.active) {

            this.debug.ui.domElement.style.setProperty('width', '340px');
            this.rendererFolder = this.debug.ui.addFolder('Renderer');
            this.shaderFolder = this.debug.ui.addFolder('Shader');

            this.setGui();

        }

    }

    setParameters() {

        this.particles = {};

        if (this.debug.active) {

            this.debugObject = {};
            Object.assign(this.debugObject, this.sceneConfig.renderer);
            this.debugObject.color = new Color(this.sceneConfig.renderer);

        };

    }

    setModel() {
        
        this.models = this.resources.items.strandedBoat;

    }

    setParticles() {

        // geometry
        this.particles.geometry = new SphereGeometry(3);

        // material
        this.particles.material = new ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                uSize: new Uniform(0.4),
                uResolution: new Uniform(this.sizes.resolution)
            }
        });

        // points
        this.particles.points = new Points(this.particles.geometry, this.particles.material);

        this.scene.add(this.particles.points);

    }

    setGui() {

        this.rendererFolder.addColor(this.debugObject, 'clearColor')
            .onChange(value => this.renderer.setClearColor(value));

        this.shaderFolder.add(this.particles.material.uniforms.uSize, 'value', 0, 1, .001).name('uSize');

    }

    previousTime = 0;

    tick(delta, elapsed) {

        this.previousTime = elapsed;

    }

};