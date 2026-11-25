import { DirectionalLight, Mesh, PlaneGeometry, MeshStandardMaterial, MeshDepthMaterial, SRGBColorSpace, RGBADepthPacking } from 'three';
import World from '../World';

export default class CustomizedMaterialScene extends World {

    constructor(specs) {

        super(specs);

    }

    init() {

        this.setEnvironmentMap();
        this.setTextures();
        this.setMaterial();
        this.setModel();
        this.setPlane();
        this.setSunLight();
        this.updateMaterials();

    }

    setEnvironmentMap() {

        this.environmentMap = {};
        this.environmentMap.texture = this.resources.items.environmentMapTexture;
        this.environmentMap.texture.colorSpace = SRGBColorSpace;

        this.scene.environment = this.environmentMap.texture;
        this.scene.background = this.environmentMap.texture;

    }

    setTextures() {

        this.mapTexture = this.resources.items.leePerrySmithColorTexture;
        this.mapTexture.colorSpace = SRGBColorSpace;
        this.normalTexture = this.resources.items.leePerrySmithNormalTexture;

    }

    setMaterial() {

        this.material = new MeshStandardMaterial({
            map: this.mapTexture,
            normalMap: this.normalTexture
        });

        this.depthMaterial = new MeshDepthMaterial({
            depthPacking: RGBADepthPacking
        });

        this.setMaterialShaders();

    }

    setMaterialShaders() {

        this.customUniforms = {
            uTime: { value: 0 }
        };

        this.material.onBeforeCompile = shader => {

            shader.uniforms.uTime = this.customUniforms.uTime;

            shader.vertexShader = shader.vertexShader.replace(                
                '#include <common>',
                `
                    #include <common>

                    uniform float uTime;

                    mat2 getXZRotationMatrix2(float _angle)
                    {
                        return mat2(cos(_angle), - sin(_angle), sin(_angle), cos(_angle));
                    }
                `
            );

            shader.vertexShader = shader.vertexShader.replace(
                '#include <beginnormal_vertex>',
                `
                    #include <beginnormal_vertex>

                    float angle = sin(position.y + uTime) * 0.4;
                    mat2 rotateMatrix = getXZRotationMatrix2(angle);

                    objectNormal.xz = rotateMatrix * objectNormal.xz;
                    
                    #ifdef USE_TANGENT

                        objectTangent.xz = rotateMatrix * objectTangent.xz;

                    #endif
                `
            );
            
            shader.vertexShader = shader.vertexShader.replace(
                '#include <begin_vertex>',
                `
                    #include <begin_vertex>

                    transformed.xz = rotateMatrix * transformed.xz;
                `
            );

        };

        this.depthMaterial.onBeforeCompile = shader => {

            shader.uniforms.uTime = this.customUniforms.uTime;

            shader.vertexShader = shader.vertexShader.replace(
                '#include <common>',
                `
                    #include <common>

                    uniform float uTime;

                    mat2 getXZRotationMatrix2(float _angle)
                    {
                        return mat2(cos(_angle), - sin(_angle), sin(_angle), cos(_angle));
                    }
                `
            );

            shader.vertexShader = shader.vertexShader.replace(
                '#include <begin_vertex>',
                `
                    #include <begin_vertex>

                    float angle = sin(position.y + uTime) * 0.4;
                    mat2 rotateMatrix = getXZRotationMatrix2(angle);

                    transformed.xz = rotateMatrix * transformed.xz;
                `
            );

        }

    }

    setModel() {

        this.model = this.resources.items.leePerrySmithModel.scene.children[0].clone();
        this.model.rotation.y = Math.PI * .5;
        this.model.material = this.material;    // update the material
        this.model.customDepthMaterial = this.depthMaterial;    // update the depth material

        this.scene.add(this.model);

    }

    setPlane() {

        this.plane = new Mesh(
            new PlaneGeometry(15, 15, 15),
            new MeshStandardMaterial()
        );
        this.plane.rotation.y = Math.PI;
        this.plane.position.set(0, - 5, 5);

        this.scene.add(this.plane);

    }

    setSunLight() {

        this.directionalLight = new DirectionalLight('#ffffff', 3);
        this.directionalLight.castShadow = true;
        this.directionalLight.shadow.mapSize.set(1024, 1024);
        this.directionalLight.shadow.camera.far = 15;
        this.directionalLight.shadow.normalBias = 0.05;
        this.directionalLight.position.set(0.25, 2, - 2.25);

        this.scene.add(this.directionalLight);

    }

    updateMaterials() {

        this.scene.traverse(object => {

            if (object.isMesh && object.material.isMeshStandardMaterial) {

                object.material.envMapIntensity = 1;
                object.material.needsUpdate = true;
                object.castShadow = true;
                object.receiveShadow = true;

            }

        });

    }

    tick(delta, elapsed) {

        this.customUniforms.uTime.value = elapsed;

    }

};