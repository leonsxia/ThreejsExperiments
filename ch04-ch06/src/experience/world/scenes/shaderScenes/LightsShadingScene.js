import { ShaderMaterial, Color, Uniform, Mesh, PlaneGeometry, OctahedronGeometry, MeshBasicMaterial, TorusKnotGeometry, SphereGeometry, DoubleSide, Vector3 } from 'three';
import World from '../World';
import vertexShader from '../../../shaders/lightsShading/vertex.glsl';
import fragmentShader from '../../../shaders/lightsShading/fragment.glsl';

const v0 = new Vector3();

export default class LightsShadingScene extends World {

    constructor(specs) {

        super(specs);        

        this.debugObject = {
            color: '#ffffff'
        };

    }

    init() {

        this.setLights();
        this.setMaterial();
        this.setModel();
        this.setObjects();
        this.setLightHelpers();

    }
    
    setDebugParameters() {

        this.debugGui.debugFolder = this.debug.ui.addFolder('Shader Lights');

        this.debugGui.ambientLightFolder = this.debug.ui.addFolder('Ambient Light');
        this.debugGui.directionalLightFolder = this.debug.ui.addFolder('Directional Light');
        this.debugGui.pointLight1Folder = this.debug.ui.addFolder('Point Light 1');
        this.debugGui.pointLight2Folder = this.debug.ui.addFolder('Point Light 2');

    }

    setLights() {

        this.ambientLight = {
            color: '#ffffff',
            intensity: 0.03
        };

        this.directionalLight = {
            color: '#1919ff',
            intensity: 1,
            position: new Vector3(0, 0, 3),
            specular: 20
        };

        this.pointLight1 = {
            color: '#ff1919',
            intensity: 1,
            position: new Vector3(0, 2.5, 0),
            specular: 20,
            radius: 4
        };

        this.pointLight2 = {
            color: '#19ff80',
            intensity: 1,
            position: new Vector3(2, 0, 2),
            specular: 20,
            radius: 5
        };

    }

    setMaterial() {

        this.material = new ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            uniforms: {
                uColor: new Uniform(new Color(this.debugObject.color)),
                // ambient light
                uAmbientColor: new Uniform(new Color(this.ambientLight.color)),
                uAmbientIntensity: new Uniform(this.ambientLight.intensity),
                // directional light
                uDirectionalColor: new Uniform(new Color(this.directionalLight.color)),
                uDirectionalIntensity: new Uniform(this.directionalLight.intensity),
                uDirectionalSpecular: new Uniform(this.directionalLight.specular),
                uDirectionalPosition: new Uniform(this.directionalLight.position),
                // point light 1
                uPoint1Color: new Uniform(new Color(this.pointLight1.color)),
                uPoint1Intensity: new Uniform(this.pointLight1.intensity),
                uPoint1Position: new Uniform(this.pointLight1.position),
                uPoint1Specular: new Uniform(this.pointLight1.specular),
                uPoint1Radius: new Uniform(this.pointLight1.radius),
                // point light 2
                uPoint2Color: new Uniform(new Color(this.pointLight2.color)),
                uPoint2Intensity: new Uniform(this.pointLight2.intensity),
                uPoint2Position: new Uniform(this.pointLight2.position),
                uPoint2Specular: new Uniform(this.pointLight2.specular),
                uPoint2Radius: new Uniform(this.pointLight2.radius),
            }
        });

    }

    setModel() {

        this.suzanne = this.resources.items.suzanne.scene;
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

    setLightHelpers() {

        this.directionalLightHelper = new Mesh(
            new PlaneGeometry(),
            new MeshBasicMaterial({
                color: this.directionalLight.color,
                wireframe: true
            })
        );
        this.directionalLightHelper.position.set(0, 0, 3);

        this.pointLightHelper1 = new Mesh(
            new OctahedronGeometry(0.1, 0),
            new MeshBasicMaterial({
                color: this.pointLight1.color,
                wireframe: true
            })
        );
        this.pointLightHelper1.position.set(0, 2.5, 0);

        this.pointLightHelper2 = new Mesh(
            new OctahedronGeometry(0.1, 0),
            new MeshBasicMaterial({
                color: this.pointLight2.color,
                wireframe: true
            })
        );
        this.pointLightHelper2.position.set(2, 0, 2);

        this.scene.add(this.directionalLightHelper, this.pointLightHelper1, this.pointLightHelper2);

    }

    setGui() {

        this.debugGui.debugFolder.addColor(this.debugObject, 'color').name('mesh material color')
            .onChange(value => this.material.uniforms.uColor.value.set(value));

        this.debugGui.ambientLightFolder.addColor(this.ambientLight, 'color')
            .onChange(value => this.material.uniforms.uAmbientColor.value.set(value));
        this.debugGui.ambientLightFolder.add(this.ambientLight, 'intensity', 0, 10, .01)
            .onChange(value => this.material.uniforms.uAmbientIntensity.value = value);

        this.debugGui.directionalLightFolder.addColor(this.directionalLight, 'color')
            .onChange(value => {
                this.material.uniforms.uDirectionalColor.value.set(value);
                this.directionalLightHelper.material.color.set(value);
            });
        this.debugGui.directionalLightFolder.add(this.directionalLight, 'intensity', 0, 20, .01)
            .onChange(value => this.material.uniforms.uDirectionalIntensity.value = value);
        this.debugGui.directionalLightFolder.add(this.directionalLight, 'specular', 0, 50, 1)
            .onChange(value => this.material.uniforms.uDirectionalSpecular.value = value);
        this.debugGui.directionalLightFolder.add(this.directionalLight.position, 'x', - 5, 5, .01).name('position.x')
            .onChange(value => {
                this.directionalLightHelper.position.x = value;
                this.directionalLightHelper.lookAt(v0);
            });
        this.debugGui.directionalLightFolder.add(this.directionalLight.position, 'y', - 5, 5, .01).name('position.y')
            .onChange(value => {
                this.directionalLightHelper.position.y = value;
                this.directionalLightHelper.lookAt(v0);
            });
        this.debugGui.directionalLightFolder.add(this.directionalLight.position, 'z', - 5, 5, .01).name('position.z')
            .onChange(value => {
                this.directionalLightHelper.position.z = value;
                this.directionalLightHelper.lookAt(v0);
            });

        this.debugGui.pointLight1Folder.addColor(this.pointLight1, 'color')
            .onChange(value => {
                this.material.uniforms.uPoint1Color.value.set(value);
                this.pointLightHelper1.material.color.set(value);
            });
        this.debugGui.pointLight1Folder.add(this.pointLight1, 'intensity', 0, 20, .01)
            .onChange(value => this.material.uniforms.uPoint1Intensity.value = value);
        this.debugGui.pointLight1Folder.add(this.pointLight1, 'specular', 0, 50, 1)
            .onChange(value => this.material.uniforms.uPoint1Specular.value = value);
        this.debugGui.pointLight1Folder.add(this.pointLight1, 'radius', 0, 20, .01)
            .onChange(value => this.material.uniforms.uPoint1Radius.value = value);
        this.debugGui.pointLight1Folder.add(this.pointLight1.position, 'x', - 5, 5, .01).name('position.x')
            .onChange(value => {
                this.pointLightHelper1.position.x = value;
            });
        this.debugGui.pointLight1Folder.add(this.pointLight1.position, 'y', - 5, 5, .01).name('position.y')
            .onChange(value => {
                this.pointLightHelper1.position.y = value;
            });
        this.debugGui.pointLight1Folder.add(this.pointLight1.position, 'z', - 5, 5, .01).name('position.z')
            .onChange(value => {
                this.pointLightHelper1.position.z = value;
            });

        this.debugGui.pointLight2Folder.addColor(this.pointLight2, 'color')
            .onChange(value => {
                this.material.uniforms.uPoint2Color.value.set(value);
                this.pointLightHelper2.material.color.set(value);
            });
        this.debugGui.pointLight2Folder.add(this.pointLight2, 'intensity', 0, 20, .01)
            .onChange(value => this.material.uniforms.uPoint2Intensity.value = value);
        this.debugGui.pointLight2Folder.add(this.pointLight2, 'specular', 0, 50, 1)
            .onChange(value => this.material.uniforms.uPoint2Specular.value = value);
        this.debugGui.pointLight2Folder.add(this.pointLight2, 'radius', 0, 20, .01)
            .onChange(value => this.material.uniforms.uPoint2Radius.value = value);
        this.debugGui.pointLight2Folder.add(this.pointLight2.position, 'x', - 5, 5, .01).name('position.x')
            .onChange(value => {
                this.pointLightHelper2.position.x = value;
            });
        this.debugGui.pointLight2Folder.add(this.pointLight2.position, 'y', - 5, 5, .01).name('position.y')
            .onChange(value => {
                this.pointLightHelper2.position.y = value;
            });
        this.debugGui.pointLight2Folder.add(this.pointLight2.position, 'z', - 5, 5, .01).name('position.z')
            .onChange(value => {
                this.pointLightHelper2.position.z = value;
            });

    }

    tick(delta, elapsed) {

        this.suzanne.rotation.x -= delta * .1;
        this.suzanne.rotation.y += delta * .2;

        this.torusKnot.rotation.x -= delta * .1;
        this.torusKnot.rotation.y += delta * .2;

        this.sphere.rotation.x -= delta * .1;
        this.sphere.rotation.y += delta * .2;

    }

};