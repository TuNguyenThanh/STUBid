import { combineReducers } from 'redux'
import configureStore from './CreateStore'
import rootSaga from '../Sagas/'

export default () => {
  /* ------------- Assemble The Reducers ------------- */
  const rootReducer = combineReducers({
    github: require('./GithubRedux').reducer,
    login: require('./LoginRedux').reducer,
    searchs: require('./SearchRedux').reducer,
    settings: require('./SettingsRedux').reducer,
    tabNavigator: require('./TabNavigatorRedux').reducer,
    auctions: require('./AuctionsRedux').reducer,
  })

  return configureStore(rootReducer, rootSaga)
}
