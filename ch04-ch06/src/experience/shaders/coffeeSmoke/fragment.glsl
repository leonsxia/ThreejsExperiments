uniform float uTime;
uniform sampler2D uPerlinTexture;
// gui related uniforms
uniform float uRepeatU;
uniform float uRepeatV;
uniform float uFlowSpeed;
uniform float uOpacity;
uniform float uEdgeLeftWidth;
uniform float uEdgeRightWidth;
uniform float uEdgeBottomWidth;
uniform float uEdgeTopWidth;
uniform vec3 uColor;

varying vec2 vUv;

void main()
{
    // scale and animate
    vec2 smokeUv = vUv;
    smokeUv.x *= uRepeatU;
    smokeUv.y *= uRepeatV;
    // make sure texture is floating upward
    smokeUv.y -= uTime * uFlowSpeed;

    // smoke
    float smoke = texture(uPerlinTexture, smokeUv).r;

    // edges
    smoke = smoothstep(uOpacity, 1.0, smoke);
    // smoke = 1.0;
    smoke *= smoothstep(0.0, uEdgeLeftWidth, vUv.x);
    smoke *= smoothstep(1.0, 1.0 - uEdgeRightWidth, vUv.x);
    smoke *= smoothstep(0.0, uEdgeBottomWidth, vUv.y);
    smoke *= smoothstep(1.0, 1.0 - uEdgeTopWidth, vUv.y);

    // final color
    // gl_FragColor = vec4(1.0, 1.0, 1.0, smoke);
    gl_FragColor = vec4(uColor, smoke);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}