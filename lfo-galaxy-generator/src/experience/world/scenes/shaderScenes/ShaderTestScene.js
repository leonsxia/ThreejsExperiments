import { Mesh, PlaneGeometry, ShaderMaterial, Float32BufferAttribute, Vector2, Color, DoubleSide } from 'three';
import World from '../World';
import testVertexShader from '../../../shaders/test/vertex.glsl';
import testFragmentShader from '../../../shaders/test/fragment.glsl';

export default class ShaderTestScene extends World {

    name = 'ShaderTestScene';

    constructor() {

        super();

        // debug
        if (this.debug.active) {

            this.debugFolder = this.debug.ui.addFolder('Shader');

        }

    }

    init() {

        this.initGeometry();
        this.initMaterial();
        this.initMesh();

    }

    initGeometry() {

        this.geometry = new PlaneGeometry(1, 1, 32, 32);
        const count = this.geometry.attributes.position.count;
        const randoms = [];

        for (let i = 0; i < count; i++) {

            randoms.push(Math.random());

        }

        this.geometry.setAttribute('aRandom', new Float32BufferAttribute(randoms, 1));

    }

    initMaterial() {

        const flagTexture = this.resources.items.flagTexture;
        this.material = new ShaderMaterial({
            vertexShader: testVertexShader,
            fragmentShader: testFragmentShader,
            uniforms: {
                uFrequency: { value: new Vector2(10, 5) },
                uTime: { value: 0 },
                uColor: { value: new Color('orange') },
                uTexture: { value: flagTexture }
            },
            side: DoubleSide
        });

        this.debugFolder.add(this.material.uniforms.uFrequency.value, 'x', 0, 20, .01).name('frequency x');
        this.debugFolder.add(this.material.uniforms.uFrequency.value, 'y', 0, 20, .01).name('frequency y');

    }

    initMesh() {

        this.mesh = new Mesh(this.geometry, this.material);
        this.scene.add(this.mesh);

    }

    tick(delta, elapsed) {
        
        this.material.uniforms.uTime.value = elapsed;

    }

}