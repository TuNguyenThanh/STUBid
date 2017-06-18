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
    auctions: require('./AuctionsRedux').reducer,
    category: require('./CategoryRedux').reducer,
    account: require('./AccountRedux').reducer,
    product: require('./ProductRedux').reducer,
  })

  return configureStore(rootReducer, rootSaga)
}
