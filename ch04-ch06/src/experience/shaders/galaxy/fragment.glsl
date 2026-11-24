uniform sampler2D uAlphaMap;
uniform float uAttenuation;

varying vec3 vColor;

void main()
{

    // disc
    // float strength = distance(gl_PointCoord, vec2(0.5));
    // strength = step(0.5, strength);
    // strength = 1.0 - strength;

    // diffuse point
    // float strength = distance(gl_PointCoord, vec2(0.5));
    // strength *= 2.0;
    // strength = 1.0 - strength;

    // light point
    float strength = distance(gl_PointCoord, vec2(0.5));
    strength = 1.0 - strength;
    strength = pow(strength, uAttenuation);

    // alpha map
    float alpha = texture2D(uAlphaMap, gl_PointCoord).g;

    vec3 color = mix(vec3(0.0), vColor, strength);
    gl_FragColor = vec4(color, alpha);
    // output color in sRGB
    #include <colorspace_fragment>

}