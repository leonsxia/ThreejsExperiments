import { Mesh, PlaneGeometry, ShaderMaterial, Uniform } from 'three';

export default class ScreenMask {

    constructor() {

        this.setMask();

    }

    setMask() {

        this.maskGeometry = new PlaneGeometry(2, 2, 1, 1);
        this.maskMaterial = new ShaderMaterial({
            transparent: true,
            uniforms: {
                uAlpha: new Uniform(1)
            },
            vertexShader: `
                void main()
                {
                    gl_Position = vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float uAlpha;

                void main()
                {
                    gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
                }
            `
        });

        this.mesh = new Mesh(this.maskGeometry, this.maskMaterial);

    }

};