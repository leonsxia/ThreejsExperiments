#include '../includes/simplexNoise4d.glsl'
uniform float uTime;
uniform float uPositionFrequency;
uniform float uTimeFrequency;
uniform float uStrength;
uniform float uWarpPositionFrequency;
uniform float uWarpTimeFrequency;
uniform float uWarpStrength;

uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uWobbleLevel;

varying vec3 vPosition;
varying vec2 vUv;

float getWobble(vec3 position)
{
    vec3 warpedPosition = position;
    warpedPosition += simplexNoise4d(vec4(
        position * uWarpPositionFrequency,
        uTime * uWarpTimeFrequency
    )) * uWarpStrength;

    return simplexNoise4d(vec4(
        warpedPosition * uPositionFrequency,   // xyz
        uTime * uTimeFrequency                 // w
    )) * uStrength;
}

void main()
{
    // vec3 biTangent = cross(vNormal, vTangent);

    // neighbours positions
    float shift = 0.01;
    vec3 positionA = vPosition + normalize(vTangent) * shift;
    vec3 positionB = vPosition + normalize(vBitangent) * shift;

    // wobble
    float wobble = getWobble(vPosition);
    vec3 computedPosition = vPosition;
    computedPosition += wobble * vNormal;
    positionA += getWobble(positionA) * normalize(vNormal);
    positionB += getWobble(positionB) * normalize(vNormal);

    /**
    * normal
    */
    // normal map in tangent space
    vec3 mapNor = normalize(texture(normalMap, vUv).xyz) * 2.0 - 1.0;
    mapNor.xy *= normalScale;
    mat3 cTBN = mat3(normalize(vTangent), normalize(vBitangent), normalize(vNormal));
	vec3 tNormal = normalize(cTBN * mapNor);

    // computed normal
    vec3 toA = normalize(positionA - computedPosition);
    vec3 toB = normalize(positionB - computedPosition);
    vec3 computedNormal = cross(toA, toB);  //normalize((viewMatrix * vec4(cross(toA, toB), 0.0)).xyz);

    // mix normal map with computed normal
    vec3 finalNormal = normalize(tNormal + mix(vec3(0.0), computedNormal, uWobbleLevel));

    // assign final normal to output
    csm_FragNormal = finalNormal;

    float finalWobble = wobble / uStrength;
    float colorMix = smoothstep(- 1.0, 1.0, finalWobble);
    csm_DiffuseColor.rgb = mix(csm_DiffuseColor.rgb, mix(uColorA, uColorB, colorMix), uWobbleLevel);

    // test
    // csm_FragColor = vec4(tNormal, 1.0);

    // mirror step
    // csm_Metalness = step(0.25, wobble);
    // csm_Roughness = 1.0 - csm_Metalness;

    // shiny tip
    csm_Roughness = mix(roughness, (1.0 - colorMix), uWobbleLevel);
}