import { Points, ShaderMaterial, Uniform, Float32BufferAttribute, AdditiveBlending, Color, BufferGeometry, SphereGeometry, Mesh, PlaneGeometry, MeshBasicMaterial } from 'three';
import { GPUComputationRenderer } from 'three/addons/misc/GPUComputationRenderer.js';
import World from '../World';
import vertexShader from '../../../shaders/gpgpuFlowFieldParticles/vertex.glsl';
import fragmentShader from '../../../shaders/gpgpuFlowFieldParticles/fragment.glsl';
import gpuParticlesShader from '../../../shaders/gpgpu/particles.glsl';

export default class GpgpuFlowFieldParticlesScene extends World {

    constructor(specs) {

        super(specs);

    }

    init() {

        this.setModel();
        this.setParameters();        
        this.setParticles();

        // debug
        // this.test();

    }

    setDebugParameters() {

        this.debugGui.rendererFolder = this.debug.ui.addFolder('Renderer');
        this.debugGui.shaderFolder = this.debug.ui.addFolder('Shader');

        this.debugObject = {};
        Object.assign(this.debugObject, this.sceneConfig.renderer);

    }

    setParameters() {

        /**
         * base geometry
         */
        const geometry = this.models.scene.children[0].geometry;
        this.baseGeometry = {
            instance: geometry,
            count: geometry.attributes.position.count
        };

        /**
         * GPU compute
         */
        const size = Math.ceil(Math.sqrt(this.baseGeometry.count))
        this.gpgpu = {
            size,
            computation: new GPUComputationRenderer(size, size, this.renderer.instance),
        };

        // base particles
        const baseParticlesTexture = this.gpgpu.computation.createTexture();
        this.gpgpu.baseParticlesTexture = baseParticlesTexture;

        // initialize with geometry
        for (let i = 0, il = geometry.attributes.position.count; i < il; i++) {

            const i3 = i * 3;
            const i4 = i * 4;

            // position based on geometry
            baseParticlesTexture.image.data[i4] = geometry.attributes.position.array[i3];
            baseParticlesTexture.image.data[i4 + 1] = geometry.attributes.position.array[i3 + 1];
            baseParticlesTexture.image.data[i4 + 2] = geometry.attributes.position.array[i3 + 2];
            baseParticlesTexture.image.data[i4 + 3] = Math.random();

        }

        // particles variables
        this.gpgpu.particlesVariable = this.gpgpu.computation.addVariable('uParticles', gpuParticlesShader, baseParticlesTexture);
        // keep varibale injecting every frame
        this.gpgpu.computation.setVariableDependencies(this.gpgpu.particlesVariable, [this.gpgpu.particlesVariable]);

        // uniforms
        this.gpgpu.particlesVariable.material.uniforms.uTime = new Uniform(0);
        this.gpgpu.particlesVariable.material.uniforms.uDelta = new Uniform(0);
        this.gpgpu.particlesVariable.material.uniforms.uBase = new Uniform(baseParticlesTexture);
        this.gpgpu.particlesVariable.material.uniforms.uFlowfieldInfluence = new Uniform(0.5);
        this.gpgpu.particlesVariable.material.uniforms.uFlowfieldStrength = new Uniform(2);
        this.gpgpu.particlesVariable.material.uniforms.uFlowfieldFrequency = new Uniform(0.5);
        this.gpgpu.particlesVariable.material.uniforms.uInfluenceFrequency = new Uniform(0.2);

        // init
        this.gpgpu.computation.init();

        // debug
        this.gpgpu.debug = new Mesh(
            new PlaneGeometry(3, 3),
            new MeshBasicMaterial({
                map: this.gpgpu.computation.getCurrentRenderTarget(this.gpgpu.particlesVariable).texture
            })
        );
        this.gpgpu.debug.position.x = 10;

        /**
         * particles
         */
        this.particles = {
            particlesUvArray: [],
            sizesArray: [],
            geometry: new BufferGeometry()
        };

        for (let y = 0; y < this.gpgpu.size; y++) {

            for (let x = 0; x < this.gpgpu.size; x++) {

                const i = y * this.gpgpu.size + x;
                const i2 = i * 2;

                // uv
                // make sure uv is in the center of each cell in the particlesTexture
                const u = (x + 0.5) / this.gpgpu.size;
                const v = (y + 0.5) / this.gpgpu.size;

                this.particles.particlesUvArray[i2] = u;
                this.particles.particlesUvArray[i2 + 1] = v;

                this.particles.sizesArray[i] = Math.random();

            }
        }

        this.particles.geometry.setDrawRange(0, this.baseGeometry.count);
        this.particles.geometry.setAttribute('aParticlesUv', new Float32BufferAttribute(this.particles.particlesUvArray, 2));
        this.particles.geometry.setAttribute('aColor', geometry.attributes.color);
        this.particles.geometry.setAttribute('aSize', new Float32BufferAttribute(this.particles.sizesArray, 1));        

    }

    setModel() {
        
        this.models = this.resources.items.strandedBoat;

    }

    setParticles() {

        // material
        this.particles.material = new ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                uSize: new Uniform(0.07),
                uResolution: new Uniform(this.sizes.resolution),
                uParticlesTexture: new Uniform()
            }
        });

        // points
        this.particles.points = new Points(this.particles.geometry, this.particles.material);

        this.scene.add(this.particles.points);

    }

    setGui() {

        this.debugGui.rendererFolder.addColor(this.debugObject, 'clearColor')
            .onChange(value => this.renderer.instance.setClearColor(value));

        this.debugGui.shaderFolder.add(this.particles.material.uniforms.uSize, 'value', 0, 1, .001).name('uSize');
        this.debugGui.shaderFolder.add(this.gpgpu.particlesVariable.material.uniforms.uFlowfieldInfluence, 'value', 0, 1, .001).name('uFlowfieldInfluence');
        this.debugGui.shaderFolder.add(this.gpgpu.particlesVariable.material.uniforms.uFlowfieldStrength, 'value', 0, 10, .001).name('uFlowfieldStrength');
        this.debugGui.shaderFolder.add(this.gpgpu.particlesVariable.material.uniforms.uFlowfieldFrequency, 'value', 0, 1, .001).name('uFlowfieldFrequency');
        this.debugGui.shaderFolder.add(this.gpgpu.particlesVariable.material.uniforms.uInfluenceFrequency, 'value', 0, 5, .001).name('uFlowfieldFrequency');

    }

    test() {

        this.scene.add(this.gpgpu.debug);

    }

    tick(delta, elapsed) {

        // GPGPU update
        this.gpgpu.particlesVariable.material.uniforms.uTime.value = elapsed;
        this.gpgpu.particlesVariable.material.uniforms.uDelta.value = delta;
        this.gpgpu.computation.compute();
        this.particles.material.uniforms.uParticlesTexture.value = this.gpgpu.computation.getCurrentRenderTarget(this.gpgpu.particlesVariable).texture;

    }

};