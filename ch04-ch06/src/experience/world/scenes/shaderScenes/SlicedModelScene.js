import { Mesh, MeshStandardMaterial, MeshDepthMaterial, PlaneGeometry, Uniform, DirectionalLight, DirectionalLightHelper, CameraHelper, EquirectangularReflectionMapping, Vector3, DoubleSide, Color } from 'three';
import World from '../World';
import vertexShader from '../../../shaders/slicedModel/vertex.glsl';
import fragmentShader from '../../../shaders/slicedModel/fragment.glsl';
import CustomShaderMaterial from 'three-custom-shader-material/vanilla';

export default class SlicedModelScene extends World {

    constructor(specs) {

        super(specs);

    }

    init() {

        this.setHDR();
        this.setLight();
        this.setMesh();
        this.setMaterial();
        this.setModel();

    }

    setDebugParameters() {

        this.debugGui.debugFolder = this.debug.ui.addFolder('Debug');

    }

    setHDR() {

        this.resources.items.aerodynamicsWorkshopHDR.mapping = EquirectangularReflectionMapping;
        this.scene.background = this.resources.items.aerodynamicsWorkshopHDR;
        this.scene.backgroundBlurriness = 0.5;
        this.scene.environment = this.resources.items.aerodynamicsWorkshopHDR;

    }

    setLight() {

        this.directionalLight = new DirectionalLight('#ffffff', 4);
        this.directionalLight.position.set(6.25, 3, 4);
        this.directionalLight.castShadow = true;
        this.directionalLight.shadow.mapSize.set(1024, 1024);
        this.directionalLight.shadow.camera.near = 0.1;
        this.directionalLight.shadow.camera.far = 30;
        this.directionalLight.shadow.normalBias = 0.05
        this.directionalLight.shadow.camera.top = 8;
        this.directionalLight.shadow.camera.bottom = - 8;
        this.directionalLight.shadow.camera.left = - 8;
        this.directionalLight.shadow.camera.right = 8;

        this.scene.add(this.directionalLight);
        this.scene.add(new DirectionalLightHelper(this.directionalLight));
        this.scene.add(new CameraHelper(this.directionalLight.shadow.camera));

    }

    setMaterial() {

        this.debugObject = {
            backsideColor: '#bf264d'
        };

        this.uniforms = {
            uSliceStart: new Uniform(1.75),
            uSliceArc: new Uniform(1.25),
            uBacksideColor: new Uniform(new Color(this.debugObject.backsideColor))
        };

        const patchMap = {
            csm_Slice: {
                "#include <colorspace_fragment>":
                `
                    #include <colorspace_fragment>

                    if (!gl_FrontFacing)
                        gl_FragColor = vec4(uBacksideColor, 1.0);
                `
            }
        };

        this.material = new MeshStandardMaterial({
            metalness: 0.5,
            roughness: 0.25,
            envMapIntensity: 0.5,
            color: '#858080'
        });

        this.sliceMaterial = new CustomShaderMaterial({
            // csm
            baseMaterial: MeshStandardMaterial,
            vertexShader,
            fragmentShader,
            uniforms: this.uniforms,
            patchMap: patchMap,
            // MeshStandardMaterial
            metalness: 0.5,
            roughness: 0.25,
            envMapIntensity: 0.5,
            color: '#858080',
            side: DoubleSide
        });

        this.slicedDepthMaterial = new CustomShaderMaterial({
            // csm
            baseMaterial: MeshDepthMaterial,
            vertexShader,
            fragmentShader,
            uniforms: this.uniforms,
            patchMap: patchMap
        });

    }

    setModel() {

        this.model = this.resources.items.gears.scene;

        this.model.traverse(object => {

            if (object.isMesh) {

                if (object.name === 'outerHull') {

                    object.material = this.sliceMaterial;
                    object.customDepthMaterial = this.slicedDepthMaterial;

                } else {

                    object.material = this.material;

                }

                object.castShadow = true;
                object.receiveShadow = true;

            }

        });

        this.scene.add(this.model);

    }

    setMesh() {

        this.plane = new Mesh(
            new PlaneGeometry(10, 10, 10),
            new MeshStandardMaterial({ color: '#aaaaaa' })
        );
        this.plane.receiveShadow = true;
        this.plane.position.set(- 4, - 3, - 4);
        this.plane.lookAt(new Vector3());

        this.scene.add(this.plane);

    }

    setGui() {

        this.debugGui.debugFolder.add(this.uniforms.uSliceStart, 'value', - Math.PI , Math.PI, .001).name('uSliceStart');
        this.debugGui.debugFolder.add(this.uniforms.uSliceArc, 'value', 0, Math.PI * 2, .001).name('uSiliceArc');
        this.debugGui.debugFolder.addColor(this.debugObject, 'backsideColor').onChange(value => this.uniforms.uBacksideColor.value.set(value));

    }

};