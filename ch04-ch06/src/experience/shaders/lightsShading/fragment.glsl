uniform vec3 uColor;
// ambient light
uniform vec3 uAmbientColor;
uniform float uAmbientIntensity;
// directional light
uniform vec3 uDirectionalColor;
uniform float uDirectionalIntensity;
uniform float uDirectionalSpecular;
uniform vec3 uDirectionalPosition;
// point light 1
uniform vec3 uPoint1Color;
uniform float uPoint1Intensity;
uniform vec3 uPoint1Position;
uniform float uPoint1Specular;
uniform float uPoint1Radius;
// point light 2
uniform vec3 uPoint2Color;
uniform float uPoint2Intensity;
uniform vec3 uPoint2Position;
uniform float uPoint2Specular;
uniform float uPoint2Radius;

varying vec3 vNormal;
varying vec3 vPosition;

#include ../includes/ambientLight.glsl
#include ../includes/directionalLight.glsl
#include ../includes/pointLight.glsl

void main()
{
    vec3 color = uColor;
    vec3 normal = normalize(vNormal);
    vec3 viewDirection = normalize(vPosition - cameraPosition);

    // lights
    vec3 light = vec3(0.0);

    light += ambientLight(
        uAmbientColor,
        uAmbientIntensity
    );

    light += directionalLight(
        uDirectionalColor,
        uDirectionalIntensity,
        normal,
        uDirectionalPosition,
        viewDirection,
        uDirectionalSpecular
    );

    light += pointLight(
        uPoint1Color,
        uPoint1Intensity,
        normal,
        uPoint1Position,
        viewDirection,
        uPoint1Specular,
        vPosition,
        uPoint1Radius
    );

    light += pointLight(
        uPoint2Color,
        uPoint2Intensity,
        normal,
        uPoint2Position,
        viewDirection,
        uPoint2Specular,
        vPosition,
        uPoint2Radius
    );

    color *= light;

    // final color
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}