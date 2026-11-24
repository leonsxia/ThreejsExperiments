uniform vec3 uColorWaterDeep;
uniform vec3 uColorWaterSurface;
uniform vec3 uColorSand;
uniform vec3 uColorGrass;
uniform vec3 uColorSnow;
uniform vec3 uColorRock;

varying vec3 vPosition;
varying float vUpDot;

#include ../includes/simplexNoise2d.glsl

void main()
{
    // color
    vec3 color = vec3(1.0);

    // water
    float surfaceWaterMix = smoothstep(- 1.0, - 0.1, vPosition.y);
    color = mix(uColorWaterDeep, uColorWaterSurface, surfaceWaterMix);

    // sand
    float sandMix = step(- 0.1, vPosition.y);
    color = mix(color, uColorSand, sandMix);

    // grass
    float grassMix = step(- 0.06, vPosition.y);
    color = mix(color, uColorGrass, grassMix);

    // rock
    float rockMix = vUpDot;
    // discard dot(normal, up) > 0.8, means flat surface will not mix rock color
    // rockMix = 1.0 - step(0.8, rockMix); // vertex normal > 45 degree will add rock color
    rockMix = step(rockMix, 0.8);
    rockMix *= step(- 0.06, vPosition.y);
    color = mix(color, uColorRock, rockMix);

    // snow
    float snowThreshold = 0.45;
    snowThreshold += simplexNoise2d(vPosition.xz * 15.0) * 0.1; // y range variation [- 0.1, 0.1]
    float snowMix = step(snowThreshold, vPosition.y);
    color = mix(color, uColorSnow, snowMix);

    // final color
    csm_DiffuseColor = vec4(color, 1.0);
}