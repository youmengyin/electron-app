// ESM
import { rebuild } from '@electron/rebuild'

rebuild({
  buildPath: import.meta.dirname,
  electronVersion: '35.1.5'
})
  .then(() => console.info('Rebuild Successful'))
  .catch((e) => {
    console.error("Building modules didn't work!")
    console.error(e)
  })
