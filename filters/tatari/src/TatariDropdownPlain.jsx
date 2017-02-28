import React, { PropTypes } from 'react';
import cx from 'classnames';

export default class TatariDropdownPlain extends React.Component {
  static propTypes = {
    isLoading: PropTypes.bool,
    data: PropTypes.arrayOf(PropTypes.shape({
      endpoint: PropTypes.string,
      key: PropTypes.string,
      value: PropTypes.string
    })).isRequired,
    onChange: PropTypes.func.isRequired,
    styles: PropTypes.shape().isRequired
  };

  static defaultProps = {
    isLoading: false
  };

  constructor(props) {
    super(props);

    this.state = {
      expanded: false
    };
  }

  componentDidMount() {
    window.addEventListener('click', this.onBlur);
  }

  onBlur = () => {
    this.setState({ expanded: false });
  }

  onFocus = (evt) => {
    evt.stopPropagation();
    this.setState({ expanded: !this.state.expanded });
  }

  onSelect = (evt) => {
    this.props.onChange(evt.target.dataset.value);
  }

  render() {
    const { styles } = this.props;

    const items = this.props.data.map(item => (<div
      key={`item-${item.key}`}
      data-value={item.endpoint}
      className={styles.dropdownPlainItem}
      onClick={this.onSelect}
    >
      {item.value}
    </div>));

    const loading = (this.props.isLoading
      ? <span>o</span>
      : null);

    const caret = (this.state.fetching || items.length === 0)
      ? null
      : (<div className={styles.caret}>
        <span className={cx('fa', 'fa-caret-down', styles.arrow, { [styles.expanded]: this.state.expanded })} />
      </div>);

    return (<div className={cx(styles.dropdownContainer, { [styles.expanded]: this.state.expanded })}>
      <div className={styles.dropdownPlainHead} onClick={this.onFocus}>
        Add Filter
        {caret}
        {loading}
      </div>
      {items}
    </div>);
  }
}
