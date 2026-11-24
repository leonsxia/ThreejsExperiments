uniform float uTime;
// gui related uniforms
uniform vec3 uColor;
uniform float uStripesFlowSpeedY;
uniform float uStripesSegments;
uniform float uStripesSharpness;
uniform float uFalloffInsideOffset;
uniform float uFalloffOutsideOffset;
uniform float uFresnelSharpness;
uniform float uFresnelStrength;
uniform bool uEnableFresnel;
uniform float uEnableColorGradient;

varying vec3 vPosition;
varying vec3 vNormal;

void main()
{
    // normal
    vec3 normal = normalize(vNormal);
    // invert back side normals in case the back side is too bright
    if (!gl_FrontFacing)
    {
        normal *= - 1.0;
    }

    // stripes
    float stripes = mod((vPosition.y - uTime * uStripesFlowSpeedY) * uStripesSegments, 1.0);
    stripes = pow(stripes, uStripesSharpness);

    // fresnel
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    float fresnel = dot(viewDirection, normal) + 1.0;
    // make the fresnel more bright on the edge, formula:(1 - abs(cosx))^2
    fresnel = pow(fresnel, uFresnelSharpness);

    // falloff
    float falloff = smoothstep(uFalloffOutsideOffset, uFalloffInsideOffset, fresnel);

    // holographic
    float holographic = stripes;
    if (uEnableFresnel)
    {
        holographic *= fresnel;
        holographic += fresnel * uFresnelStrength;
    }
    holographic *= falloff;

    float r = min(uColor.r, max(abs(sin(uColor.r + uTime)), 0.1 + uEnableColorGradient));
    float g = min(uColor.g, max(abs(sin(uColor.g + uTime)), 0.1 + uEnableColorGradient));
    float b = min(uColor.b, max(abs(sin(uColor.b + uTime)), 0.1 + uEnableColorGradient));
    gl_FragColor = vec4(r, g, b, holographic);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}