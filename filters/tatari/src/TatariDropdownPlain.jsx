import React, { PropTypes } from 'react';
import cx from 'classnames';

const TatariDropdownPlain = ({
  data,
  isExpanded,
  isLoading,
  onChange,
  onExpand,
  styles
}) => {
  const items = data.map(item => (<div
    key={`item-${item.key}`}
    data-key={item.key}
    className={styles.dropdownPlainItem}
    onClick={onChange}
  >
    {item.value}
  </div>));

  const loading = (isLoading
    ? <span className={styles.loading} />
    : null);

  const caret = (isLoading || items.length === 0)
    ? null
    : (<div className={styles.caret}>
      <span
        className={cx('fa', 'fa-caret-down', styles.arrow,
        { [styles.expanded]: isExpanded })}
      />
    </div>);

  return (<div
    className={cx(styles.dropdownContainer, { [styles.expanded]: isExpanded })}
    data-key={'inactive'}
    onClick={onExpand}
  >
    <div className={styles.dropdownPlainHead}>
      Add Filter
      {caret}
      {loading}
    </div>
    {items}
  </div>);
};

TatariDropdownPlain.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    endpoint: PropTypes.string,
    key: PropTypes.string,
    value: PropTypes.string
  })).isRequired,
  isExpanded: PropTypes.bool,
  isLoading: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onExpand: PropTypes.func.isRequired,
  styles: PropTypes.shape().isRequired
};

TatariDropdownPlain.defaultProps = {
  isExpanded: false,
  isLoading: false
};

export default TatariDropdownPlain;
