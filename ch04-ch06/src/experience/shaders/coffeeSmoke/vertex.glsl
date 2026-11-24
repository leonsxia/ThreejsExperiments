uniform float uTime;
uniform sampler2D uPerlinTexture;
// gui related uniforms
uniform float uTwistPerlinU;
uniform float uTwistPerlinYFrequency;
uniform float uTwistPerlinYSpeed;
uniform float uTwistStrength;
uniform float uWindOffsetXPerlinU;
uniform float uWindOffsetZPerlinU;
uniform float uWindPowGradient;
uniform float uWindStrength;

varying vec2 vUv;

#include ../includes/rotate2D.glsl

void main()
{
    vec3 newPosition = position;

    // twist
    float twistPerlin = texture(
        uPerlinTexture,
        vec2(uTwistPerlinU, uv.y * uTwistPerlinYFrequency - uTime * uTwistPerlinYSpeed)
    ).r;
    float angle = twistPerlin * uTwistStrength;
    newPosition.xz = rotate2D(newPosition.xz, angle);

    // wind
    vec2 windOffset = vec2(
        texture(uPerlinTexture, vec2(uWindOffsetXPerlinU, uTime * 0.01)).r - 0.5,
        texture(uPerlinTexture, vec2(uWindOffsetZPerlinU, uTime * 0.01)).r - 0.5
    );
    windOffset *= pow(uv.y, uWindPowGradient) * uWindStrength;
    newPosition.xz += windOffset;

    // final position
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);

    // varyings
    vUv = uv;
}