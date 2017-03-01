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
  const items = data.reduce((acc, item) => {
    if (item.hidden !== true) {
      acc.push(<div
        key={`item-${item.key}`}
        data-key={item.key}
        className={styles.inactiveItem}
        onClick={onChange}
      >
        {item.value}
      </div>);
    }
    return acc;
  }, []);

  const text = <div className={styles.dropdownTitle}>Add Filter</div>;

  const loading = (isLoading
    ? <span className={styles.dropdownLoading} />
    : null);

  const caret = (isLoading || items.length === 0)
    ? null
    : (<div className={styles.dropdownCaret}>
      <span
        className={cx('fa', 'fa-caret-down', styles.arrow,
        { [styles.expanded]: isExpanded })}
      />
    </div>);

  return (<div className={styles.dropdownContainer}>
    <div
      className={styles.dropdownHead}
      data-key={'inactive'}
      onClick={onExpand}
    >
      {text}
      {caret}
      {loading}
    </div>

    <div className={cx(styles.dropdownBody, { [styles.expanded]: isExpanded })}>
      {items}
    </div>
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
