#include '../../includes/simplexNoise4d.glsl'
uniform float uTime;
uniform float uPositionFrequency;
uniform float uTimeFrequency;
uniform float uStrength;
uniform float uWarpPositionFrequency;
uniform float uWarpTimeFrequency;
uniform float uWarpStrength;
uniform float uFadeout;
uniform float uDensity;

uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uEffectLevel;

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

    // get original wobble since getWobble will divide uStrength at last
    float finalWobble = wobble / uStrength;    
    float colorMix = smoothstep(- 1.0, 1.0, finalWobble);
    float finalMix = smoothstep(min(- uDensity, 0.0), max(0.0, uFadeout), finalWobble);
    // csm_DiffuseColor.rgb = mix(csm_DiffuseColor.rgb, mix(uColorA, uColorB, colorMix), uEffectLevel);
    csm_DiffuseColor.rgb = mix(
        csm_DiffuseColor.rgb,
        mix(csm_DiffuseColor.rgb, mix(uColorA, uColorB, colorMix), uEffectLevel),
        finalMix
    );
    // csm_DiffuseColor.a = finalMix;

    /**
    * normal
    */
    // normal map in tangent space
    vec3 nor = normalize(vNormal);
    nor *= gl_FrontFacing ? 1.0 : - 1.0;

    vec3 mapNor = texture(normalMap, vNormalMapUv).xyz * 2.0 - 1.0;
    mapNor.xy *= normalScale;
    mat3 cTBN = mat3(normalize(vTangent), normalize(vBitangent), nor);
	vec3 tNormal = normalize(cTBN * mapNor);

    // computed normal
    vec3 toA = normalize(positionA - computedPosition);
    vec3 toB = normalize(positionB - computedPosition);
    vec3 computedNormal = cross(toA, toB);  //normalize((viewMatrix * vec4(cross(toA, toB), 0.0)).xyz);

    // mix normal map with computed normal
    vec3 finalNormal = normalize(tNormal + mix(vec3(0.0), computedNormal, uEffectLevel));

    // assign final normal to output
    // csm_FragNormal = finalNormal;
    csm_FragNormal = normalize(mix(tNormal, finalNormal, finalMix));
    // test
    // csm_FragNormal = tNormal;

    // test
    // csm_FragColor = vec4(tNormal, 1.0);
    // csm_FragColor = vec4(vUv, 1.0, 1.0);

    // shiny tip
    csm_Roughness = mix(roughness, max(0.0, roughness - colorMix), uEffectLevel);
}