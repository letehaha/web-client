<template>
  <div class="asset-explorer">
    <template>
      <assets-renderer
        :is-account-unverified="isAccountUnverified"
        :is-account-us-accredited="isAccountUsAccredited"
        :is-account-us-verified="isAccountUsVerified"
        :is-account-general="isAccountGeneral"
        :is-account-corporate="isAccountCorporate"
      />
    </template>

    <template v-if="isLoadFailed">
      <p class="asset-explorer__error-msg">
        {{ 'assets.loading-error-msg' | globalize }}
      </p>
    </template>
  </div>
</template>

<script>
import AssetsRenderer from './components/assets-renderer'

import { mapGetters, mapActions } from 'vuex'
import { types } from './store/types'
import { vuexTypes } from '@/vuex'

import { ErrorHandler } from '@/js/helpers/error-handler'

export default {
  name: 'asset-explorer',
  components: {
    AssetsRenderer,
  },

  data: _ => ({
    isLoaded: false,
    isLoadFailed: false,
  }),

  computed: {
    ...mapGetters([
      vuexTypes.isAccountUnverified,
      vuexTypes.isAccountGeneral,
      vuexTypes.isAccountUsVerified,
      vuexTypes.isAccountUsAccredited,
      vuexTypes.isAccountCorporate,
    ]),
  },

  async created () {
    await this.load()
  },

  methods: {
    ...mapActions({
      loadAccountBalances: vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS,
    }),
    ...mapActions('asset-explorer', {
      loadKycRequiredAssetType: types.LOAD_KYC_REQUIRED_ASSET_TYPE,
      loadSecurityAssetType: types.LOAD_SECURITY_ASSET_TYPE,
    }),

    async load () {
      try {
        await this.loadAccountBalances()
        await this.loadKycRequiredAssetType()
        await this.loadSecurityAssetType()
        this.isLoaded = true
      } catch (e) {
        this.isLoadFailed = true
        ErrorHandler.processWithoutFeedback()
      }
    },
  },
}
</script>
