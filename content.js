const browser = globalThis.browser || globalThis.chrome

let textWidth = null;
let input = null

const addCSS = () => {
    const css = document.createElement('style')

    css.id = 'babbel-set-translation-length'
    css.textContent = `
    #babbel-set-translation-length {
      background-color: transparent;
      background-repeat: no-repeat;
      background-position: bottom center, 50%, 50%;
      border: none;
      cursor: pointer;
      height: 24px;
      width: 24px;
      min-width: 24px;
      min-height: 24px;
      margin: 0 10px 0 10px;
      padding: 0;
      border-radius: 4px;
    }

    #babbel-set-translation-length:hover {
      background-color: rgba(0, 0, 0, 0.1);
      box-shadow: rgba(154, 68, 0, 0.5) 1px 1px 2px;
    }
    #babbel-set-translation-length.hidden {
        background-image: url(${browser.runtime.getURL('rsc/img/icon_disable24x24.svg')});
    }

    #babbel-set-translation-length.shown {
        background-image: url(${browser.runtime.getURL('rsc/img/icon_enable24x24.svg')});
    }
`
    document.head.appendChild(css)
    const hideTranslationCSS = document.createElement('style')
    hideTranslationCSS.id = 'babbel-set-translation-length'
    document.head.appendChild(hideTranslationCSS)
}

const resetInputLength = () => {
    if (textWidth && input) {
        console.log('resetInputLength')
        input.ad
        input.removeEventListener('input', (x) => updateInputLength(x.currentTarget))
        input.style = `width: ${textWidth}px`
    }else {
        console.warn('input or textWidth is not set')
    }
}

const activateDynamicLength = () => {
    input = document.querySelector('.iwIHL') || null;

    console.info('activateDynamicLength -> input: ', input)
    if (input) {
        textWidth = input.clientWidth;
        console.debug(`store current width: ${textWidth} \nadjust input width \nadd EventListener`);
        updateInputLength(input)
        input.addEventListener('input', (x) => updateInputLength(x.currentTarget))
    } else {
        console.warn('input is not set')
    }
}

const updateInputLength = (element) => {
    const charSize = 13;
    console.debug('Update Input width');
    element.style = `width: ${element.value.length * charSize + 15}px`
}

const createButton = () => {
    const button = document.createElement('button')

    button.id = 'babbel-set-translation-length'
    button.className = 'hidden'
    button.title = 'Set automatically input length'

    const toggle = () => {
        if (button.className === 'shown') {
            button.className = 'hidden'
            button.title = 'Enable automatically input length'
            resetInputLength()
        } else {
            button.className = 'shown'
            button.title = 'Disable automatically input length'
            activateDynamicLength()
        }
    }

    button.addEventListener('click', toggle)

    return button
}

const insertButton = () => {
    const button = createButton()
    const header = document.querySelector(
        '[aria-label="right aligned menu"][as="nav"] > div:first-child'
    )

    header.prepend(button)

    return button
}

const init = async () => {
    if (document.getElementById('babbel-set-translation-length')) {
        console.debug('Babbel - Babble adjust input length: Already initialized.')
        return
    }

    addCSS()
    insertButton()

    console.debug('Babbel - Hide Translations: Initialized.')
}

init().catch(error => {
    console.error('Babbel - Auto Adjust Input Length: Error initializing.', error)
})