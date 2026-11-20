import { Mesh, PlaneGeometry, ShaderMaterial, DoubleSide } from 'three';
import World from '../World';
import vertexShader from '../../../shaders/patterns/vertex.glsl';
import fragmentShader from '../../../shaders/patterns/fragment.glsl';

export default class ShaderPatternScene extends World {

    name = 'ShaderPatternScene';

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

    }

    initMaterial() {

        this.material = new ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            uniforms: {
                uTime: { value: 0 }
            },
            side: DoubleSide
        });

    }

    initMesh() {

        this.mesh = new Mesh(this.geometry, this.material);
        this.scene.add(this.mesh);

    }

    tick(delta, elapsed) {

        this.material.uniforms.uTime.value = elapsed;

    }

}