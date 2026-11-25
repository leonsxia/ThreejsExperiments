import { Mesh, Uniform, Color, DirectionalLight, PlaneGeometry, MeshStandardMaterial, MeshPhysicalMaterial, IcosahedronGeometry, EquirectangularReflectionMapping, MeshDepthMaterial, DirectionalLightHelper, CameraHelper, DoubleSide, SRGBColorSpace } from 'three';
import World from '../World';
import vertexMutatedVertexShader from '../../../shaders/mutatedSkin/vertex_mutated/vertex.glsl';
import vertexMutatedFragmentShader from '../../../shaders/mutatedSkin/vertex_mutated/fragment.glsl';
import vertexMutatedNoTangentDefinedShader from '../../../shaders/mutatedSkin/vertex_mutated/vertex_no_tangent_defined.glsl';
import fragmentMutatedVertexShader from '../../../shaders/mutatedSkin/fragment_mutated/vertex.glsl';
import fragmentMutatedFragmentShader from '../../../shaders/mutatedSkin/fragment_mutated/fragment.glsl';
import CustomShaderMaterial from 'three-custom-shader-material/vanilla';
import { mergeVertices, computeMikkTSpaceTangents } from 'three/addons/utils/BufferGeometryUtils.js';
import * as MikkTSpace from 'three/addons/libs/mikktspace.module.js';

await MikkTSpace.ready;

export default class MutatedSkinScene extends World {

    constructor(specs) {

        super(specs);

    }

    init() {

        this.setParameters();
        this.setHDR();
        this.setLight();
        this.setTextures();
        this.setMaterial();
        this.setProps();        
        this.setVirusMesh();
        // this.setWobbleModel();
        this.setMan();

    }

    setDebugParameters() {

        this.debugGui.virusFolder = this.debug.ui.addFolder('Virus');
        this.debugGui.virusShaderFolder = this.debugGui.virusFolder.addFolder('Shader');
        this.debugGui.skinWallFolder = this.debug.ui.addFolder('Skin Wall');
        this.debugGui.skinWallShaderFolder = this.debugGui.skinWallFolder.addFolder('Shader');
        this.debugGui.manFolder = this.debug.ui.addFolder('Man');
        this.debugGui.manSkinShaderFolder = this.debugGui.manFolder.addFolder('Shader');

    }

    setParameters() {

        this.virusObject = {
            colorA: '#e6b084',
            colorB: '#f40b0b'
        };

        this.skinWallObject = {
            colorA: '#e6b084',
            colorB: '#8f0f0f'
        };

        this.skinObject = {
            colorA: '#e6b084',
            colorB: '#981616'
        };

    }

    setHDR() {

        this.resources.items.urbanAlleyHDR.mapping = EquirectangularReflectionMapping;
        this.scene.background = this.resources.items.urbanAlleyHDR;
        this.scene.environment = this.resources.items.urbanAlleyHDR;

    }

    setLight() {

        this.directionalLight = new DirectionalLight('#ffffff', 1);
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

        this.backwall = new Mesh(
            new PlaneGeometry(19.2, 12.8, segments, segments),
            new MeshStandardMaterial({
                map: this.resources.items.metal168,
                normalMap: this.resources.items.metal168Normal
            })
        );
        this.backwall.receiveShadow = true;
        this.backwall.castShadow = true;
        this.backwall.rotation.y = Math.PI;
        this.backwall.position.set(0, - 5, 5.01);

        this.scene.add(this.skinWall);

    }

    setTextures() {

        this.resources.items.metal168.anisotropy = 8;
        this.resources.items.metal168.colorSpace = SRGBColorSpace;
        this.resources.items.metal168Normal.anisotropy = 8;
        this.resources.items.damagedPlaster.anisotropy = 8;
        this.resources.items.damagedPlaster.colorSpace = SRGBColorSpace;
        this.resources.items.damagedPasterNormal.anisotropy = 8;
        this.resources.items.brickWall1.anisotropy = 8;
        this.resources.items.brickWall1.colorSpace = SRGBColorSpace;
        this.resources.items.brickWall1Normal.anisotropy = 8;
        this.resources.items.leePerrySmithColorTexture.colorSpace = SRGBColorSpace;

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
            uEffectLevel: new Uniform(0.5)
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
            uEffectLevel: new Uniform(0.459)
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
            uEffectLevel: new Uniform(0.459),
            uFadeout: new Uniform(0),
            uDensity: new Uniform(0.5)
        };

        this.skinUniforms = {
            uTime: new Uniform(0),
            uPositionFrequency: new Uniform(0.615),
            uTimeFrequency: new Uniform(0.255),
            uStrength: new Uniform(0.673),
            uWarpPositionFrequency: new Uniform(1.945),
            uWarpTimeFrequency: new Uniform(0.29),
            uWarpStrength: new Uniform(0.927),
            uColorA: new Uniform(new Color(this.skinObject.colorA)),
            uColorB: new Uniform(new Color(this.skinObject.colorB)),
            uEffectLevel: new Uniform(0.851),
            uFadeout: new Uniform(0.674),
            uDensity: new Uniform(0.566)
        };

        this.virusMaterial = new CustomShaderMaterial({
            // CSM
            baseMaterial: MeshPhysicalMaterial,
            vertexShader: vertexMutatedVertexShader,
            fragmentShader: vertexMutatedFragmentShader,
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

        this.skinWallMaterial = new CustomShaderMaterial({
            // CSM
            baseMaterial: MeshPhysicalMaterial,
            vertexShader: fragmentMutatedVertexShader,
            fragmentShader: fragmentMutatedFragmentShader,
            uniforms: this.silentHillUniforms,
            // MeshPhysicalMaterial
            metalness: 0,
            roughness: 0.6,
            color: '#ffffff',
            transmission: 0,
            ior: 1.519,
            thickness: 2.257,
            transparent: true,
            wireframe: false,
            map: this.resources.items.metal168,
            normalMap: this.resources.items.metal168Normal,
            side: DoubleSide
        });

        this.skinMaterial = new CustomShaderMaterial({
            // CSM
            baseMaterial: MeshPhysicalMaterial,
            vertexShader: fragmentMutatedVertexShader,
            fragmentShader: fragmentMutatedFragmentShader,
            uniforms: this.skinUniforms,
            // MeshPhysicalMaterial
            metalness: 0,
            roughness: 1,
            color: '#ffffff',
            transmission: 0,
            ior: 1.519,
            thickness: 2.257,
            transparent: true,
            wireframe: false,
            map: this.resources.items.leePerrySmithColorTexture,
            normalMap: this.resources.items.leePerrySmithNormalTexture
        });

        this.depthMaterial = new CustomShaderMaterial({
            // CSM
            baseMaterial: MeshDepthMaterial,
            vertexShader: vertexMutatedVertexShader,
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

    setMan() {

        this.man = this.resources.items.leePerrySmithModel.scene.children[0].clone();
        // this.man.geometry = mergeVertices(this.man.geometry);
        // this.man.geometry.computeTangents();
        this.man.material = this.skinMaterial;
        if (this.man.geometry.attributes['uv'] && this.man.material.normalMap && !this.man.geometry.attributes['tangent']) {

            computeMikkTSpaceTangents(this.man.geometry, MikkTSpace, false);

        }
        this.man.receiveShadow = true;
        this.man.castShadow = true;
        this.man.rotation.y = Math.PI * .5;
        this.man.position.set(0, - 5, 0);

        this.scene.add(this.man);

    }

    setGui() {

        // virus
        const virusFolder = this.debugGui.virusFolder;
        virusFolder.add(this.virusMaterial, 'metalness', 0, 1, .001).listen();
        virusFolder.add(this.virusMaterial, 'roughness', 0, 1, .001).listen();
        virusFolder.add(this.virusMaterial, 'transmission', 0, 1, .001);
        virusFolder.add(this.virusMaterial, 'ior', 0, 10, .001);
        virusFolder.add(this.virusMaterial, 'thickness', 0, 10, .001);
        virusFolder.addColor(this.virusMaterial, 'color');

        const virusShaderFolder = this.debugGui.virusShaderFolder;
        virusShaderFolder.add(this.virusUniforms.uPositionFrequency, 'value', 0, 2, .001).name('uPositionFrequency');
        virusShaderFolder.add(this.virusUniforms.uTimeFrequency, 'value', 0, 2, .001).name('uTimeFrequency');
        virusShaderFolder.add(this.virusUniforms.uStrength, 'value', 0, 2, .001).name('uStrength');
        virusShaderFolder.add(this.virusUniforms.uWarpPositionFrequency, 'value', 0, 15, .001).name('uWarpPositionFrequency');
        virusShaderFolder.add(this.virusUniforms.uWarpTimeFrequency, 'value', 0, 2, .001).name('uWarpTimeFrequency');
        virusShaderFolder.add(this.virusUniforms.uWarpStrength, 'value', 0, 2, .001).name('uWarpStrength');
        virusShaderFolder.addColor(this.virusObject, 'colorA').onChange(value => this.virusUniforms.uColorA.value.set(value));
        virusShaderFolder.addColor(this.virusObject, 'colorB').onChange(value => this.virusUniforms.uColorB.value.set(value));
        virusShaderFolder.add(this.virusUniforms.uEffectLevel, 'value', 0, 1, .001).name('uEffectLevel');

        // skin wall
        const skinWallFolder = this.debugGui.skinWallFolder;
        skinWallFolder.add(this.skinWallMaterial, 'metalness', 0, 1, .001).listen();
        skinWallFolder.add(this.skinWallMaterial, 'roughness', 0, 1, .001).listen();
        skinWallFolder.add(this.skinWallMaterial, 'transmission', 0, 1, .001);
        skinWallFolder.add(this.skinWallMaterial, 'ior', 0, 10, .001);
        skinWallFolder.add(this.skinWallMaterial, 'thickness', 0, 10, .001);
        skinWallFolder.addColor(this.skinWallMaterial, 'color');

        const skinWallShaderFolder = this.debugGui.skinWallShaderFolder;
        skinWallShaderFolder.add(this.silentHillUniforms.uPositionFrequency, 'value', 0, 2, .001).name('uPositionFrequency');
        skinWallShaderFolder.add(this.silentHillUniforms.uTimeFrequency, 'value', 0, 2, .001).name('uTimeFrequency');
        skinWallShaderFolder.add(this.silentHillUniforms.uStrength, 'value', 0, 2, .001).name('uStrength');
        skinWallShaderFolder.add(this.silentHillUniforms.uWarpPositionFrequency, 'value', 0, 15, .001).name('uWarpPositionFrequency');
        skinWallShaderFolder.add(this.silentHillUniforms.uWarpTimeFrequency, 'value', 0, 2, .001).name('uWarpTimeFrequency');
        skinWallShaderFolder.add(this.silentHillUniforms.uWarpStrength, 'value', 0, 5, .001).name('uWarpStrength');
        skinWallShaderFolder.addColor(this.skinWallObject, 'colorA').onChange(value => this.silentHillUniforms.uColorA.value.set(value));
        skinWallShaderFolder.addColor(this.skinWallObject, 'colorB').onChange(value => this.silentHillUniforms.uColorB.value.set(value));
        skinWallShaderFolder.add(this.silentHillUniforms.uEffectLevel, 'value', 0, 1, .001).name('uEffectLevel');
        skinWallShaderFolder.add(this.silentHillUniforms.uFadeout, 'value', 0, 1, .001).name('uFadeout');
        skinWallShaderFolder.add(this.silentHillUniforms.uDensity, 'value', 0, 1, .001).name('uDensity');

        // man skin
        const manFolder = this.debugGui.manFolder;
        manFolder.add(this.skinMaterial, 'metalness', 0, 1, .001).listen();
        manFolder.add(this.skinMaterial, 'roughness', 0, 1, .001).listen();
        manFolder.add(this.skinMaterial, 'transmission', 0, 1, .001);
        manFolder.add(this.skinMaterial, 'ior', 0, 10, .001);
        manFolder.add(this.skinMaterial, 'thickness', 0, 10, .001);
        manFolder.addColor(this.skinMaterial, 'color');

        const manSkinShaderFolder = this.debugGui.manSkinShaderFolder;
        manSkinShaderFolder.add(this.skinUniforms.uPositionFrequency, 'value', 0, 2, .001).name('uPositionFrequency');
        manSkinShaderFolder.add(this.skinUniforms.uTimeFrequency, 'value', 0, 2, .001).name('uTimeFrequency');
        manSkinShaderFolder.add(this.skinUniforms.uStrength, 'value', 0, 2, .001).name('uStrength');
        manSkinShaderFolder.add(this.skinUniforms.uWarpPositionFrequency, 'value', 0, 15, .001).name('uWarpPositionFrequency');
        manSkinShaderFolder.add(this.skinUniforms.uWarpTimeFrequency, 'value', 0, 2, .001).name('uWarpTimeFrequency');
        manSkinShaderFolder.add(this.skinUniforms.uWarpStrength, 'value', 0, 5, .001).name('uWarpStrength');
        manSkinShaderFolder.addColor(this.skinObject, 'colorA').onChange(value => this.skinUniforms.uColorA.value.set(value));
        manSkinShaderFolder.addColor(this.skinObject, 'colorB').onChange(value => this.skinUniforms.uColorB.value.set(value));
        manSkinShaderFolder.add(this.skinUniforms.uEffectLevel, 'value', 0, 1, .001).name('uEffectLevel');
        manSkinShaderFolder.add(this.skinUniforms.uFadeout, 'value', 0, 1, .001).name('uFadeout');
        manSkinShaderFolder.add(this.skinUniforms.uDensity, 'value', 0, 1, .001).name('uDensity');

    }

    tick(delta, elapsed) {

        this.virusUniforms.uTime.value = elapsed;
        this.silentHillUniforms.uTime.value = elapsed;
        this.skinUniforms.uTime.value = elapsed;
        // this.skinWall.rotation.y += delta * 0.2;
        this.man.rotation.y += delta * 0.1;

    }

}