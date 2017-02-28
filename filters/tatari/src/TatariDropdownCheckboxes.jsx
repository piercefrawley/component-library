import React, { PropTypes } from 'react';
import cx from 'classnames';

const TatariDropdownCheckboxes = ({
  filter,
  isExpanded,
  isLoading,
  onChange,
  onExpand,
  onRemove,
  onSearch,
  options,
  styles
}) => {
  // TODO const adjustedCount = (count ? `(${count})` : null);
  // TODO text wrapping on checkbox items
  // TODO padding and improved styling
  const adjustedCount = '(6)';

  const remove = (<button
    className={cx('fa', 'fa-times', styles.dropdownCheckboxesHeadRemove)}
    data-key={filter.key}
    onClick={onRemove}
  />);

  const loading = (isLoading
    ? <span className={styles.loading} />
    : null);

  const caret = (isLoading
    ? null
    : (<div className={styles.caret}>
      <span
        className={cx('fa', 'fa-caret-down', styles.arrow,
        { [styles.expanded]: isExpanded })}
      />
    </div>));

  const text = <div className={styles.text}>{filter.value}</div>;

  const items = options.reduce((acc, option) => {
    if (option.hidden !== true) {
      acc.push(<label
        key={`option-${option.key}`}
        data-key={option.key}
        className={styles.dropdownCheckboxesItem}
        onChange={onChange}
      >
        <input
          type='checkbox'
          checked={option.checked}
          className={styles.dropdownCheckboxesCheckbox}
        />
        {option.value}
      </label>);
    }

    return acc;
  }, []);

  return (<div
    className={cx(styles.dropdownContainer, { [styles.expanded]: isExpanded })}
  >
    <div // eslint-disable-line
      className={styles.dropdownCheckboxesHead}
      data-key={filter.key}
      onClick={onExpand}
    >
      {remove}
      {text}
      {adjustedCount}
      {caret}
      {loading}
    </div>

    <div className={styles.dropdownCheckboxesSearch}>
      <input onChange={onSearch} data-key={filter.key} className={styles.input} />
      <div className={cx('fa', 'fa-search', styles.icon)} />
    </div>

    <div className={styles.dropdownCheckboxesControls}>
      <button onClick={null} className={styles.control}>
        Select All
      </button>
      <span className={styles.control}>/</span>
      <button onClick={null} className={styles.control}>
        Clear All
      </button>
    </div>

    {items}
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
  onChange: PropTypes.func.isRequired,
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
