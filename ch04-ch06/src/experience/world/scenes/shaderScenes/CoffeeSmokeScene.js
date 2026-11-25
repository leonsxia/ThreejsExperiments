import { Mesh, PlaneGeometry, MeshBasicMaterial, ShaderMaterial, Uniform, RepeatWrapping, DoubleSide, Color } from 'three';
import World from '../World';
import vertexShader from '../../../shaders/coffeeSmoke/vertex.glsl';
import fragmentShader from '../../../shaders/coffeeSmoke/fragment.glsl';

export default class CoffeeSmokeScene extends World {

    constructor(specs) {

        super(specs);        

    }

    init() {

        this.setParameters();
        this.setModel();
        this.setSmoke();

    }

    setDebugParameters() {

        this.debugGui.materialFolder = this.debug.ui.addFolder('Material');
        this.debugGui.shaderFolder = this.debug.ui.addFolder('Shader');
        this.debugGui.vertexShaderFolder = this.debugGui.shaderFolder.addFolder('Vertex Shader');
        this.debugGui.fragmentShaderFolder = this.debugGui.shaderFolder.addFolder('Fragment Shader');

    }

    setParameters() {

        this.vertexShaderDebugObject = {
            twistPerlinU: 0.5,
            twistPerlinYFrequency: 0.2,
            twistPerlinYSpeed: 0.005,
            twistStrength: 10,
            windOffsetXPerlinU: 0.25,
            windOffsetZPerlinU: 0.75,
            windPowGradient: 2,
            windStrength: 10
        };

        this.fragmentShaderDebugObject = {
            repeatU: 0.5,
            repeatV: 0.3,
            flowSpeed: 0.03,
            opacity: 0.4,
            edgeLeftWidth: 0.1,
            edgeRightWidth: 0.1,
            edgeBottomWidth: 0.1,
            edgeTopWidth: 0.6,
            color: '#994d33'
        };

    }

    setModel() {

        this.model = this.resources.items.coffeeMug.scene;
        this.model.getObjectByName('baked').material.map.anisotropy = 8;
        this.scene.add(this.model);

    }

    setSmoke() {

        // geometry
        this.smokeGeometry = new PlaneGeometry(1, 1, 16, 64);
        this.smokeGeometry.translate(0, 0.5, 0);
        this.smokeGeometry.scale(1.5, 6, 1.5);

        // Perlin texture
        this.perlinTexture = this.resources.items.perlin;
        this.perlinTexture.wrapS = RepeatWrapping;
        this.perlinTexture.wrapT = RepeatWrapping;

        // material
        this.smokeMaterial = new ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            uniforms: {
                uTime: new Uniform(0),
                uPerlinTexture: new Uniform(this.perlinTexture),
                // vertex shader uniforms
                uTwistPerlinU: new Uniform(this.vertexShaderDebugObject.twistPerlinU),
                uTwistPerlinYFrequency: new Uniform(this.vertexShaderDebugObject.twistPerlinYFrequency),
                uTwistPerlinYSpeed: new Uniform(this.vertexShaderDebugObject.twistPerlinYSpeed),
                uTwistStrength: new Uniform(this.vertexShaderDebugObject.twistStrength),
                uWindOffsetXPerlinU: new Uniform(this.vertexShaderDebugObject.windOffsetXPerlinU),
                uWindOffsetZPerlinU: new Uniform(this.vertexShaderDebugObject.windOffsetZPerlinU),
                uWindPowGradient: new Uniform(this.vertexShaderDebugObject.windPowGradient),
                uWindStrength: new Uniform(this.vertexShaderDebugObject.windStrength),
                // fragment shader uniforms
                uRepeatU: new Uniform(this.fragmentShaderDebugObject.repeatU),
                uRepeatV: new Uniform(this.fragmentShaderDebugObject.repeatV),
                uFlowSpeed: new Uniform(this.fragmentShaderDebugObject.flowSpeed),
                uOpacity: new Uniform(this.fragmentShaderDebugObject.opacity),
                uEdgeLeftWidth: new Uniform(this.fragmentShaderDebugObject.edgeLeftWidth),
                uEdgeRightWidth: new Uniform(this.fragmentShaderDebugObject.edgeRightWidth),
                uEdgeBottomWidth: new Uniform(this.fragmentShaderDebugObject.edgeBottomWidth),
                uEdgeTopWidth: new Uniform(this.fragmentShaderDebugObject.edgeTopWidth),
                uColor: new Uniform(new Color(this.fragmentShaderDebugObject.color))
            },
            side: DoubleSide,
            transparent: true,
            depthWrite: false,
            // wireframe: true
        });
        // this.smokeMaterial = new MeshBasicMaterial({
        //     color: 'cyan',
        //     wireframe: true
        // });

        // mesh
        this.smoke = new Mesh(this.smokeGeometry, this.smokeMaterial);
        this.smoke.position.y = 1.83;

        this.scene.add(this.smoke);

    }

    setGui() {

        this.debugGui.materialFolder.add(this.smokeMaterial, 'wireframe');

        this.debugGui.vertexShaderFolder.add(this.vertexShaderDebugObject, 'twistPerlinU', 0, 1, .01)
            .onChange(value => this.smokeMaterial.uniforms.uTwistPerlinU.value = value);
        this.debugGui.vertexShaderFolder.add(this.vertexShaderDebugObject, 'twistPerlinYFrequency', 0, 1, .01)
            .onChange(value => this.smokeMaterial.uniforms.uTwistPerlinYFrequency.value = value);
        this.debugGui.vertexShaderFolder.add(this.vertexShaderDebugObject, 'twistPerlinYSpeed', 0, 0.05, .001)
            .onChange(value => this.smokeMaterial.uniforms.uTwistPerlinYSpeed.value = value);
        this.debugGui.vertexShaderFolder.add(this.vertexShaderDebugObject, 'twistStrength', 0, 20, .01)
            .onChange(value => this.smokeMaterial.uniforms.uTwistStrength.value = value);
        this.debugGui.vertexShaderFolder.add(this.vertexShaderDebugObject, 'windOffsetXPerlinU', 0, 1, .01)
            .onChange(value => this.smokeMaterial.uniforms.uWindOffsetXPerlinU.value = value);
        this.debugGui.vertexShaderFolder.add(this.vertexShaderDebugObject, 'windOffsetZPerlinU', 0, 1, .01)
            .onChange(value => this.smokeMaterial.uniforms.uWindOffsetZPerlinU.value = value);
        this.debugGui.vertexShaderFolder.add(this.vertexShaderDebugObject, 'windPowGradient', 0.1, 5, .1)
            .onChange(value => this.smokeMaterial.uniforms.uWindPowGradient.value = value);
        this.debugGui.vertexShaderFolder.add(this.vertexShaderDebugObject, 'windStrength', 0, 20, .01)
            .onChange(value => this.smokeMaterial.uniforms.uWindStrength.value = value);

        this.debugGui.fragmentShaderFolder.add(this.fragmentShaderDebugObject, 'repeatU', 0, 4, .01)
            .onChange(value => this.smokeMaterial.uniforms.uRepeatU.value = value);
        this.debugGui.fragmentShaderFolder.add(this.fragmentShaderDebugObject, 'repeatV', 0, 4, .01)
            .onChange(value => this.smokeMaterial.uniforms.uRepeatV.value = value);
        this.debugGui.fragmentShaderFolder.add(this.fragmentShaderDebugObject, 'flowSpeed', 0, .2, .01)
            .onChange(value => this.smokeMaterial.uniforms.uFlowSpeed.value = value);
        this.debugGui.fragmentShaderFolder.add(this.fragmentShaderDebugObject, 'opacity', 0, 1, .01)
            .onChange(value => this.smokeMaterial.uniforms.uOpacity.value = value);
        this.debugGui.fragmentShaderFolder.add(this.fragmentShaderDebugObject, 'edgeLeftWidth', 0, 1, .01)
            .onChange(value => this.smokeMaterial.uniforms.uEdgeLeftWidth.value = value);
        this.debugGui.fragmentShaderFolder.add(this.fragmentShaderDebugObject, 'edgeRightWidth', 0, 1, .01)
            .onChange(value => this.smokeMaterial.uniforms.uEdgeRightWidth.value = value);
        this.debugGui.fragmentShaderFolder.add(this.fragmentShaderDebugObject, 'edgeBottomWidth', 0, 1, .01)
            .onChange(value => this.smokeMaterial.uniforms.uEdgeBottomWidth.value = value);
        this.debugGui.fragmentShaderFolder.add(this.fragmentShaderDebugObject, 'edgeTopWidth', 0, 1, .01)
            .onChange(value => this.smokeMaterial.uniforms.uEdgeTopWidth.value = value);
        this.debugGui.fragmentShaderFolder.addColor(this.fragmentShaderDebugObject, 'color')
            .onChange(value => this.smokeMaterial.uniforms.uColor.value.set(value));

    }

    tick(delta, elapsed) {

        this.smokeMaterial.uniforms.uTime.value = elapsed;

    }

}