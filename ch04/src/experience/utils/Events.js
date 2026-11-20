import { Vector2 } from 'three';

export default class Events {

    constructor() {

        this.screenCursor = new Vector2(9999, 9999);

        this.addPointerEvents();

    }

    addPointerEvents() {

        window.addEventListener('pointermove', event => {

            this.screenCursor.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.screenCursor.y = - (event.clientY / window.innerHeight) * 2 + 1;

        });

    }

};