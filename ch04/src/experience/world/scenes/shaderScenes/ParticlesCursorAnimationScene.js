import { Points, PlaneGeometry, ShaderMaterial, Uniform, Mesh, MeshBasicMaterial, Raycaster, Vector2, CanvasTexture, Float32BufferAttribute, AdditiveBlending, DoubleSide } from 'three';
import World from '../World';
import vertexShader from '../../../shaders/particlesCursorAnimation/vertex.glsl';
import fragmentShader from '../../../shaders/particlesCursorAnimation/fragment.glsl';

export default class ParticlesCursorAnimationScene extends World {

    constructor() {

        super();

    }

    init() {

        this.setParameters();
        this.setTextures();
        this.setParticles();

    }

    setParameters() {

        // 2D canvas
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        canvas.style.position = 'fixed';
        canvas.style.width = '256px';
        canvas.style.height = '256px';
        canvas.style.top = '48px';
        canvas.style.left = 0;
        canvas.style.zIndex = 10;
        document.body.append(canvas);

        // displacement
        this.displacement = {
            canvas,
            context: canvas.getContext('2d'),
            glowImage: this.resources.items.glow,
            interactivePlane: new Mesh(
                new PlaneGeometry(10, 10),
                new MeshBasicMaterial({ color: 'red', side: DoubleSide })
            ),
            raycaster: new Raycaster(),
            canvasCursor: new Vector2(9999, 9999),
            canvasCursorPrevious: new Vector2(9999, 9999),
            texture: new CanvasTexture(canvas)
        };

        this.displacement.context.fillRect(0, 0, canvas.width, canvas.height);

        this.displacement.interactivePlane.visible = false;
        this.scene.add(this.displacement.interactivePlane);

    }

    setTextures() {

        this.textures = {
            tex1: this.resources.items.grey1,
            tex2: this.resources.items.grey2,
            tex3: this.resources.items.grey3,
            tex4: this.resources.items.grey4
        };

    }

    setParticles() {

        this.particleGeometry = new PlaneGeometry(10, 10, 128, 128);
        this.particleGeometry.setIndex(null);
        this.particleGeometry.deleteAttribute('normal');
        this.intensitiesArray = [];
        this.anglesArray = []

        for (let i = 0; i < this.particleGeometry.attributes.position.count; i++) {

            this.intensitiesArray[i] = Math.random();
            this.anglesArray[i] = Math.random() * Math.PI * 2;

        }
        this.particleGeometry.setAttribute('aIntensity', new Float32BufferAttribute(this.intensitiesArray, 1));
        this.particleGeometry.setAttribute('aAngle', new Float32BufferAttribute(this.anglesArray, 1));

        this.particleMaterial = new ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                uResolution: new Uniform(this.sizes.resolution),
                uPictureTexture: new Uniform(this.textures.tex4),
                uDisplacementTexture: new Uniform(this.displacement.texture)
            },
            blending: AdditiveBlending
        });

        this.particles = new Points(this.particleGeometry, this.particleMaterial);

        this.scene.add(this.particles);

    }

    drawCanvas() {

        const { canvas, context, glowImage, canvasCursor, canvasCursorPrevious, texture } = this.displacement;
        const glowSize = canvas.width * 0.25;
        const halfGlowSize = glowSize * .5;

        // fade out
        context.globalCompositeOperation = 'source-over';
        context.globalAlpha = 0.02;
        context.fillRect(0, 0, canvas.width, canvas.height);

        // speed alpha
        const cursorDistance = canvasCursorPrevious.distanceTo(canvasCursor);
        canvasCursorPrevious.copy(canvasCursor);
        const alpha = Math.min(cursorDistance * 0.1, 1);

        // draw glow
        context.globalCompositeOperation = 'lighten';
        context.globalAlpha = alpha;
        context.drawImage(
            glowImage,
            canvasCursor.x - halfGlowSize,
            canvasCursor.y - halfGlowSize,
            glowSize,
            glowSize
        );

        // update texture
        texture.needsUpdate = true;

    }

    tick(delta, elapsed) {

        const { canvas, raycaster, canvasCursor, interactivePlane } = this.displacement;
        raycaster.setFromCamera(this.events.screenCursor, this.camera);
        const intersections = raycaster.intersectObject(interactivePlane);

        if (intersections.length) {

            const uv = intersections[0].uv;

            canvasCursor.x = uv.x * canvas.width;
            canvasCursor.y = (1 - uv.y) * canvas.height;
            
        }

        this.drawCanvas();

    }

}