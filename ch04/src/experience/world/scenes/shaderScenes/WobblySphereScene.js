import { Mesh, Uniform, Color, DirectionalLight, PlaneGeometry, MeshStandardMaterial, MeshPhysicalMaterial, IcosahedronGeometry, EquirectangularReflectionMapping, MeshDepthMaterial } from 'three';
import World from '../World';
import vertexShader from '../../../shaders/wobble/vertex.glsl';
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
        // this.setWobbleMesh();
        this.setWobbleModel();

        // debug
        if (this.debug.active) {

            this.materialFolder = this.debug.ui.addFolder('Material');
            this.shaderFolder = this.debug.ui.addFolder('Shader');

            this.setGui();

        }

    }

    setParameters() {

        this.debugObject = {
            colorA: '#0000ff',
            colorB: '#ff0000'
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
        this.directionalLight.shadow.camera.far = 15;
        this.directionalLight.shadow.normalBias = .05;
        this.directionalLight.position.set(0.25, 2, - 2.25);

        this.scene.add(this.directionalLight);

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

        this.material = new CustomShaderMaterial({
            // CSM
            baseMaterial: MeshPhysicalMaterial,
            vertexShader,
            fragmentShader,
            uniforms: this.uniforms,
            // MeshPhysicalMaterial
            metalness: 0,
            roughness: 0.5,
            color: '#ffffff',
            transmission: 0,
            ior: 1.5,
            thickness: 1.5,
            transparent: true,
            wireframe: false
        });

        this.planeMaterial = new CustomShaderMaterial({
            // CSM
            baseMaterial: MeshPhysicalMaterial,
            vertexShader,
            fragmentShader,
            uniforms: this.uniforms,
            // MeshPhysicalMaterial
            metalness: 0,
            roughness: 0.5,
            transmission: 0,
            ior: 1.5,
            thickness: 1.5,
            transparent: true,
            wireframe: false,
            map: this.resources.items.metal168,
            // normalMap: this.resources.items.metal168Normal
        });

        this.depthMaterial = new CustomShaderMaterial({
            // CSM
            baseMaterial: MeshDepthMaterial,
            vertexShader,
            uniforms: this.uniforms
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

        this.scene.add(this.wobble);
        
    }

    setWobbleModel() {

        this.wobble = this.resources.items.suzanne2.scene.children[0];
        this.wobble.material = this.material;
        this.wobble.customDepthMaterial = this.depthMaterial;
        this.wobble.receiveShadow = true;
        this.wobble.castShadow = true;

        this.scene.add(this.wobble);

    }

    setGui() {

        this.materialFolder.add(this.material, 'metalness', 0, 1, .001);
        this.materialFolder.add(this.material, 'roughness', 0, 1, .001);
        this.materialFolder.add(this.material, 'transmission', 0, 1, .001);
        this.materialFolder.add(this.material, 'ior', 0, 10, .001);
        this.materialFolder.add(this.material, 'thickness', 0, 10, .001);
        this.materialFolder.addColor(this.material, 'color');

        this.shaderFolder.add(this.uniforms.uPositionFrequency, 'value', 0, 10, .001).name('uPositionFrequency');
        this.shaderFolder.add(this.uniforms.uTimeFrequency, 'value', 0, 2, .001).name('uTimeFrequency');
        this.shaderFolder.add(this.uniforms.uStrength, 'value', 0, 2, .001).name('uStrength');
        this.shaderFolder.add(this.uniforms.uWarpPositionFrequency, 'value', 0, 10, .001).name('uWarpPositionFrequency');
        this.shaderFolder.add(this.uniforms.uWarpTimeFrequency, 'value', 0, 2, .001).name('uWarpTimeFrequency');
        this.shaderFolder.add(this.uniforms.uWarpStrength, 'value', 0, 2, .001).name('uWarpStrength');
        this.shaderFolder.addColor(this.debugObject, 'colorA').onChange(value => this.uniforms.uColorA.value.set(value));
        this.shaderFolder.addColor(this.debugObject, 'colorB').onChange(value => this.uniforms.uColorB.value.set(value));
        this.shaderFolder.add(this.uniforms.uBaseColor, 'value', 0, 1, .001).name('uBaseColor');

    }

    tick(delta, elapsed) {

        this.uniforms.uTime.value = elapsed;

    }

}