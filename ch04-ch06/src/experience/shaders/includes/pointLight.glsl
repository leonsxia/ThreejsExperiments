// blinnphong
vec3 pointLight(vec3 lightColor, float lightIntensity, vec3 normal, vec3 lightPosition, vec3 viewDirection, float specularPower, vec3 position, float lightRadius)
{
    float lightDecay = 1.0 / lightRadius;
    vec3 toLight = lightPosition - position;
    float lightDistance = length(toLight);
    vec3 lightDirection = normalize(toLight);
    vec3 lightReflection = reflect(- lightDirection, normal);

    // shading
    float shading = dot(normal, lightDirection);
    shading = max(0.0, shading);

    // specular
    // float specular = - dot(lightReflection, viewDirection);
    vec3 halfVec = normalize(lightDirection - viewDirection);
    float specular = dot(halfVec, normal);
    specular = max(0.0, specular);
    specular = pow(specular, specularPower);

    // falloff
    float falloff = 1.0 - lightDistance * lightDecay;
    falloff = max(0.0, falloff);

    return lightColor * lightIntensity * falloff * (shading + specular);
}