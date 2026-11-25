import { Mesh, PlaneGeometry, ShaderMaterial, Color, Vector2 } from 'three';
import World from '../World';
import vertexShader from '../../../shaders/ragingSea/vertex.glsl';
import fragmentShader from '../../../shaders/ragingSea/fragment.glsl';

export default class RagingSea extends World {

    name = 'RagingSea';

    constructor(specs) {

        super(specs);

    }

    init() {

        this.setParameters();
        this.initGeometry();
        this.initMaterial();
        this.initMesh();

    }

    setDebugParameters() {

        this.debugGui.debugFolder = this.debug.ui.addFolder('Shader');

    }

    initGeometry() {

        this.waterGeometry = new PlaneGeometry(2, 2, 512, 512);

    }

    initMaterial() {

        this.debugObject.depthColor = '#186691';
        this.debugObject.surfaceColor = '#9bd8ff';

        this.waterMaterial = new ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            uniforms: {

                uTime: { value: 0 },

                uBigWavesElevation: { value: 0.2 },
                uBigWavesFrequency: { value: new Vector2(4, 3.5) },
                uBigWavesSpeed: { value: 0.75 },

                uSmallWavesElevation: { value: 0.15 },
                uSmallWavesFrequency: { value: 3 },
                uSmallWavesSpeed: { value: 0.2 },
                uSmallIterations: { value: 4 },

                uDepthColor: { value: new Color(this.debugObject.depthColor) },
                uSurfaceColor: { value: new Color(this.debugObject.surfaceColor) },
                uColorOffset: { value: 0.08 },
                uColorMultiplier: { value: 5 }

            }
        });

    }

    initMesh() {

        this.water = new Mesh(this.waterGeometry, this.waterMaterial);
        this.water.rotation.x = - Math.PI * .5;
        this.scene.add(this.water);

    }

    setGui() {

        this.debugGui.debugFolder.addColor(this.debugObject, 'depthColor').name('depth color').onChange(() => { this.waterMaterial.uniforms.uDepthColor.value.set(this.debugObject.depthColor); });
        this.debugGui.debugFolder.addColor(this.debugObject, 'surfaceColor').name('surface color').onChange(() => { this.waterMaterial.uniforms.uSurfaceColor.value.set(this.debugObject.surfaceColor); });

        this.debugGui.debugFolder.add(this.waterMaterial.uniforms.uBigWavesElevation, 'value', 0, 1, .001).name('uBigWavesElevation');
        this.debugGui.debugFolder.add(this.waterMaterial.uniforms.uBigWavesFrequency.value, 'x', 0, 10, .001).name('uBigWavesFrequency.x');
        this.debugGui.debugFolder.add(this.waterMaterial.uniforms.uBigWavesFrequency.value, 'y', 0, 10, .001).name('uBigWavesFrequency.y');
        this.debugGui.debugFolder.add(this.waterMaterial.uniforms.uBigWavesSpeed, 'value', 0, 1, .001).name('uBigWavesSpeed');

        this.debugGui.debugFolder.add(this.waterMaterial.uniforms.uSmallWavesElevation, 'value', 0, 1, .001).name('uSmallWavesElevation');
        this.debugGui.debugFolder.add(this.waterMaterial.uniforms.uSmallWavesFrequency, 'value', 0, 30, .001).name('uSmallWavesFrequency');
        this.debugGui.debugFolder.add(this.waterMaterial.uniforms.uSmallWavesSpeed, 'value', 0, 4, .001).name('uSmallWavesSpeed');
        this.debugGui.debugFolder.add(this.waterMaterial.uniforms.uSmallIterations, 'value', 0, 5, 1).name('uSmallIterations');

        this.debugGui.debugFolder.add(this.waterMaterial.uniforms.uColorOffset, 'value', 0, 1, .001).name('uColorOffset');
        this.debugGui.debugFolder.add(this.waterMaterial.uniforms.uColorMultiplier, 'value', 0, 10, .001).name('uColorMultiplier');

    }

    tick(delta, elapsed) {

        this.waterMaterial.uniforms.uTime.value = elapsed;

    }

};