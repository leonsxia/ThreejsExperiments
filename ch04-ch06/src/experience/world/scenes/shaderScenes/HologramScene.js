import { Mesh, TorusKnotGeometry, SphereGeometry, ShaderMaterial, Uniform, DoubleSide, AdditiveBlending, Color } from 'three';
import World from '../World';
import vertexShader from '../../../shaders/hologram/vertex.glsl';
import fragmentShader from '../../../shaders/hologram/fragment.glsl';

export default class HologramScene extends World {

    constructor(specs) {

        super(specs);
        
    }

    init() {

        this.setParameters();
        this.setMaterial();
        this.setModel();
        this.setMesh();
        
    }

    setDebugParameters() {

        this.debugGui.debugFolder = this.debug.ui.addFolder('Debug');
        this.debugGui.vertexShaderFolder = this.debug.ui.addFolder('Vertex Shader');
        this.debugGui.fragmentShaderFolder = this.debug.ui.addFolder('Fragment Shader');

    }

    setParameters() {

        this.debugObject = {};
        Object.assign(this.debugObject, this.sceneConfig.renderer);

        this.vertexShaderDebugObject = {
            glitchStrengthMod1: 3.45,
            glitchStrengthMod2: 8.76,
            glitchDuration: 0.7,
            glitchStrength: 0.25
        };

        this.fragmentShaderDebugObject = {
            color: '#70c1ff',
            stripesFlowSpeedY: 0.02,
            stripesSegments: 20,
            stripesSharpness: 3,
            falloffInsideOffset: 0.2,
            falloffOutsideOffset: 0.8,
            fresnelSharpness: 2,
            fresnelStrength: 1.25,
            enableFresnel: true,
            enableColorGradient: true
        };

    }

    setMaterial() {

        this.material = new ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            uniforms: {
                uTime: new Uniform(0),                
                // vertex shader uniforms
                uGlitchStrengthMod1: new Uniform(this.vertexShaderDebugObject.glitchStrengthMod1),
                uGlitchStrengthMod2: new Uniform(this.vertexShaderDebugObject.glitchStrengthMod2),
                uGlitchDuration: new Uniform(this.vertexShaderDebugObject.glitchDuration),
                uGlitchStrength: new Uniform(this.vertexShaderDebugObject.glitchStrength),
                // fragment shader uniforms
                uColor: new Uniform(new Color(this.fragmentShaderDebugObject.color)),
                uStripesFlowSpeedY: new Uniform(this.fragmentShaderDebugObject.stripesFlowSpeedY),
                uStripesSegments: new Uniform(this.fragmentShaderDebugObject.stripesSegments),
                uStripesSharpness: new Uniform(this.fragmentShaderDebugObject.stripesSharpness),
                uFalloffInsideOffset: new Uniform(this.fragmentShaderDebugObject.falloffInsideOffset),
                uFalloffOutsideOffset: new Uniform(this.fragmentShaderDebugObject.falloffOutsideOffset),
                uFresnelSharpness: new Uniform(this.fragmentShaderDebugObject.fresnelSharpness),
                uFresnelStrength: new Uniform(this.fragmentShaderDebugObject.fresnelStrength),
                uEnableFresnel: new Uniform(this.fragmentShaderDebugObject.enableFresnel),
                uEnableColorGradient: new Uniform(this.fragmentShaderDebugObject.enableColorGradient ? 0 : 1)
            },
            transparent: true,
            side: DoubleSide,
            depthWrite: false,
            blending: AdditiveBlending
        });

    }

    setModel() {

        this.suzanne = this.resources.items.suzanne.scene.clone();
        this.suzanne.traverse(object => {

            if (object.isMesh) {

                object.material = this.material;

            }

        });

        this.scene.add(this.suzanne);

    }

    setMesh() {

        this.torusKnot = new Mesh(
            new TorusKnotGeometry(0.6, 0.25, 128, 32),
            this.material
        );
        this.torusKnot.position.x = 3;

        this.sphere = new Mesh(
            new SphereGeometry(),
            this.material
        );
        this.sphere.position.x = - 3;

        this.scene.add(this.torusKnot, this.sphere);

    }

    setGui() {

        this.debugGui.debugFolder.addColor(this.debugObject, 'clearColor')
            .onChange(value => {
                this.renderer.instance.setClearColor(value);
            });

        // vertex shader
        this.debugGui.vertexShaderFolder.add(this.vertexShaderDebugObject, 'glitchStrengthMod1', 0, 10, .01)
            .onChange(value => this.material.uniforms.uGlitchStrengthMod1.value = value);

        this.debugGui.vertexShaderFolder.add(this.vertexShaderDebugObject, 'glitchStrengthMod2', 0, 10, .01)
            .onChange(value => this.material.uniforms.uGlitchStrengthMod2.value = value);

        this.debugGui.vertexShaderFolder.add(this.vertexShaderDebugObject, 'glitchDuration', 0, 1, .01)
            .onChange(value => this.material.uniforms.uGlitchDuration.value = value);

        this.debugGui.vertexShaderFolder.add(this.vertexShaderDebugObject, 'glitchStrength', 0, 1, .01)
            .onChange(value => this.material.uniforms.uGlitchStrength.value = value);

        // fragment shader
        this.debugGui.fragmentShaderFolder.addColor(this.fragmentShaderDebugObject, 'color')
            .onChange(value => this.material.uniforms.uColor.value.set(value));

        this.debugGui.fragmentShaderFolder.add(this.fragmentShaderDebugObject, 'stripesFlowSpeedY', 0, .1, .001)
            .onChange(value => this.material.uniforms.uStripesFlowSpeedY.value = value);

        this.debugGui.fragmentShaderFolder.add(this.fragmentShaderDebugObject, 'stripesSegments', 1, 25, 1)
            .onChange(value => this.material.uniforms.uStripesSegments.value = value);

        this.debugGui.fragmentShaderFolder.add(this.fragmentShaderDebugObject, 'stripesSharpness', 1, 5, .01)
            .onChange(value => this.material.uniforms.uStripesSharpness.value = value);

        this.debugGui.fragmentShaderFolder.add(this.fragmentShaderDebugObject, 'falloffInsideOffset', 0, 1, .01)
            .onChange(value => this.material.uniforms.uFalloffInsideOffset.value = value);

        this.debugGui.fragmentShaderFolder.add(this.fragmentShaderDebugObject, 'falloffOutsideOffset', 0, 1, .01)
            .onChange(value => this.material.uniforms.uFalloffOutsideOffset.value = value);

        this.debugGui.fragmentShaderFolder.add(this.fragmentShaderDebugObject, 'fresnelSharpness', 1, 5, .01)
            .onChange(value => this.material.uniforms.uFresnelSharpness.value = value);

        this.debugGui.fragmentShaderFolder.add(this.fragmentShaderDebugObject, 'fresnelStrength', 0, 5, .01)
            .onChange(value => this.material.uniforms.uFresnelStrength.value = value);

        this.debugGui.fragmentShaderFolder.add(this.fragmentShaderDebugObject, 'enableFresnel')
            .onChange(value => this.material.uniforms.uEnableFresnel.value = value);

        this.debugGui.fragmentShaderFolder.add(this.fragmentShaderDebugObject, 'enableColorGradient')
            .onChange(value => this.material.uniforms.uEnableColorGradient.value = value ? 0 : 1);

    }

    tick(delta, elapsed) {

        this.material.uniforms.uTime.value = elapsed;

        this.suzanne.rotation.x -= delta * .1;
        this.suzanne.rotation.y += delta * .2;

        this.torusKnot.rotation.x -= delta * .1;
        this.torusKnot.rotation.y += delta * .2;

        this.sphere.rotation.x -= delta * .1;
        this.sphere.rotation.y += delta * .2;

    }

}