varying vec3 vPosition;
varying vec2 vUv;

void main()
{
    // varying
    vTangent = tangent.xyz;
    vPosition = csm_Position; //(modelMatrix * vec4(position, 0.0)).xyz;
    vUv = uv;
}