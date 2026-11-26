import { ShaderMaterial, Color, Uniform, Mesh, PlaneGeometry, OctahedronGeometry, MeshBasicMaterial, TorusKnotGeometry, SphereGeometry, DoubleSide, Vector3 } from 'three';
import World from '../World';
import vertexShader from '../../../shaders/halftone/vertex.glsl';
import fragmentShader from '../../../shaders/halftone/fragment.glsl';

const v0 = new Vector3();

export default class HalftoneScene extends World {

    constructor(specs) {

        super(specs);

    }

    initParameters() {

        this.materialParameters = {
            color: '#ff794d',
            shadowColor: '#8e19b8',
            lightColor: '#e5ffe0'
        };        

    }

    setLightWithHelper() {

        this.lights = {
            ambient: {
                color: '#ffffff',
                intensity: .1,
                display: 'Ambient Light'
            },
            directional: {
                color: '#ffffff',
                intensity: 1.0,
                position: new Vector3(1, 1, 1),
                specular: 1,
                enableHelper: true,
                isDirectionalLight: true,
                display: 'Directional Light'
            }
        };

        this.lightHelpers = {
            directional: new Mesh(
                new PlaneGeometry(.5, .5),
                new MeshBasicMaterial({
                    color: this.lights.directional.color,
                    wireframe: true
                })
            )
        };

        for (const atlas in this.lightHelpers) {

            const helper = this.lightHelpers[atlas];
            const light = this.lights[atlas];

            helper.position.copy(light.position);
            if (light.isDirectionalLight) helper.lookAt(v0);
            helper.visible = light.enableHelper;
            this.scene.add(helper);

        }

    }

    init() {

        this.initParameters();
        this.setLightWithHelper();
        this.setMaterial();
        this.setModel();
        this.setObjects();
        
    }

    setDebugParameters() {

        this.debugGui.rendererFolder = this.debug.ui.addFolder('Renderer');
        this.debugGui.shaderFolder = this.debug.ui.addFolder('Shader');
        this.debugGui.lightFolder = this.debug.ui.addFolder('Lights');

        this.debugObject = {};
        Object.assign(this.debugObject, this.sceneConfig.renderer);

    }

    setMaterial() {

        this.material = new ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            uniforms: {
                uResolution: new Uniform(this.sizes.resolution),
                uColor: new Uniform(new Color(this.materialParameters.color)),
                uShadowColor: new Uniform(new Color(this.materialParameters.shadowColor)),
                uLightColor: new Uniform(new Color(this.materialParameters.lightColor)),
                uShadowRepetitions: new Uniform(100),
                uLightRepetitions: new Uniform(130),
                uShadowFalloffPower: new Uniform(3),
                uLightFalloffPower: new Uniform(1),
                // ambient light
                uAmbientColor: new Uniform(new Color(this.lights.ambient.color)),
                uAmbientIntensity: new Uniform(this.lights.ambient.intensity),
                // directional light
                uDirectionalColor: new Uniform(new Color(this.lights.directional.color)),
                uDirectionalIntensity: new Uniform(this.lights.directional.intensity),
                uDirectionalSpecular: new Uniform(this.lights.directional.specular),
                uDirectionalPosition: new Uniform(this.lights.directional.position)
            }
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

    setObjects() {

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

        for (const atlas in this.lights) {

            const light = this.lights[atlas];
            light.gui = this.debugGui.lightFolder.addFolder(light.display);

        }        

        this.debugGui.rendererFolder.addColor(this.debugObject, 'clearColor')
            .onChange(value => this.renderer.instance.setClearColor(value));

        // shader
        this.debugGui.shaderFolder.addColor(this.materialParameters, 'color').name('mesh color')
            .onChange(value => this.material.uniforms.uColor.value.set(value));
        this.debugGui.shaderFolder.addColor(this.materialParameters, 'shadowColor').name('shadow color')
            .onChange(value => this.material.uniforms.uShadowColor.value.set(value));
        this.debugGui.shaderFolder.add(this.material.uniforms.uShadowRepetitions, 'value', 1, 300, 1).name('shadow repetitions');
        this.debugGui.shaderFolder.add(this.material.uniforms.uShadowFalloffPower, 'value', 1, 10, 1).name('shadow falloff power');
        this.debugGui.shaderFolder.addColor(this.materialParameters, 'lightColor').name('light color')
            .onChange(value => this.material.uniforms.uLightColor.value.set(value));
        this.debugGui.shaderFolder.add(this.material.uniforms.uLightRepetitions, 'value', 1, 300, 1).name('light repetitions');
        this.debugGui.shaderFolder.add(this.material.uniforms.uLightFalloffPower, 'value', 1, 10, 1).name('light falloff power');

        // lights
        const ambientFolder = this.lights.ambient.gui;
        ambientFolder.addColor(this.lights.ambient, 'color')
            .onChange(value => {
                this.material.uniforms.uAmbientColor.value.set(value);
            });
        ambientFolder.add(this.lights.ambient, 'intensity', 0, 10, .01)
            .onChange(value => this.material.uniforms.uAmbientIntensity.value = value);

        const directionalFolder = this.lights.directional.gui;
        directionalFolder.addColor(this.lights.directional, 'color')
            .onChange(value => {
                this.material.uniforms.uDirectionalColor.value.set(value);
                this.lightHelpers.directional.material.color.set(value);
            });
        directionalFolder.add(this.lights.directional, 'intensity', 0, 20, .01)
            .onChange(value => this.material.uniforms.uDirectionalIntensity.value = value);
        directionalFolder.add(this.lights.directional, 'specular', 0, 50, 1)
            .onChange(value => this.material.uniforms.uDirectionalSpecular.value = value);
        directionalFolder.add(this.lights.directional.position, 'x', - 5, 5, .01)
            .name('position.x')
            .onChange(value => {
                this.lightHelpers.directional.position.x = value;
                this.lightHelpers.directional.lookAt(v0);
            });
        directionalFolder.add(this.lights.directional.position, 'y', - 5, 5, .01)
            .name('position.y')
            .onChange(value => {
                this.lightHelpers.directional.position.y = value;
                this.lightHelpers.directional.lookAt(v0);
            });
        directionalFolder.add(this.lights.directional.position, 'z', - 5, 5, .01)
            .name('position.z')
            .onChange(value => {
                this.lightHelpers.directional.position.z = value;
                this.lightHelpers.directional.lookAt(v0);
            });
        directionalFolder.add(this.lights.directional, 'enableHelper')
            .name('helper')
            .onChange(value => this.lightHelpers.directional.visible = value);

    }

     tick(delta, elapsed) {

        this.suzanne.rotation.x -= delta * .1;
        this.suzanne.rotation.y += delta * .2;

        this.torusKnot.rotation.x -= delta * .1;
        this.torusKnot.rotation.y += delta * .2;

        this.sphere.rotation.x -= delta * .1;
        this.sphere.rotation.y += delta * .2;

    }

}