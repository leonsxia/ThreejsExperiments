export default {
    FoxScene: {
        camera: {
            fov: 35,
            near: 0.1,
            far: 100,
            position: [6, 4, 8]
        }
    },
    ShaderTestScene: {
        camera: {
            fov: 75,
            near: 0.1,
            far: 100,
            position: [0.25, - 0.25, 1]
        }
    },
    ShaderPatternScene: {
        camera: {
            fov: 75,
            near: 0.1,
            far: 100,
            position: [0.25, - 0.25, 1]
        }
    },
    RagingSea: {
        camera: {
            fov: 75,
            near: 0.1,
            far: 100,
            position: [1, 1, 1]
        }
    },
    GalaxyScene: {
        camera: {
            fov: 75,
            near: 0.1,
            far: 100,
            position: [0, 7, 7]
        },
        LfoGalaxy001: {
            name: 'LFO Galaxy 001',
            parameters: {
                count: 100000,
                size: 18,
                radius: 3.6,
                branches: 10,
                spinType: 1,
                spin: 3.691,
                spinCoefficient: 20,
                randomness: 0.344,
                randomnessPower: 7.434,
                insideColor: '#ff6030',
                mediumColor: '#bf47ff',
                outsideColor: '#1b3984'
            },
            oscillator: {
                frequency: 4,
                amplitude: 0.025,
                speed: 1,
                mod1Enable: true,
                mod2Enable: true,
                'sin modulator1': 0.234,
                'sin modulator2': 0.345
            },
            position: [-9.213, -0.48, -1],
            rotation: [0.0595926535897933, 0, -0.463592653589793]
        },
        LfoGalaxy002: {
            name: 'LFO Galaxy 002',
            parameters: {
                count: 100000,
                size: 13.4,
                radius: 4.5,
                branches: 5,
                spinType: 1,
                spin: -3.769,
                spinCoefficient: 28.2,
                randomness: 0.2,
                randomnessPower: 4.7,
                insideColor: '#e64747',
                mediumColor: '#e29d44',
                outsideColor: '#bc4e29'
            },
            oscillator: {
                frequency: 4,
                amplitude: 0.025,
                speed: 1,
                mod1Enable: true,
                mod2Enable: true,
                'sin modulator1': 0.234,
                'sin modulator2': 0.345
            },
            position: [7.38, 1.849, -5.72],
            rotation: [0.398407346410207, 0, 0.580407346410207]
        },
        LfoGalaxy003: {
            name: 'LFO Galaxy 003',
            parameters: {
                count: 50000,
                size: 6.4,
                radius: 2.8,
                branches: 6,
                spinType: 0,
                rotateSpeed: 0.189,
                spin: 1.204,
                spinCoefficient: 20.6,
                randomness: 0.235,
                randomnessPower: 6.823,
                insideColor: '#f80d0d',
                mediumColor: '#4bece9',
                outsideColor: '#bc295d'
            },
            oscillator: {
                frequency: 7,
                amplitude: 0.06,
                speed: 1,
                mod1Enable: true,
                mod2Enable: true,
                'sin modulator1': 0.633,
                'sin modulator2': 0.345
            },
            position: [0.685, -1.353, 2.443],
            rotation: [-0.463592653589793, 0, 0.151407346410207]
        }
    },
    CustomizedMaterialScene: {
        camera: {
            fov: 75,
            near: 0.1,
            far: 100,
            position: [4, 1, -4]
        }
    },
    CoffeeSmokeScene: {
        camera: {
            fov: 25,
            near: 0.1,
            far: 100,
            position: [8, 10, 12]
        }
    },
    HologramScene: {
        camera: {
            fov: 25,
            near: 0.1,
            far: 100,
            position: [7, 7, 7]
        },
        renderer: {
            clearColor: '#1d1f2a'
        }
    },
    FireworksScene: {
        camera: {
            fov: 25, 
            near: 0.1,
            far: 100,
            position: [1.5, 0, 6]
        }
    },
    LightsShadingScene: {
        camera: {
            fov: 25,
            near: 0.1,
            far: 100,
            position: [7, 7, 7]
        }
    },
    DemonicSea: {
        camera: {
            fov: 75,
            near: 0.1,
            far: 100,
            position: [1, 1, 1]
        }
    },
    HalftoneScene: {
        camera: {
            fov: 25,
            near: 0.1,
            far: 100,
            position: [7, 7, 7]
        },
        renderer: {
            clearColor: '#26132f'
        }
    },
    EarthScene: {
        camera: {
            fov: 25,
            near: 0.1,
            far: 100,
            position: [12, 5, 4]
        },
        renderer: {
            clearColor: '#000011'
        }
    },
    ParticlesCursorAnimationScene: {
        camera: {
            fov: 35,
            near: 0.1,
            far: 100,
            position: [0, 0, 18]
        }
    },
    ParticlesMorphingScene: {
        camera: {
            fov: 35,
            near: 0.1,
            far: 100,
            position: [0, 0, 16]
        },
        renderer: {
            clearColor: '#160920'
        }
    },
    GpgpuFlowFieldParticlesScene: {
        camera: {
            fov: 35,
            near: 0.1,
            far: 100,
            position: [0, 0, 16]
        },
        renderer: {
            clearColor: '#29191f'
        }
    },
    MutatedSkinScene: {
        camera: {
            fov: 35,
            near: 0.1,
            far: 100,
            position: [13, - 3, - 5]
        },
    },
    SlicedModelScene: {
        camera: {
            fov: 35,
            near: 0.1,
            far: 100,
            position: [- 5, 5, 12]
        }
    },
    ProceduralTerrainScene: {
        camera: {
            fov: 35,
            near: 0.1,
            far: 100,
            position: [- 10, 6, - 2]
        }
    }
};