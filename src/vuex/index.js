import Vue from 'vue'
import Vuex from 'vuex'

import account from './account.module'
import assets from './assets.module'
import factors from './factors.module'
import wallet from './wallet.module'
import kyc from './kyc.module'
import identities from './identities.module'
import keyValue from './key-value.module'
import kycRecovery from './kyc-recovery.module'
import assetExplorer from '@/vue/modules/assets/asset-explorer/store'
import fees from '@/vue/modules/fees/store'
import movementsHistory from '@/vue/modules/movements-history/store'
import issuanceExplorer from '@/vue/modules/issuance-explorer/store'
import createAssetRequests from '@/vue/modules/requests/create-asset-requests/store'
import createSaleRequests from '@/vue/modules/requests/create-sale-requests/store'
import incomingWithdrawalRequests from '@/vue/modules/requests/incoming-withdrawal-requests/store'
import pollRequests from '@/vue/modules/requests/poll-requests/store'
import preIssuanceRequests from '@/vue/modules/requests/pre-issuance-requests/store'
import updateAssetRequests from '@/vue/modules/requests/update-asset-requests/store'
import verificationGeneralForm from '@/vue/modules/verification/general-form/store'
import documentSignersManager from '@/vue/modules/documents/document-manager/modules/signers-manager/store'
import idleHandler from './idle-handler.module'
import { vuexTypes } from '@/vuex/types'
import { sessionStoragePlugin } from './plugins/session-storage'
import { errors } from '@/js/errors'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { useWallet } from '@/api'
import { Wallet } from '@tokend/js-sdk'

import _isEmpty from 'lodash/isEmpty'

Vue.use(Vuex)

export const rootModule = {
  actions: {
    [vuexTypes.LOG_OUT] ({ commit }) {
      commit(vuexTypes.CLEAR_STATE)
    },
    async [vuexTypes.LOG_IN] ({ getters, dispatch }, { email, password }) {
      await dispatch(vuexTypes.LOAD_WALLET, { email, password })
      await dispatch(vuexTypes.LOAD_ACCOUNT, getters[vuexTypes.walletAccountId])
      await dispatch(vuexTypes.LOAD_KV_ENTRIES)

      const isKycRecoveryInProgress = getters[vuexTypes.isKycRecoveryInProgress]
      if (!isKycRecoveryInProgress) {
        await dispatch(vuexTypes.LOAD_KYC)
      }
    },
    async [vuexTypes.RESTORE_SESSION] ({ getters, dispatch }) {
      let walletSeed
      try {
        walletSeed = await dispatch(vuexTypes.DECRYPT_SECRET_SEED)
      } catch (e) {
        if (!(e instanceof errors.NotFoundError)) {
          ErrorHandler.processWithoutFeedback(e)
        }
        dispatch(vuexTypes.LOGOUT_SESSION)
      }

      const wallet = new Wallet(
        getters[vuexTypes.walletEmail],
        walletSeed,
        getters[vuexTypes.walletAccountId],
        getters[vuexTypes.walletId],
      )
      useWallet(wallet)
    },
  },
  mutations: {
    // These mutations are being subscribed by plugins
    [vuexTypes.POP_STATE] () { },
    [vuexTypes.CLEAR_STATE] () { },
  },
  getters: {
    [vuexTypes.isLoggedIn]: (_, getters) => !_isEmpty(
      getters[vuexTypes.account]
    ),
  },
  state: {},
}

let store
function buildStore () {
  store = new Vuex.Store({
    ...rootModule,
    modules: {
      account,
      assets,
      factors,
      wallet,
      kyc,
      identities,
      keyValue,
      idleHandler,
      kycRecovery,
      'asset-explorer': assetExplorer,
      'document-signers-manager': documentSignersManager,
      'fees': fees,
      'issuance-explorer': issuanceExplorer,
      'movements-history': movementsHistory,
      'create-asset-requests': createAssetRequests,
      'create-sale-requests': createSaleRequests,
      'incoming-withdrawal-requests': incomingWithdrawalRequests,
      'poll-requests': pollRequests,
      'pre-issuance-requests': preIssuanceRequests,
      'update-asset-requests': updateAssetRequests,
      'verification-general-form': verificationGeneralForm,
    },
    plugins: [sessionStoragePlugin],
  })

  store.commit(vuexTypes.POP_STATE)

  return store
}
buildStore()

export { store, buildStore }
export { vuexTypes } from './types'
