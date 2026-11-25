import { ShaderMaterial, Color, Uniform, Mesh, SphereGeometry, DoubleSide, Vector3, SRGBColorSpace, Spherical, IcosahedronGeometry, MeshBasicMaterial, BackSide, RepeatWrapping } from 'three';
import World from '../World';
import earthVertexShader from '../../../shaders/earth/vertex.glsl';
import earthFragmentShader from '../../../shaders/earth/fragment.glsl';
import atmosphereVertexShader from '../../../shaders/atmosphere/vertex.glsl';
import atmosphereFragmentShader from '../../../shaders/atmosphere/fragment.glsl';
import { Lensflare, LensflareElement } from 'three/addons/objects/Lensflare.js';

export default class EarthScene extends World {

    constructor(specs) {

        super(specs);

    }

    init() {

        this.initParameters();
        this.setTextures();
        this.setMaterial();
        this.setEarth();
        this.setSun();
        this.setLensflares();

    }

    setDebugParameters() {

        this.debugGui.atmosphereFolder = this.debug.ui.addFolder('Atmosphere');
        this.debugGui.sunFolder = this.debug.ui.addFolder('Sun');

    }

    initParameters() {

        this.earthParameters = {
            atmosphereDayColor: '#00aaff',
            atmosphereTwilightColor: '#ff6600'
        };

        this.sunParameters = {
            spherical: new Spherical(1, Math.PI * .5, .5),
            direction: new Vector3()
        };

    }

    setTextures() {

        this.earthDayTexture = this.resources.items.earthDayTexture;
        this.earthDayTexture.colorSpace = SRGBColorSpace;
        this.earthDayTexture.anisotropy = 8;

        this.earthNightTexture = this.resources.items.earthNightTexture;
        this.earthNightTexture.colorSpace = SRGBColorSpace;
        this.earthNightTexture.anisotropy = 8;

        this.earthSpecularCloudsTexture = this.resources.items.earthSpecularCloudsTexture;
        this.earthSpecularCloudsTexture.anisotropy = 8;
        this.earthSpecularCloudsTexture.wrapS = RepeatWrapping;
        this.earthSpecularCloudsTexture.wrapT = RepeatWrapping;

        this.lens0 = this.resources.items.lensflareTexture0;
        this.lens1 = this.resources.items.lensflareTexture1;

    }

    setMaterial() {

        this.earthMaterial = new ShaderMaterial({
            vertexShader: earthVertexShader,
            fragmentShader: earthFragmentShader,
            uniforms: {
                uTime: new Uniform(0),
                uDayTexture: new Uniform(this.earthDayTexture),
                uNightTexture: new Uniform(this.earthNightTexture),
                uSpecularCloudsTexture: new Uniform(this.earthSpecularCloudsTexture),
                uSunDirection: new Uniform(this.sunParameters.direction),
                uAtmosphereDayColor: new Uniform(new Color(this.earthParameters.atmosphereDayColor)),
                uAtmosphereTwilightColor: new Uniform(new Color(this.earthParameters.atmosphereTwilightColor))
            }
        });

        this.atmosphereMaterial = new ShaderMaterial({
            vertexShader: atmosphereVertexShader,
            fragmentShader: atmosphereFragmentShader,
            uniforms: {
                uSunDirection: new Uniform(this.sunParameters.direction),
                uAtmosphereDayColor: new Uniform(new Color(this.earthParameters.atmosphereDayColor)),
                uAtmosphereTwilightColor: new Uniform(new Color(this.earthParameters.atmosphereTwilightColor))
            },
            side: BackSide,
            transparent: true
        });

    }

    setEarth() {

        this.earthGeometry = new SphereGeometry(2, 64, 64);
        this.earth = new Mesh(this.earthGeometry, this.earthMaterial);

        this.atmosphere = new Mesh(this.earthGeometry, this.atmosphereMaterial);
        this.atmosphere.scale.set(1.04, 1.04, 1.04);

        this.scene.add(this.earth);
        this.scene.add(this.atmosphere);

    }

    setSun() {

        this.updateSun = () => {

            // sun direction
            this.sunParameters.direction.setFromSpherical(this.sunParameters.spherical);

            this.sun.position.copy(this.sunParameters.direction).multiplyScalar(5);
            
        };

        this.sun = new Mesh(
            new IcosahedronGeometry(0.1, 2),
            new MeshBasicMaterial()
        );

        this.updateSun();

        this.scene.add(this.sun);

    }

    setLensflares() {

        const lensflare = new Lensflare();
        lensflare.addElement(new LensflareElement(this.lens0, 700, 0, this.sun.material.color));
        lensflare.addElement(new LensflareElement(this.lens1, 60, 0.6));
        lensflare.addElement(new LensflareElement(this.lens1, 70, 0.7));
        lensflare.addElement(new LensflareElement(this.lens1, 120, 0.9));
        lensflare.addElement(new LensflareElement(this.lens1, 70, 1));
        this.sun.add(lensflare);

    }

    setGui() {

        this.debugGui.atmosphereFolder.addColor(this.earthParameters, 'atmosphereDayColor')
            .onChange(value => {
                this.earthMaterial.uniforms.uAtmosphereDayColor.value.set(value);
                this.atmosphereMaterial.uniforms.uAtmosphereDayColor.value.set(value);
            });

        this.debugGui.atmosphereFolder.addColor(this.earthParameters, 'atmosphereTwilightColor')
            .onChange(value => {
                this.earthMaterial.uniforms.uAtmosphereTwilightColor.value.set(value);
                this.atmosphereMaterial.uniforms.uAtmosphereTwilightColor.value.set(value);
            });

        this.debugGui.sunFolder.add(this.sunParameters.spherical, 'phi', 0, Math.PI)
            .onChange(this.updateSun);

        this.debugGui.sunFolder.add(this.sunParameters.spherical, 'theta', 0, Math.PI)
            .onChange(this.updateSun);

    }

    tick(delta, elapsed) {

        this.earthMaterial.uniforms.uTime.value = elapsed;
        this.earth.rotation.y += delta * 0.1;

    }

}