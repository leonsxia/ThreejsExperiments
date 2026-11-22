import { Mesh, Uniform, Color, DirectionalLight, PlaneGeometry, MeshStandardMaterial, MeshPhysicalMaterial, IcosahedronGeometry, EquirectangularReflectionMapping, MeshDepthMaterial, DirectionalLightHelper, CameraHelper, DoubleSide } from 'three';
import World from '../World';
import vertexShader from '../../../shaders/wobble/vertex.glsl';
import vertexNoWobbleShader from '../../../shaders/wobble/vertex_no_wobble.glsl';
import vertexNoTangentDefinedShader from '../../../shaders/wobble/vertex_no_tangent_defined.glsl';
import fragmentWobbleShader from '../../../shaders/wobble/fragment_wobble.glsl';
import fragmentShader from '../../../shaders/wobble/fragment.glsl';
import CustomShaderMaterial from 'three-custom-shader-material/vanilla';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';

export default class WobblySphereScene extends World {

    constructor() {

        super();

    }

    init() {

        this.setParameters();
        this.setHDR();
        this.setLight();
        this.setMaterial();
        this.setProps();        
        this.setVirusMesh();
        // this.setWobbleModel();

        // debug
        if (this.debug.active) {

            this.VirusFolder = this.debug.ui.addFolder('Virus');
            this.virusShaderFolder = this.VirusFolder.addFolder('Shader');
            this.skinWallFolder = this.debug.ui.addFolder('Skin Wall');
            this.skinWallShaderFolder = this.skinWallFolder.addFolder('Shader');            

            this.setGui();

        }

    }

    setParameters() {

        this.virusObject = {
            colorA: '#e6b084',
            colorB: '#f40b0b'
        };

        this.skinWallObject = {
            colorA: '#e6b084',
            colorB: '#f40b0b'
        };

    }

    setHDR() {

        this.resources.items.urbanAlleyHDR.mapping = EquirectangularReflectionMapping;
        this.scene.background = this.resources.items.urbanAlleyHDR;
        this.scene.environment = this.resources.items.urbanAlleyHDR;

    }

    setLight() {

        this.directionalLight = new DirectionalLight('#ffffff', 3);
        this.directionalLight.castShadow = true;
        this.directionalLight.shadow.mapSize.set(1024, 1024);
        this.directionalLight.shadow.camera.far = 50;
        this.directionalLight.shadow.normalBias = .05;
        this.directionalLight.shadow.camera.left = - 15;
        this.directionalLight.shadow.camera.right = 15;
        this.directionalLight.shadow.camera.top = 15;
        this.directionalLight.shadow.camera.bottom = - 15;
        this.directionalLight.position.set(0.25, 20, - 22.5);

        this.scene.add(this.directionalLight);

        // this.scene.add(new DirectionalLightHelper(this.directionalLight));
        // this.scene.add(new CameraHelper(this.directionalLight.shadow.camera));

    }

    setProps() {

        const segments = 1;
        this.skinWallGeometry = new PlaneGeometry(19.2, 12.8, segments, segments);
        this.skinWallGeometry = mergeVertices(this.skinWallGeometry);
        this.skinWallGeometry.computeTangents();
        this.skinWall = new Mesh(
            this.skinWallGeometry,
            this.skinWallMaterial
        );        
        // this.plane.customDepthMaterial = this.depthMaterial;
        this.skinWall.receiveShadow = true;
        this.skinWall.castShadow = true;
        this.skinWall.rotation.y = Math.PI;
        this.skinWall.position.set(0, - 5, 5);

        this.scene.add(this.skinWall);

    }

    setMaterial() {

        this.uniforms = {
            uTime: new Uniform(0),
            uPositionFrequency: new Uniform(0.5),
            uTimeFrequency: new Uniform(0.4),
            uStrength: new Uniform(0.3),
            uWarpPositionFrequency: new Uniform(0.38),
            uWarpTimeFrequency: new Uniform(0.12),
            uWarpStrength: new Uniform(1.7),
            uColorA: new Uniform(new Color(this.virusObject.colorA)),
            uColorB: new Uniform(new Color(this.virusObject.colorB)),
            uWobbleLevel: new Uniform(0.5)
        };

        this.virusUniforms = {
            uTime: new Uniform(0),
            uPositionFrequency: new Uniform(0.353),
            uTimeFrequency: new Uniform(0.255),
            uStrength: new Uniform(0.429),
            uWarpPositionFrequency: new Uniform(0.853),
            uWarpTimeFrequency: new Uniform(0.29),
            uWarpStrength: new Uniform(1.14),
            uColorA: new Uniform(new Color(this.virusObject.colorA)),
            uColorB: new Uniform(new Color(this.virusObject.colorB)),
            uWobbleLevel: new Uniform(0.459)
        };

        this.silentHillUniforms = {
            uTime: new Uniform(0),
            uPositionFrequency: new Uniform(0.353),
            uTimeFrequency: new Uniform(0.255),
            uStrength: new Uniform(0.673),
            uWarpPositionFrequency: new Uniform(0.853),
            uWarpTimeFrequency: new Uniform(0.29),
            uWarpStrength: new Uniform(1.14),
            uColorA: new Uniform(new Color(this.skinWallObject.colorA)),
            uColorB: new Uniform(new Color(this.skinWallObject.colorB)),
            uWobbleLevel: new Uniform(0.459)
        };

        this.virusMaterial = new CustomShaderMaterial({
            // CSM
            baseMaterial: MeshPhysicalMaterial,
            vertexShader,
            fragmentShader,
            uniforms: this.virusUniforms,
            // MeshPhysicalMaterial
            metalness: 0,
            roughness: 0.5,
            color: '#140000',
            transmission: 0.275,
            ior: 1.5,
            thickness: 2.257,
            transparent: true,
            wireframe: false
        });

        this.resources.items.metal168.anisotropy = 8;
        this.resources.items.metal168Normal.anisotropy = 8;
        this.resources.items.damagedPlaster.anisotropy = 8;
        this.resources.items.damagedPasterNormal.anisotropy = 8;
        this.resources.items.brickWall1.anisotropy = 8;
        this.resources.items.brickWall1Normal.anisotropy = 8;
        this.skinWallMaterial = new CustomShaderMaterial({
            // CSM
            baseMaterial: MeshPhysicalMaterial,
            vertexShader: vertexNoWobbleShader,
            fragmentShader: fragmentWobbleShader,
            uniforms: this.silentHillUniforms,
            // MeshPhysicalMaterial
            metalness: 0,
            roughness: 0.5,
            color: '#ffffff',
            transmission: 0.164,
            ior: 1.519,
            thickness: 2.257,
            transparent: true,
            wireframe: false,
            map: this.resources.items.metal168,
            normalMap: this.resources.items.metal168Normal,
            side: DoubleSide
        });

        this.depthMaterial = new CustomShaderMaterial({
            // CSM
            baseMaterial: MeshDepthMaterial,
            vertexShader,
            uniforms: this.virusUniforms
        });

    }

    setVirusMesh() {

        this.virusGeometry = new IcosahedronGeometry(2.5, 50);
        this.virusGeometry = mergeVertices(this.virusGeometry);
        this.virusGeometry.computeTangents();
        this.virus = new Mesh(this.virusGeometry, this.virusMaterial);
        this.virus.customDepthMaterial = this.depthMaterial;
        this.virus.receiveShadow = true;
        this.virus.castShadow = true;
        this.virus.position.set(- 10, 0, - 3);

        this.scene.add(this.virus);
        
    }

    setWobbleModel() {

        this.wobble = this.resources.items.suzanne2.scene.children[0];
        this.wobble.material = this.virusMaterial;
        this.wobble.customDepthMaterial = this.depthMaterial;
        this.wobble.receiveShadow = true;
        this.wobble.castShadow = true;
        this.wobble.position.set(- 10, 0, - 3);

        this.scene.add(this.wobble);

    }

    setGui() {

        // virus
        this.VirusFolder.add(this.virusMaterial, 'metalness', 0, 1, .001).listen();
        this.VirusFolder.add(this.virusMaterial, 'roughness', 0, 1, .001).listen();
        this.VirusFolder.add(this.virusMaterial, 'transmission', 0, 1, .001);
        this.VirusFolder.add(this.virusMaterial, 'ior', 0, 10, .001);
        this.VirusFolder.add(this.virusMaterial, 'thickness', 0, 10, .001);
        this.VirusFolder.addColor(this.virusMaterial, 'color');

        this.virusShaderFolder.add(this.virusUniforms.uPositionFrequency, 'value', 0, 2, .001).name('uPositionFrequency');
        this.virusShaderFolder.add(this.virusUniforms.uTimeFrequency, 'value', 0, 2, .001).name('uTimeFrequency');
        this.virusShaderFolder.add(this.virusUniforms.uStrength, 'value', 0, 2, .001).name('uStrength');
        this.virusShaderFolder.add(this.virusUniforms.uWarpPositionFrequency, 'value', 0, 15, .001).name('uWarpPositionFrequency');
        this.virusShaderFolder.add(this.virusUniforms.uWarpTimeFrequency, 'value', 0, 2, .001).name('uWarpTimeFrequency');
        this.virusShaderFolder.add(this.virusUniforms.uWarpStrength, 'value', 0, 2, .001).name('uWarpStrength');
        this.virusShaderFolder.addColor(this.virusObject, 'colorA').onChange(value => this.virusUniforms.uColorA.value.set(value));
        this.virusShaderFolder.addColor(this.virusObject, 'colorB').onChange(value => this.virusUniforms.uColorB.value.set(value));
        this.virusShaderFolder.add(this.virusUniforms.uWobbleLevel, 'value', 0, 1, .001).name('uWobbleLevel');

        // skin wall
        this.skinWallFolder.add(this.skinWallMaterial, 'metalness', 0, 1, .001).listen();
        this.skinWallFolder.add(this.skinWallMaterial, 'roughness', 0, 1, .001).listen();
        this.skinWallFolder.add(this.skinWallMaterial, 'transmission', 0, 1, .001);
        this.skinWallFolder.add(this.skinWallMaterial, 'ior', 0, 10, .001);
        this.skinWallFolder.add(this.skinWallMaterial, 'thickness', 0, 10, .001);
        this.skinWallFolder.addColor(this.skinWallMaterial, 'color');

        this.skinWallShaderFolder.add(this.silentHillUniforms.uPositionFrequency, 'value', 0, 2, .001).name('uPositionFrequency');
        this.skinWallShaderFolder.add(this.silentHillUniforms.uTimeFrequency, 'value', 0, 2, .001).name('uTimeFrequency');
        this.skinWallShaderFolder.add(this.silentHillUniforms.uStrength, 'value', 0, 2, .001).name('uStrength');
        this.skinWallShaderFolder.add(this.silentHillUniforms.uWarpPositionFrequency, 'value', 0, 15, .001).name('uWarpPositionFrequency');
        this.skinWallShaderFolder.add(this.silentHillUniforms.uWarpTimeFrequency, 'value', 0, 2, .001).name('uWarpTimeFrequency');
        this.skinWallShaderFolder.add(this.silentHillUniforms.uWarpStrength, 'value', 0, 2, .001).name('uWarpStrength');
        this.skinWallShaderFolder.addColor(this.skinWallObject, 'colorA').onChange(value => this.silentHillUniforms.uColorA.value.set(value));
        this.skinWallShaderFolder.addColor(this.skinWallObject, 'colorB').onChange(value => this.silentHillUniforms.uColorB.value.set(value));
        this.skinWallShaderFolder.add(this.silentHillUniforms.uWobbleLevel, 'value', 0, 1, .001).name('uWobbleLevel');

    }

    tick(delta, elapsed) {

        this.virusUniforms.uTime.value = elapsed;
        this.silentHillUniforms.uTime.value = elapsed;
        // this.skinWall.rotation.y += delta * 0.2;

    }

}