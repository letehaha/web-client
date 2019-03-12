import _cloneDeep from 'lodash/cloneDeep'
import { ModuleDescriptor } from './module-descriptor'

/**
 * Describes the module that represents a page. Extends ModuleDescriptor but
 * have some specific fields for rendering buttons and sections in the sidebar
 * menu.
 */
export class PageModuleDescriptor extends ModuleDescriptor {
  /**
   * @param {Object} opts
   * All the opts of ModuleDescriptor but also some Page-related args
   *
   * @param {Object} opts.routerEntry
   * Vue router entry.
   *
   * @param {String} [opts.menuButtonTranslationId]
   * Menu button translation ID. The button wont be rendered if no translation
   * ID provided.
   *
   * @param {String} [opts.menuButtonMdiName]
   * Name of the icon to be used in sidebar. Should be kebab-cased.
   *
   * @param {String} [opts.menuSectionTranslationId]
   * All the menu items with the same value of menuSectionTranslationId will be
   * rendered as a group in the Sidebar. If the argument is omitted, the menu
   * item will be rendered in default section with no label.
   *
   * @param {Boolean} [isCorporateOnly]
   * If `true` only corporate accounts can access the page
   *
   * @param {Object} moduleOpts @link ModuleDescriptor
   */
  constructor (opts = {}) {
    super(opts)
    this._menuButtonTranslationId = opts.menuButtonTranslationId || ''
    this._menuButtonMdiName = opts.menuButtonMdiName || ''
    this._menuSectionTranslationId = opts.menuSectionTranslationId || ''
    this._isCorporateOnly = opts.isCorporateOnly || false

    this._routerEntry = this._parseRouterEntry(opts)
  }

  get routerEntry () { return _cloneDeep(this._routerEntry) }
  get menuButtonTranslationId () { return this._menuButtonTranslationId }
  get menuButtonMdiName () { return this._menuButtonMdiName }
  get menuSectionTranslationId () { return this._menuSectionTranslationId }
  get isCorporateOnly () { return this._isCorporateOnly }

  _parseRouterEntry (opts = {}) {
    if (!opts.routerEntry) {
      throw new Error(`${this.constructor.name}: no opts.routerEntry provided!`)
    }

    const entry = _cloneDeep(opts.routerEntry)
    entry.component = this.importComponent
    if (!entry.meta) {
      entry.meta = {}
    }
    entry.meta.pageModule = this
    return entry
  }
}
