import { takeLatest, fork } from 'redux-saga/effects'
import AuctionsAPI from '../Services/AuctionsApi'
import CategoryAPI from '../Services/CategoryApi'

/* ------------- Types ------------- */

import { StartupTypes } from '../Redux/StartupRedux'
import { SettingsTypes } from '../Redux/SettingsRedux'
import { AuctionsTypes } from '../Redux/AuctionsRedux'
import { SearchTypes } from '../Redux/SearchRedux'
import { CategoryTypes } from '../Redux/CategoryRedux'

/* ------------- Sagas ------------- */

import { startup } from './StartupSagas'
import { updateLanguage } from './SettingsSagas'
import { getAuctions, bidProduct } from './AuctionsSagas'
import { getProducts, searchs } from './SearchSagas'
import { getCategory } from './CategorySagas'

/* ------------- API ------------- */

// The API we use is only used from Sagas, so we create it here and pass along
// to the sagas which need it.
//const api = DebugConfig.useFixtures ? FixtureAPI : API.create()
const AuctionsApi = AuctionsAPI.create()
const CategoryApi = CategoryAPI.create()

/* ------------- Connect Types To Sagas ------------- */

export default function * root () {
  yield [
    // some sagas only receive an action
    takeLatest(StartupTypes.STARTUP, startup),
    //takeLatest(LoginTypes.LOGIN_REQUEST, login),
    //takeLatest(OpenScreenTypes.OPEN_SCREEN, openScreen),

    //some sagas receive extra parameters in addition to an action
    //takeLatest(GithubTypes.USER_REQUEST, getUserAvatar, api),

    //setting
    takeLatest(SettingsTypes.CHANGE_LANGUAGE, updateLanguage),

    //Auctions
    takeLatest(AuctionsTypes.AUCTIONS_REQUEST, getAuctions, AuctionsApi),

    takeLatest(AuctionsTypes.BID_PRODUCT_REQUEST, bidProduct, AuctionsApi),

    //Search - AuctionsApi
    takeLatest(SearchTypes.GET_PRODUCTS_REQUEST, getProducts, AuctionsApi),

    //Category
    takeLatest(CategoryTypes.CATEGORY_PRODUCT_REQUEST, getCategory, CategoryApi),
  ]
}
