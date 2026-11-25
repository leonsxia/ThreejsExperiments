import { Group, BufferGeometry, Float32BufferAttribute, ShaderMaterial, Points, AdditiveBlending, Color } from 'three';
import SceneObjectBase from '../SceneObjectBase';
import vertexShader from '../../../shaders/galaxy/vertex.glsl';
import fragmentShader from '../../../shaders/galaxy/fragment.glsl';
import { lerp3Bands } from '../../../utils/math';

const _colorInside = new Color();
const _colorMedium = new Color();
const _colorOutside = new Color();
const _targetColor = new Color();

export default class Galaxy extends SceneObjectBase {

    name = 'LFO Galaxy';

    geometry = null;
    material = null;
    points = null;

    frequency = 4;
    amplitude = 0.025;
    speed = 1;
    sinModulator1 = 0.234;
    sinModulator2 = 0.345;
    enableMod1 = true;
    enableMod2 = true;

    parameters = {
        count: 100000,
        size: 20,
        attenuation: 3,
        radius: 10,
        branches: 3,
        spinTypeDef: {
            linear: 0,
            fade: 1
        },
        spinType: 0,
        rotateSpeed: .1,
        spin: 1,
        spinCoefficient: 20,
        randomness: 0.2,
        randomnessPower: 3,
        insideColor: '#ff6030',
        mediumColor: '#6fff47',
        outsideColor: '#1b3984'
    };

    oscillator = {
        frequency: this.frequency,
        amplitude: this.amplitude,
        speed: this.speed,
        mod1Enable: this.enableMod1,
        mod2Enable: this.enableMod2,
        'sin modulator1': this.sinModulator1,
        'sin modulator2': this.sinModulator2
    };
    
    constructor(specs = {}) {

        super(specs);

        this.group = new Group();

        const { name, parameters = {}, oscillator = {} } = specs;
        this.name = name ? name : this.name;

        this.parameters = { ...this.parameters, ...parameters };
        this.oscillator = { ...this.oscillator, ...oscillator };

        this.frequency = this.oscillator.frequency;
        this.amplitude = this.oscillator.amplitude;
        this.speed = this.oscillator.speed;
        this.sinModulator1 = this.oscillator['sin modulator1'];
        this.sinModulator2 = this.oscillator['sin modulator2'];
        this.enableMod1 = this.oscillator.mod1Enable;
        this.enableMod2 = this.oscillator.mod2Enable;

        const { position = [0, 0, 0], rotation = [0, 0, 0] } = specs;
        this.group.position.set(...position);
        this.group.rotation.set(...rotation);

    }

    init() {

        this.generateGalaxy();

    }

    setDebugParameters() {

        this.debugGui.debugFolder = this.debug.ui.addFolder(this.name).close();
        this.debugGui.galaxyFolder = this.debugGui.debugFolder.addFolder('Galaxy');
        this.debugGui.transformFolder = this.debugGui.galaxyFolder.addFolder('Transform');
        this.debugGui.oscillatorFolder = this.debugGui.debugFolder.addFolder('Oscillator');

    }

    generateGalaxy() {

        if (this.points !== null) {

            this.geometry.dispose();
            this.material.dispose();

            if (this.points.parent) {

                this.points.parent.remove(this.points);

            }

        }

        this.initGeometry();
        this.initMaterial();
        this.initMesh();

    }

    initGeometry() {

        this.geometry = new BufferGeometry();

        const positions = [];
        const randomness = [];
        const colors = [];
        const scales = [];

        _colorInside.set(this.parameters.insideColor);
        _colorMedium.set(this.parameters.mediumColor);
        _colorOutside.set(this.parameters.outsideColor);

        for (let i = 0; i < this.parameters.count; i++) {

            const i3 = i * 3;

            const radius = Math.random() * this.parameters.radius;
            const branchAngle = (i % this.parameters.branches) / this.parameters.branches * Math.PI * 2;

            const randomX = Math.pow(Math.random(), this.parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * this.parameters.randomness * radius;
            const randomY = Math.pow(Math.random(), this.parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * this.parameters.randomness * radius;
            const randomZ = Math.pow(Math.random(), this.parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * this.parameters.randomness * radius;

            positions[i3] = Math.cos(branchAngle) * radius;
            positions[i3 + 1] = 0;
            positions[i3 + 2] = Math.sin(branchAngle) * radius;

            randomness[i3] = randomX;
            randomness[i3 + 1] = randomY;
            randomness[i3 + 2] = randomZ;

            const mixedColor = lerp3Bands(_colorInside, _colorMedium, _colorOutside, radius / this.parameters.radius, _targetColor);

            colors[i3] = mixedColor.r;
            colors[i3 + 1] = mixedColor.g;
            colors[i3 + 2] = mixedColor.b;

            scales[i] = Math.random();

        }

        this.geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
        this.geometry.setAttribute('color', new Float32BufferAttribute(colors, 3));
        this.geometry.setAttribute('aRandomness', new Float32BufferAttribute(randomness, 3));
        this.geometry.setAttribute('aScale', new Float32BufferAttribute(scales, 1));

    }

    initMaterial() {

        this.material = new ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            uniforms: {
                uTime: { value: 0 },
                uSize: { value: this.parameters.size * this.renderer.getPixelRatio() },
                uAttenuation: { value: this.parameters.attenuation },
                uAlphaMap: { value: this.resources.items.particle1 },
                uSpin: { value: this.parameters.spin },
                uSpinCoefficient: { value: this.parameters.spinCoefficient },
                uSpinType: { value: this.parameters.spinType },
                uLfoFrequency: { value: this.oscillator.frequency },
                uLfoAmplitude: { value: this.oscillator.amplitude },
                uLfoSpeed: { value: this.oscillator.speed },
                uLfoMod1Enable: { value: this.oscillator.mod1Enable },
                uLfoMod2Enable: { value: this.oscillator.mod2Enable },
                uLfoMod1: { value: this.oscillator['sin modulator1'] },
                uLfoMod2: { value: this.oscillator['sin modulator2'] },
                uCenterVec3: { value: this.group.position }
            },
            blending: AdditiveBlending,
            depthWrite: false,
            vertexColors: true
        });

    }

    initMesh() {

        this.points = new Points(this.geometry, this.material);
        this.group.add(this.points);
        this.scene.add(this.group);

    }

    setGui() {

        const switchRotateSpeedClt = (value, reset = true) => {
            if (value === 0) this.debugGui.galaxyFolder.controllers.find(c => c.property === 'rotateSpeed').show();
            else {

                if (reset) this.group.rotation.set(0, 0, 0);
                this.debugGui.galaxyFolder.controllers.find(c => c.property === 'rotateSpeed').hide();

            };
        }

        this.debugGui.transformFolder.add(this.group.position, 'x').min(- 10).max(10).step(0.001).name('position x');
        this.debugGui.transformFolder.add(this.group.position, 'y').min(- 10).max(10).step(0.001).name('position y');
        this.debugGui.transformFolder.add(this.group.position, 'z').min(- 10).max(10).step(0.001).name('position z');
        this.debugGui.transformFolder.add(this.group.rotation, 'x').min(- Math.PI).max(Math.PI).step(0.001).name('rotation x');
        this.debugGui.transformFolder.add(this.group.rotation, 'y').min(- Math.PI).max(Math.PI).step(0.001).name('rotation y');
        this.debugGui.transformFolder.add(this.group.rotation, 'z').min(- Math.PI).max(Math.PI).step(0.001).name('rotation z');

        this.debugGui.galaxyFolder.add(this.parameters, 'count').min(100).max(1000000).step(100).onChange(() => this.generateGalaxy());
        this.debugGui.galaxyFolder.add(this.parameters, 'size').min(1).max(50).step(0.1).onChange(value => this.material.uniforms.uSize.value = value * this.renderer.getPixelRatio());
        this.debugGui.galaxyFolder.add(this.parameters, 'attenuation').min(1).max(10).step(0.1).onChange(value => this.material.uniforms.uAttenuation.value = value);
        this.debugGui.galaxyFolder.add(this.parameters, 'radius').min(0.1).max(20).step(0.1).onChange(() => this.generateGalaxy());
        this.debugGui.galaxyFolder.add(this.parameters, 'branches').min(2).max(10).step(1).onChange(() => this.generateGalaxy());
        this.debugGui.galaxyFolder.add(this.parameters, 'spinType', this.parameters.spinTypeDef).onChange(value => {
            this.material.uniforms.uSpinType.value = value;
            switchRotateSpeedClt(value);
        });
        this.debugGui.galaxyFolder.add(this.parameters, 'rotateSpeed').min(- 1).max(1).step(0.001);
        this.debugGui.galaxyFolder.add(this.parameters, 'spin').min(-5).max(5).step(0.001).onChange(value => this.material.uniforms.uSpin.value = value);
        this.debugGui.galaxyFolder.add(this.parameters, 'spinCoefficient').min(5).max(50).step(0.1).onChange(value => this.material.uniforms.uSpinCoefficient.value = value);
        this.debugGui.galaxyFolder.add(this.parameters, 'randomness').min(0).max(2).step(0.001).onChange(() => this.generateGalaxy());
        this.debugGui.galaxyFolder.add(this.parameters, 'randomnessPower').min(1).max(10).step(0.001).onChange(() => this.generateGalaxy());
        this.debugGui.galaxyFolder.addColor(this.parameters, 'insideColor').onChange(() => this.generateGalaxy());
        this.debugGui.galaxyFolder.addColor(this.parameters, 'mediumColor').onChange(() => this.generateGalaxy());
        this.debugGui.galaxyFolder.addColor(this.parameters, 'outsideColor').onChange(() => this.generateGalaxy());

        this.debugGui.oscillatorFolder.add(this.oscillator, 'frequency').min(0).max(10).step(0.01).onChange(value => this.material.uniforms.uLfoFrequency.value = value).listen();
        this.debugGui.oscillatorFolder.add(this.oscillator, 'amplitude').min(0).max(1).step(0.001).onChange(value => this.material.uniforms.uLfoAmplitude.value = value).listen();
        this.debugGui.oscillatorFolder.add(this.oscillator, 'speed').min(0).max(5).step(0.01).onChange(value => this.material.uniforms.uLfoSpeed.value = value).listen();
        this.debugGui.oscillatorFolder.add(this.oscillator, 'sin modulator1').min(0).max(1).step(0.001).onChange(value => this.material.uniforms.uLfoMod1.value = value).listen();
        this.debugGui.oscillatorFolder.add(this.oscillator, 'mod1Enable').name('mod 1 enable').onChange(value => this.material.uniforms.uLfoMod1Enable.value = value).listen();
        this.debugGui.oscillatorFolder.add(this.oscillator, 'sin modulator2').min(0).max(1).step(0.001).onChange(value => this.material.uniforms.uLfoMod2.value = value).listen();
        this.debugGui.oscillatorFolder.add(this.oscillator, 'mod2Enable').name('mod 2 enable').onChange(value => this.material.uniforms.uLfoMod2Enable.value = value).listen();

        this.debugGui.oscillatorFolder.add({
            'reset': () => {
                this.oscillator.frequency = this.frequency;
                this.oscillator.amplitude = this.amplitude;
                this.oscillator.speed = this.speed;
                this.oscillator['sin modulator1'] = this.sinModulator1;
                this.oscillator['sin modulator2'] = this.sinModulator2;
                this.oscillator.mod1Enable = this.enableMod1;
                this.oscillator.mod2Enable = this.enableMod2;
                // this.debugGui.oscillatorFolder.controllers.find(c => c.property === 'mod1Enable').updateDisplay();
                // this.debugGui.oscillatorFolder.controllers.find(c => c.property === 'mod2Enable').updateDisplay();

                this.material.uniforms.uLfoFrequency.value = this.frequency;
                this.material.uniforms.uLfoAmplitude.value = this.amplitude;
                this.material.uniforms.uLfoSpeed.value = this.speed;
                this.material.uniforms.uLfoMod1.value = this.sinModulator1;
                this.material.uniforms.uLfoMod2.value = this.sinModulator2;
                this.material.uniforms.uLfoMod1Enable.value = this.enableMod1;
                this.material.uniforms.uLfoMod2Enable.value = this.enableMod2;
            }
        }, 'reset').name('Reset Oscillator');

        switchRotateSpeedClt(this.parameters.spinType, false);

    }

    tick(delta, elapsed) {

        if (this.parameters.spinType === 0) {

            this.group.rotation.y += delta * this.parameters.rotateSpeed;

        }
        this.material.uniforms.uTime.value = elapsed;

    }

};