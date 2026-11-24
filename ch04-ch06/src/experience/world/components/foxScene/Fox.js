import { AnimationMixer } from 'three';
import SceneObjectBase from '../SceneObjectBase';

export default class Fox extends SceneObjectBase {

    constructor() {

        super();

        // debug
        if (this.debug.active) {

            this.debugFolder = this.debug.ui.addFolder('Fox');

        }

        // resource
        this.resource = this.resources.items.foxModel;

        this.setModel()
        this.setAnimation();

    }

    setModel() {

        this.model = this.resource.scene;
        this.model.scale.set(.02, .02, .02);
        this.scene.add(this.model);

        this.model.traverse((object) => {

            if (object.isMesh) {

                object.castShadow = true;
                object.receiveShadow = true;

            }

        });

    }

    setAnimation() {

        this.animation = {};

        // mixer
        this.animation.mixer = new AnimationMixer(this.model);

        // actions
        this.animation.actions = {};
        this.animation.actions.idle = this.animation.mixer.clipAction(this.resource.animations[0]);
        this.animation.actions.walking = this.animation.mixer.clipAction(this.resource.animations[1]);
        this.animation.actions.running = this.animation.mixer.clipAction(this.resource.animations[2]);

        this.animation.actions.current = this.animation.actions.idle;
        this.animation.actions.current.play();

        // play the action
        this.animation.play = (name) => {

            const newAction = this.animation.actions[name];
            const oldAction = this.animation.actions.current;

            newAction
                .reset()
                .play()
                .crossFadeFrom(oldAction, 1);

            this.animation.actions.current = newAction;

        };

        // debug
        if (this.debug.active) {

            const debugObject = {
                playIdle: () => { this.animation.play('idle') },
                playWalking: () => { this.animation.play('walking') },
                playRunning: () => { this.animation.play('running') }
            };
            this.debugFolder.add(debugObject, 'playIdle');
            this.debugFolder.add(debugObject, 'playWalking');
            this.debugFolder.add(debugObject, 'playRunning');

        }

    }

    update(delta) {

        this.animation.mixer.update(delta);

    }

};