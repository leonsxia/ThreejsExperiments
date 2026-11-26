import { Mesh, InstancedMesh, BoxGeometry, TorusGeometry, SphereGeometry, PlaneGeometry, MeshStandardMaterial, ShaderMaterial, MeshNormalMaterial, DirectionalLight, CameraHelper, Vector3, Matrix4, Uniform, Quaternion, Euler } from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import World from './World';

export default class PerformanceTestScene extends World {

    constructor(specs) {

        super(specs);

    }

    init() {

        this.setLight();
        // this.setTestMeshes();
        // this.testRandomMesh();
        // this.testMergeGeometires();
        // this.testInstancedMesh();
        this.testShaderMesh();

    }

    setTestMeshes() {

        this.cube = new Mesh(
            new BoxGeometry(2, 2, 2),
            new MeshStandardMaterial()
        );
        this.cube.castShadow = true;
        this.cube.receiveShadow = true;
        this.cube.position.set(- 5, 0, 0);

        this.torusKnot = new Mesh(
            new TorusGeometry(1, 0.4, 128, 32),
            new MeshStandardMaterial()
        );
        this.torusKnot.castShadow = true;
        this.torusKnot.receiveShadow = true;

        this.sphere = new Mesh(
            new SphereGeometry(1, 32, 32),
            new MeshStandardMaterial()
        );
        this.sphere.castShadow = true;
        this.sphere.receiveShadow = true;
        this.sphere.position.set(5, 0, 0);

        this.floor = new Mesh(
            new PlaneGeometry(10, 10),
            new MeshStandardMaterial()
        );
        this.floor.castShadow = false;
        this.floor.receiveShadow = true;
        this.floor.rotation.x = - Math.PI * .5;
        this.floor.position.set(0, - 2, 0);

        this.scene.add(this.cube, this.torusKnot, this.sphere, this.floor);

    }

    setLight() {

        this.directionalLight = new DirectionalLight('#ffffff', 3);
        this.directionalLight.castShadow = true;
        this.directionalLight.shadow.mapSize.set(1024, 1024);
        this.directionalLight.shadow.camera.far = 15;
        this.directionalLight.shadow.camera.top = 3;
        this.directionalLight.shadow.camera.bottom = - 3;
        this.directionalLight.shadow.camera.left = - 6;
        this.directionalLight.shadow.camera.right = 6;
        this.directionalLight.shadow.normalBias = .05;
        this.directionalLight.position.set(0.25, 3, 2.25);

        this.scene.add(this.directionalLight);
        // this.scene.add(new CameraHelper(this.directionalLight.shadow.camera));

    }

    testRandomMesh() {

        const geometry = new BoxGeometry(.5, .5, .5);
        const material = new MeshNormalMaterial();

        for (let i = 0; i < 50; i++) {

            const mesh = new Mesh(geometry, material);
            mesh.position.x = (Math.random() - .5) * 10;
            mesh.position.y = (Math.random() - .5) * 10;
            mesh.position.z = (Math.random() - .5) * 10;
            mesh.rotation.y = (Math.random() - .5) * Math.PI * 2;
            mesh.rotation.z = (Math.random() - .5) * Math.PI * 2;

            this.scene.add(mesh);

        }

    }

    testInstancedMesh() {

        const geometry = new BoxGeometry(.5, .5, .5);
        const material = new MeshNormalMaterial();
        const mesh = new InstancedMesh(geometry, material, 50);

        this.scene.add(mesh);

        for (let i = 0; i < 50; i++) {
            
            const position = new Vector3(
                (Math.random() - .5) * 10,
                (Math.random() - .5) * 10,
                (Math.random() - .5) * 10
            );

            const quaternion = new Quaternion();
            quaternion.setFromEuler(new Euler(
                (Math.random() - .5) * 10,
                (Math.random() - .5) * 10,
                0
            ));

            const matrix = new Matrix4()
            matrix.makeRotationFromQuaternion(quaternion);
            matrix.setPosition(position);

            mesh.setMatrixAt(i, matrix);
        
        }

    }

    testMergeGeometires() {

        const geometries = [];
        for (let i = 0; i < 50; i++) {

            const geometry = new BoxGeometry(.5, .5, .5);
            geometry.translate(
                (Math.random() - .5) * 10,
                (Math.random() - .5) * 10,
                (Math.random() - .5) * 10
            );
            geometry.rotateX((Math.random() - .5) * Math.PI * 2);
            geometry.rotateY((Math.random() - .5) * Math.PI * 2);

            geometries.push(geometry);

        }

        const meregeGeometry = mergeGeometries(geometries);
        const material = new MeshNormalMaterial();
        const mesh = new Mesh(meregeGeometry, material);

        this.scene.add(mesh);

    }

    testShaderMesh() {

        const shaderGeometry = new PlaneGeometry(10, 10, 256, 256);
        const shaderMaterial = new ShaderMaterial({
            precision: 'lowp',
            uniforms: {
                uDisplacementTexture: new Uniform(this.resources.items.displacementMap)
            },
            defines: {
                DISPLACEMENT_STRENGTH: 1.5
            },
            vertexShader: `
                uniform sampler2D uDisplacementTexture;

                varying vec3 vColor;

                void main()
                {
                    // position
                    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
                    float elevation = texture(uDisplacementTexture, uv).r;
                    modelPosition.y += max(elevation, 0.5) * DISPLACEMENT_STRENGTH;
                    gl_Position = projectionMatrix * viewMatrix * modelPosition;

                    // color
                    float colorElevation = max(elevation, 0.25);
                    vec3 color = mix(vec3(1.0, 0.1, 0.1), vec3(0.1, 0.0, 0.5), colorElevation);

                    // varying
                    vColor = color;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;

                void main()
                {
                    gl_FragColor = vec4(vColor, 1.0);
                }
            `
        });

        this.shaderMesh = new Mesh(shaderGeometry, shaderMaterial);
        this.shaderMesh.rotation.x = - Math.PI * .5;

        this.scene.add(this.shaderMesh);

    }

    tick(delta, elapsed) {

        // this.torusKnot.rotation.y += 0.1 * delta;

    }
}