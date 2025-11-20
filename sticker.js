const config = {
    radius: 4,
    outline: '#fff',
    base: 0.4,
    octaves: 4,
    seed: 120,
    type: 'turbulence',
    deviation: 2,
    surface: 8,
    specular: 6,
    exponent: 65,
    light: 'hsla(0, 0%, 80%, 0.5)',
    x: 50,
    y: 50,
    z: 65,
    pointer: true,
    dx: 1,
    dy: 3,
    shadow: 'hsl(0, 0%, 0%)',
    shadowOpacity: 0.75,
    shadowDev: 3,
}

const sticker = document.querySelector('.sticker')
const feMorphology = document.querySelector('feMorphology')
const feFlood = document.querySelector('feFlood')
const feTurbulence = document.querySelector('feTurbulence')
const feGaussianBlur = document.querySelector('feGaussianBlur')
const feSpecularLighting = document.querySelector('feSpecularLighting')
const fePointLight = document.querySelector('fePointLight')
const feDropShadow = document.querySelector('feDropShadow')

const syncLight = ({ x, y }) => {
    const stickerBounds = sticker.getBoundingClientRect()
    fePointLight.setAttribute('x', Math.floor(x - stickerBounds.x))
    fePointLight.setAttribute('y', Math.floor(y - stickerBounds.y))
}

let monitoring = false

const update = () => {
    feMorphology.setAttribute('radius', config.radius)
    feFlood.setAttribute('flood-color', config.outline)
    feTurbulence.setAttribute('seed', config.seed)
    feTurbulence.setAttribute('type', config.type)
    feTurbulence.setAttribute('numOctaves', config.octaves)
    feTurbulence.setAttribute('baseFrequency', config.base)
    feGaussianBlur.setAttribute('stdDeviation', config.deviation)
    feSpecularLighting.setAttribute('surfaceScale', config.surface)
    feSpecularLighting.setAttribute('specularConstant', config.specular)
    feSpecularLighting.setAttribute('specularExponent', config.exponent)
    feSpecularLighting.setAttribute('lighting-color', config.light)
    fePointLight.setAttribute('x', config.x)
    fePointLight.setAttribute('y', config.y)
    fePointLight.setAttribute('z', config.z)
    feDropShadow.setAttribute('dx', config.dx)
    feDropShadow.setAttribute('dy', config.dy)
    feDropShadow.setAttribute('flood-color', config.shadow)
    feDropShadow.setAttribute('flood-opacity', config.shadowOpacity)
    feDropShadow.setAttribute('stdDeviation', config.shadowDev)

    if (config.pointer && !monitoring) {
        monitoring = true
        sticker.dataset.pointerLighting = true
        window.addEventListener('pointermove', syncLight)
    } else if (!config.pointer) {
        monitoring = false
        sticker.dataset.pointerLighting = false
        window.removeEventListener('pointermove', syncLight)
    }
}

update()
