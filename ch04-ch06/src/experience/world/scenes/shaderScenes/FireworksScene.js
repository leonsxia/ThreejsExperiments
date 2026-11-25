import { Spherical, Vector3, BufferGeometry, Float32BufferAttribute, ShaderMaterial, Uniform, Points, Color, MathUtils, Mesh, PlaneGeometry, MeshBasicMaterial, AdditiveBlending } from 'three';
import { Sky } from 'three/addons/objects/Sky.js';
import gsap from 'gsap';
import vertexShader from '../../../shaders/fireworks/vertex.glsl';
import fragmentShader from '../../../shaders/fireworks/fragment.glsl';
import World from '../World';

const v0 = new Vector3();
const v1 = new Vector3();
const sph1 = new Spherical();
const color0 = new Color('#8affff');

export default class FireworksScene extends World {

    constructor(specs) {

        super(specs);        

    }

    init() {

        this.setParameters();
        this.setTextures();
        this.setSky();

        // test
        //this.createFireWork();

        // const test = new Mesh(new PlaneGeometry(), new MeshBasicMaterial());
        // this.scene.add(test);

    }

    setParameters() {

        this.skyParameters = {
            turbidity: 10,
            rayleigh: 3,
            mieCoefficient: 0.005,
            mieDirectionalG: 0.95,
            elevation: - 1.82,
            azimuth: 180,
            exposure: this.renderer.toneMappingExposure
        };

    }

    setDebugParameters() {

        this.debugGui.debugFolder = this.debug.ui.addFolder('Debug');

    }

    clickEvent = () => {

        this.createRandomFirework();

    }

    suspend() {

        super.suspend();
        window.removeEventListener('click', this.clickEvent);

    }

    alive() {

        super.alive();
        window.addEventListener('click', this.clickEvent);

    }

    setTextures() {

        this.textures = [
            this.resources.items.particle01,
            this.resources.items.particle02,
            this.resources.items.particle04,
            this.resources.items.particle05,
            this.resources.items.particle08,
            this.resources.items.particle09,
            this.resources.items.particle10,
            this.resources.items.particle11
        ];

    }

    createFireWork(specs) {

        const { count = 100, position = v0, size = .5, texture = this.textures[7], radius = 1, color = color0 } = specs ?? {};

        // geometry
        const positionsArray = [];
        const sizesArray = [];
        const timeMultipliersArray = [];

        for (let i = 0; i < count; i++) {

            const i3 = i * 3;

            sph1.set(
                radius * (0.75 + Math.random() * 0.25),
                Math.random() * Math.PI,
                Math.random() * Math.PI * 2
            );

            v1.setFromSpherical(sph1);

            positionsArray[i3] = v1.x;
            positionsArray[i3 + 1] = v1.y;
            positionsArray[i3 + 2] = v1.z;

            sizesArray[i] = Math.random();

            timeMultipliersArray[i] = 1 + Math.random();

        }

        const geometry = new BufferGeometry();
        geometry.setAttribute('position', new Float32BufferAttribute(positionsArray, 3));
        geometry.setAttribute('aSize', new Float32BufferAttribute(sizesArray, 1));
        geometry.setAttribute('aTimeMultiplier', new Float32BufferAttribute(timeMultipliersArray, 1));

        // material
        texture.flipY = false;
        const material = new ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            uniforms: {
                uSize: new Uniform(size),
                uResolution: new Uniform(this.sizes.resolution),
                uTexture: new Uniform(texture),
                uColor: new Uniform(color),
                uProgress: new Uniform(0)
            },
            transparent: true,
            depthWrite: false,
            blending: AdditiveBlending
        });

        // points
        const firework = new Points(geometry, material);
        firework.position.copy(position);

        this.scene.add(firework);

        // destroy
        const destroy = () => {

            this.scene.remove(firework);
            geometry.dispose();
            material.dispose();

        };

        // animate
        gsap.to(
            material.uniforms.uProgress,
            { value: 1, ease: 'linear', duration: 3, onComplete: destroy }
        );

    }

    createRandomFirework() {

        console.log('firework');
        this.createFireWork({
            count: Math.round(400 + Math.random() * 1000),
            position: new Vector3(Math.random() - 0.5, Math.random(), Math.random() - 0.5),
            size: 0.1 + Math.random() * 0.1,
            texture: this.textures[Math.floor(Math.random() * this.textures.length)],
            radius: 0.5 + Math.random(),
            color: new Color().setHSL(Math.random(), 1, 0.7)
        });

    }

    setSky() {

        this.sky = new Sky();
        this.sky.scale.setScalar(450000);
        this.scene.add(this.sky);

        this.sun = new Vector3();

        this.setUpdateSky();

    }    

    setUpdateSky() {

        this.updateSky = () => {

            const uniforms = this.sky.material.uniforms;
            uniforms['turbidity'].value = this.skyParameters.turbidity;
            uniforms['rayleigh'].value = this.skyParameters.rayleigh;
            uniforms['mieCoefficient'].value = this.skyParameters.mieCoefficient;
            uniforms['mieDirectionalG'].value = this.skyParameters.mieDirectionalG;

            const phi = MathUtils.degToRad(90 - this.skyParameters.elevation);
            const theta = MathUtils.degToRad(this.skyParameters.azimuth);

            this.sun.setFromSphericalCoords(1, phi, theta);

            uniforms['sunPosition'].value.copy(this.sun);

            this.renderer.toneMappingExposure = this.skyParameters.exposure;

        };

        this.updateSky();

    }

    setGui() {

        this.debugGui.debugFolder.add(this.skyParameters, 'turbidity', 0, 20, .1).onChange(this.updateSky);
        this.debugGui.debugFolder.add(this.skyParameters, 'rayleigh', 0, 4, .001).onChange(this.updateSky);
        this.debugGui.debugFolder.add(this.skyParameters, 'mieCoefficient', 0, .1, .001).onChange(this.updateSky);
        this.debugGui.debugFolder.add(this.skyParameters, 'mieDirectionalG', 0, 1, .001).onChange(this.updateSky);
        this.debugGui.debugFolder.add(this.skyParameters, 'elevation', - 3, 65, .01).onChange(this.updateSky);
        this.debugGui.debugFolder.add(this.skyParameters, 'azimuth', - 180, 180, .1).onChange(this.updateSky);
        this.debugGui.debugFolder.add(this.skyParameters, 'exposure', 0, 1, .0001).onChange(this.updateSky);

    }

};