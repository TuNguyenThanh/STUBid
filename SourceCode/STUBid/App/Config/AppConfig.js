// Simple React Native specific changes

import '../I18n/I18n'

//STORAGE_KEY save token logined
const STORAGE_KEY_SAVE_TOKEN = 'loginToken';

export default {
  // font scaling override - RN default is on
  allowTextFontScaling: true,
  STORAGE_KEY_SAVE_TOKEN,
}
