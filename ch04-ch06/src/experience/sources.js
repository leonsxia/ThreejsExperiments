const sourceMaps = {
    texture: [
        {
            name: 'grassColorTexture',
            type: 'texture',
            path: 'textures/dirt/color.jpg'
        }, {
            name: 'grassNormalTexture',
            type: 'texture',
            path: 'textures/dirt/normal.jpg'
        }, {
            name: 'flagTexture',
            type: 'texture',
            path: 'textures/shades/flag-french.jpg'
        }, {
            name: 'particle1',
            type: 'texture',
            path: 'textures/particles/1.png'
        }, {
            name: 'leePerrySmithColorTexture',
            type: 'texture',
            path: 'models/LeePerrySmith/color.jpg'
        }, {
            name: 'leePerrySmithNormalTexture',
            type: 'texture',
            path: 'models/LeePerrySmith/normal.jpg'
        }, {
            name: 'perlin',
            type: 'texture',
            path: 'textures/perlin.png'
        }, {
            name: 'particle01',
            type: 'texture',
            path: 'textures/particles/1.png'
        }, {
            name: 'particle02',
            type: 'texture',
            path: 'textures/particles/2.png'
        }, {
            name: 'particle03',
            type: 'texture',
            path: 'textures/particles/3.png'
        }, {
            name: 'particle04',
            type: 'texture',
            path: 'textures/particles/4.png'
        }, {
            name: 'particle05',
            type: 'texture',
            path: 'textures/particles/5.png'
        }, {
            name: 'particle06',
            type: 'texture',
            path: 'textures/particles/6.png'
        }, {
            name: 'particle07',
            type: 'texture',
            path: 'textures/particles/7.png'
        }, {
            name: 'particle08',
            type: 'texture',
            path: 'textures/particles/8.png'
        }, {
            name: 'particle09',
            type: 'texture',
            path: 'textures/particles/9.png'
        }, {
            name: 'particle10',
            type: 'texture',
            path: 'textures/particles/10.png'
        }, {
            name: 'particle11',
            type: 'texture',
            path: 'textures/particles/11.png'
        }, {
            name: 'earthDayTexture',
            type: 'texture',
            path: 'textures/earth/day.jpg'
        }, {
            name: 'earthNightTexture',
            type: 'texture',
            path: 'textures/earth/night.jpg'
        }, {
            name: 'earthSpecularCloudsTexture',
            type: 'texture',
            path: 'textures/earth/specularClouds.jpg'
        }, {
            name: 'lensflareTexture0',
            type: 'texture',
            path: 'textures/lenses/lensflare0.png'
        }, {
            name: 'lensflareTexture1',
            type: 'texture',
            path: 'textures/lenses/lensflare1.png'
        }, {
            name: 'glow',
            type: 'texture',
            path: 'textures/grey/glow.png'
        }, {
            name: 'grey1',
            type: 'texture',
            path: 'textures/grey/picture-1.png'
        }, {
            name: 'grey2',
            type: 'texture',
            path: 'textures/grey/picture-2.png'
        }, {
            name: 'grey3',
            type: 'texture',
            path: 'textures/grey/picture-3.png'
        }, {
            name: 'grey4',
            type: 'texture',
            path: 'textures/grey/picture-4.png'
        }, {
            name: 'glow',
            type: 'image',
            path: 'textures/grey/glow.png'
        }, {
            name: 'metal168',
            type: 'texture',
            path: 'textures/walls/Texturelabs_Metal_168M.jpg'
        }, {
            name: 'metal168Normal',
            type: 'texture',
            path: 'textures/walls/Texturelabs_Metal_168L.jpg'
        }, {
            name: 'damagedPlaster',
            type: 'texture',
            path: 'textures/walls/damaged_plaster_diff_2k.jpg'
        }, {
            name: 'damagedPasterNormal',
            type: 'texture',
            path: 'textures/walls/damaged_plaster_nor_gl_2k.jpg'
        }, {
            name: 'brickWall1',
            type: 'texture',
            path: 'textures/walls/brick_wall_001_diffuse_2k.jpg'
        }, {
            name: 'brickWall1Normal',
            type: 'texture',
            path: 'textures/walls/brick_wall_001_nor_gl_2k.jpg'
        }, {
            name: 'interfaceNormal',
            type: 'texture',
            path: 'textures/normal/interfaceNormalMap.png'
        }, {
            name: 'displacementMap',
            type: 'texture',
            path: 'textures/displacement/displacementMap.png'
        }
    ],
    cubeTexture: [
        {
            name: 'environmentMapTexture',
            type: 'cubeTexture',
            path:
                [
                    'textures/environmentMap/px.jpg',
                    'textures/environmentMap/nx.jpg',
                    'textures/environmentMap/py.jpg',
                    'textures/environmentMap/ny.jpg',
                    'textures/environmentMap/pz.jpg',
                    'textures/environmentMap/nz.jpg'
                ]
        }
    ],
    hdr: [
        {
            name: 'urbanAlleyHDR',
            type: 'hdr',
            path: 'textures/hdr/urban_alley_01_1k.hdr'
        }, {
            name: 'aerodynamicsWorkshopHDR',
            type: 'hdr',
            path: 'textures/hdr/aerodynamics_workshop.hdr'
        }, {
            name: 'spruitSunriseHDR',
            type: 'hdr',
            path: 'textures/hdr/spruit_sunrise.hdr'
        }
    ],
    gltfModel: [
        {
            name: 'foxModel',
            type: 'gltfModel',
            path: 'models/fox/glTF/Fox.gltf'
        }, {
            name: 'hamburgerModel',
            type: 'gltfModel',
            path: 'models/hamburger/hamburger.glb'
        }, {
            name: 'leePerrySmithModel',
            type: 'gltfModel',
            path: 'models/LeePerrySmith/LeePerrySmith.glb'
        }, {
            name: 'coffeeMug',
            type: 'gltfModel',
            path: 'models/coffeeMug/bakedModel.glb'
        }, {
            name: 'suzanne',
            type: 'gltfModel',
            path: 'models/suzanne.glb'
        }, {
            name: 'morphModels',
            type: 'gltfModel',
            path: 'models/models.glb'
        }, {
            name: 'textSamples',
            type: 'gltfModel',
            path: 'models/textSamples.glb'
        }, {
            name: 'strandedBoat',
            type: 'gltfModel',
            path: 'models/boat/model.glb'
        }, {
            name: 'suzanne2',
            type: 'gltfModel',
            path: 'models/suzanne/suzanne.glb'
        }, {
            name: 'gears',
            type: 'gltfModel',
            path: 'models/gears.glb'
        }, {
            name: 'damagedHelmet',
            type: 'gltfModel',
            path: 'models/DamagedHelmet/glTF/DamagedHelmet.gltf'
        }
    ]
};

const sources = [];
for (const map in sourceMaps) {

    sources.push(...sourceMaps[map]);

}

export default sources;