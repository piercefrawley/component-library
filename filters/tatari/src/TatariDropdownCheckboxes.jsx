import React, { PropTypes } from 'react';
import cx from 'classnames';

const TatariDropdownCheckboxes = ({
  data,
  filter,
  isExpanded,
  isLoading,
  onChange,
  onExpand,
  onRemove,
  styles
}) => {
  // const adjustedCount = (count ? `(${count})` : null);
  const adjustedCount = '(6)';

  const remove = (<div
    className={cx('fa', 'fa-times', styles.remove)}
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

  // const items = data.map(item => (<div
  //   key={`item-${item.key}`}
  //   data-endpoint={item.endpoint}
  //   data-key={item.key}
  //   data-value={item.value}
  //   className={styles.dropdownPlainItem}
  //   onClick={onChange}
  // >
  //   {item.value}
  // </div>));
  const items = [
    <div>A</div>,
    <div>A</div>,
    <div>A</div>,
    <div>A</div>
  ]

  return (<div
    className={cx(styles.dropdownContainer, { [styles.expanded]: isExpanded })}
    data-key={filter.key}
    onClick={onExpand}
  >
    <div className={styles.dropdownCheckboxesHead}>
      {remove}
      {text}
      {adjustedCount}
      {caret}
      {loading}
    </div>

    {items}
  </div>);
};

TatariDropdownCheckboxes.propTypes = {
  data: PropTypes.arrayOf(),
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
  styles: PropTypes.shape().isRequired
};

TatariDropdownCheckboxes.defaultProps = {
  data: [],
  isExpanded: false,
  isLoading: false,
  styles: {}
};

export default TatariDropdownCheckboxes;

// const TatariCheckboxItem = ({
//   checkAllCheckboxes,
//   key,
//   toggleCheckbox,
//   uncheckAllCheckboxes,
//   updateUrl
// }, { item }) => {
//   const onChange = (evt) => {
//     toggleCheckbox({ itemKey: item.key, evt });
//     updateUrl();
//   };
//
//   const onCheckAll = () => {
//     checkAllCheckboxes(key);
//     updateUrl();
//   };
//
//   const onUncheckAll = () => {
//     uncheckAllCheckboxes(key);
//     updateUrl();
//   };
//
//   if (item === 'SELECTALL') {
//     return (
//       <div className={styles['toggle-items-container']}>
//         <button onClick={onCheckAll} className={styles['select-all-items']}>
//           Select All
//         </button>
//         <span className={styles['toggle-items-divider']}>/</span>
//         <button onClick={onUncheckAll} className={styles['clear-all-items']}>
//           Clear All
//         </button>
//       </div>
//     );
//   }
//
//   const id = `tatari-checkbox-item-${item.key}`;
//
//   const checked = (item.checked ? 'checked' : null);
//
//   return (
//     <label htmlFor={id} className={styles['checkbox-item']}>
//       <input type='checkbox' {...{id, value: key, onChange, checked }} />
//       {item.value}
//     </label>
//   );
// };
