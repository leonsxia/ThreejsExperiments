import { FloatType, LinearFilter, RGBAFormat, ShaderMaterial, Uniform, Vector3, WebGLRenderTarget } from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { DotScreenPass } from 'three/addons/postprocessing/DotScreenPass.js';
import { GlitchPass } from 'three/addons/postprocessing/GlitchPass.js';
import { RGBShiftShader } from 'three/addons/shaders/RGBShiftShader.js';
import { GammaCorrectionShader } from 'three/addons/shaders/GammaCorrectionShader.js';
import { FXAAPass } from 'three/addons/postprocessing/FXAAPass.js';
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import Experience from './Experience';
import GUI from 'lil-gui';

export default class PostProcessor {

    enabled = false;

    constructor(scene, camera) {

        this.scene = scene;
        this.camera = camera;

        this.experience = new Experience();
        this.renderer = this.experience.renderer;
        this.sizes = this.experience.sizes;
        this.resources = this.experience.resources;

        this.setComposer();
        this.resize();        

    }

    init() {

        this.setPass();
        this.setGui();

    }

    setComposer() {

        this.renderTarget = new WebGLRenderTarget(
            800,
            600,
            {
                samples: this.renderer.instance.getPixelRatio() === 1 ? 2 : 0
            }
        );
        this.effectComposer = new EffectComposer(this.renderer.instance, this.renderTarget);

    }

    setPass() {

        this.renderPass = new RenderPass(this.scene, this.camera);
        this.effectComposer.addPass(this.renderPass);

        this.dotScreenPass = new DotScreenPass()
        this.dotScreenPass.enabled = false;
        this.effectComposer.addPass(this.dotScreenPass);

        this.glitchPass = new GlitchPass();
        this.glitchPass.goWild = true;
        this.glitchPass.enabled = false;
        this.effectComposer.addPass(this.glitchPass);

        this.rgbShiftPass = new ShaderPass(RGBShiftShader);
        this.rgbShiftPass.enabled = false;
        this.effectComposer.addPass(this.rgbShiftPass);

        this.unrealBloomPass = new UnrealBloomPass();
        this.unrealBloomPass.enabled = false;
        this.effectComposer.addPass(this.unrealBloomPass);
        
        this.unrealBloomPass.strength = 1;
        this.unrealBloomPass.radius = 1;
        this.unrealBloomPass.threshold = .5;

        this.setTintPass();
        this.setDisplacementPass();

        this.gammaCorrectionPass = new ShaderPass(GammaCorrectionShader);
        // this.gammaCorrectionPass.enabled = false;
        this.effectComposer.addPass(this.gammaCorrectionPass);

        // this.outputPass = new OutputPass();
        // this.outputPass.enabled = false;
        // this.effectComposer.addPass(this.outputPass);

        // this.fxaaPass = new FXAAPass(FXAAShader);
        // this.fxaaPass.enabled = false;
        // this.effectComposer.addPass(this.fxaaPass);

    }

    setTintPass() {

        const tintShader = {
            uniforms: {
                tDiffuse: new Uniform(),
                uTint: new Uniform()
            },
            vertexShader: `
                varying vec2 vUv;

                void main()
                {
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    vUv = uv;
                }
            `,
            fragmentShader: `
                uniform sampler2D tDiffuse;
                uniform vec3 uTint;

                varying vec2 vUv;

                void main()
                {
                    vec4 color = texture(tDiffuse, vUv);
                    color.rgb += uTint;

                    gl_FragColor = color;
                }
            `
        };

        this.tintPass = new ShaderPass(tintShader);
        this.tintPass.enabled = false;
        this.tintPass.material.uniforms.uTint.value = new Vector3();
        this.effectComposer.addPass(this.tintPass);

    }

    setDisplacementPass() {

        const displacementShader = {
            uniforms: {
                tDiffuse: new Uniform(),
                uTime: new Uniform(0),
                uNormalMap: new Uniform()
            },
            vertexShader: `
                varying vec2 vUv;

                void main()
                {
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    vUv = uv;
                }
            `,
            fragmentShader: `
                uniform sampler2D tDiffuse;
                uniform float uTime;
                uniform sampler2D uNormalMap;

                varying vec2 vUv;

                void main()
                {
                    vec3 normalColor = texture(uNormalMap, vUv).xyz * 2.0 - 1.0;
                    vec2 newUv = vUv + normalColor.xy * 0.1;
                    // vec2 newUv = vec2(
                    //     vUv.x,
                    //     vUv.y + sin(vUv.x * 10.0 + uTime * 0.1) * 0.1
                    // );
                    vec4 color = texture(tDiffuse, newUv);

                    vec3 lightDirection = normalize(vec3(- 1.0, 1.0, 0.0));
                    float lightness = clamp(dot(normalColor, lightDirection), 0.0, 1.0);
                    color.rgb += lightness * 2.0;

                    gl_FragColor = color;
                }
            `
        };

        this.displacementPass = new ShaderPass(displacementShader);
        this.displacementPass.enabled = false;
        this.displacementPass.material.uniforms.uNormalMap.value = this.resources.items.interfaceNormal;
        this.effectComposer.addPass(this.displacementPass);

    }

    setGui() {

        this.postProcessingGui = new GUI({
            title: 'Post Processing',
            width: 200
        }).close().hide();
        this.postProcessingGui.domElement.style.setProperty('left', '282px');

        this.guis = {};

        this.guis.enablePostEffectCtl = this.postProcessingGui.add(this, 'enabled').name('Post Effect Enabled');
        this.guis.dotScreenCtl = this.postProcessingGui.add(this.dotScreenPass, 'enabled').name('Dot Screen');
        this.guis.glitchCtl = this.postProcessingGui.add(this.glitchPass, 'enabled').name('Glitch');
        this.guis.rgbShiftCtl = this.postProcessingGui.add(this.rgbShiftPass, 'enabled').name('RGB Shifter');

        this.guis.bloomFolder = this.postProcessingGui.addFolder('Bloom');
        this.guis.bloomFolder.add(this.unrealBloomPass, 'enabled').name('Enabled');
        this.guis.bloomFolder.add(this.unrealBloomPass, 'strength', 0, 2, .001).name('Strength');
        this.guis.bloomFolder.add(this.unrealBloomPass, 'radius', 0, 2, .001).name('Radius');
        this.guis.bloomFolder.add(this.unrealBloomPass, 'threshold', 0, 1, .001).name('Threshold');

        this.guis.tintFolder = this.postProcessingGui.addFolder('Tint');
        this.guis.tintFolder.add(this.tintPass, 'enabled').name('Enabled');
        this.guis.tintFolder.add(this.tintPass.material.uniforms.uTint.value, 'x', - 1, 1, .001).name('red');
        this.guis.tintFolder.add(this.tintPass.material.uniforms.uTint.value, 'y', - 1, 1, .001).name('green');
        this.guis.tintFolder.add(this.tintPass.material.uniforms.uTint.value, 'z', - 1, 1, .001).name('blue');

        this.guis.dispalcementCtl = this.postProcessingGui.add(this.displacementPass, 'enabled').name('Displacement');

        this.guis.gammaCorrectionCtl = this.postProcessingGui.add(this.gammaCorrectionPass, 'enabled').name('Gamma Correction');
        // this.guis.fxaaCtl = this.postProcessingGui.add(this.fxaaPass, 'enabled')
        //     .name('FXAA')
        //     .onChange(value => {

        //         this.outputPass.enabled = value;

        //     });

    }

    resize() {

        this.effectComposer.setSize(this.sizes.width, this.sizes.height);
        this.effectComposer.setPixelRatio(this.sizes.pixelRatio);

    }

    suspend() {

        this.postProcessingGui.hide();

    }

    alive() {

        this.postProcessingGui.show();

    }

    update(delta, elapsed) {

        this.displacementPass.material.uniforms.uTime.value = elapsed;
        this.effectComposer.render();

    }

};