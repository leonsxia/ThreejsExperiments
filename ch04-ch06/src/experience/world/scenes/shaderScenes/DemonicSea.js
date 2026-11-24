import { Mesh, PlaneGeometry, ShaderMaterial, Color, Vector2, Uniform, Vector3, OctahedronGeometry, MeshBasicMaterial } from 'three';
import World from '../World';
import vertexShader from '../../../shaders/demonicSea/vertex.glsl';
import fragmentShader from '../../../shaders/demonicSea/fragment.glsl';

export default class DemonicSea extends World {

    constructor() {

        super();

        this.seaParameters = {
            depthColor: '#ff4000',
            surfaceColor: '#151c37'
        };        

    }

    init() {

        this.setLightWithHelper();
        this.setGeometry();
        this.setMaterial();
        this.setMesh();        

        // debug
        if (this.debug.active) {

            this.debugFolder = this.debug.ui.addFolder('Demonic Sea');
            this.lightFolder = this.debug.ui.addFolder('Lights');

            this.setGui();

        }

    }

    setGeometry() {

        this.waterGeometry = new PlaneGeometry(5, 5, 1024, 1024);
        // delete original normals since it will be computed in the vertex shader
        this.waterGeometry.deleteAttribute('normal');

    }

    setLightWithHelper() {

        this.lights = {
            point1: {
                color: '#ffffff',
                position: new Vector3(0.0, 1, 0.0),
                intensity: 10,
                specular: 30,
                radius: 5,
                enableHelper: true
            }
        };

        this.lightHelpers = {
            point1: new Mesh(
                new OctahedronGeometry(.1, 0),
                new MeshBasicMaterial({
                    color: this.lights.point1.color,
                    wireframe: true
                })
            )
        };

        for (const atlas in this.lightHelpers) {

            const helper = this.lightHelpers[atlas];
            const light = this.lights[atlas];

            if (light.isDirectionalLight) light.lookAt(v0);

            helper.position.copy(light.position);
            helper.visible = light.enableHelper;
            this.scene.add(helper);

        }

    }

    setMaterial() {

        this.waterMaterial = new ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            uniforms: {

                uTime: new Uniform(0),

                // vertex shader
                uShift: new Uniform(0.01),
                uBigWavesElevation: new Uniform(0.2),
                uBigWavesFrequency: new Uniform(new Vector2(4, 1.5)),
                uBigWavesSpeed: new Uniform(0.75),

                uSmallWavesElevation: new Uniform(0.15),
                uSmallWavesFrequency: new Uniform(3),
                uSmallWavesSpeed: new Uniform(0.2),
                uSmallIterations: new Uniform(4),

                // fragment shader
                uDepthColor: new Uniform(new Color(this.seaParameters.depthColor)),
                uSurfaceColor: new Uniform(new Color(this.seaParameters.surfaceColor)),
                uColorOffset: new Uniform(0.925),
                uColorMultiplier: new Uniform(1),

                // lights
                uPoint1Color: new Uniform(new Color(this.lights.point1.color)),
                uPoint1Intensity: new Uniform(this.lights.point1.intensity),
                uPoint1Specular: new Uniform(this.lights.point1.specular),
                uPoint1Radius: new Uniform(this.lights.point1.radius),
                uPoint1Position: new Uniform(this.lights.point1.position)

            }
        });
        
        
    }

    setMesh() {

        this.water = new Mesh(this.waterGeometry, this.waterMaterial);
        this.water.rotation.x = - Math.PI * .5;
        this.scene.add(this.water);

    }

    setGui() {

        this.debugFolder.addColor(this.seaParameters, 'depthColor').name('depth color')
            .onChange(value => this.waterMaterial.uniforms.uDepthColor.value.set(value));
        this.debugFolder.addColor(this.seaParameters, 'surfaceColor').name('surface color')
            .onChange(value => this.waterMaterial.uniforms.uSurfaceColor.value.set(value));

        this.debugFolder.add(this.waterMaterial.uniforms.uShift, 'value', 0, 0.1, .001).name('uShift');

        this.debugFolder.add(this.waterMaterial.uniforms.uBigWavesElevation, 'value', 0, 1, .001).name('uBigWavesElevation');
        this.debugFolder.add(this.waterMaterial.uniforms.uBigWavesFrequency.value, 'x', 0, 10, .001).name('uBigWavesFrequency.x');
        this.debugFolder.add(this.waterMaterial.uniforms.uBigWavesFrequency.value, 'y', 0, 10, .001).name('uBigWavesFrequency.y');
        this.debugFolder.add(this.waterMaterial.uniforms.uBigWavesSpeed, 'value', 0, 1, .001).name('uBigWavesSpeed');

        this.debugFolder.add(this.waterMaterial.uniforms.uSmallWavesElevation, 'value', 0, 1, .001).name('uSmallWavesElevation');
        this.debugFolder.add(this.waterMaterial.uniforms.uSmallWavesFrequency, 'value', 0, 30, .001).name('uSmallWavesFrequency');
        this.debugFolder.add(this.waterMaterial.uniforms.uSmallWavesSpeed, 'value', 0, 4, .001).name('uSmallWavesSpeed');
        this.debugFolder.add(this.waterMaterial.uniforms.uSmallIterations, 'value', 0, 5, 1).name('uSmallIterations');

        this.debugFolder.add(this.waterMaterial.uniforms.uColorOffset, 'value', 0, 1, .001).name('uColorOffset');
        this.debugFolder.add(this.waterMaterial.uniforms.uColorMultiplier, 'value', 0, 10, .001).name('uColorMultiplier');

        // lights
        this.point1Folder = this.lightFolder.addFolder('Pointlight 1');
        this.point1Folder.addColor(this.lights.point1, 'color')
            .onChange(value => {
                this.waterMaterial.uniforms.uPoint1Color.value.set(value);
                this.lightHelpers.point1.material.color.set(value);
            });
        this.point1Folder.add(this.lights.point1, 'intensity', 0, 20, .01)
            .onChange(value => this.waterMaterial.uniforms.uPoint1Intensity.value = value);
        this.point1Folder.add(this.lights.point1, 'specular', 0, 50, 1)
            .onChange(value => this.waterMaterial.uniforms.uPoint1Specular.value = value);
        this.point1Folder.add(this.lights.point1, 'radius', 0, 20, .01)
            .onChange(value => this.waterMaterial.uniforms.uPoint1Radius.value = value);
        this.point1Folder.add(this.lights.point1.position, 'x', - 5, 5, .01).name('position.x')
            .onChange(value => this.lightHelpers.point1.position.x = value);
        this.point1Folder.add(this.lights.point1.position, 'y', - 5, 5, .01).name('position.y')
            .onChange(value => this.lightHelpers.point1.position.y = value);
        this.point1Folder.add(this.lights.point1.position, 'z', - 5, 5, .01).name('position.z')
            .onChange(value => this.lightHelpers.point1.position.z = value);
        this.point1Folder.add(this.lights.point1, 'enableHelper')
            .name('helper')
            .onChange(value => this.lightHelpers.point1.visible = value);

    }

    tick(delta, elapsed) {

        this.waterMaterial.uniforms.uTime.value = elapsed;

    }

};