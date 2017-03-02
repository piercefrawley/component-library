import React, { PropTypes } from 'react';
import cx from 'classnames';

const TatariDropdownCheckboxes = ({
  filter,
  isExpanded,
  isLoading,
  onCheckOne,
  onCheckAll,
  onCheckNone,
  onExpand,
  onRemove,
  onSearch,
  options,
  styles
}) => {
  const count = options.reduce((acc, option) => (option.checked ? acc + 1 : acc), 0);
  const adjustedCount = (count ? `(${count})` : null);

  const remove = (<button
    className={cx('fa', 'fa-times', styles.activeRemove)}
    data-key={filter.key}
    onClick={onRemove}
  />);

  const loading = (isLoading
    ? <span className={styles.dropdownLoading} />
    : null);

  const caret = isLoading
    ? null
    : (<div className={styles.dropdownCaret}>
      <span
        className={cx('fa', 'fa-caret-down', styles.arrow,
        { [styles.expanded]: isExpanded })}
      />
    </div>);

  const text = <div className={styles.dropdownTitle}>{filter.value}</div>;

  const items = options.reduce((acc, option) => {
    if (option.hidden !== true) {
      acc.push(<label
        key={`option-${option.key}`}
        className={styles.activeItem}
      >
        <input
          type='checkbox'
          checked={option.checked || false}
          onChange={onCheckOne}
          data-key={option.key}
          data-filter-key={filter.key}
          className={styles.activeCheckbox}
        />
        <div className={styles.activeText}>{option.value}</div>
      </label>);
    }

    return acc;
  }, []);

  return (<div className={styles.dropdownContainer}>
    <div // eslint-disable-line
      className={styles.dropdownHead}
      data-key={filter.key}
      onClick={onExpand}
    >
      {remove}
      {text}
      {adjustedCount}
      {caret}
      {loading}
    </div>

    <div className={cx(styles.dropdownBody, { [styles.expanded]: isExpanded })}>
      <div className={styles.activeSearch}>
        <input onChange={onSearch} data-key={filter.key} className={styles.activeInput} />
        <div className={cx('fa', 'fa-search', styles.activeIcon)} />
      </div>

      <div className={styles.activeControls}>
        <button onClick={onCheckAll} data-key={filter.key} className={styles.activeControl}>
          Select All
        </button>
        <span className={styles.activeDivider}>/</span>
        <button onClick={onCheckNone} data-key={filter.key} className={styles.activeControl}>
          Clear All
        </button>
      </div>

      {items}
    </div>
  </div>);
};

TatariDropdownCheckboxes.propTypes = {
  filter: PropTypes.shape({
    endpoint: PropTypes.string,
    key: PropTypes.string,
    value: PropTypes.string
  }).isRequired,
  isExpanded: PropTypes.bool,
  isLoading: PropTypes.bool,
  onCheckOne: PropTypes.func.isRequired,
  onCheckAll: PropTypes.func.isRequired,
  onCheckNone: PropTypes.func.isRequired,
  onExpand: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape()),
  styles: PropTypes.shape().isRequired
};

TatariDropdownCheckboxes.defaultProps = {
  isExpanded: false,
  isLoading: false,
  options: [],
  styles: {}
};

export default TatariDropdownCheckboxes;
