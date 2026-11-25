import { AnimationMixer } from 'three';
import { clone as skeletonClone } from 'three/addons/utils/SkeletonUtils.js';
import SceneObjectBase from '../SceneObjectBase';

export default class Fox extends SceneObjectBase {

    constructor(specs) {

        super(specs);

        // resource
        this.resource = this.resources.items.foxModel;

        this.setModel()
        this.setAnimation();

    }

    setDebugParameters() {

        this.debugGui.debugFolder = this.debug.ui.addFolder('Fox');

    }

    setGui() {

        const debugObject = {
            playIdle: () => { this.animation.play('idle') },
            playWalking: () => { this.animation.play('walking') },
            playRunning: () => { this.animation.play('running') }
        };
        this.debugGui.debugFolder.add(debugObject, 'playIdle');
        this.debugGui.debugFolder.add(debugObject, 'playWalking');
        this.debugGui.debugFolder.add(debugObject, 'playRunning');

    }

    setModel() {

        this.model = skeletonClone(this.resource.scene);
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

    }

    tick(delta) {

        this.animation.mixer.update(delta);

    }

};