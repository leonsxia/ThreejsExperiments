uniform float uTime;
// gui related uniforms
uniform float uGlitchStrengthMod1;
uniform float uGlitchStrengthMod2;
uniform float uGlitchDuration;
uniform float uGlitchStrength;

varying vec3 vPosition;
varying vec3 vNormal;

#include ../includes/random2D.glsl

void main()
{
    // position
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // glitch
    float glitchTime = - modelPosition.y + uTime;// modelPosition.y - uTime;
    float glitchStrength = sin(glitchTime) + sin(glitchTime * uGlitchStrengthMod1) + sin(glitchTime * uGlitchStrengthMod2);
    glitchStrength /= 3.0;
    glitchStrength = smoothstep(1.0 - uGlitchDuration, 1.0, glitchStrength);
    glitchStrength *= uGlitchStrength;
    modelPosition.x += (random2D(modelPosition.xz + uTime) - 0.5) * glitchStrength;
    modelPosition.z += (random2D(modelPosition.zx + uTime) - 0.5) * glitchStrength;

    // final position
    gl_Position = projectionMatrix * viewMatrix * modelPosition;

    // model normal
    vec4 modelNormal = modelMatrix * vec4(normal, 0.0);

    // varyings
    vPosition = modelPosition.xyz;
    vNormal = modelNormal.xyz;
}