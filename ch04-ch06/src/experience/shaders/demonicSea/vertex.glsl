uniform float uTime;
uniform float uShift;
uniform float uBigWavesElevation;
uniform vec2 uBigWavesFrequency;
uniform float uBigWavesSpeed;

uniform float uSmallWavesElevation;
uniform float uSmallWavesFrequency;
uniform float uSmallWavesSpeed;
uniform float uSmallIterations;

varying float vElevation;
varying vec3 vNormal;
varying vec3 vPosition;

#include ../includes/perlinClassic3D.glsl

float waveElevation(vec3 position)
{
    float elevation = sin(position.x * uBigWavesFrequency.x + uTime * uBigWavesSpeed) *
                      sin(position.z * uBigWavesFrequency.y + uTime * uBigWavesSpeed) *
                      uBigWavesElevation;

    for (float i = 1.0; i <= uSmallIterations; i++)
    {
        // increase frequency and reduce amplitude within each iteration
        elevation -= abs(perlinClassic3D(vec3(position.xz * uSmallWavesFrequency * i, uTime * uSmallWavesSpeed)) * uSmallWavesElevation / i);
    }

    return elevation;
}

void main()
{
    // base position
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // tangent and bi-tangent based on neighbour positions
    float shift = 0.01;
    vec3 modelPositionA = modelPosition.xyz + vec3(uShift, 0.0, 0.0);
    vec3 modelPositionB = modelPosition.xyz + vec3(0.0, 0.0, - shift);

    // elevation
    float elevation = waveElevation(modelPosition.xyz);
    float elevationA = waveElevation(modelPositionA);
    float elevationB = waveElevation(modelPositionB);

    modelPosition.y += elevation;
    modelPositionA.y += elevationA;
    modelPositionB.y += elevationB;

    // compute normal
    vec3 toA = normalize(modelPositionA - modelPosition.xyz);
    vec3 toB = normalize(modelPositionB - modelPosition.xyz);
    vec3 computedNormal = cross(toA, toB);

    // final position
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    // varyings
    vElevation = elevation;
    vNormal = computedNormal;
    vPosition = modelPosition.xyz;
}