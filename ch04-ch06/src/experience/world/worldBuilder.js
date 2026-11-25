import FoxScene from './scenes/FoxScene';
import ShaderTestScene from './scenes/shaderScenes/ShaderTestScene';
import ShaderPatternScene from './scenes/shaderScenes/ShaderPatternScene';
import RagingSea from './scenes/shaderScenes/RagingSea';
import GalaxyScene from './scenes/shaderScenes/GalaxyScene';
import CustomizedMaterialScene from './scenes/shaderScenes/CustomizedMaterialScene';
import CoffeeSmokeScene from './scenes/shaderScenes/CoffeeSmokeScene';
import HologramScene from './scenes/shaderScenes/HologramScene';
import FireworksScene from './scenes/shaderScenes/FireworksScene';
import LightsShadingScene from './scenes/shaderScenes/LightsShadingScene';
import DemonicSea from './scenes/shaderScenes/DemonicSea';
import HalftoneScene from './scenes/shaderScenes/HalftoneScene';
import EarthScene from './scenes/shaderScenes/EarthScene';
import ParticlesCursorAnimationScene from './scenes/shaderScenes/ParticlesCursorAnimationScene';
import ParticlesMorphingScene from './scenes/shaderScenes/ParticlesMorphingScene';
import GpgpuFlowFieldParticlesScene from './scenes/shaderScenes/GpgpuFlowFieldParticlesScene';
import MutatedSkinScene from './scenes/shaderScenes/MutatedSkinScene';
import SlicedModelScene from './scenes/shaderScenes/SlicedModelScene';
import ProceduralTerrainScene from './scenes/shaderScenes/ProceduralTerrainScene';

import config from '../config';

const sceneLabels = [];
for (const scene in config) {

    sceneLabels.push(scene);

}

const initialWorld = 'ProceduralTerrainScene';
export { sceneLabels, initialWorld };

export default function buildWorldScenes() {

    return {

        FoxScene: new FoxScene(config.FoxScene),
        ShaderTestScene: new ShaderTestScene(config.ShaderTestScene),
        ShaderPatternScene: new ShaderPatternScene(config.ShaderPatternScene),
        RagingSea: new RagingSea(config.RagingSea),
        GalaxyScene: new GalaxyScene(config.GalaxyScene),
        CustomizedMaterialScene: new CustomizedMaterialScene(config.CustomizedMaterialScene),
        CoffeeSmokeScene: new CoffeeSmokeScene(config.CoffeeSmokeScene),
        HologramScene: new HologramScene(config.HologramScene),
        FireworksScene: new FireworksScene(config.FireworksScene),
        LightsShadingScene: new LightsShadingScene(config.LightsShadingScene),
        DemonicSea: new DemonicSea(config.DemonicSea),
        HalftoneScene: new HalftoneScene(config.HalftoneScene),
        EarthScene: new EarthScene(config.EarthScene),
        ParticlesCursorAnimationScene: new ParticlesCursorAnimationScene(config.ParticlesCursorAnimationScene),
        ParticlesMorphingScene: new ParticlesMorphingScene(config.ParticlesMorphingScene),
        GpgpuFlowFieldParticlesScene: new GpgpuFlowFieldParticlesScene(config.GpgpuFlowFieldParticlesScene),
        MutatedSkinScene: new MutatedSkinScene(config.MutatedSkinScene),
        SlicedModelScene: new SlicedModelScene(config.SlicedModelScene),
        ProceduralTerrainScene: new ProceduralTerrainScene(config.ProceduralTerrainScene)

    };

};