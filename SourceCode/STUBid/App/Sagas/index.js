import { takeLatest, fork } from 'redux-saga/effects'
import AuctionsAPI from '../Services/AuctionsApi'
import CategoryAPI from '../Services/CategoryApi'
import UserAPI from '../Services/UserApi'
import AccountAPI from '../Services/AccountApi'
import ProductAPI from '../Services/ProductApi'

/* ------------- Types ------------- */

import { StartupTypes } from '../Redux/StartupRedux'
import { SettingsTypes } from '../Redux/SettingsRedux'
import { AuctionsTypes } from '../Redux/AuctionsRedux'
import { SearchTypes } from '../Redux/SearchRedux'
import { CategoryTypes } from '../Redux/CategoryRedux'
import { LoginTypes } from '../Redux/LoginRedux'
import { AccountTypes } from '../Redux/AccountRedux'
import { ProductTypes } from '../Redux/ProductRedux'

/* ------------- Sagas ------------- */

import { startup } from './StartupSagas'
import { updateLanguage } from './SettingsSagas'
import { getAuctions, bidProduct } from './AuctionsSagas'
import { searchs } from './SearchSagas'
import { getCategory, getBankBrands } from './CategorySagas'
import { login, loginToken } from './LoginSagas'
import { uploadProduct, getInfoUploadProduct, getProductUnActivity } from './ProductSagas'
import { createAcccount, checkCode, getNewCode, forgotPassword, changePassword, editProfile, uploadAvatar } from './AccountSagas'

/* ------------- API ------------- */

// The API we use is only used from Sagas, so we create it here and pass along
// to the sagas which need it.
//const api = DebugConfig.useFixtures ? FixtureAPI : API.create()
const AuctionsApi = AuctionsAPI.create()
const CategoryApi = CategoryAPI.create()
const UserApi = UserAPI.create()
const AccountApi = AccountAPI.create()
const ProductApi = ProductAPI.create()

/* ------------- Connect Types To Sagas ------------- */

export default function * root () {
  yield [
    // some sagas only receive an action
    takeLatest(StartupTypes.STARTUP, startup),

    //Login
    takeLatest(LoginTypes.LOGIN_REQUEST, login, UserApi),
    takeLatest(LoginTypes.LOGIN_TOKEN_REQUEST, loginToken, UserApi),

    //Setting
    takeLatest(SettingsTypes.CHANGE_LANGUAGE, updateLanguage),

    //Auctions
    takeLatest(AuctionsTypes.AUCTIONS_REQUEST, getAuctions, AuctionsApi),
    takeLatest(AuctionsTypes.BID_PRODUCT_REQUEST, bidProduct, AuctionsApi, UserApi),

    //Category
    takeLatest(CategoryTypes.CATEGORY_PRODUCT_REQUEST, getCategory, CategoryApi),
    takeLatest(CategoryTypes.BANK_BRANDS_REQUEST, getBankBrands, CategoryApi),

    //Account
    takeLatest(AccountTypes.ACCOUNT_REGISTER_REQUEST, createAcccount, AccountApi),
    takeLatest(AccountTypes.CHECK_CODE_REQUEST, checkCode, AccountApi),
    takeLatest(AccountTypes.GET_NEW_CODE_REQUEST, getNewCode, AccountApi),
    takeLatest(AccountTypes.FORGOT_PASSWORD_REQUEST, forgotPassword, AccountApi),
    takeLatest(AccountTypes.CHANGE_PASSWORD_REQUEST, changePassword, AccountApi, UserApi),
    takeLatest(AccountTypes.EDIT_PROFILE_REQUEST, editProfile, AccountApi, UserApi),
    takeLatest(AccountTypes.UPLOAD_AVATAR_REQUEST, uploadAvatar, AccountApi, UserApi),

    //Product
    takeLatest(ProductTypes.UPLOAD_PRODUCT_REQUEST, uploadProduct, ProductApi, UserApi),
    takeLatest(ProductTypes.GET_INFO_UPLOAD_REQUEST, getInfoUploadProduct, ProductApi),
    takeLatest(ProductTypes.GET_PRODUCT_UN_ACTIVITY_REQUEST, getProductUnActivity, ProductApi),
  ]
}
