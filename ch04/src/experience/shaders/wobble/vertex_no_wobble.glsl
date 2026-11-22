varying vec3 vPosition;
varying vec2 vUv;

void main()
{
    // varying
    // vTangent = tangent.xyz;
    vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    vUv = uv;
}