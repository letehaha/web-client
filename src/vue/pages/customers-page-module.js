import { PageModuleDescriptor } from '@/modules-arch/page-module-descriptor'

export class CustomersPageModule extends PageModuleDescriptor {
  constructor (opts = {}) {
    super({
      ...opts,
      importComponentFn: _ => import('@/vue/pages/Customers'),
    })
  }
}