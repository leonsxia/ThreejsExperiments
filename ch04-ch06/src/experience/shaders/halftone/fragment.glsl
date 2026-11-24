uniform vec3 uColor;
// halftone
uniform vec2 uResolution;
uniform float uShadowRepetitions;
uniform vec3 uShadowColor;
uniform float uShadowFalloffPower;
uniform float uLightRepetitions;
uniform vec3 uLightColor;
uniform float uLightFalloffPower;
// ambient light
uniform vec3 uAmbientColor;
uniform float uAmbientIntensity;
// directional light
uniform vec3 uDirectionalColor;
uniform float uDirectionalIntensity;
uniform float uDirectionalSpecular;
uniform vec3 uDirectionalPosition;

varying vec3 vNormal;
varying vec3 vPosition;

#include ../includes/ambientLight.glsl
#include ../includes/directionalLight.glsl

vec3 halftone(
    vec3 color,
    float repetitions,
    vec3 direction,
    float low,
    float high,
    vec3 pointColor,
    vec3 normal,
    float falloffPow
)
{
    float intensity = dot(normal, normalize(direction));
    intensity = smoothstep(low, high, intensity);
    
    // uv
    vec2 uv = gl_FragCoord.xy / uResolution.y;
    uv *= repetitions;
    uv = mod(uv, 1.0);

    // draw point
    float point = distance(uv, vec2(0.5));
    point = 1.0 - step(0.5 * intensity, point);

    // falloff gradient
    float min = smoothstep(low, high, - 1.0);
    float max = smoothstep(low, high, 1.0);
    float strength = pow(smoothstep(min, max, intensity), falloffPow);
    pointColor = mix(color, pointColor, strength);
    
    return mix(color, pointColor, point);
}

void main()
{
    vec3 color = uColor;
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    vec3 normal = normalize(vNormal);

    // lights
    vec3 light = vec3(0.0);

    // ambient
    light += ambientLight(
        uAmbientColor,
        uAmbientIntensity
    );

    // directional
    light += directionalLight(
        uDirectionalColor,
        uDirectionalIntensity,
        normal,
        uDirectionalPosition,
        viewDirection,
        uDirectionalSpecular
    );

    color *= light;

    // halftone
    color = halftone(
        color,
        uShadowRepetitions,
        // vec3(0.0, - 1.0, 0.0),
        - uDirectionalPosition,
        - 0.8,
        1.5,
        uShadowColor,
        normal,
        uShadowFalloffPower
    );

    color = halftone(
        color,
        uLightRepetitions,
        // vec3(1.0, 1.0, 0.0),
        uDirectionalPosition,
        0.5,
        1.5,
        uLightColor,
        normal,
        uLightFalloffPower
    );

    // final color
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}