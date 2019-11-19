import { find } from 'lodash'

export const getOptionName = (presets, useds) => find(presets, preset => useds.indexOf(preset) < 0)
