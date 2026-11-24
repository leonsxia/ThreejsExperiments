import { AxesHelper, BoxGeometry, CameraHelper, Color, DirectionalLight, DirectionalLightHelper, EquirectangularReflectionMapping, Mesh, MeshDepthMaterial, MeshPhysicalMaterial, MeshStandardMaterial, PlaneGeometry, Uniform } from 'three';
import World from '../World';
import vertexShader from '../../../shaders/proceduralTerrain/vertex.glsl';
import fragmentShader from '../../../shaders/proceduralTerrain/fragment.glsl';
import CustomShaderMaterial from 'three-custom-shader-material/vanilla';
import { SUBTRACTION, Evaluator, Brush } from 'three-bvh-csg';

export default class ProceduralTerrainScene extends World {

    constructor() {

        super();

    }

    init() {

        this.setParameters();
        this.setHDR();
        this.setAxes();
        this.setLight();
        this.setWater();
        this.setMaterial();
        this.setTerrain();
        this.setBoard();

        // debug
        if (this.debug.active) {

            this.shaderFolder = this.debug.ui.addFolder('Shader');

            this.setGui();

        }

    }

    setParameters() {

        this.debugObject = {
            colorWaterDeep: '#002b3d',
            colorWaterSurface: '#66a8ff',
            colorSand: '#ffe894',
            colorGrass: '#85d534',
            colorSnow: '#ffffff',
            colorRock: '#bfbd8d'
        };

    }

    setHDR() {

        this.resources.items.spruitSunriseHDR.mapping = EquirectangularReflectionMapping;
        this.scene.background = this.resources.items.spruitSunriseHDR;
        this.scene.backgroundBlurriness = 0.5;
        this.scene.environment = this.resources.items.spruitSunriseHDR;

    }

    setAxes() {

        const axes = new AxesHelper(3);
        axes.position.set(- 6, 0, - 6);

        this.scene.add(axes);

    }

    setLight() {

        this.directionalLight = new DirectionalLight('#ffffff', 2);
        this.directionalLight.castShadow = true;
        this.directionalLight.shadow.mapSize.set(1024, 1024);
        this.directionalLight.shadow.camera.near = 0.1;
        this.directionalLight.shadow.camera.far = 50;
        this.directionalLight.shadow.normalBias = .05;
        this.directionalLight.shadow.camera.left = - 15;
        this.directionalLight.shadow.camera.right = 15;
        this.directionalLight.shadow.camera.top = 15;
        this.directionalLight.shadow.camera.bottom = - 15;
        this.directionalLight.position.set(6.25, 3, 4);

        this.scene.add(this.directionalLight);

        // this.scene.add(new DirectionalLightHelper(this.directionalLight));
        // this.scene.add(new CameraHelper(this.directionalLight.shadow.camera));

    }

    setWater() {

        this.water = new Mesh(
            new PlaneGeometry(10, 10, 1, 1),
            new MeshPhysicalMaterial({
                transmission: 1,
                roughness: 0.3
            })
        );
        this.water.rotation.set(- Math.PI * .5, 0, 0);
        this.water.position.set(0, - .1, 0);

        this.scene.add(this.water);

    }

    setMaterial() {

        this.uniforms = {
            uTime: new Uniform(0),
            uPositionFrequency: new Uniform(0.2),
            uStrength: new Uniform(2.0),
            uWarpFrequency: new Uniform(5),
            uWarpStrength: new Uniform(0.5),
            uColorWaterDeep: new Uniform(new Color(this.debugObject.colorWaterDeep)),
            uColorWaterSurface: new Uniform(new Color(this.debugObject.colorWaterSurface)),
            uColorSand: new Uniform(new Color(this.debugObject.colorSand)),
            uColorGrass: new Uniform(new Color(this.debugObject.colorGrass)),
            uColorSnow: new Uniform(new Color(this.debugObject.colorSnow)),
            uColorRock: new Uniform(new Color(this.debugObject.colorRock)),
        };

        this.material = new CustomShaderMaterial({
            // csm
            baseMaterial: MeshStandardMaterial,
            vertexShader,
            fragmentShader,
            uniforms: this.uniforms,
            // MeshStandardMaterial
            metalness: 0,
            roughness: 0.5,
            color: '#85d534'
        });

        this.depthMaterial = new CustomShaderMaterial({
            // csm
            baseMaterial: MeshDepthMaterial,
            vertexShader,
            uniforms: this.uniforms
        });

    }

    setTerrain() {

        this.geometry = new PlaneGeometry(10, 10, 500, 500);
        this.geometry.deleteAttribute('uv');
        this.geometry.deleteAttribute('normal');
        this.geometry.rotateX(- Math.PI * .5);

        this.terrain = new Mesh(this.geometry, this.material);
        this.terrain.customDepthMaterial = this.depthMaterial;
        this.terrain.castShadow = true;
        this.terrain.receiveShadow = true;

        this.scene.add(this.terrain);

    }

    setBoard() {

        // brushes
        const boardFill = new Brush(new BoxGeometry(11, 2, 11));
        const boardHole = new Brush(new BoxGeometry(10, 2.1, 10));
        // boardHole.position.y = 0.2;
        // boardHole.updateMatrixWorld();

        // evaluate
        const evaluator = new Evaluator();
        this.board = evaluator.evaluate(boardFill, boardHole, SUBTRACTION);
        this.board.geometry.clearGroups();
        this.board.material = new MeshStandardMaterial({ color: '#ffffff', metalness: 0, roughness: 0.3 });
        this.board.castShadow = true;
        this.board.receiveShadow = true;

        this.scene.add(this.board);

    }

    setGui() {

        this.debug.ui.add(this.board.material, 'wireframe').name('board wireframe');

        this.shaderFolder.add(this.uniforms.uPositionFrequency, 'value', 0, 1, .001).name('uPositionFrequency');
        this.shaderFolder.add(this.uniforms.uStrength, 'value', 0, 10, .001).name('uStrength');
        this.shaderFolder.add(this.uniforms.uWarpFrequency, 'value', 0, 10, .001).name('uWarpFrequency');
        this.shaderFolder.add(this.uniforms.uWarpStrength, 'value', 0, 1, .001).name('uWarpStrength');
        this.shaderFolder.addColor(this.debugObject, 'colorWaterDeep').onChange(value => this.uniforms.uColorWaterDeep.value.set(value));
        this.shaderFolder.addColor(this.debugObject, 'colorWaterSurface').onChange(value => this.uniforms.uColorWaterSurface.value.set(value));
        this.shaderFolder.addColor(this.debugObject, 'colorSand').onChange(value => this.uniforms.uColorSand.value.set(value));
        this.shaderFolder.addColor(this.debugObject, 'colorGrass').onChange(value => this.uniforms.uColorGrass.value.set(value));
        this.shaderFolder.addColor(this.debugObject, 'colorSnow').onChange(value => this.uniforms.uColorSnow.value.set(value));
        this.shaderFolder.addColor(this.debugObject, 'colorRock').onChange(value => this.uniforms.uColorRock.value.set(value));

    }

    tick(delta, elpased) {

        this.uniforms.uTime.value = elpased;

    }

};