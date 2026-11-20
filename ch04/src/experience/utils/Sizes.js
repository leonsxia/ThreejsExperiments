import { Vector2 } from 'three';
import EventEmitter from './EventEmitter';

export default class Sizes extends EventEmitter {

    resolution = new Vector2();

    constructor() {

        super();

        this.setSize();

        // resize event
        window.addEventListener('resize', () => {

            this.setSize();
            this.trigger('resize');

        });

    }

    setSize() {

        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.pixelRatio = Math.min(2, window.devicePixelRatio);

        this.resolution.set(this.width * this.pixelRatio, this.height * this.pixelRatio);

    }

};