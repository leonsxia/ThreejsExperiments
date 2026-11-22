import { Mesh, Uniform, Color, DirectionalLight, PlaneGeometry, MeshStandardMaterial, MeshPhysicalMaterial, IcosahedronGeometry, EquirectangularReflectionMapping, MeshDepthMaterial, DirectionalLightHelper, CameraHelper, DoubleSide } from 'three';
import World from '../World';
import vertexShader from '../../../shaders/wobble/vertex.glsl';
import vertexWithTangentDefinedShader from '../../../shaders/wobble/vertexWithTangentDefined.glsl';
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
        this.setWobbleMesh();
        // this.setWobbleModel();

        // debug
        if (this.debug.active) {

            this.objectFolder = this.debug.ui.addFolder('Object');
            this.wallFolder = this.debug.ui.addFolder('Wall');
            this.shaderFolder = this.debug.ui.addFolder('Shader');

            this.setGui();

        }

    }

    setParameters() {

        this.debugObject = {
            colorA: '#f4c29a',
            colorB: '#ef0b0b'
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
        this.directionalLight.shadow.camera.left = - 10;
        this.directionalLight.shadow.camera.right = 10;
        this.directionalLight.position.set(0.25, 20, - 22.5);

        this.scene.add(this.directionalLight);

        // this.scene.add(new DirectionalLightHelper(this.directionalLight));
        // this.scene.add(new CameraHelper(this.directionalLight.shadow.camera));

    }

    setProps() {

        this.planeGeometry = new PlaneGeometry(19.2, 12.8, 200, 200);
        this.planeGeometry = mergeVertices(this.planeGeometry);
        this.planeGeometry.computeTangents();
        this.plane = new Mesh(
            this.planeGeometry,
            this.planeMaterial
        );        
        this.plane.customDepthMaterial = this.depthMaterial;
        this.plane.receiveShadow = true;
        this.plane.castShadow = true;
        this.plane.rotation.y = Math.PI;
        this.plane.position.set(0, - 5, 5);

        this.scene.add(this.plane);

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
            uColorA: new Uniform(new Color(this.debugObject.colorA)),
            uColorB: new Uniform(new Color(this.debugObject.colorB)),
            uBaseColor: new Uniform(0.5)
        };

        this.silentHillUniforms = {
            uTime: new Uniform(0),
            uPositionFrequency: new Uniform(0.304),
            uTimeFrequency: new Uniform(0.255),
            uStrength: new Uniform(0.132),
            uWarpPositionFrequency: new Uniform(0.853),
            uWarpTimeFrequency: new Uniform(0.29),
            uWarpStrength: new Uniform(1.14),
            uColorA: new Uniform(new Color(this.debugObject.colorA)),
            uColorB: new Uniform(new Color(this.debugObject.colorB)),
            uBaseColor: new Uniform(0.85)
        };

        this.currentUniforms = this.silentHillUniforms;

        this.material = new CustomShaderMaterial({
            // CSM
            baseMaterial: MeshPhysicalMaterial,
            vertexShader,
            fragmentShader,
            uniforms: this.currentUniforms,
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
        this.planeMaterial = new CustomShaderMaterial({
            // CSM
            baseMaterial: MeshPhysicalMaterial,
            vertexShader: vertexWithTangentDefinedShader,
            fragmentShader,
            uniforms: this.currentUniforms,
            // MeshPhysicalMaterial
            metalness: 0,
            roughness: 0.5,
            transmission: 0,
            ior: 1.5,
            thickness: 1.5,
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
            uniforms: this.currentUniforms
        });

    }

    setWobbleMesh() {

        this.geometry = new IcosahedronGeometry(2.5, 50);
        this.geometry = mergeVertices(this.geometry);
        this.geometry.computeTangents();
        this.wobble = new Mesh(this.geometry, this.material);
        this.wobble.customDepthMaterial = this.depthMaterial;
        this.wobble.receiveShadow = true;
        this.wobble.castShadow = true;
        this.wobble.position.set(- 10, 0, - 3);

        this.scene.add(this.wobble);
        
    }

    setWobbleModel() {

        this.wobble = this.resources.items.suzanne2.scene.children[0];
        this.wobble.material = this.material;
        this.wobble.customDepthMaterial = this.depthMaterial;
        this.wobble.receiveShadow = true;
        this.wobble.castShadow = true;
        this.wobble.position.set(- 10, 0, - 3);

        this.scene.add(this.wobble);

    }

    setGui() {

        this.objectFolder.add(this.material, 'metalness', 0, 1, .001).listen();
        this.objectFolder.add(this.material, 'roughness', 0, 1, .001).listen();
        this.objectFolder.add(this.material, 'transmission', 0, 1, .001);
        this.objectFolder.add(this.material, 'ior', 0, 10, .001);
        this.objectFolder.add(this.material, 'thickness', 0, 10, .001);
        this.objectFolder.addColor(this.material, 'color');

        this.wallFolder.add(this.planeMaterial, 'metalness', 0, 1, .001).listen();
        this.wallFolder.add(this.planeMaterial, 'roughness', 0, 1, .001).listen();
        this.wallFolder.add(this.planeMaterial, 'transmission', 0, 1, .001);
        this.wallFolder.add(this.planeMaterial, 'ior', 0, 10, .001);
        this.wallFolder.add(this.planeMaterial, 'thickness', 0, 10, .001);
        this.wallFolder.addColor(this.planeMaterial, 'color');

        this.shaderFolder.add(this.currentUniforms.uPositionFrequency, 'value', 0, 2, .001).name('uPositionFrequency');
        this.shaderFolder.add(this.currentUniforms.uTimeFrequency, 'value', 0, 2, .001).name('uTimeFrequency');
        this.shaderFolder.add(this.currentUniforms.uStrength, 'value', 0, 2, .001).name('uStrength');
        this.shaderFolder.add(this.currentUniforms.uWarpPositionFrequency, 'value', 0, 10, .001).name('uWarpPositionFrequency');
        this.shaderFolder.add(this.currentUniforms.uWarpTimeFrequency, 'value', 0, 2, .001).name('uWarpTimeFrequency');
        this.shaderFolder.add(this.currentUniforms.uWarpStrength, 'value', 0, 2, .001).name('uWarpStrength');
        this.shaderFolder.addColor(this.debugObject, 'colorA').onChange(value => this.currentUniforms.uColorA.value.set(value));
        this.shaderFolder.addColor(this.debugObject, 'colorB').onChange(value => this.currentUniforms.uColorB.value.set(value));
        this.shaderFolder.add(this.currentUniforms.uBaseColor, 'value', 0, 1, .001).name('uBaseColor');

    }

    tick(delta, elapsed) {

        this.currentUniforms.uTime.value = elapsed;

    }

}