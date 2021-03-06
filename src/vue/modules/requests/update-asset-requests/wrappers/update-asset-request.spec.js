import { UpdateAssetRequest } from './update-asset-request'
import { ASSET_POLICIES } from '@tokend/js-sdk'

describe('Update asset request', () => {
  describe('constructor', () => {
    it('should properly parse record', () => {
      const record = {
        requestDetails: {
          asset: { id: 'USD' },
          type: 0,
          policies: 3,
          creatorDetails: {
            name: 'Dollar',
            terms: { key: 'terms-key' },
            logo: { key: 'logo-key' },
          },
        },
      }

      const result = new UpdateAssetRequest(record)

      expect(result.assetCode).to.equal('USD')
      expect(result.assetType).to.equal(0)
      expect(result.assetName).to.equal('Dollar')

      expect(result.policy).to.equal(3)

      expect(result.terms).to.deep.equal({ key: 'terms-key' })
      expect(result.termsKey).to.equal('terms-key')

      expect(result.logo).to.deep.equal({ key: 'logo-key' })
      expect(result.logoKey).to.equal('logo-key')
    })
  })

  describe('getters', () => {
    describe('isTransferable', () => {
      it('returns true if the request has transferable policy', () => {
        const request = new UpdateAssetRequest({
          requestDetails: {
            policies: ASSET_POLICIES.transferable,
          },
        })

        expect(request.isTransferable).to.be.true
      })

      it('returns false if the request does not have transferable policy', () => {
        const request = new UpdateAssetRequest({
          requestDetails: {
            policies: 0,
          },
        })

        expect(request.isTransferable).to.be.false
      })
    })

    describe('isWithdrawable', () => {
      it('returns true if the request has withdrawable policy', () => {
        const request = new UpdateAssetRequest({
          requestDetails: {
            policies: ASSET_POLICIES.withdrawable,
          },
        })

        expect(request.isWithdrawable).to.be.true
      })

      it('returns false if the request does not have withdrawable policy', () => {
        const request = new UpdateAssetRequest({
          requestDetails: {
            policies: 0,
          },
        })

        expect(request.isWithdrawable).to.be.false
      })
    })
  })
})
