uniform float uTime;
uniform float uSize;
uniform float uSpin;
uniform float uSpinCoefficient;
uniform int uSpinType;

uniform vec3 uCenterVec3;

// lfo
uniform float uLfoFrequency;
uniform float uLfoAmplitude;
uniform float uLfoSpeed;
uniform bool uLfoMod1Enable;
uniform bool uLfoMod2Enable;
uniform float uLfoMod1;
uniform float uLfoMod2;

attribute vec3 aRandomness;
attribute float aScale;

varying vec3 vColor;

void main()
{

    vec4 m_position = vec4(position, 1.0);

    // Rotate
    float angle = atan(m_position.x, m_position.z);
    float distanceToCenter = length(m_position.xz);

    float angleOffset = uSpin * uTime / uSpinCoefficient;
    switch(uSpinType)
    {
        case 0:
            angleOffset *= distanceToCenter;
            break;
        case 1:
            angleOffset *= 1.0 / distanceToCenter;
            break;
    }
   
    angle += angleOffset;
    m_position.x = cos(angle) * distanceToCenter;
    m_position.z = sin(angle) * distanceToCenter;

    // Oscillator
    m_position.y += sin((uTime * uLfoSpeed + distanceToCenter) * uLfoFrequency) * uLfoAmplitude * distanceToCenter;
    if (uLfoMod1Enable) {
        m_position.y *= sin(uTime * uLfoMod1);
    }
    if (uLfoMod2Enable) {
        m_position.y *= sin(uTime * uLfoMod2);
    }    

    m_position.xyz += aRandomness;

    vec4 viewPosition = viewMatrix * modelMatrix * m_position;
    gl_Position = projectionMatrix * viewPosition;

    gl_PointSize = uSize * aScale;
    gl_PointSize *= (1.0 / - viewPosition.z);

    vColor = color;

}