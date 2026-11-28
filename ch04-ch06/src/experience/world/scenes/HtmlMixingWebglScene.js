import { AxesHelper, DirectionalLight, Raycaster, Vector3 } from 'three';
import World from './World';
import { element } from 'three/tsl';

const v0 = new Vector3();

export default class HtmlMixingWebglScene extends World {

    constructor(specs) {

        super(specs);

    }

    init() {

        this.setAxes();
        this.setHtmlModule();
        this.setPoints();
        this.setEnvironmentMap();
        this.setLight();
        this.setModel();

    }

    setAxes() {

        const axes = new AxesHelper(3);
        axes.position.set(0, 0, 0);

        this.scene.add(axes);

    }

    setEnvironmentMap() {

        this.scene.background = this.resources.items.environmentMapTexture;
        this.scene.environment = this.resources.items.environmentMapTexture;

    }

    setLight() {

        this.directionalLight = new DirectionalLight('#ffffff', 3);
        this.directionalLight.castShadow = true;
        this.directionalLight.shadow.mapSize.set(1024, 1024);
        this.directionalLight.shadow.camera.far = 15;
        this.directionalLight.shadow.normalBias = 0.05;
        this.directionalLight.position.set(0.25, 3, - 2.25);

        this.scene.add(this.directionalLight);

    }

    setModel() {

        this.model = this.resources.items.damagedHelmet.scene.clone();
        this.model.scale.set(2.5, 2.5, 2.5);
        this.model.rotation.y = Math.PI * 0.5;

        this.scene.add(this.model);

        this.model.traverse(object => {

            if (object.isMesh && object.material.isMeshStandardMaterial) {

                object.material.envMapIntensity = 2.5;
                object.material.needsUpdate = true;
                object.castShadow = true;
                object.receiveShadow = true;

            }

        })

    }

    setHtmlModule() {

        this.customModuleHtml = document.querySelector('.custom-module');

        // point-0
        this.point0Element = document.createElement('div');
        this.point0Element.classList.add('point', 'point-0');
        this.point0Label = document.createElement('div');
        this.point0Label.classList.add('label');
        this.point0Label.append(`1`);
        this.point0Text = document.createElement('div');
        this.point0Text.classList.add('text');
        this.point0Text.append(`Front and top screen with HUD aggregating terrain and battle information.`);
        this.point0Element.appendChild(this.point0Label);
        this.point0Element.appendChild(this.point0Text);

        // point-1
        this.point1Element = document.createElement('div');
        this.point1Element.classList.add('point', 'point-1');
        this.point1Label = document.createElement('div');
        this.point1Label.classList.add('label');
        this.point1Label.append(`2`);
        this.point1Text = document.createElement('div');
        this.point1Text.classList.add('text');
        this.point1Text.append(`Ventilation with air purifier and detection of environment toxicity.`);
        this.point1Element.appendChild(this.point1Label);
        this.point1Element.appendChild(this.point1Text);

        // point-2
        this.point2Element = document.createElement('div');
        this.point2Element.classList.add('point', 'point-2');
        this.point2Label = document.createElement('div');
        this.point2Label.classList.add('label');
        this.point2Label.append(`3`);
        this.point2Text = document.createElement('div');
        this.point2Text.classList.add('text');
        this.point2Text.append(`Cameras supporting night vision and heat vision with automatic adjustment.`);
        this.point2Element.appendChild(this.point2Label);
        this.point2Element.appendChild(this.point2Text);

        this.customModuleHtml.appendChild(this.point0Element);
        this.customModuleHtml.appendChild(this.point1Element);
        this.customModuleHtml.appendChild(this.point2Element);

    }

    setPoints() {

        this.raycaster = new Raycaster();
        this.points = [
            {
                position: new Vector3(1.55, 0.3, - 0.6),
                element: this.point0Element
            },
            {
                position: new Vector3(0.5, 0.8, - 1.6),
                element: this.point1Element
            },
            {
                position: new Vector3(1.6, - 1.3, - 0.7),
                element: this.point2Element
            }
        ];

    }

    tick(delta, elaplsed) {
        
        const camera = this.camera.instance;

        for (const point of this.points) {

            const screenPosition = v0.copy(point.position).project(camera);

            this.raycaster.setFromCamera(screenPosition, camera);
            const intersects = this.raycaster.intersectObjects(this.scene.children, true);

            if (intersects.length === 0) {

                point.element.classList.add('visible');

            } else {

                const intersectionDistance = intersects[0].distance;
                const pointDistance = point.position.distanceTo(camera.position);

                if (intersectionDistance < pointDistance) {

                    point.element.classList.remove('visible');

                } else {

                    point.element.classList.add('visible');

                }
                
            }

            if (point.element.classList.contains('visible')) {

                const translateX = screenPosition.x * this.sizes.width * .5;
                const translateY = - screenPosition.y * this.sizes.height * .5;
                point.element.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`;

            }

        }
    }

};