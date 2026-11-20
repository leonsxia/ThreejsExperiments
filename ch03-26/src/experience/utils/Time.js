import { Timer } from 'three';
import EventEmitter from './EventEmitter';

export default class Time extends EventEmitter {

    constructor(renderer) {

        super();

        this.timer = new Timer();
        this.renderer = renderer;
        this._isLooping = false;

    }

    reset() {

        this.timer.disconnect();
        this.timer = new Timer();
        this.timer.connect(document);

    }

    start(stats) {

        if (this._isLooping) return;

        this.reset();

        this.renderer.setAnimationLoop(() => {

            stats?.begin();
            this.tick();
            stats?.end();

        });

        this._isLooping = false;
    }

    stop() {

        this.renderer.setAnimationLoop(null);
        this._isLooping = false;

    }

    tick() {

        this.timer.update();
        const delta = this.timer.getDelta();
        const elapsed = this.timer.getElapsed();

        this.trigger('tick', delta, elapsed);
        
    }

}