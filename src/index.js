/**
 * Build styles
 */
require('./index.css').toString();

/**
 * Inline Code Tool for the Editor.js
 *
 * Allows to wrap inline fragment and style it somehow.
 */
class InlineCode {
  /**
   * Class name for term-tag
   *
   * @type {string}
   */
  static get CSS() {
    return 'inline-code';
  };

  /**
   */
  constructor({api}) {
    this.api = api;

    /**
     * Toolbar Button
     *
     * @type {HTMLElement|null}
     */
    this.button = null;

    /**
     * Tag represented the term
     *
     * @type {string}
     */
    this.tag = 'CODE';

    /**
     * CSS classes
     */
    this.iconClasses = {
      base: this.api.styles.inlineToolButton,
      active: this.api.styles.inlineToolButtonActive
    };
  }

  /**
   * Specifies Tool as Inline Toolbar Tool
   *
   * @return {boolean}
   */
  static get isInline() {
    return true;
  }

  /**
   * Create button element for Toolbar
   *
   * @return {HTMLElement}
   */
  render() {
    this.button = document.createElement('button');
    this.button.type = 'button';
    this.button.classList.add(this.iconClasses.base);
    this.button.innerHTML = this.toolboxIcon;

    return this.button;
  }

  /**
   * Wrap/Unwrap selected fragment
   *
   * @param {Range} range - selected fragment
   */
  surround(range) {
    if (!range) {
      return;
    }

    let termWrapper = this.api.selection.findParentTag(this.tag, InlineCode.CSS);

    /**
     * If start or end of selection is in the highlighted block
     */
    if (termWrapper) {
      this.unwrap(termWrapper);
    } else {
      this.wrap(range);
    }
  }

  /**
   * Wrap selection with term-tag
   *
   * @param {Range} range - selected fragment
   */
  wrap(range) {
    /**
     * Create a wrapper for highlighting
     */
    let span = document.createElement(this.tag);

    span.classList.add(InlineCode.CSS);

    /**
     * SurroundContent throws an error if the Range splits a non-Text node with only one of its boundary points
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Range/surroundContents}
     *
     * // range.surroundContents(span);
     */
    span.appendChild(range.extractContents());
    range.insertNode(span);

    /**
     * Expand (add) selection to highlighted block
     */
    this.api.selection.expandToTag(span);
  }

  /**
   * Unwrap term-tag
   *
   * @param {HTMLElement} termWrapper - term wrapper tag
   */
  unwrap(termWrapper) {
    /**
     * Expand selection to all term-tag
     */
    this.api.selection.expandToTag(termWrapper);

    let sel = window.getSelection();
    let range = sel.getRangeAt(0);

    let unwrappedContent = range.extractContents();

    /**
     * Remove empty term-tag
     */
    termWrapper.parentNode.removeChild(termWrapper);

    /**
     * Insert extracted content
     */
    range.insertNode(unwrappedContent);

    /**
     * Restore selection
     */
    sel.removeAllRanges();
    sel.addRange(range);
  }

  /**
   * Check and change Term's state for current selection
   */
  checkState() {
    const termTag = this.api.selection.findParentTag(this.tag, InlineCode.CSS);

    this.button.classList.toggle(this.iconClasses.active, !!termTag);
  }

  /**
   * Get Tool icon's SVG
   * @return {string}
   */
  get toolboxIcon() {
    return '<svg width="80" height="24" viewBox="0 0 80 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M45.6452 5H48.2372V13.464C48.2372 13.56 48.2426 13.6827 48.2532 13.832C48.2639 13.9707 48.2746 14.12 48.2852 14.28L48.3492 14.76C48.3706 14.9093 48.3919 15.0427 48.4132 15.16H49.4852V16.2H47.3572L47.1972 14.968H47.1332C46.8986 15.3733 46.5466 15.7147 46.0772 15.992C45.6186 16.2587 45.0852 16.392 44.4772 16.392C43.2719 16.392 42.3812 16.056 41.8052 15.384C41.2399 14.7013 40.9572 13.6453 40.9572 12.216C40.9572 11.544 41.0532 10.952 41.2452 10.44C41.4372 9.91733 41.7092 9.48533 42.0612 9.144C42.4239 8.792 42.8559 8.52533 43.3572 8.344C43.8586 8.16267 44.4186 8.072 45.0372 8.072C45.2612 8.072 45.4586 8.07733 45.6292 8.088C45.8106 8.09867 45.9759 8.11467 46.1252 8.136C46.2746 8.15733 46.4132 8.18933 46.5412 8.232C46.6799 8.264 46.8292 8.30133 46.9892 8.344V6.072H45.6452V5ZM44.6852 15.32C45.3359 15.32 45.8479 15.1547 46.2212 14.824C46.5946 14.4827 46.8506 13.976 46.9892 13.304V9.592C46.7546 9.432 46.4879 9.31467 46.1892 9.24C45.9012 9.16533 45.5172 9.128 45.0372 9.128C44.1839 9.128 43.5119 9.37867 43.0212 9.88C42.5306 10.3707 42.2852 11.1493 42.2852 12.216C42.2852 12.6533 42.3226 13.064 42.3972 13.448C42.4826 13.8213 42.6159 14.1467 42.7972 14.424C42.9892 14.7013 43.2399 14.92 43.5492 15.08C43.8586 15.24 44.2372 15.32 44.6852 15.32ZM60.9688 15.712L61.5767 16.672L69.1287 12.32V11.856L61.5928 7.26399L60.9847 8.25599L67.3367 12.016L60.9688 15.712ZM57.431 15.672C57.6977 15.5227 57.927 15.3627 58.119 15.192L57.623 14.28C57.5163 14.376 57.3617 14.4827 57.159 14.6C56.967 14.7173 56.743 14.824 56.487 14.92C56.231 15.016 55.959 15.1013 55.671 15.176C55.3937 15.24 55.111 15.272 54.823 15.272C53.959 15.272 53.2657 15.0373 52.743 14.568C52.231 14.088 51.975 13.368 51.975 12.408H58.167C58.2203 11.5013 58.1563 10.7653 57.975 10.2C57.7937 9.624 57.5323 9.176 57.191 8.856C56.8603 8.52533 56.4763 8.30133 56.039 8.184C55.6017 8.06666 55.159 8.008 54.711 8.008C54.0923 8.008 53.5323 8.104 53.031 8.296C52.5297 8.47733 52.103 8.744 51.751 9.096C51.399 9.448 51.127 9.88533 50.935 10.408C50.7537 10.9307 50.663 11.528 50.663 12.2C50.663 12.84 50.7483 13.416 50.919 13.928C51.0897 14.44 51.3403 14.8827 51.671 15.256C52.0017 15.6187 52.4123 15.9013 52.903 16.104C53.3937 16.296 53.959 16.392 54.599 16.392C54.9403 16.392 55.2763 16.36 55.607 16.296C55.9483 16.2427 56.2737 16.1627 56.583 16.056C56.8923 15.9493 57.175 15.8213 57.431 15.672ZM53.735 9.176C54.055 9.10133 54.391 9.064 54.743 9.064C55.3937 9.064 55.9163 9.26133 56.311 9.656C56.7163 10.04 56.9457 10.584 56.999 11.288H52.023C52.0657 10.872 52.1617 10.5253 52.311 10.248C52.471 9.96 52.6683 9.73066 52.903 9.56C53.1483 9.37866 53.4257 9.25066 53.735 9.176ZM32.3875 9.144C31.7155 9.89066 31.3795 10.9093 31.3795 12.2C31.3795 12.7867 31.4542 13.336 31.6035 13.848C31.7635 14.36 32.0035 14.8027 32.3235 15.176C32.6435 15.5493 33.0488 15.848 33.5395 16.072C34.0302 16.2853 34.6062 16.392 35.2675 16.392C35.8862 16.392 36.4355 16.296 36.9155 16.104C37.4062 15.9013 37.8168 15.6187 38.1475 15.256C38.4782 14.8933 38.7288 14.456 38.8995 13.944C39.0702 13.4213 39.1555 12.84 39.1555 12.2C39.1555 11.6133 39.0755 11.064 38.9155 10.552C38.7662 10.04 38.5315 9.59733 38.2115 9.224C37.8915 8.85066 37.4862 8.55733 36.9955 8.344C36.5155 8.12 35.9395 8.008 35.2675 8.008C34.0195 8.008 33.0595 8.38666 32.3875 9.144ZM32.8355 13.32C32.7502 12.9467 32.7075 12.5733 32.7075 12.2C32.7075 11.1653 32.9208 10.3867 33.3475 9.864C33.7742 9.34133 34.4142 9.08 35.2675 9.08C35.7368 9.08 36.1315 9.17066 36.4515 9.352C36.7822 9.53333 37.0488 9.77333 37.2515 10.072C37.4648 10.3707 37.6142 10.7067 37.6995 11.08C37.7955 11.4427 37.8435 11.816 37.8435 12.2C37.8435 13.224 37.6248 14.0027 37.1875 14.536C36.7608 15.0587 36.1208 15.32 35.2675 15.32C34.7982 15.32 34.3982 15.2293 34.0675 15.048C33.7475 14.8667 33.4862 14.6267 33.2835 14.328C33.0808 14.0293 32.9315 13.6933 32.8355 13.32ZM27.8977 9.432C27.6524 9.34666 27.3857 9.27733 27.0977 9.224C26.8204 9.16 26.5431 9.128 26.2657 9.128C25.2204 9.128 24.4417 9.37333 23.9297 9.864C23.4177 10.3547 23.1617 11.1333 23.1617 12.2C23.1617 12.6693 23.2364 13.0907 23.3857 13.464C23.5351 13.8267 23.7484 14.136 24.0257 14.392C24.3031 14.648 24.6337 14.8453 25.0177 14.984C25.4124 15.1227 25.8444 15.192 26.3137 15.192C26.8151 15.192 27.3004 15.1067 27.7697 14.936C28.2497 14.7653 28.6497 14.5413 28.9697 14.264L29.5297 15.192C29.3804 15.32 29.1937 15.4533 28.9697 15.592C28.7457 15.7307 28.4844 15.864 28.1857 15.992C27.8977 16.1093 27.5724 16.2053 27.2097 16.28C26.8577 16.3547 26.4737 16.392 26.0577 16.392C25.3644 16.392 24.7511 16.296 24.2177 16.104C23.6951 15.9013 23.2577 15.6187 22.9057 15.256C22.5537 14.8827 22.2871 14.44 22.1057 13.928C21.9244 13.4053 21.8337 12.8293 21.8337 12.2C21.8337 11.528 21.9244 10.9307 22.1057 10.408C22.2977 9.88533 22.5697 9.448 22.9217 9.096C23.2737 8.744 23.7004 8.47733 24.2017 8.296C24.7031 8.104 25.2631 8.008 25.8817 8.008C26.6711 8.008 27.3111 8.07733 27.8017 8.216C28.3031 8.35466 28.7244 8.50933 29.0658 8.68L29.0497 8.728V10.952H27.8977V9.432ZM11 11.856V12.32L18.552 16.672L19.16 15.712L12.792 12.016L19.144 8.25599L18.536 7.26399L11 11.856Z" fill="#212132"/></svg>';
  }

  /**
   * Sanitizer rule
   * @return {{span: {class: string}}}
   */
  static get sanitize() {
    return {
      code: {
        class: InlineCode.CSS
      }
    };
  }
}

module.exports = InlineCode;
