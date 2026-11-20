import { Points, ShaderMaterial, Uniform, Float32BufferAttribute, AdditiveBlending, Color, BufferGeometry } from 'three';
import World from '../World';
import vertexShader from '../../../shaders/particlesMorphing/vertex.glsl';
import fragmentShader from '../../../shaders/particlesMorphing/fragment.glsl';
import gsap from 'gsap';

export default class ParticlesMorphingScene extends World {

    constructor() {

        super();        

    }

    init() {

        this.setParameters();
        this.setModel();
        this.setParticles();

        // debug
        if (this.debug.active) {

            this.rendererFolder = this.debug.ui.addFolder('Renderer');
            this.shaderFolder = this.debug.ui.addFolder('Shader');

            this.setGui();

        }

    }

    setParameters() {

        this.particles = {
            index: 0,
            morph0: () => this.morph(0),
            morph1: () => this.morph(1),
            morph2: () => this.morph(2),
            morph3: () => this.morph(3),
            morphAll: () => this.morphAll(),
            infiniteMorph: () => this.infiniteMorphAll(),
            colorA: '#ff7300',
            colorB: '#0091ff'

        };

        if (this.debug.active) {

            this.debugObject = {};
            Object.assign(this.debugObject, this.sceneConfig.renderer);
            this.debugObject.color = new Color(this.sceneConfig.renderer);

        };

    }

    setModel() {

        this.models = this.resources.items.textSamples.scene;

        this.modelPositions = this.models.children.map(child => child.geometry.attributes.position);

        this.particles.maxCount = 0;
        for (const position of this.modelPositions) {

            if (position.count > this.particles.maxCount) {

                this.particles.maxCount = position.count;

            }

        }

        this.particles.positions = [];
        this.particles.sizes = [];
        for (let j = 0, jl = this.modelPositions.length; j < jl; j++) {

            const position = this.modelPositions[j];
            const originArray = position.array;
            const targetArray = [];
            const sizes = [];

            for (let i = 0; i < this.particles.maxCount; i++) {

                const i3 = i * 3;

                if (i3 < originArray.length) {

                    targetArray[i3] = originArray[i3];
                    targetArray[i3 + 1] = originArray[i3 + 1];
                    targetArray[i3 + 2] = originArray[i3 + 2];

                } else {

                    const randomIndex = Math.floor(position.count * Math.random()) * 3;
                    targetArray[i3] = originArray[randomIndex];
                    targetArray[i3 + 1] = originArray[randomIndex + 1];
                    targetArray[i3 + 2] = originArray[randomIndex + 2];

                }

                sizes[i] = Math.random();

            }

            this.particles.positions.push(new Float32BufferAttribute(targetArray, 3));
            this.particles.sizes.push(new Float32BufferAttribute(sizes, 1));

        }        

    }

    setParticles() {        

        // geometry
        this.particles.geometry = new BufferGeometry();
        this.particles.geometry.setAttribute('position', this.particles.positions[this.particles.index]);
        this.particles.geometry.setAttribute('aPositionTarget', this.particles.positions[3]);
        this.particles.geometry.setAttribute('aSize', this.particles.sizes[this.particles.index]);
        this.particles.geometry.setAttribute('aSizeTarget', this.particles.sizes[3]);

        // material
        this.particles.material = new ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                uSize: new Uniform(0.4),
                uResolution: new Uniform(this.sizes.resolution),
                uProgress: new Uniform(0),
                uDuration: new Uniform(0.4),
                uColorA: new Uniform(new Color(this.particles.colorA)),
                uColorB: new Uniform(new Color(this.particles.colorB))
            },
            transparent: true,
            depthWrite: false,
            blending: AdditiveBlending
        });

        // points
        this.particles.points = new Points(this.particles.geometry, this.particles.material);
        this.particles.points.frustumCulled = false;

        this.scene.add(this.particles.points);

    }

    morph(idx, callback) {

        if (!callback || this.morphAllRunning) {

            this.animation?.kill();
            this.morphAllRunning = false;

        }

        // if (idx === this.particles.index) return;

        const { geometry, material, positions, sizes, index } = this.particles;
        geometry.attributes.position = positions[index];
        geometry.attributes.aPositionTarget = positions[idx];
        geometry.attributes.aSize = sizes[index];
        geometry.attributes.aSizeTarget = sizes[idx];

        this.animation = gsap.fromTo(
            material.uniforms.uProgress,
            { value: 0 },
            { value: 1, duration: 3, ease: 'linear', onComplete: () => callback?.() }
        );

        // save index
        this.particles.index = idx;

    }

    morphAll(callback) {
        
        this.morphAllRunning = true;

        const morphAfter1 = () => {

            this.morph(1, () => {

                this.morph(2, () => {

                    this.morph(3, callback);

                });

            });

        }

        if (this.particles.index > 0) {

            this.morph(0, () => {

                morphAfter1();

            });

        } else {

            morphAfter1();

        }        

    }

    infiniteMorphAll() {

        this.morphAllRunning = true;

        this.morphAll(() => {

            this.infiniteMorphAll();

        });

    }

    setGui() {

        this.rendererFolder.addColor(this.debugObject, 'clearColor')
            .onChange(value => this.renderer.setClearColor(value));

        this.shaderFolder.addColor(this.particles, 'colorA').onChange(value => this.particles.material.uniforms.uColorA.value.set(value));
        this.shaderFolder.addColor(this.particles, 'colorB').onChange(value => this.particles.material.uniforms.uColorB.value.set(value));

        this.shaderFolder.add(this.particles.material.uniforms.uSize, 'value', 0, 1, .001).name('uSize');
        this.shaderFolder.add(this.particles.material.uniforms.uDuration, 'value', 0, 1, .001).name('uDuration').listen();
        this.shaderFolder.add(this.particles.material.uniforms.uProgress, 'value', 0, 1, .001).name('uProgress').listen();

        this.shaderFolder.add(this.particles, 'morph0');
        this.shaderFolder.add(this.particles, 'morph1');
        this.shaderFolder.add(this.particles, 'morph2');
        this.shaderFolder.add(this.particles, 'morph3');
        this.shaderFolder.add(this.particles, 'morphAll');
        this.shaderFolder.add(this.particles, 'infiniteMorph');

    }

    tick(delta, elapsed) {

        this.particles.points.rotation.y = Math.sin(elapsed * 0.1) * 0.8;
        this.particles.points.rotation.x = Math.sin(elapsed * 0.8) * 0.2;

    }

};