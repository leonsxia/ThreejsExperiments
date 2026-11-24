uniform float uTime;
uniform float uDelta;
uniform sampler2D uBase;
uniform float uFlowfieldInfluence;
uniform float uFlowfieldStrength;
uniform float uFlowfieldFrequency;
uniform float uInfluenceFrequency;

#include ../includes/simplexNoise4d.glsl

void main()
{
    float time = uTime * 0.2;
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec4 particle = texture(uParticles, uv);
    vec4 base = texture(uBase, uv);

    // dead
    if (particle.a >= 1.0)
    {
        // make sure particles not synchronized when uDelta is too large
        particle.a = mod(particle.a, 1.0);
        particle.xyz = base.xyz;
    }
    // alive
    else
    {
        // strength
        float strength = simplexNoise4d(vec4(base.xyz * uInfluenceFrequency, time + 1.0));
        float influence = (uFlowfieldInfluence - 0.5) * (- 2.0);
        strength = smoothstep(influence, 1.0, strength);

        // flow field
        vec3 flowField = vec3(
            simplexNoise4d(vec4(particle.xyz * uFlowfieldFrequency + 0.0, time)),
            simplexNoise4d(vec4(particle.xyz * uFlowfieldFrequency + 1.0, time)),
            simplexNoise4d(vec4(particle.xyz * uFlowfieldFrequency + 2.0, time))
        );
        flowField = normalize(flowField);
        particle.xyz += flowField * uDelta * strength * uFlowfieldStrength;

        // decay
        particle.a += uDelta * 0.3;
    }

    gl_FragColor = particle;
}