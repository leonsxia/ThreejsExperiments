uniform float uSliceStart;
uniform float uSliceArc;
uniform vec3 uBacksideColor;

varying vec3 vPosition;

void main()
{
    float angle = atan(vPosition.y, vPosition.x);
    angle -= uSliceStart;
    angle = mod(angle, PI * 2.0);

    if (angle > 0.0 && angle < uSliceArc)
        discard;

    // alert Custom Shader Material to replace and inject shader chunk through the whole shader
    float csm_Slice;
}