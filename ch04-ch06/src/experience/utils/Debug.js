import GUI from 'lil-gui';

export default class Debug {

    constructor() {

        this.active = window.location.hash === '#debug';

        if (this.active) {

            this.ui = new GUI({
                title: 'World',
                width: 340
            }).hide();

        }

    }

    hideAll() {
        
        if (this.active) {

            for (const folder of this.ui.folders) {

                folder.hide();

            }

            for (const controller of this.ui.controllers) {

                controller.hide();

            }

        }

        return this;

    }

    show() {

        if (this.active) {

            this.ui.show();

        }

        return this;

    }

};