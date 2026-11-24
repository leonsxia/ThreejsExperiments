uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;

// point light 1
uniform vec3 uPoint1Color;
uniform float uPoint1Intensity;
uniform vec3 uPoint1Position;
uniform float uPoint1Specular;
uniform float uPoint1Radius;

varying float vElevation;
varying vec3 vNormal;
varying vec3 vPosition;

#include ../includes/ambientLight.glsl
#include ../includes/directionalLight.glsl
#include ../includes/pointLight.glsl

void main()
{
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    vec3 normal = normalize(vNormal);
    
    // color strength
    float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
    mixStrength = smoothstep(0.0, 1.0, mixStrength);
    vec3 color = mix(uDepthColor, uSurfaceColor, mixStrength);

    vec3 light = vec3(0.0);

    light += pointLight(
        uPoint1Color,  // color
        uPoint1Intensity,   // intensity
        normal, // normal
        uPoint1Position, // light position
        viewDirection,  // view direction from vPosition to cameraPosition
        uPoint1Specular,   // specular
        vPosition,  // fragment position
        uPoint1Radius  // radius
    );

    color *= light;

    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}